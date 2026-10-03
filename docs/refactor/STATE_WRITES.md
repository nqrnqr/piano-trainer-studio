# AppState 直接写入位置

由 `node scripts/inventory-state-writes.cjs` 重建。扫描赋值、增减及容器变更调用。
这不是完整调用图；对象通过局部别名或函数返回值修改的补充所有权说明见 STATE_OWNERSHIP.md。
默认字段初始化在 src/state/app-state.ts，运行中追加的 5 字段保持 optional。

| 位置 | 目标 | 操作 |
| --- | --- | --- |
| src/compatibility/feedback-debug.ts:26 | AppState[flag] | = |
| src/state/player-range.ts:4 | AppState.playerRange | = |
| src/state/preferences.ts:111 | AppState.midiInChannel | = |
| src/state/preferences.ts:112 | AppState.midiOutChannel | = |
| src/state/preferences.ts:113 | AppState.midiLightsChannel | = |
| src/state/preferences.ts:115 | AppState.midiLedLowVelocity | = |
| src/state/preferences.ts:116 | AppState.ledReverse | = |
| src/state/preferences.ts:117 | AppState.inputVelocityEnabled | = |
| src/state/preferences.ts:118 | AppState.liveLowLatencyMonitoringEnabled | = |
| src/state/preferences.ts:119 | AppState.lowLatencyPlaybackEnabled | = |
| js/led.js:139 | AppState.ledCalibrationMode | = |
| js/led.js:155 | AppState.ledCalibrationSelectedMidi | = |
| js/led.js:165 | AppState.ledCalibrationSelectedMidi | = |
| js/led.js:613 | AppState.wledTransport | = |
| js/led.js:615 | AppState.wledDdpLastSendOk | = |
| js/led.js:616 | AppState.wledDdpLastSendAt | = |
| js/led.js:617 | AppState.wledDdpLastError | = |
| js/led.js:713 | AppState.wledStatus | = |
| js/led.js:719 | AppState.wledConnectionState | = |
| js/led.js:737 | AppState.ledOutputMode | = |
| js/led.js:752 | AppState.wledConnectionState | = |
| js/led.js:761 | AppState.wledConnectionState | = |
| js/led.js:772 | AppState.ledReverse | = |
| js/led.js:792 | AppState.wledIp | = |
| js/led.js:796 | AppState.wledConnectionState | = |
| js/led.js:815 | AppState.ledOutputMode | = |
| js/led.js:816 | AppState.wledIp | = |
| js/led.js:817 | AppState.wledTransport | = |
| js/led.js:818 | AppState.wledActiveTransport | = |
| js/led.js:819 | AppState.wledHelperAvailable | = |
| js/led.js:820 | AppState.wledHelperStatus | = |
| js/led.js:821 | AppState.wledDdpDebugEnabled | = |
| js/led.js:864 | AppState.wledDdpDebugEnabled | = |
| js/led.js:1159 | AppState.wledActiveTransport | = |
| js/led.js:1193 | AppState.wledHelperAvailable | = |
| js/led.js:1194 | AppState.wledHelperStatus | = |
| js/led.js:1197 | AppState.wledActiveTransport | = |
| js/led.js:1228 | AppState.wledHelperAvailable | = |
| js/led.js:1231 | AppState.helperVersion | = |
| js/led.js:1234 | AppState.wledHelperStatus | = |
| js/led.js:1241 | AppState.wledHelperStatus | = |
| js/led.js:1242 | AppState.wledDdpLastSendOk | = |
| js/led.js:1244 | AppState.wledActiveTransport | = |
| js/led.js:1348 | AppState.wledConnectionState | = |
| js/led.js:1353 | AppState.wledConnectionState | = |
| js/led.js:1487 | AppState.wledDdpLastSendOk | = |
| js/led.js:1488 | AppState.wledDdpLastError | = |
| js/led.js:1493 | AppState.wledDdpLastSendOk | = |
| js/led.js:1494 | AppState.wledDdpLastSendAt | = |
| js/led.js:1495 | AppState.wledDdpLastError | = |
| js/led.js:1496 | AppState.wledHelperStatus | = |
| js/led.js:1843 | AppState.hardwareLEDState | clear |
| js/optional/midi-led-test.js:85 | AppState.hardwareLEDState | clear |
