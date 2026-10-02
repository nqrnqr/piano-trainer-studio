// Only the migrated runtime interface is described here. AppState remains a
// global lexical binding in legacy JS; it is deliberately not a Window member.
interface Window {
    PTTiming: PianoTrainerTiming.Api;
}
