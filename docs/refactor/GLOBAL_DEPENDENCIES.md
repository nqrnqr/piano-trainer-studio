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

P4a 已收敛为 `src/midi/midi-output.ts` 的唯一实现，以 core 行为为基线；小数力度未修复。
上面的覆盖描述是 P0 历史证据。旧 midi.js 和 core 重复定义已删除，当前经典脚本 inventory 无同名函数覆盖。

## 临时兼容层

P1 保留经典脚本顺序及 `window.PTTiming` 身份。其声明按字段描述，不声明整份 AppState
或 vendor 为 `any`。源映射内嵌 TS；本地服务器不需开放 `/src`。P2 及以后逐步消除隐式全局。

P3 后，上表中的 LED 键域 provider 已迁至 domain/state；时间线 provider 已迁至
`src/score/score-traversal.ts`。中性名称的方法通过工厂注入 cursor、共享缓存、谱表／手分配、
范围检查与 debug port，不读取 DOM、Tone、LED 或 OSMD 全局。`src/compatibility/score-traversal.ts`
保留旧名只读转发供 core 的提前输入、keyboard、playback 与测试使用；cache 字段仍沿用 P2 的
`ledPreview*` 名称以保留状态身份，P9 随消费者迁移移除这些 forwards。

MIDI 权限提示、连接状态、更新检查分别归属 `src/ui/{permission-help,connection-status,update-controls}.ts`。
连接状态通过暂时的 `getLegacyMidiPort` 回调读取实际 MIDI 服务；P4a 已将 provider 换成新 service。
更新 UI 在 core 原启动位置独立初始化；LED 设置变化触发的旧更新检查仍保留。

core 的 LED 输出委托 `optionalLedOutput`，不再访问 LedEngine/WLEDController 或自行启动 LED rAF。
旧 MIDI LED 硬件写入／清屏函数迁回 `led.js`，临时全局 `wipeHardwareLEDs` 只转发 optional port。
共享 range 控件归属 `src/ui/player-range-controls.ts`；无 LED 时仍维护期望音符／延音过滤。
显式 no-op 配置及默认行为见 DEVELOPMENT。生产不加载新的测试脚本。

P4a：输入 decoder／echo filter、设备生命周期、输出分别在 `src/midi` 三个文件。
`src/ui/midi-controls.ts` 只拥有 DOM、持久化与 UI 监听；service 不读取 DOM/storage，
发送／解析不依赖 Tone/OSMD。`src/compatibility/midi.ts` 暂时组装，输入消息携带 kind/note/
velocity/source/channel/receivedAtMs，经 dispatchTrainerNoteInput 转交既有 triggerVirtualKey。
UI 键盘仍走同一个 triggerVirtualKey；P6 再迁出其判定职责。

core 和 optional LED 不再读全局 midiAccess/activeMidiInput；前者只读输出端口，后者使用
getLegacyMidiOutput。旧 MIDI LED 测试控制器迁往 `js/optional/midi-led-test.js`，由 adapter
初始化，保持独立 legacy 实现。P4b 已把 normalizeLiveVelocity 移到 domain/velocity，
MIDI output 与音频共享唯一算法。P9 删除 classic composition 与转发。

P4b：Tone 资源仅由 `src/audio/tone-adapter.ts` 拥有，factory 定义本身不分配资源。
`src/compatibility/audio.ts` 在 core 前组装窄端口；core 在原节点创建位置调用 `audioOutput.init()`。
输入监听和播放路由由 `src/audio/audio-routing.ts` 决定，状态、声音、MIDI、timer 均注入，
不读取 DOM/OSMD/global Tone。UI codec probe 位于 `src/ui/audio-capabilities.ts`。
剩余五个全局转发只供未迁移的 core：profile、sampler loaded、live unlock/time 和 schedule destinations。
输入／暂停／音量的委托已直接使用 audioOutput/audioRouting。dead releaseLowLatencySynth 没有消费者，已删除。
core 的 metronome synth、Tone.Transport 与播放循环仍留待 P7，不能据此声称整个 Tone 调度已迁出。

sample release 与 routed MIDI note-off timer 分别由 audioOutput/audioRouting 持有；dispose 清除并
失效迟到回调。Pause 仍只 silence，不取消旧 one-shot release；P7 需单独记录这一原有语义。
Tone 的 latencyHint getter 无 setter；旧 sloppy JS 静默忽略赋值。迁移使用 Reflect.set 忽略 false，
保留该行为，避免 TS strict 引入警告；有抛错的 setter 仍落入原 warning 路径。

P5：旧 score-display.js 已删除；layout／native rAF／vertical scroll 在
`src/render/score-viewport.ts`，DOM、storage、cursor provider 和命令均通过窄端口注入。
`score-renderer.ts` 保留 render → geometry invalidate → display restore/anchor refresh →
feedback → Loop → debug 顺序。geometry-engine、feedback-overlay 和 loop-overlay 为唯一绘制实现；
旧 feedback-engine.js 只剩期望构建／匹配、反馈记录和尚未迁出的 Loop 边界推进。

`src/score/osmd-adapter.ts` 是唯一写 cursor.iterator／浅拷贝 snapshot 的源文件，保存 prototype
及 enumerable repeat fields、复制数组；数值 readPositions 只作观察，不能代替完整快照 token。
private hook 有明确所有者，重复 afterRender 不叠加；换 cursor 或 dispose 释放旧 hook，保留外部新 owner。
其 NoteRef registry 根据实际 Sheet identity 增加 revision；map 不按 midi/timestamp 合并，并拒绝旧谱 ref。
图形 exact-source 查找与 measure/system 坐标由 adapter 提供；vendor Shape 仅供渲染几何使用。

`src/compatibility/{geometry,score-rendering}.ts` 仍提供 GeometryEngine／ScoreDisplay 和 legacy callback
给 core、feedback/debug、optional LED 及旧测试。首次组成 factory 无 render/rAF 副作用，ScoreDisplay.init
仍在 core 原位置执行；renderer、geometry 的实际工作在命令调用时发生。P6/P9 再移除这些隐式消费者。
Geometry 的两个局部断言分别用于完整 iterator prototype/fields clone 与有界 vendor shape reflection；
没有 any/index-any，未改候选评分、dot/annotation rejection、same-stem cluster 优先级或 beam 算法。

P6：`src/practice/{input-controller,input-matching,early-grace,expected-notes,scoring,feedback-state,sustain-state}.ts`
为唯一输入判定实现。均由窄状态/领域数据/命令端口构造，无 DOM、OSMD、Tone、localStorage 或 LED 硬件访问，
也无创建时 timer/listener 副作用。`src/compatibility/practice.ts` 在 audio composition 后、core 前组装；
其回调惰性读取 core 的 hand assignment、score UI、keyboard、calibration 和 Wait/Follow advance。
MIDI 的 dispatch 与虚拟 key wrapper 同进 practiceInput.handle，保留 channel/source/receivedAtMs；
这些输入元数据不成为另一套计时基准。测试只在 iframe 包装该端口，生产不加载 test API。

旧反馈脚本只剩 renderLooper/enforceLooperBounds，后者依赖 cursor 和 checkbox，随 P7 迁出。
core 的 clearFeedbackVisualStatePreserveScoring 仅转发 feedback-state，clearVisuals 的总取消规则继续保留。
OSMD adapter 惰性提供 PracticeSourceEntry/Note，并按原读取顺序保持 Array.forEach 的初始长度与跳过 holes；
source objects 不越过 practice 边界。getCombinedTieLength 在 adapter 单一实现，显式链接/Notes/cycle 语义不变。
仍保留经典脚本全局转发，P9 才转为真实 import/export 和显式 bootstrap。

P7a 第一子步骤：core 不再创建 MembraneSynth 或持有 metronome/cache/pulse counters；
`src/audio/{metronome,metronome-output,playback-clock}.ts` 分别持有节拍决策、节点与时钟资源，
`src/score/measure-timing.ts` 持有按实际 iterator 构建的小节缓存，`src/ui/tempo-pulse.ts` 操作 DOM。
`src/compatibility/metronome.ts` 在 audio 后/practice 前无资源组装，core 原节点位置调用 init。
所有 timing decisions 只读注入状态和端口；MIDI raw percussion bytes/release 捕获由 midi-output 提供，
Tone/DOM/OSMD/vendor 对象不进入节拍器。最小 source-measure ports 仍位于 score 层而非 domain。
兼容旧函数名的 const forwards 只有一份实现；UI 改读 getWaitMeasureIndex 与 volume setter。
Play/Pause/Reset、Tone.Transport 与 playbackLoop/checkWaitModeAdvance 随后由下面的 coordinator
检查点接管，P7b 再提取模式策略。普通 Pause 与显式 dispose 的区别在 scheduling contract 中固定。

P7a 协调器检查点：`src/practice/playback-coordinator.ts` 是 Play/Pause/Reset、Loop enforcement、
checkWaitModeAdvance/playbackLoop 的唯一实现；原 core 函数与 feedback-engine.js/HTML 槽位已删除。
core 保留原位置的 DOM binding，转发仅在 `src/compatibility/playback.ts`，P8/P9 再移除。
clearVisuals/clearTransient 在 playback-state，Transport 原 API 在 audio/tone-transport，Loop/metro
checkbox/min/max 读取在 ui/playback-controls；coordinator 不读 DOM、Tone、OSMD、storage。

OSMD adapter 捕获 entry array，惰性投影领域 PlaybackEvent；旧 keyboard 只在 composition 边界
取回这些 entries，不把 vendor 对象传入 practice。adapter 的 loaded cursor/source assertions 与既有
异常条件一致；fallback 是 raw first-note Length，不能用 combined tie 替代。
工厂均无创建时 timer/node/listener 副作用；计时/资源实际工作在命令调用时发生，
显式 dispose 统一清除 event clock 和 count-in/metronome，普通 Pause 保留旧 callback gates。

P7b：新增 `PianoTrainerModePolicy` classic namespace，加载在唯一 coordinator 前；纯策略
不调用全局服务或写 AppState。原 Follow comfort 常量归此模块，coordinator 只调用策略。
旧名和输入推进仍只有 compatibility/playback 一份转发，P9 再改为源码 import/export。

P8 loader 第一步：core 的 score IO/load/file-input block 迁出，旧实现已删除。
`musicxml-io` 保留 ZIP/原始 payload，`score-loader` 通过 adapter/typed commands 保持返回和
副作用顺序，`ui/score-file-*` 持有 native file 与 DOM listener。`compatibility/score-data`
提供 ScoresUI/ScoreLibrary/Transpose/MidiImport 仍需的旧名，显式 window forwards 仅 picker/load。
所有 factory 创建时不读文件/加载乐谱/创建 listener；原 init 槽位只初始化 input。
library/其余 UI 仍是后续 P8 迁移范围；不把该检查点视为全 P8 完成。

P8 converter/transpose：旧 midi-import.js、transpose-engine.js、transpose-ui.js 及槽位已删除。
`score/score-conversion.ts` 通过 webmscore-adapter/typed reader 实现原格式与 export 命令，
`score/transpose-engine.ts` 是 XML DOM 算法唯一实现，transpose-controller 拥有 original-source 命令，
`ui/transpose-controls.ts` 拥有 DOM 值读取和 listener。compatibility/score-conversion、transpose
暂提供原 Window.MidiImport/TransposeEngine/TransposeUI；core loader、scores-ui 和旧弹窗仍消费。
最小 vendor 声明的 export 为 unknown，只在 adapter 检查/解码。vendor/WASM 不变，
初始化次序与惰性资源请求保留；74 classic slots、620 global candidates、重复函数定义为零。
