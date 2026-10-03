# 共享状态的迁移契约与所有权

P2 保留一个 `const AppState` 词法对象。Map/Set 泛型、null 和动态字段按实际代码建模；
`types/legacy-state.d.ts` 不能当作所有旧 JS 已完成严格检查的证明。旧消费者逐阶段迁移。

直接写入清单见 [STATE_WRITES.md](STATE_WRITES.md)。生成脚本使用 TypeScript AST 收集赋值、
增减、Map/Set 与数组变更；经由别名的变更需人工审阅，主要如下。

| 组 | 当前写入者和别名 | 计划最终所有者 |
| --- | --- | --- |
| modeSettings、practice、playback | domain/hand-routing 规范化 Follow、返回当前 mode settings 并复制 active booleans；practice-controls 仅更新用户选择，preference-controls 恢复三个原默认 settings entries | settings commands / practice coordinator |
| expectedNotes / hit、score、提前预留 | src/practice 的 expected-notes、input-controller、early-grace、scoring；`expectedMatch.hit` 和 `expected.hit` 通过局部引用变更；playback-state/coordinator 负责原 reset | expected-notes / input-matching / scoring / coordinator |
| 当前谱与移调源 | core loader、ScoresUI、TransposeUI 的 `state = ensureTransposeState()`；同一个 transpose 对象 | score-loader / transpose commands |
| 真实遍历、当前期望、预览 timeline | playback coordinator 与 shared traversal；OSMD adapter 提供惰性 PlaybackEvent 与推进命令，core 仍有未迁 UI/loader 查询 | traversal / practice coordinator |
| feedback / debug 历史与几何锚点 | practice/feedback-state、FeedbackDebug，ScoreDisplay 通过 `expected` 引用重写 anchor | practice 记录、geometry / overlays 绘制 |
| played / held / pending / timers | practice 输入／延音、playback-state 的原总清理、coordinator 的 pendingAudio/flags，LED 键域刷新 | practice / coordinator / audio scheduler |
| 音频与 MIDI 路由、通道、回声 | preferences 初始化、core UI、midi listeners | audio / midi services；偏好命令更新 |
| LED / WLED 状态 | led.js、core 虚拟键盘、midi LED test | optional adapter |
| 共享键域 | src/domain/playable-range.ts 纯计算；src/state/player-range.ts 缓存，旧键盘／判定消费者转发 | domain / explicit controller |
| library 抽屉、选中项、管理模式 | ScoresUI 和 toolbar | UI controllers |

P3/P4a 后，共享 timeline 的 cache 写入通过 `score-traversal` 注入的 `state` 端口进行；
键域过滤由 `player-range-controls` 使用同一 AppState。MIDI echo 的 push／slice／filter
在 `midi-input.createEchoFilter`，设备对象与监听仅由 `midi-service` 持有；通道／低力度偏好
由 `midi-controls` 的窄 `state` 引用写入。`STATE_WRITES.md` 现在动态扫描所有 src TS 和
HTML 当前加载的 legacy JS，避免继续引用已经删除的脚本；别名写入仍由本表解释。

P4b：audioOutput 通过窄 state 只读 mode／lowLatencyPlaybackEnabled／audioEnabled；
audioRouting 只读输入力度、boost 与两类 routing。偏好写入仍由当前 core UI 持有。
sampler ready/promise、Tone nodes、初始 context profile 与 sample release timers 是 adapter 私有字段，
不追加到 AppState；routing 的 MIDI release timers 也由端口实例拥有。AudioRouting 的可选 left/right
仅描述旧 delayed sampler guard，不新增偏好或默认属性；hands-only 在未加载时不补播放的旧行为保留。

运行中追加的字段：`wledDdpLastSendOk`、`wledDdpLastSendAt`、`wledDdpLastError`、
`scoreLibrarySelectedFolderIds`、`scoreLibraryFolderManageMode`。初始对象仍没有这些 own properties。
左／右谱表分配可以是 null。future 显示事件没有 signature，timeline 事件有；它们是不同接口。
移调 UI 使用 `semitone`，targetKey 可为 null；没有按草案猜测字段值。

核心时间单位保留别名与字段名：谱面全音符、Tone 秒、performance 毫秒；数字别名本身不提供品牌隔离。
P5 已把 ExpectedNote.logicalNote 替换为 readonly `noteRef: {scoreRevision,id}`；
源对象映射只由 osmd-adapter 持有，按 Sheet 身份变更／dispose 失效。相同 pitch/time 的不同源对象
获得不同 ID；expected 同谱表同音的旧去重规则仍由 buildExpectedNotes 保留，不借 ID 改变匹配。
renderer 不推进 iterator；viewport 经 adapter 恢复最后绘制快照，再立即恢复真实预取 iterator。
anchor 刷新仍保留原 horizontal／changingLayout 条件，cache 在每次 render 后失效。
模式初值是三个有效值，但旧 core 直接接收 persisted string；类型保留此历史事实，后续 UI 边界需显式判别。

P5 的反馈／Loop 绘制只读记录与 looper 边界，不写计分、expected hit 或时间线；feedback
context key 通过旧 practice callback 注入。几何 node/measure cache 归 geometryEngine 实例；
reset feedback history 已由 P6 feedback-state 负责。布局切换临时保存 realtimeWrongPressInCurrentContext，
zoom/resize 仍执行原 clearFeedbackVisualStatePreserveScoring 的 flag 清理；这是原语义，未合并两条路径。

P6 的 `state` 局部别名写入不在 STATE_WRITES 的直接 AppState 扫描中；完整契约见
[P6_INPUT_CONTRACT.md](P6_INPUT_CONTRACT.md)。input-controller 拥有 pressed/held/preExpected
输入变更与 realtime wrong flag，early-grace 拥有预留，expected-notes 拥有数组构建与预留消费，
scoring 拥有 correct/wrong 增量，feedback-state 拥有 marker/history/visual cleanup。
输入保留 feedback → score → held → UI → hit → advance 的顺序，构建预留则先 hit/held，再 feedback/score。
同音跨谱表预留仍按每个期望计分，不能在迁移时以 MIDI 为单位合并。

sustain-state 拥有 pending/sustained 数组、原 35ms retrigger 与 expiry timer 登记；
pruneAtTimestamp / markHeldPreview 在原 keyboard 呈现位置调用。clearVisuals 的总清理与 activeTimeouts
取消仍由旧 core 调度入口执行，P7 才统一资源协调。Map/Set 仍保持原实例；数组沿原算法替换。
解析出的 staffId 确实可空，因此 Expected/Sustained/OutOfRange staffId 补为 number|null；
使用 Number(staffId)-1 保留旧算术，不新增手分配规则。PTTiming 接口接受 nullable timestamp，
提前输入按原值传递；null 与 undefined 的旧 JS 算术差异已有用例，算法没有修改。

P7a 的 metronome `state` alias 仅写 countInActive，以及停止后的 lastLedPreviewEvents /
ledPreviewTraversalIndex；isPlaying/mode/BPM/routing 开关只读。Play/Pause/Reset 和这些字段的
总协调由后续 P7a coordinator 检查点接管。measureTimingCache、Wait beat/counter/target/measure、
window timer IDs、pulse IDs/lastPulse 都由独立实例私有持有，不向 AppState 追加字段。
playback-clock 持有 metronome timer/rAF 资源及 dispose epoch；普通 Pause 不重置 epoch。
percussion release timer 与捕获的 MIDI output 由 midi-output 持有，只有显式 dispose 失效。
这与原 Pause 仍允许已排 attack/release 的规则区分，详见 P7_SCHEDULING_CONTRACT.md。

P7a 后续：coordinator 的窄 state alias 拥有 playing/busy、anchorTime、followAdvanceInfo、
currentExpectedContext、pendingAudio、score reset 与 baseBpm 的原自动 tempo 更新；
playback-state 拥有原 clearVisuals/clearTransient 的数组替换和 Map/Set.clear。
普通 Pause 的 transient cleanup 不取消 activeTimeouts、不清 sustain/held-correct，
Reset/loaded-score/Loop 的 visual cleanup 才执行原列表取消。pressed keys 仍由 input-controller 拥有。
event clock timer/rAF 为独立实例资源，不进入 AppState；只在显式 dispose 取消全部，
async start generation 也只在 dispose 更新。Tempo UI 和模式/手设置仍在 core，P8 再移到 UI commands。

P7b 的 mode-policy 不拥有可写 AppState、timer 或 vendor 引用。coordinator 在原 decision
边界调用策略，所有 busy/playing/anchor/followInfo/pendingAudio 写入仍归 coordinator；guard
按回调当下状态判断。displayed/prefetched 为只读数值观察，不能取代 adapter 的 iterator snapshot。

P8 loader 第一步：currentScore/currentScoreOriginal 元数据与 shared timeline dirty/reset
写入归 score-loader 的窄 state alias，时机仍在 render/cursor 初始化之后、library markOpened
之前。失败不回滚原已完成 writes。musicxml-io 无 AppState，FileReader private pending set
仅在显式 dispose abort；file-controls 只拥有一个 input change listener。

P8 converter/transpose：conversion 不写 AppState，私有 owned score set 保留 ordinary soft destroy 后的
vendor handle，显式 dispose 调用 destroy(false) 一次。late score 返回也释放，late export 不再 load。
vendor 在 load 失败、尚未返回 score handle 时创建的 worker 属于 vendor 内部；本次未改其私有实现。
transpose-controller 的窄 state alias 拥有 transpose availability/defaults/active/target，保留对象身份
及 await load 后的原读取时机；UI 写 mode/semitones/target/signature，DOM listener 在 controls。
显式 dispose 失效 pending apply/reset 的后续 UI commit，普通加载/Pause/Reset 不更新 generation。
完整应用的 loader notification dispose gate 仍由 P9 bootstrap 生命周期统一处理。

P8 library repository/backup 不写 AppState。dbPromise 仅缓存 v1 native open，仍保留旧 public
属性供过渡消费者；实际 connection、transactions、pending open 和 dispose generation 在实例私有。
CRUD/export/starter 的 await 后 generation 只因显式 dispose 改变，阻止旧命令续发查询/写入或重开库。
request promise 的 rejection observer 只在 disposal 添加，避免 abort 后 orphaned rejection；
普通 tx.complete/result/error 的时机保留。ScoreLibraryWindow facade 和 drawer 当前仍使用同一实例。
drawer/selection/currentScoreLibraryId/title 等 UI 写入仍在 scores-ui，下一 P8 检查点迁移。

P8c drawer 的这些写入已迁至 library-controls-state/actions/list/scores-drawer 的 narrow state alias，
不再直接读取整个 AppState。两个 manage/selection 数组保持原去重与独立清空；row rename
保留 loaded title 不更新的旧行为，bulk move 在原位置重新读取 loaded title。save current
在 picker await 后读 live current score。普通 refresh/关闭/换谱不更新 generation 或取消操作。
显式 UI dispose 才失效 pending dialog/read/refresh/input continuation，移除自己的静态与行监听、
capture keydown、resize listeners，并取消自己的 rAF；旧 callbacks 在重新 init 后仍无效。
每次重建列表先释放旧 row listeners，已开始的普通异步命令继续沿原 await 顺序完成。
库存 186 direct AppState writes 不含这些 state alias 写入；repository/current loaded data 的所有权
仍由相应服务保持，销毁抽屉不会删除用户数据或停止其他模块的播放。

P8d display-controls 写 pseudoFullscreenActive/zoom 和 native labels；tempo-controls 写 speedPercent、
三个 metronome preferences；audio-level-controls 写 midiOutVolume/midiInBoost，其他 levels 经 audio/MIDI
数字命令；loop-controls 写 looper.min/max、loopCountInEnabled。UI 只持有 Pick state，保留对象身份。
loader 调用 resetRangeForScore 按原 DOM/state 顺序设置实际小节范围；toolbar 写 scoreLibraryView 并 await
refresh 后 toggle。168 direct AppState writes 不包含这些别名写入。
toolbar 私有 panel/button/intro state 与 frames/transition handlers/220ms timers；display owns 两个 onclick
slots、fullscreen/zoom listeners 与 300ms resize debounce；loop owns 320ms delay/170ms interval、pointer
capture 和 listeners。普通操作保留旧 callback 规则，explicit dispose 才清资源/失效 await、旧 onclick/
hold/animation callbacks；reinit 不重复绑定。dispose 不修改外部替换的 onclick，也不删除用户偏好/库。

设置 key 单一来源是 `src/state/preference-keys.ts` 的 `PREFERENCE_STORAGE_KEYS`，旧常量为别名。
Reset / backup 白名单顺序及排除项不变，包含 `pt_scoreLayout`，不包含 update override / 其他应用的键。
首次默认值与 input velocity / live low latency 强制开启规则保留。
`getStoredNumber` 将缺失值转成 0 的旧行为保留；需要 fallback 的调用使用原 getClampedNumber。

设置备份先检查 unknown 的对象结构，再处理受支持的自有属性。受支持值按原 String 规则保存，
不是借迁移修改备份格式；没有支持的键时先拒绝，不清理现有设置。下载、alert、FileReader 和 reload
已移至 `src/ui/settings-controls.ts`；backup service 不读取 DOM 或触发 UI。

P8e 当前直接 AppState 写入为 97（原 168）。迁出的写入通过 narrow state alias：
hand-routing 保留 hands/modeSettings/practice/playback 的引用，Follow normalization 和独立模式默认值
沿旧规则；practice-controls 更新 mode/preferences/audio/MIDI routing，只通过命令清理/暂停播放。
preference-controls 同步应用存储值、强制 monitoring flags、恢复三个 modeSettings entries，并按原
位置调用显示/audio/debug/range/LED/MIDI 命令。不会整体替换 AppState、Map/Set 或 active hands 对象。
hand-assignment-controller 在 right assignment 有效时写 hands、dirty preview 和当前 preview events；
只有显式刷新且有 iterator 的空帧才清 expected/visual/out-of-range arrays，有效帧 build→render。
adapter 只捕获一次 entries/measure/timestamp；UI 不遍历 OSMD 对象。
practice、staff select、settings actions 各自拥有 22/2/4 个原生监听（staff 在 load 后），无新增 timer。
dispose 只移除自己的 listeners/markers，generation 使旧 handler 在 reinit 后仍失效；外部 marker 保留。
偏好 apply/reset 是同步命令，不拥有异步资源；settings FileReader 下载/导入仍是 P2 UI 边界，生命周期
统一归后续 P9，不因按钮 dispose 改变普通正在进行的设置导入行为。

P8f 当前直接 AppState 写入为 90（原 97）。keyboard-controller 仅协调原 sustain/preview、
last preview array 和同一 hardwareLEDState Map；预览只覆盖 display map，hardware cache 使用
原 base map。score-ui-controller 保留 base BPM/tempo、assignments/reset score/loop render 顺序，
score-status 每次读取当前 score 对象；没有冻结 loader 会替换的 score 引用。staff identity map
成为 OSMD adapter 私有资源，不进入 AppState 或 Window。
virtual-keyboard-controls 私有持有 active MIDI/token、所有 connected/detached keys/监听与 capture；
12 activation + 88×10 key listeners，score-seek-controls 自己持有一个 canvas click。普通 rebuild
保持 pending old-key attack 和 detached handlers；explicit dispose 才释放全部自己的资源、失效
pending audio unlock。不会释放 MIDI 等外部 pressed notes，不借普通 Pause/keyup 改变延迟回调。

P9a 当前直接 AppState 写入77（原90）。debug history/flags/sequence 写入在 feedback-debug 的 narrow
state port；vendor note snapshots 独立在 osmd-debug-observation，没有生产判定/anchor算法迁到debug。
debug 服务拥有一个checkbox listener/marker、一个4000ms heartbeat和自己创建的SVG groups，显式
dispose只移除own resources并失效captured callbacks；不会删除外部同名group/marker/其他interval。
settingsFiles私有持有pending FileReader以及未完成下载的links/URLs；ordinary read error/abort保持
原silent语义，导入完成仍原parse→import→alert→reload。显式dispose才abort own pending readers、
清callbacks、失效捕获的old onload；普通按钮dispose/操作不会取消读文件。已完成read不再owned。

P9b direct AppState writes53（原77）。player-range-controls用narrow state保持原数组prune/inverse
out-of-range过滤、heldCorrect Map身份、preview dirty/clear/index reset，refresh/invalidate/output→
keyboard顺序不变；select自己listener/marker/generation，explicit dispose不修改range或清外部notes。
connection-status只观察typed port state与LED mode/IP/status；不拥有timer/监听。
update-controller用narrow state、clock/storage/location/fetch ports持有pending AbortControllers，
只explicit dispose abort own pending requests、失效fetch/JSON await/catch/finally后的state/UI/navigation。
ordinary并发仍按完成次序commit，普通LED init重复检查不cancel旧请求。update UI单独拥有一个
button listener/marker；bootstrap须dispose UI及controller，不能把UI cleanup当作request取消。

P9c direct writes仍53，LED的AppState是factory注入的narrow state alias。calibration/WLED queue/
helper promise/test tokens/MIDI active notes在私有闭包，native owner持有31 listeners/21 markers，
MIDI test为1/1。explicit dispose才取消owned资源；old callbacks/await/Promise跨fresh activate仍
失效，waits解析为false。completed request/read与外部timer/marker保留，普通operation语义不变。
核心仍拥有同一hardwareLEDState Map；LED释放cache对应输出，MIDI test只停止自己active run。
硬件发送失败仍完成native cleanup。完整契约见P9_LED_CONTRACT.md。
