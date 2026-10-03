# Architecture

## Current structure
- `/assets/js` = local third-party vendor libraries kept separate for offline use
- `/assets/audio` = static audio assets such as Salamander samples
- `/js` = extracted app modules with focused ownership
- `/src` = migrated TypeScript source; `/js/generated` = committed classic-script output and embedded source maps
- `trainer-core.js` = original startup order only; typed factories own score data, input, render and playback coordination
- `/docs` = architecture notes and development notes

## Current modules
- `src/state/app-state.ts`, `preference-keys.ts`, `preferences.ts`, `settings-backup.ts` = typed shared state, canonical settings keys, persistence and backup format; generated classic scripts retain the original lexical bindings
- `src/ui/settings-controls.ts` = settings download, FileReader import, alert and reload boundary with owned-reader/link/URL disposal
- `src/domain/playable-range.ts` / `src/state/player-range.ts` = hardware-independent keyboard range math and shared range cache used by input grading and previews
- `src/domain/timing.ts` → `js/generated/domain/timing.js` = shared timing math for traversal waits, measure remainder checks, and playback scheduling inputs
- `src/score/osmd-adapter.ts` = OSMD graph access, revision-scoped NoteRef registry, private iterator snapshot and painted cursor restoration
- `src/render/score-viewport.ts`, `score-renderer.ts` = layout/scroll ownership and the unchanged render lifecycle
- `src/render/geometry-engine.ts`, `feedback-overlay.ts`, `loop-overlay.ts` = stabilized notehead anchors and independent SVG layers
- `src/practice/*.ts` = typed common input, expected notes, pitch matching, early grace, feedback records, scoring and sustain state; factories consume domain data and narrow ports
- `src/ui/toolbar.ts` = native toolbar/menu/first-run shell and owned transitions; old toolbar-ui.js is removed
- `src/ui/controls-dom.ts`, `display-controls.ts`, `tempo-controls.ts`, `audio-level-controls.ts`, `loop-controls.ts` = typed DOM access, fullscreen/Play/Reset/zoom/resize, speed/metronome, numeric audio levels and loop range/hold resources
- `src/score/musicxml-io.ts`, `score-loader.ts`, `score-conversion.ts`, `webmscore-adapter.ts`, `transpose-*.ts` = score data, native loading, conversion and transpose boundaries
- `src/domain/library.ts`, `library-view.ts`, `src/score/library-backup.ts`, `score-library.ts` = v1 library records, filtering, backup and IndexedDB repository
- `src/ui/library-controls-state.ts`, `library-dialogs.ts`, `library-actions.ts`, `library-list.ts`, `scores-drawer.ts` = selection, native dialogs, library commands, rows and responsive drawer; old scores-ui.js and score-library.js are removed
- `js/led.js` = LED simulator, calibration, and hardware/WLED output
- `src/midi/*.ts`, `src/ui/midi-controls.ts` = Web MIDI decoding, service, output and device controls; old js/midi.js is removed
- `src/audio/*.ts`, `src/domain/velocity.ts` = Tone voice/loading/unlock lifecycle, independent audio/MIDI routing and shared velocity normalization
- `src/practice/playback-coordinator.ts`, `playback-state.ts` = single Play/Pause/Reset/Loop coordinator and original transient/visual cleanup; old feedback-engine.js is removed
- `src/audio/metronome.ts`, `metronome-output.ts`, `playback-clock.ts`, `tone-transport.ts` = count-in/beat decisions, actual Tone node, native clock resource ownership and unchanged Transport commands
- `src/score/measure-timing.ts`, `src/ui/tempo-pulse.ts`, `playback-controls.ts` = actual traversal cache, DOM pulse and playback control reads
- `src/ui/feedback-debug.ts` = developer-only sticky debug labels, checkbox and heartbeat; `src/score/osmd-debug-observation.ts` provides vendor snapshots
- `src/domain/keyboard-state.ts`, `src/app/keyboard-controller.ts`, `src/render/virtual-keyboard.ts` = key-state priority, sustain/preview/output coordination and native key presentation
- `src/ui/virtual-keyboard-controls.ts`, `score-seek-controls.ts`, `score-status.ts` = owned pointer/mouse/touch/activation events, native score clicks and score percentage
- `src/app/score-seek-controller.ts`, `score-ui-controller.ts` = real-iterator seeking and loaded-score metadata/UI commands; staff identity stays inside the OSMD adapter
- `trainer-core.js` = remaining startup sequence; classic composition moves into bootstrap at P9


## Timing module boundary
- `src/domain/timing.ts` is shared infrastructure for all practice modes, exposing the existing `window.PTTiming` API through generated classic JS
- It answers **how long** structural traversal should wait
- It must not directly move the cursor, render feedback, or update UI
- `src/practice/playback-coordinator.ts` is the single orchestrator that decides **when** each mode advances; P7b will extract policies from its existing branches
- Realtime structural jumps should use current-measure remainder timing instead of first-note fallbacks or raw iterator deltas
- Edit the TS source, run `npm run build`, and commit both JS and map. `npm run check` validates types, generated output, and Node behavior tests. See `docs/refactor/DEVELOPMENT.md` for the staged migration and browser checks.

## Practice input boundary

MIDI messages and virtual key events reach the same `practiceInput.handle(TrainerNoteInput)`.
The input controller preserves physical-key updates, audio monitoring, matching/reservation,
feedback/scoring, hit marking, advance notification and keyboard/LED presentation order.
Expected-note construction consumes the OSMD adapter's lazy domain projection; practice code
has no DOM, vendor object or audio clock access. Ties remain an adapter concern, while hidden/cue,
rest/continuation, hand and range filtering remain explicit in expected-notes.
Same-staff pitch merging and cross-staff identities retain their original rules. Feedback records
belong to practice; SVG overlays only draw them. Sustain timers still use the original shared
activeTimeouts cancellation list; playback-state cancels that list only on original visual cleanup. Classic assembly and forwards
live in `src/compatibility/practice.ts` and will move into bootstrap at P9.

## Playback coordination boundary

The coordinator reads lazy domain PlaybackEvent data and numeric traversal observations from the OSMD
adapter; only the adapter moves or paints the real iterator. Event entries stay captured while the
iterator prefetches the next event. Painted snapshots remain private to the adapter and viewport.
Classic playback composition temporarily passes captured entries back to the legacy keyboard at that
boundary; vendor objects do not enter practice. State flags, Follow comfort rules, real repeats and
timer ordering retain their existing meanings.

Normal Pause and Reset retain their original cancellation rules. Explicit dispose clears the event
clock and metronome/count-in clock and rejects pending async starts; native Transport owns no scheduled
events in this application. Original late-callback and pending-unlock behavior is documented and tested
in `docs/refactor/P7_SCHEDULING_CONTRACT.md`. The muted native Tone fixture records the original Wait
look-ahead offset and the immediate-time Follow/Realtime window; hardware/audible synchronization
remains a separate manual check.

## Score display modes

Display → Score Layout selects Traditional (the default) or Continuous (horizontal).
The choice is stored as `pt_scoreLayout`; Auto Scroll applies to both layouts.
Horizontal mode uses the bundled OSMD SVG backend and `renderSingleHorizontalStaffline`,
disables MusicXML system/page breaks, and expands the engraving width for long scores.
Switching back restores the original engraving options and container width.

All practice modes still advance through the same playback loop and `handleAutoScroll`.
Traditional mode retains the vertical threshold behavior. Horizontal mode follows each
painted cursor position toward 33% of the viewport with one retargetable animation.
It does not predict notes or advance musical time. At a Wait/Follow stop, the viewport
settles on the current note; backward repeats use the same follower. Pause cancels the
animation; Reset follows the reset cursor. Reduced-motion preferences use immediate positioning.

The playback iterator often points one event ahead of the visible cursor. The display
adapter snapshots the iterator when `cursor.update()` paints and uses that snapshot only
to repaint after a horizontal relayout or mode switch. It restores the live iterator
immediately, without traversing or scheduling it. OSMD recreates cursors on render, so the
update hook is attached again by `afterRender()` without stacking wrappers. Expected notes retain a revision-scoped
NoteRef, resolved only by the adapter, so feedback anchors can be refreshed after geometry invalidation without
rebuilding grading state. This integration depends on the bundled OSMD cursor's `iterator`
field; rerun the display and render checks when upgrading OSMD. The registry uses exact source identity,
keeps equal-pitch voices separate and invalidates old references on a new Sheet or dispose.

Run `node local-web-server.js`, then open `/docs/testing/score-display.html` and click
Run checks for browser integration coverage. The synthetic two-staff score exercises
layout switching, smooth following, reverse navigation, final-measure positioning,
Auto Scroll, zoom, Reset, narrow screens, long SVGs, and actual Wait/Follow/Realtime
advancement. MIDI input is simulated through the app's normal virtual-key handler;
physical MIDI devices and hardware outputs require separate manual verification.
The test harness drives animation frames deterministically because background browsers
may suspend native animation callbacks. Production following uses native requestAnimationFrame.

## Why playback keeps one coordinator
`src/practice/mode-policy.ts` owns pure Wait/Follow/Realtime decisions; the coordinator owns one
event loop, state writes and effects. It resolves the current mode at the original decision points,
including after sustain/audio effects and inside pending callbacks. Displayed and prefetched numeric
positions are separate observations; only the OSMD adapter retains full iterator/repeat state.
Existing flags, real repeat traversal and native clock behavior are preserved. Metronome and count-in own their separate
clock resources, but handoff remains a coordinator command. No independent cursor clock or tempo
scheduler has been added. XML/MXL IO and score loading now live in `src/score/musicxml-io.ts`
and `score-loader.ts`; OSMD receives original MXL bytes, while extracted XML belongs to transpose.
Native file reads and the required input binding live in `src/ui/score-file-*.ts`; core initializes
the input at the original point. Conversion lives in `score/score-conversion.ts`, with lazy vendor readiness
and binary decoding in `score/webmscore-adapter.ts`. Native XML transforms live in `score/transpose-engine.ts`;
original-source commands and DOM listeners live in `score/transpose-controller.ts` and `ui/transpose-controls.ts`.
Ordinary conversion preserves vendor soft destroy; explicit disposal releases owned score workers.
Native v1 IndexedDB operations and starter imports live in `score/score-library.ts`; the
permissive backup codec lives in `score/library-backup.ts`. Commands wait for native transaction
completion, preserve the existing schema and generate new IDs on backup import. Explicit disposal
aborts owned transactions, closes the connection and prevents late commands from reopening it.
The score drawer now lives in `ui/scores-drawer`, `library-list`, `library-actions` and
`library-dialogs`, with domain selection rules in `domain/library-view`. Toolbar, display,
tempo, audio level and Loop controls own their native resources. Hand routing rules live
in `domain/hand-routing`; `app/hand-assignment-controller` commits assignments using one
captured frame through typed commands. Practice, preference and settings button controls
live in their respective UI factories. They preserve mode-specific objects, saved routing
choices, reset change-event order and the existing file commands. Only explicit disposal
removes their listeners and invalidates old handlers; repeated initialization is deduplicated.
Keyboard presentation consumes domain states; its controller coordinates existing sustains,
preview and optional outputs without accessing vendor objects or DOM. Pointer, mouse and touch
handlers preserve ordinary delayed attacks and keyboard rebuild behavior. Explicit disposal
removes connected and detached owned handlers and prevents old unlock continuations from firing.
Score seeking delegates to the existing real iterator; loaded-score UI uses typed metadata commands.
Core now retains the original startup sequence. Classic composition and forwards remain temporary
until the P9 bootstrap and module bundle.

## Fragile systems
- Feedback-note anchor positioning and resize stability
- Beam/layout rendering stability
- Playback repeat/jump timing
- Metronome sync and drift behavior
- LED shared frame pipeline

## Commenting standard
- Minimal HTML comments only when script order is non-obvious
- Short ownership header comments at the top of app JS files
- Targeted warning comments above fragile functions only
- Larger structure notes belong in `/docs`, not in `index.html`

## Debug rule
- `src/ui/feedback-debug.ts` is developer-only diagnostic tooling
- It must not own production feedback matching or anchor-placement rules

## Rename note
- `app.js` was renamed to `trainer-core.js` once the safer module boundaries were extracted
- The rename was organizational only. The staged TypeScript migration now assigns playback/rendering to explicit factories while preserving their behavior.

------------------------
- Note - if first run values look different in menu than what they actually are - check if the storagehelper looks to localstorage and is defaulting to 0. 

- When the app is more stable, plan to change from nodejs install requirement, to included mac/win runtime. 

