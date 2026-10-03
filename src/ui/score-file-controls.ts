import {PianoTrainerDomain} from '../domain/model';
// Required file input and native target guards; import effects go through commands.
export namespace PianoTrainerScoreFileControls {
    export interface Ports {
        input: HTMLInputElement; resumeAudio(): void;
        readFile(file: File): Promise<PianoTrainerDomain.ScoreFile>;
        load(rawData: PianoTrainerDomain.ScoreRawData, options: PianoTrainerDomain.ScoreLoadOptions): Promise<void>;
        getConverter(): {isConverterImportFileName(name: string): boolean; convertFileToScore(file: File): Promise<PianoTrainerDomain.ScoreFile>} | undefined;
        closeDrawer(): void;
    }
    export function create(ports: Ports) {
        let initialized = false;
        function openScoreFilePicker() {ports.resumeAudio(); ports.input.click();}
        async function handleDirectScoreFileSelection(file: File | null | undefined) {
            if (!file) return;
            const converter = ports.getConverter();
            if (converter && typeof converter.isConverterImportFileName === 'function' && converter.isConverterImportFileName(file.name || '')) {
                const converted = await converter.convertFileToScore(file);
                await ports.load(converted.rawData, converted);
                ports.closeDrawer();
                return;
            }
            const scoreFile = await ports.readFile(file);
            await ports.load(scoreFile.rawData, scoreFile);
            ports.closeDrawer();
        }
        async function onChange(event: Event) {
            if (!(event.target instanceof HTMLInputElement)) return;
            const input = event.target;
            const file = input.files?.[0];
            try {await handleDirectScoreFileSelection(file);} finally {input.value = '';}
        }
        function init() {if (!initialized) {initialized = true; ports.input.addEventListener('change', onChange);}}
        function dispose() {if (initialized) {initialized = false; ports.input.removeEventListener('change', onChange);}}
        return {init, dispose, openScoreFilePicker, handleDirectScoreFileSelection};
    }
}
