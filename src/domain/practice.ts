// Transitional domain data: preserve legacy field names and units. OSMD note
// objects stay opaque here until the renderer introduces revision-scoped refs.
namespace PianoTrainerDomain {
    export type PracticeMode = 'wait' | 'follow' | 'realtime';
    export type ScoreLayout = 'traditional' | 'horizontal';
    export type HandRole = 'left' | 'right';
    export type MidiChannel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
    export type MidiInputChannel = 0 | MidiChannel;
    export type MidiNote = number;
    export type WholeNoteTime = number;
    export type AudioTimeSeconds = number;
    export type MonotonicMilliseconds = number;
    export type ScoreRawData = string | ArrayBuffer | ArrayBufferView | Blob;
    export interface SvgPoint { x: number; y: number; }
    export interface HandSelection { left: boolean; right: boolean; }
    export interface ModeSettings { practice: HandSelection; playback: HandSelection; }
    export interface AudioRouting { hands: boolean; other: boolean; instrument: boolean; virtual: boolean; }
    export interface ExpectedContext { measureIndex: number; timestamp: WholeNoteTime; signature: string; }
    export interface ExpectedNote {
        midi: MidiNote;
        staffId: number;
        hit: boolean;
        mIdx: number;
        anchor: SvgPoint | null;
        logicalNote: unknown;
    }
    export interface EarlyGraceReservation {
        midi: MidiNote;
        staffId: number;
        measureIndex: number;
        timestamp: WholeNoteTime | null;
        allowTapCarry: boolean;
        beatsUntilTarget: number | null;
    }
    export interface FollowAdvanceInfo {
        currentMeasureIdx: number;
        currentTimestamp: WholeNoteTime;
        waitSeconds: AudioTimeSeconds;
        beatsToWait: number;
    }
    export interface PendingPlaybackNote {
        midi: MidiNote;
        durationMs: number;
        velocity: number;
        toLocalAudio: boolean;
        toMidiOut: boolean;
    }
    export interface SustainedVisual {
        midi: MidiNote;
        staffId: number;
        mIdx: number;
        endTimestamp: WholeNoteTime | null;
    }
    export interface PendingVisual extends SustainedVisual { durationMs: number; }
    export interface OutOfRangeNote { midi: MidiNote; staffId: number; mIdx: number; }
    export interface FeedbackMarker {
        midi: MidiNote;
        staffId: number | null;
        anchor: SvgPoint;
        isCorrect: boolean;
        measureIndex: number | null;
        timestamp: WholeNoteTime | null;
        contextKey: string;
    }
    export interface DebugNote {
        midi: MidiNote;
        staffId: number | null;
        kind: string;
        hit: boolean;
        anchor: SvgPoint;
    }
    export interface DebugFrame {
        seq: number;
        measureIndex: number | null;
        timestamp: WholeNoteTime | null;
        kind: string;
        notes: DebugNote[];
    }
    export interface PreviewNote { midi: MidiNote; staffId: number; state: string; }
    export interface PreviewEvent {
        measureIndex: number;
        timestamp: WholeNoteTime | null;
        signature?: string;
        notes: PreviewNote[];
    }
    export interface PreviewTimelineEvent extends PreviewEvent { signature: string; }
    export interface PlayerRange {
        keyCount: number;
        minMidi: MidiNote;
        maxMidi: MidiNote;
        trimmedLowKeys: number;
        trimmedHighKeys: number;
    }
    export interface MidiEcho {
        status: number;
        note: MidiNote;
        velocity: number;
        time: MonotonicMilliseconds;
    }
}
