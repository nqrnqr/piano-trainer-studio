import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerTransposeEngine} from './transpose-engine';
import type {LegacyAppState} from '../state/model';
// Original-source transpose commands. State identity and post-load reads are preserved.
export namespace PianoTrainerTransposeController {
    export type State = LegacyAppState['transpose'];
    export type App = Pick<LegacyAppState, 'transpose' | 'currentScoreData' | 'currentScoreOriginalData' | 'currentScoreOriginalFileName' |
        'currentScoreFileName' | 'currentScoreOriginalFileType' | 'currentScoreFileType' | 'currentScoreLibraryId' | 'currentScoreTitle'>;
    export interface Ports {
        getApp(): App | undefined; getEngine(): typeof PianoTrainerTransposeEngine | undefined;
        getLoader(): ((rawData: PianoTrainerDomain.ScoreRawData, options: PianoTrainerDomain.ScoreLoadOptions) => Promise<void>) | undefined;
        syncUi(): void; setStatus(text: string, isError?: boolean): void;
        reportError(message: string, error: unknown): void; errorText(error: unknown, fallback: string): string;
    }
    export function getDefaultState(): State {
        return {available:false, sourceKeyLabel:'No score loaded', sourceKeyFound:false, mode:'key', semitones:0, targetKey:null,
            updateKeySignature:true, active:false, activeLabel:'Original score', disableReason:'Load a MusicXML-based score to enable transpose.'};
    }
    export function create(ports: Ports) {
        let generation = 0, disposed = false;
        function ensureTransposeState() {
            const app = ports.getApp();
            if (!app) return getDefaultState();
            if (!app.transpose || typeof app.transpose !== 'object') app.transpose = getDefaultState();
            return app.transpose;
        }
        function refreshAvailabilityFromCurrentScore() {
            const state = ensureTransposeState(), app = ports.getApp()!;
            const originalData = app.currentScoreOriginalData, fallbackData = app.currentScoreData;
            const engine = ports.getEngine();
            const source = engine && engine.isXmlString(originalData) ? originalData : engine && engine.isXmlString(fallbackData) ? fallbackData : null;
            state.available = !!(engine && source);
            if (!state.available) {
                state.sourceKeyLabel = app.currentScoreData ? 'Unavailable for this score' : 'No score loaded';
                state.sourceKeyFound = false;
                state.disableReason = app.currentScoreData
                    ? 'Transpose works on XML, MusicXML, normalized MXL, and imported files that convert to MusicXML.'
                    : 'Load a MusicXML-based score to enable transpose.';
                state.active = false; state.activeLabel = 'Original score';
                return state;
            }
            // Availability proves that the engine and original/fallback XML exist.
            const detected = engine!.detectScoreKey(engine!.parseXml(source!));
            state.sourceKeyLabel = detected.label || 'Unknown'; state.sourceKeyFound = !!detected.found; state.disableReason = '';
            if (detected.found) {
                const inferred = detected.presetValue ? engine!.getPresetByValue(detected.presetValue) : null;
                const hasValidTarget = !!engine!.getPresetByValue(state.targetKey);
                if (inferred && (!state.targetKey || !hasValidTarget)) state.targetKey = inferred.value;
            } else if (!engine!.getPresetByValue(state.targetKey)) state.targetKey = 'sig-0';
            return state;
        }
        function handleScoreLoaded() {
            Object.assign(ensureTransposeState(), getDefaultState());
            refreshAvailabilityFromCurrentScore(); ports.syncUi();
        }
        async function applyTranspose() {
            if (disposed) return;
            const started = generation, state = ensureTransposeState();
            refreshAvailabilityFromCurrentScore();
            if (!state.available) {ports.syncUi(); return;}
            const engine = ports.getEngine(), load = ports.getLoader();
            if (!engine || typeof load !== 'function') return;
            const app = ports.getApp()!;
            try {
                if (state.mode === 'key' && state.sourceKeyFound) {
                    const selected = engine.getPresetByValue(state.targetKey), originalXml = app.currentScoreOriginalData;
                    const detected = engine.isXmlString(originalXml) ? engine.detectScoreKey(engine.parseXml(originalXml)) : null;
                    if (selected && detected?.presetValue && selected.value === detected.presetValue) {
                        ports.setStatus('Target key already matches the current key. Choose a different key or use semitones.', true); return;
                    }
                }
                const result = engine.transposeXml(app.currentScoreOriginalData, {mode:state.mode, semitones:Number(state.semitones || 0),
                    targetKey:state.targetKey, updateKeySignature:state.updateKeySignature !== false});
                const originalName = app.currentScoreOriginalFileName || app.currentScoreFileName || 'Untitled Score.musicxml';
                await load(result.xmlString, {fileName:originalName.replace(/\.(mxl)$/i, '.musicxml'), fileType:'musicxml',
                    libraryScoreId:app.currentScoreLibraryId, title:app.currentScoreTitle, originalRawData:app.currentScoreOriginalData!,
                    originalFileName:app.currentScoreOriginalFileName || app.currentScoreFileName,
                    originalFileType:app.currentScoreOriginalFileType || app.currentScoreFileType, skipTransposeReset:true});
                if (started !== generation) return;
                state.active = true;
                state.activeLabel = state.mode === 'key' ? `to ${result.targetKeyLabel}` : `${result.semitoneDelta > 0 ? '+' : ''}${result.semitoneDelta} semitones`;
                ports.setStatus(`Applied: ${state.activeLabel}`); ports.syncUi();
            } catch (error) {
                if (started !== generation) return;
                ports.reportError('Transpose apply failed', error); ports.setStatus(ports.errorText(error, 'Could not transpose this score.'), true);
            }
        }
        async function resetTranspose() {
            if (disposed) return;
            const started = generation, state = ensureTransposeState(), app = ports.getApp()!;
            const load = ports.getLoader();
            if (!app.currentScoreOriginalData || typeof load !== 'function') {handleScoreLoaded(); return;}
            try {
                await load(app.currentScoreOriginalData, {fileName:app.currentScoreOriginalFileName || app.currentScoreFileName || 'Untitled Score.musicxml',
                    fileType:app.currentScoreOriginalFileType || app.currentScoreFileType || 'musicxml', libraryScoreId:app.currentScoreLibraryId,
                    title:app.currentScoreTitle, originalRawData:app.currentScoreOriginalData, originalFileName:app.currentScoreOriginalFileName || app.currentScoreFileName,
                    originalFileType:app.currentScoreOriginalFileType || app.currentScoreFileType, skipTransposeReset:true});
                if (started !== generation) return;
                state.active = false; state.activeLabel = 'Original score'; state.semitones = 0;
                refreshAvailabilityFromCurrentScore();
                const originalXml = app.currentScoreOriginalData, engine = ports.getEngine();
                const detected = engine && engine.isXmlString(originalXml) ? engine.detectScoreKey(engine.parseXml(originalXml)) : null;
                const inferred = detected?.presetValue ? engine!.getPresetByValue(detected.presetValue) : null;
                state.targetKey = inferred?.value || 'sig-0'; ports.syncUi();
            } catch (error) {
                if (started !== generation) return;
                ports.reportError('Transpose reset failed', error); ports.setStatus(ports.errorText(error, 'Could not reset transpose.'), true);
            }
        }
        function init() {disposed = false;}
        function dispose() {if (!disposed) {disposed = true; generation++;}}
        return {ensureTransposeState, refreshAvailabilityFromCurrentScore, handleScoreLoaded, applyTranspose, resetTranspose, init, dispose};
    }
    export type Service = ReturnType<typeof create>;
}
