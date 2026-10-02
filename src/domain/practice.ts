// Transitional domain data: preserve legacy field names and units. Expected
// notes now use revision-scoped references; vendor objects belong to adapters.
namespace PianoTrainerDomain {
    export type PracticeMode = 'wait' | 'follow' | 'realtime';
    export type ScoreLayout = 'traditional' | 'horizontal';
    export type HandRole = 'left' | 'right';
    export type MidiChannel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
    export type MidiInputChannel = 0 | MidiChannel;
    export type MidiNote = number;
    export type InputSource = 'midi' | 'ui';
    export interface TrainerNoteInput {
        kind: 'note-on' | 'note-off';
        note: MidiNote;
        velocity: number;
        source: InputSource;
        channel: MidiChannel | null;
        receivedAtMs: MonotonicMilliseconds;
    }
    export type WholeNoteTime = number;
    export type AudioTimeSeconds = number;
    export type MonotonicMilliseconds = number;
    export type ScoreRawData = string | ArrayBuffer | ArrayBufferView | Blob;
    export interface SvgPoint { x: number; y: number; }
    export interface HandSelection { left: boolean; right: boolean; }
    export interface ModeSettings { practice: HandSelection; playback: HandSelection; }
    export interface AudioRouting {
        hands: boolean; other: boolean; instrument: boolean; virtual: boolean;
        // Legacy deferred sampler guard still reads these optional keys.
        left?: boolean; right?: boolean;
    }
    export interface ExpectedContext { measureIndex: number; timestamp: WholeNoteTime; signature: string; }
    export interface NoteRef { readonly scoreRevision: number; readonly id: string; }
    export interface PracticeSourceNote {
        readonly midi: MidiNote;
        readonly noteRef: NoteRef;
        readonly notehead: string | undefined;
        readonly printObject: boolean | undefined;
        readonly cue: boolean | undefined;
        readonly rest: boolean;
        readonly tieContinuation: boolean;
        readonly combinedLengthWhole: WholeNoteTime;
    }
    export interface PracticeSourceEntry { readonly staffId: number | null; readonly notes: Iterable<PracticeSourceNote>; }
    export interface SatisfiedMatch {
        midi: MidiNote; staffId: number | null; mIdx: number | null; source: 'already-hit' | 'sustained-visual';
    }
    export interface FeedbackFrameInput {
        kind: string; measureIndex: number | null; timestamp?: WholeNoteTime | null;
        notes: {midi: MidiNote; staffId: number | null; anchor: SvgPoint | null; hit: boolean; kind: string}[];
    }
    export interface TraversalPosition { measureIndex: number; timestampWhole: WholeNoteTime | null; }
    export interface ExpectedNote {
        midi: MidiNote;
        staffId: number | null;
        hit: boolean;
        mIdx: number;
        anchor: SvgPoint | null;
        noteRef: NoteRef;
    }
    export interface EarlyGraceReservation {
        midi: MidiNote;
        staffId: number | null;
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
        staffId: number | null;
        mIdx: number;
        endTimestamp: WholeNoteTime | null;
    }
    export interface PendingVisual extends SustainedVisual { durationMs: number; }
    export interface OutOfRangeNote { midi: MidiNote; staffId: number | null; mIdx: number; }
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
    export interface PreviewNote { midi: MidiNote; staffId: number | null; state: string; }
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
