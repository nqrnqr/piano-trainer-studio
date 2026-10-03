// Minimal used surface of bundled OSMD 1.9.7. Private cursor operations belong
// exclusively to score/osmd-adapter. Shape fields model the stabilized geometry
// access pattern; opaque/private enumeration is limited to two adapter sites.
declare namespace PianoTrainerOsmdVendor {
    interface Fraction { RealValue: number; }
    interface Note extends PianoTrainerScoreTraversal.Note {
        ParentVoiceEntry?: {Timestamp?: Fraction};
    }
    interface Shape { AbsolutePosition: PianoTrainerDomain.SvgPoint; Size?: {width: number; height: number}; }
    interface ShapeContainer { PositionAndShape?: Shape; }
    interface GraphicalNote extends ShapeContainer {
        sourceNote?: Note;
        getSVGGElement?(): SVGGraphicsElement | null;
        Notehead?: ShapeContainer; notehead?: ShapeContainer; NoteHead?: ShapeContainer; noteHead?: ShapeContainer;
        GraphicalNotehead?: ShapeContainer; graphicalNotehead?: ShapeContainer; graphicalNoteHead?: ShapeContainer;
        NoteHeads?: ShapeContainer[]; noteHeads?: ShapeContainer[];
        noteheadShape?: ShapeContainer; NoteheadShape?: ShapeContainer;
    }
    interface GraphicalVoiceEntry { notes?: GraphicalNote[]; }
    interface GraphicalStaffEntry { graphicalVoiceEntries?: GraphicalVoiceEntry[]; }
    interface MeasureShape extends Shape { Size: {width: number; height: number}; }
    interface MusicSystem {
        PositionAndShape: MeasureShape;
        StaffLines?: {PositionAndShape: Shape}[];
    }
    interface GraphicalMeasure {
        staffEntries?: GraphicalStaffEntry[];
        PositionAndShape: MeasureShape;
        ParentStaffLine?: {ParentMusicSystem: MusicSystem};
    }
    interface GraphicSheet { MeasureList: GraphicalMeasure[][]; }
    interface Cursor extends PianoTrainerScoreTraversal.Cursor {
        show(): void;
        // Actual OSMD getter and its backing field. Neither is a domain position.
        iterator: PianoTrainerScoreTraversal.Iterator;
        cursorElement?: HTMLElement;
    }
    interface LayoutOptions {
        renderSingleHorizontalStaffline: boolean;
        newSystemFromXML: boolean;
        newSystemFromNewPageInXML: boolean;
        newPageFromXML: boolean;
        followCursor: boolean;
    }
    interface SourceMeasure {TempoInBPM?: number; ActiveTimeSignature?: {Numerator: number; Denominator: number};}
    interface Sheet {SourceMeasures?: SourceMeasure[];}
    interface Renderer {
        cursor?: Cursor | null;
        Sheet?: Sheet | null;
        GraphicSheet?: GraphicSheet | null;
        EngravingRules: {
            SheetMaximumWidth: number;
            NewSystemAtXMLNewSystemAttribute: boolean;
            NewSystemAtXMLNewPageAttribute: boolean;
            NewPageAtXMLNewPageAttribute: boolean;
        };
        FollowCursor: boolean;
        setOptions(options: LayoutOptions): void;
        IsReadyToRender(): boolean;
        render(): void;
    }
}
