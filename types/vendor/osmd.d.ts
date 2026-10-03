import {PianoTrainerDomain} from '../../src/domain/model';
import {PianoTrainerScoreTraversal} from '../../src/score/score-traversal';
declare global {
// Minimal used surface of bundled OSMD 1.9.7. Private cursor operations belong
// exclusively to score/osmd-adapter. Shape fields model the stabilized geometry
// access pattern; opaque/private enumeration is limited to two adapter sites.
namespace PianoTrainerOsmdVendor {
    interface Fraction { RealValue: number; }
    interface Note extends PianoTrainerScoreTraversal.Note {
        ParentVoiceEntry?: {Timestamp?: Fraction; ParentSourceStaffEntry?: {ParentStaff?: Staff}};
        parentStaff?: Staff;
        parentVoiceEntry?: {parentSourceStaffEntry?: {parentStaff?: Staff}};
        SourceStaff?: Staff;
        sourceStaff?: Staff;
    }
    interface Staff {id?: number;}
    interface Instrument {Staves?: Staff[]; staves?: Staff[]; Staffs?: Staff[]; staffs?: Staff[];}
    interface IdentityVoiceEntry {Notes?: Note[]; notes?: Note[];}
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
    interface GraphicSheet { MeasureList: GraphicalMeasure[][]; MusicPages?: {MusicSystems: unknown[]}[]; }
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
    interface Sheet {SourceMeasures?: SourceMeasure[]; Instruments?: Instrument[]; instruments?: Instrument[];}
    interface Renderer {
        zoom: number;
        load(rawData: PianoTrainerDomain.ScoreRawData): Promise<unknown>;
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

const opensheetmusicdisplay: {OpenSheetMusicDisplay: new (container: string, options: {autoResize:boolean;drawTitle:boolean}) => PianoTrainerOsmdVendor.Renderer};

}
export {};
