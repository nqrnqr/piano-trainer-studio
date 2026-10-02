# 经典脚本依赖与启动副作用

记录日期：2026-10-02。P0 基线为 `be6d51c`；P1 仅替换 timing 槽位。

P2 将原第 1 槽位展开为 generated/state 的 preference-keys、app-state、preferences、
settings-backup 与 generated/ui/settings-controls，依次同步执行。其余相对顺序保持，
原 trainer-state.js 已移除；下表第 1 行是历史职责汇总。默认值副作用在 preferences 执行末尾。

P3 键域步骤在 key 表之前加载 generated/domain/playable-range，在 preferences 之后加载
generated/state/player-range。旧 led.js 的范围定义已删除；键盘、feedback、core 预览仍调用原名，
其计算和共享缓存现在由非硬件模块拥有。

完整符号候选、定义行、引用文件及实际加载顺序见 [GLOBAL_SYMBOLS.json](GLOBAL_SYMBOLS.json)。
运行 `node scripts/inventory-legacy-globals.cjs` 可从当前入口重建。它扫描列首声明和
`window.*` 赋值，引用是词法匹配，包含注释、局部遮蔽等候选；不是调用图或完整 AST。
IIFE 内局部声明、解构声明、动态索引不自动认定为全局。以下是人工审阅的边界与副作用。

## 执行顺序

所有业务脚本是同步经典脚本，由 `document.write` 加载；后面的函数声明可覆盖前面的声明。
入口先读取 `version.json`，设置 `window.__PT_APP_MANIFEST__` / `__PT_ASSET_VERSION__`，
再加载本地 Tone 和 OSMD。其后严格按以下顺序执行：

| 顺序 | 文件／接口 | 执行时副作用及依赖 |
| --- | --- | --- |
| 1 | trainer-state.js / `AppState`、storage helpers | 读取设置、写首次默认值、应用强制设置。依赖版本全局与 localStorage；`AppState` 是全局词法 const，不是 Window 属性 |
| 2 | transpose-engine.js / `TransposeEngine` | IIFE 暴露 XML 移调 API；转换时使用 XML DOM |
| 3 | transpose-ui.js / `TransposeUI` | 绑定控件、初始化选项与移调状态；事件后调用 loader |
| 4 | toolbar-ui.js / popup globals | 捕获 DOM、绑定菜单／遮罩／resize／首运行帮助事件 |
| 5 | score-library.js / `ScoreLibrary` | 定义 repository 与 Window 转发；打开 IndexedDB / 导入初始库在方法调用时发生 |
| 6 | scores-ui.js / `ScoresUI` | 绑定抽屉、文件列表与管理事件；异步初始化库与初始导入 |
| 7 | led.js / `LedEngine`、`WLEDController`、键域和连接 helpers | 定义硬件、键域、权限与更新 API；实际 LED 初始化由 core 调用。仍是核心必需依赖 |
| 8 | midi.js / `midiAccess`、`activeMidiInput`、MIDI helpers | 绑定选择／通道／LED 测试事件、同步 LED 控件；权限请求由 core 调用 `setupMIDI` |
| 9 | midi-import.js / `MidiImport` | IIFE 定义转换 API；首次转换才加载本地 webmscore / WASM |
| 10 | feedback-engine.js / `GeometryEngine`、匹配和计分 helpers | 定义几何、反馈、期望音符与漏音入口；这些函数会读写 AppState，并非都是纯函数 |
| 11 | feedback-debug.js / debug helpers | 定义诊断入口，不能承担生产匹配规则 |
| 12 | timing / `window.PTTiming` | 建立／复用 namespace 并定义两项纯计算；P0 为 trainer-timing.js，P1 为 generated/domain/timing.js |
| 13 | score-display.js / `ScoreDisplay` | IIFE 定义布局与跟随 API，持有显示 cursor 快照、scroll rAF |
| 14 | trainer-core.js / orchestration globals | 应用偏好、创建 OSMD／Tone 资源、绑定 UI 与键盘、初始化 LedEngine、调用 setupMIDI、启动 LED pulse rAF；集中组装入口尚未迁移 |

## 关键符号契约

| 定义者／符号 | 主要消费者 | 副作用／迁移约束 |
| --- | --- | --- |
| state / `AppState` | 除 timing、纯移调外的大部分业务脚本 | 多写入者；Map/Set 身份与动态字段在 P2 记录，不提前换 store |
| state / `getStoredBool`、`setStoredBool`、`normalizeMidiChannel`、storage constants | core、led、midi、display、scores、toolbar | 保持 key、默认值和 `0 = Any` 输入语义 |
| core / `osmd`、`measureTimingCache`、`getMeasureTimingInfo` | feedback、debug、display、练习／预览 | OSMD 运行位置与绘制位置不同；measure timing 是全音符单位 |
| timing / `PTTiming.getRemainingMeasureWaitWhole`、`getTraversalBeatsToWait` | core 的 Follow、提前输入、playbackLoop；测试 | 不读取 DOM；遍历结果为四分拍数，反复／跳结尾用当前小节剩余长度 |
| core / `triggerVirtualKey` | MIDI callback、虚拟键盘事件、集成测试 | 按下／释放、实时监听、计分、提前预留和反馈；UI 与 MIDI 使用同一入口 |
| feedback / `findExpectedMatchForMidi`、`buildExpectedNotesFromEntries`、`processMissedNotes` | core | 构造期望组会处理提前预留并计分；保持副作用顺序 |
| led / `getPlayerPlayableRange`、`isMidiInPlayerRange` | core、feedback、debug、MIDI LED test | 可弹奏键域影响判定，不是可删除的硬件功能 |
| core / `ensureLedPreviewTimelineBuilt`、预览签名与遍历函数 | core 单手提前预留、LedEngine／键盘 | `findSingleHandPracticeTimelineWindow` 依赖它，即使 LED 模式 none 也必须工作 |
| led / MIDI permission、connection status、update helpers | midi、core、toolbar | 用户错误提示和连接状态不是硬件输出职责 |
| display / `ScoreDisplay` | core、集成测试 | render/zoom 后恢复已绘制 cursor，再恢复真实 iterator；取消／重置跟随需保持 |
| library / `ScoreLibrary` | ScoresUI、core | IndexedDB `pianoTrainerLibrary` v1；保持事务、返回时机与备份格式 |
| transpose / `TransposeEngine`、`TransposeUI` | core、移调控件 | 原始 MXL 直接交 OSMD；提取 XML 用于移调的路径不能替换原谱路径 |
| core / `renderScoreAndRefreshGeometry`、`playbackLoop`、`checkWaitModeAdvance` | UI、输入、resize、测试 | 渲染生命周期和播放推进仍由原实现协调 |

## 同名 MIDI 覆盖

`getSelectedMidiOutOutput`、`sendMidiOutNoteOn`、`sendMidiOutNoteOff` 同时定义在
`midi.js` 与 `trainer-core.js`。后加载的 core 是实际生效版本，P0 已有用例按此顺序加载。

- midi Note On：`Number(velocity) || 100`、四舍五入后夹到 1..127；0 → 100。
- core Note On：`normalizeLiveVelocity` 先判断有限数字再夹到 1..127；0 → 1，65.5 保持 65.5。
- midi 输出通道 helper 读 DOM 值，core 的 `getMidiOutStatus` 使用 `AppState.midiOutChannel`。
- 两者都记录回声、排除断连／None 输出；Note Off 力度为 0。

P4a 收敛时以 core 行为为基线，若需修复小数 MIDI 数据，另做产品行为修复与独立用例。

## 临时兼容层

P1 保留经典脚本顺序及 `window.PTTiming` 身份。其声明按字段描述，不声明整份 AppState
或 vendor 为 `any`。源映射内嵌 TS；本地服务器不需开放 `/src`。P2 及以后逐步消除隐式全局。
