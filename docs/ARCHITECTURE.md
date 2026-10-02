# Architecture

## Current structure
- `/assets/js` = local third-party vendor libraries kept separate for offline use
- `/assets/audio` = static audio assets such as Salamander samples
- `/js` = extracted app modules with focused ownership
- `/src` = migrated TypeScript source; `/js/generated` = committed classic-script output and embedded source maps
- `trainer-core.js` = remaining integration layer for rendering lifecycle, playback scheduling, metronome flow, repeat/jump handling, and cross-module orchestration
- `/docs` = architecture notes and development notes

## Current modules
- `src/state/app-state.ts`, `preference-keys.ts`, `preferences.ts`, `settings-backup.ts` = typed shared state, canonical settings keys, persistence and backup format; generated classic scripts retain the original lexical bindings
- `src/ui/settings-controls.ts` = settings download, FileReader import, alert and reload boundary
- `src/domain/playable-range.ts` / `src/state/player-range.ts` = hardware-independent keyboard range math and shared range cache used by input grading and previews
- `src/domain/timing.ts` → `js/generated/domain/timing.js` = shared timing math for traversal waits, measure remainder checks, and playback scheduling inputs
- `src/score/osmd-adapter.ts` = OSMD graph access, revision-scoped NoteRef registry, private iterator snapshot and painted cursor restoration
- `src/render/score-viewport.ts`, `score-renderer.ts` = layout/scroll ownership and the unchanged render lifecycle
- `src/render/geometry-engine.ts`, `feedback-overlay.ts`, `loop-overlay.ts` = stabilized notehead anchors and independent SVG layers
- `js/toolbar-ui.js` = toolbar/menu shell
- `js/scores-ui.js` = score browser UI shell
- `js/score-library.js` = score library shell
- `js/led.js` = LED simulator, calibration, and hardware/WLED output
- `src/midi/*.ts`, `src/ui/midi-controls.ts` = Web MIDI decoding, service, output and device controls; old js/midi.js is removed
- `src/audio/*.ts`, `src/domain/velocity.ts` = Tone voice/loading/unlock lifecycle, independent audio/MIDI routing and shared velocity normalization
- `js/feedback-engine.js` = remaining legacy matching, expected-note construction and feedback state, delegating geometry/overlays to render ports
- `js/feedback-debug.js` = developer-only feedback diagnostics and sticky debug labels
- `trainer-core.js` = remaining trainer core and orchestration


## Timing module boundary
- `src/domain/timing.ts` is shared infrastructure for all practice modes, exposing the existing `window.PTTiming` API through generated classic JS
- It answers **how long** structural traversal should wait
- It must not directly move the cursor, render feedback, or update UI
- `trainer-core.js` remains the orchestrator that decides **when** each mode advances
- Realtime structural jumps should use current-measure remainder timing instead of first-note fallbacks or raw iterator deltas
- Edit the TS source, run `npm run build`, and commit both JS and map. `npm run check` validates types, generated output, and Node behavior tests. See `docs/refactor/DEVELOPMENT.md` for the staged migration and browser checks.

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

## Why `trainer-core.js` stays together for now
The remaining file still owns the most timing-sensitive systems:
- playback scheduling
- repeat/jump traversal
- metronome behavior and drift fixes
- count-in handoff
- render commands still enter through transitional compatibility; lifecycle implementation is in src/render

Keeping those areas together is safer while playback/navigation behavior is still being stabilized.

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
- `js/feedback-debug.js` is developer-only diagnostic tooling
- It must not own production feedback matching or anchor-placement rules

## Rename note
- `app.js` was renamed to `trainer-core.js` once the safer module boundaries were extracted
- The rename is organizational only; playback/rendering logic remains together on purpose

------------------------
- Note - if first run values look different in menu than what they actually are - check if the storagehelper looks to localstorage and is defaulting to 0. 

- When the app is more stable, plan to change from nodejs install requirement, to included mac/win runtime. 

