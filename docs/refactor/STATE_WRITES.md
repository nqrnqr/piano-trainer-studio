# AppState 直接写入位置

由 `node scripts/inventory-state-writes.cjs` 重建。扫描赋值、增减及容器变更调用。
这不是完整调用图；对象通过局部别名或函数返回值修改的补充所有权说明见 STATE_OWNERSHIP.md。
默认字段初始化在 src/state/app-state.ts，运行中追加的 5 字段保持 optional。

| 位置 | 目标 | 操作 |
| --- | --- | --- |
| src/state/player-range.ts:10 | AppState.playerRange | = |
| src/state/preferences.ts:98 | AppState.midiInChannel | = |
| src/state/preferences.ts:99 | AppState.midiOutChannel | = |
| src/state/preferences.ts:100 | AppState.midiLightsChannel | = |
| src/state/preferences.ts:101 | AppState.midiLedLowVelocity | = |
| src/state/preferences.ts:102 | AppState.ledReverse | = |
| src/state/preferences.ts:103 | AppState.inputVelocityEnabled | = |
| src/state/preferences.ts:104 | AppState.liveLowLatencyMonitoringEnabled | = |
| src/state/preferences.ts:105 | AppState.lowLatencyPlaybackEnabled | = |
| js/led.js:138 | AppState.ledCalibrationMode | = |
| js/led.js:153 | AppState.ledCalibrationSelectedMidi | = |
| js/led.js:162 | AppState.ledCalibrationSelectedMidi | = |
| js/led.js:570 | AppState.wledTransport | = |
| js/led.js:573 | AppState.wledDdpLastSendOk | = |
| js/led.js:574 | AppState.wledDdpLastSendAt | = |
| js/led.js:575 | AppState.wledDdpLastError | = |
| js/led.js:676 | AppState.wledStatus | = |
| js/led.js:681 | AppState.wledConnectionState | = |
| js/led.js:699 | AppState.ledOutputMode | = |
| js/led.js:712 | AppState.wledConnectionState | = |
| js/led.js:719 | AppState.wledConnectionState | = |
| js/led.js:728 | AppState.ledReverse | = |
| js/led.js:748 | AppState.wledIp | = |
| js/led.js:753 | AppState.wledConnectionState | = |
| js/led.js:770 | AppState.ledOutputMode | = |
| js/led.js:771 | AppState.wledIp | = |
| js/led.js:772 | AppState.wledTransport | = |
| js/led.js:773 | AppState.wledActiveTransport | = |
| js/led.js:774 | AppState.wledHelperAvailable | = |
| js/led.js:775 | AppState.wledHelperStatus | = |
| js/led.js:776 | AppState.wledDdpDebugEnabled | = |
| js/led.js:812 | AppState.wledDdpDebugEnabled | = |
| js/led.js:1058 | AppState.wledActiveTransport | = |
| js/led.js:1101 | AppState.wledHelperAvailable | = |
| js/led.js:1102 | AppState.wledHelperStatus | = |
| js/led.js:1105 | AppState.wledActiveTransport | = |
| js/led.js:1145 | AppState.wledHelperAvailable | = |
| js/led.js:1149 | AppState.helperVersion | = |
| js/led.js:1152 | AppState.wledHelperStatus | = |
| js/led.js:1160 | AppState.wledHelperStatus | = |
| js/led.js:1161 | AppState.wledDdpLastSendOk | = |
| js/led.js:1163 | AppState.wledActiveTransport | = |
| js/led.js:1301 | AppState.wledConnectionState | = |
| js/led.js:1306 | AppState.wledConnectionState | = |
| js/led.js:1477 | AppState.wledDdpLastSendOk | = |
| js/led.js:1478 | AppState.wledDdpLastError | = |
| js/led.js:1483 | AppState.wledDdpLastSendOk | = |
| js/led.js:1484 | AppState.wledDdpLastSendAt | = |
| js/led.js:1485 | AppState.wledDdpLastError | = |
| js/led.js:1486 | AppState.wledHelperStatus | = |
| js/led.js:1892 | AppState.hardwareLEDState | clear |
| js/optional/midi-led-test.js:97 | AppState.hardwareLEDState | clear |
