// Used surface of bundled webmscore 0.21.0-a; export values cross as unknown.
declare namespace PianoTrainerWebmscoreVendor {
    interface Score {
        saveXml?(): Promise<unknown>; saveMusicXml?(): Promise<unknown>;
        saveMxml?(): Promise<unknown>; saveMusicXML?(): Promise<unknown>;
        destroy?(soft?: boolean): void;
    }
    interface Engine {ready?: Promise<unknown>; load(format: string, bytes: Uint8Array): Promise<Score | null>;}
}
interface Window {WebMscore?: PianoTrainerWebmscoreVendor.Engine;}
