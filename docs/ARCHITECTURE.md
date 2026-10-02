# Architecture

## Current structure
- `/assets/js` = local third-party vendor libraries kept separate for offline use
- `/assets/audio` = static audio assets such as Salamander samples
- `/js` = extracted app modules with focused ownership
- `trainer-core.js` = remaining integration layer for rendering lifecycle, playback scheduling, metronome flow, repeat/jump handling, and cross-module orchestration
- `/docs` = architecture notes and development notes

## Current modules
- `js/trainer-state.js` = shared state and persisted preference helpers
- `js/trainer-timing.js` = shared timing math for traversal waits, measure remainder checks, and playback scheduling inputs
- `js/score-display.js` = score layout preference, single-system engraving, and horizontal viewport following
- `js/toolbar-ui.js` = toolbar/menu shell
- `js/scores-ui.js` = score browser UI shell
- `js/score-library.js` = score library shell
- `js/led.js` = LED simulator, calibration, and hardware/WLED output
- `js/midi.js` = WebMIDI setup, selectors, and connection state wiring
- `js/feedback-engine.js` = production feedback-note matching, anchor resolution, and overlay placement
- `js/feedback-debug.js` = developer-only feedback diagnostics and sticky debug labels
- `trainer-core.js` = remaining trainer core and orchestration


## Timing module boundary
- `js/trainer-timing.js` is shared infrastructure for all practice modes
- It answers **how long** structural traversal should wait
- It must not directly move the cursor, render feedback, or update UI
- `trainer-core.js` remains the orchestrator that decides **when** each mode advances
- Realtime structural jumps should use current-measure remainder timing instead of first-note fallbacks or raw iterator deltas

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
module snapshots the iterator when `cursor.update()` paints and uses that snapshot only
to repaint after a horizontal relayout or mode switch. It restores the live iterator
immediately, without traversing or scheduling it. OSMD recreates cursors on render, so the
update hook is attached again by `afterRender()`. Expected notes retain their logical-note
reference so feedback anchors can be refreshed after geometry invalidation without
rebuilding grading state. This integration depends on the bundled OSMD cursor's `iterator`
field; rerun the display checks when upgrading OSMD.

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
- score render lifecycle coordination

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

