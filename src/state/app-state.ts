// Shared state retains its legacy shape, identity and initialization order.
const APP_MANIFEST = window.__PT_APP_MANIFEST__ || {};

const APP_REPO_SLUG = 'ztbishop/piano-trainer-studio';

const APP_VERSION = String(window.__PT_ASSET_VERSION__ || APP_MANIFEST.version || 'dev').trim();

const UPDATE_MANIFEST_URL =
  localStorage.getItem(UPDATE_MANIFEST_URL_STORAGE_KEY) || '/version.json';

const UPDATE_RELEASES_URL = String(
  APP_MANIFEST.releaseUrl || `https://github.com/${APP_REPO_SLUG}/releases/latest`
).trim();

const UPDATE_TAG_ZIP_URL = String(
  APP_MANIFEST.downloadUrl || `https://github.com/${APP_REPO_SLUG}/archive/refs/tags/v${APP_VERSION}.zip`
).trim();

const AppState: LegacyAppState = {
    mode: 'realtime',
    followAdvanceInfo: null,
    currentExpectedContext: null,
    earlyGraceReservations: new Map<number, PianoTrainerDomain.EarlyGraceReservation>(),
    isPlaying: false,
    isAudioBusy: false,
    zoom: 1.0,
    baseBpm: 120,
    speedPercent: 1.0,
    looper: { enabled: false, min: 1, max: 100 },
    hands: { left: 2, right: 1 },
    practice: { left: true, right: true },
    playback: { left: true, right: true },
    modeSettings: {
        realtime: { practice: { left: true, right: true }, playback: { left: true, right: true } },
        wait: { practice: { left: true, right: true }, playback: { left: false, right: false } },
        follow: { practice: { left: false, right: true }, playback: { left: true, right: false } }
    },
    audioEnabled: { hands: true, other: false, instrument: false, virtual: true },
    midiOutEnabled: { hands: false, other: false, instrument: false, virtual: false },
    midiOutVolume: 65,
    midiInBoost: 100,
    expectedNotes: [],
    pressedKeys: new Set<number>(),
    heldCorrectNotes: new Map<number, number | null>(),
    preExpectedHeldNotes: new Set<number>(),
    activeHeldIncorrectFeedback: new Map<number, PianoTrainerDomain.FeedbackMarker>(),
    releasedIncorrectFeedback: [],
    correctFeedbackHistory: [],
    realtimeWrongPressInCurrentContext: false,
    pendingAudio: [],
    feedbackEnabled: true,
    anchorTime: 0,
    score: { correct: 0, wrong: 0 },

    sustainedVisuals: [],
    visualNotesToStart: [],
    activeTimeouts: [],
    hardwareLEDState: new Map<number, string>(),
    recentMidiEchoes: [],
    debugPersistentAnchors: false,
    debugEventFlow: false,
    debugMatchLogs: false,
    debugAnchorResolution: false,
    debugStickyFrameLimit: 30,
    debugFrameSeq: 0,
    debugAnchorHistory: [],
    futurePreviewEnabled: true,
    futurePreviewDepth: 1,
    correctHighlightEnabled: false,
    wledDdpDebugEnabled: false,
    helperVersion: '',
    updateManifestUrl: '',
    updateStatus: '',
    updateLastCheckedAt: 0,
    updateInfo: null,
    countInActive: false,
    lastLedPreviewEvents: [],
    ledPreviewTimeline: [],
    ledPreviewTimelineDirty: true,
    ledPreviewTraversalIndex: -1,
    playerPianoType: 88,
    playerRange: null,
    outOfRangeCurrentNotes: [],
    ledOutputMode: 'none',
    midiInChannel: 0,
    midiOutChannel: 1,
    midiLightsChannel: 1,
    midiLedLowVelocity: false,
    ledReverse: false,
    wledIp: '',
    wledTransport: 'http-json',
    wledActiveTransport: 'http-json',
    wledHelperAvailable: false,
    wledHelperStatus: 'Helper: Not detected.',
    wledStatus: 'WLED idle.',
    wledConnectionState: 'none',
    ledCalibrationMode: false,
    ledCalibrationSelectedMidi: null,
    visualPulseEnabled: true,
    accentedDownbeatEnabled: true,
    loopCountInEnabled: true,
    metronomeMidiOutEnabled: false,
    currentScoreData: null,
    currentScoreOriginalData: null,
    currentScoreFileName: '',
    currentScoreOriginalFileName: '',
    inputVelocityEnabled: true,
    liveLowLatencyMonitoringEnabled: true,
    lowLatencyPlaybackEnabled: false,
    currentScoreFileType: '',
    currentScoreOriginalFileType: '',
    currentScoreLibraryId: null,
    currentScoreTitle: '',
    fullscreenOnPlay: false,
    pseudoFullscreenActive: false,
    transpose: {
        available: false,
        sourceKeyLabel: 'No score loaded',
        sourceKeyFound: false,
        mode: 'key',
        semitones: 0,
        targetKey: 'sig-0',
        updateKeySignature: true,
        active: false,
        activeLabel: 'Original score',
        disableReason: 'Load a MusicXML-based score to enable transpose.'
    },
    scoreLibrarySelectedFolderId: '__all__',
    scoreLibraryView: 'folders',
    scoreLibraryManageMode: false,
    scoreLibrarySelectedScoreIds: []
};

const FULL_PIANO_MIDI_MIN = 21;

const FULL_PIANO_MIDI_MAX = 108;

const FULL_PIANO_KEY_COUNT = 88;

const PLAYER_PIANO_SIZES = [88, 76, 73, 61, 49, 37, 32, 25];
