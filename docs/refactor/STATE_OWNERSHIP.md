# 共享状态的迁移契约与所有权

P2 保留一个 `const AppState` 词法对象。Map/Set 泛型、null 和动态字段按实际代码建模；
`types/legacy-state.d.ts` 不能当作所有旧 JS 已完成严格检查的证明。旧消费者逐阶段迁移。

直接写入清单见 [STATE_WRITES.md](STATE_WRITES.md)。生成脚本使用 TypeScript AST 收集赋值、
增减、Map/Set 与数组变更；经由别名的变更需人工审阅，主要如下。

| 组 | 当前写入者和别名 | 计划最终所有者 |
| --- | --- | --- |
| modeSettings、practice、playback | core 的 `normalizeFollowModeSettings` / `getCurrentModeSettings` / `setFollowPracticeHand` 返回或持有 `follow`、`settings` 引用；复选框监听修改它们 | settings commands / practice coordinator |
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

设置 key 单一来源是 `src/state/preference-keys.ts` 的 `PREFERENCE_STORAGE_KEYS`，旧常量为别名。
Reset / backup 白名单顺序及排除项不变，包含 `pt_scoreLayout`，不包含 update override / 其他应用的键。
首次默认值与 input velocity / live low latency 强制开启规则保留。
`getStoredNumber` 将缺失值转成 0 的旧行为保留；需要 fallback 的调用使用原 getClampedNumber。

设置备份先检查 unknown 的对象结构，再处理受支持的自有属性。受支持值按原 String 规则保存，
不是借迁移修改备份格式；没有支持的键时先拒绝，不清理现有设置。下载、alert、FileReader 和 reload
已移至 `src/ui/settings-controls.ts`；backup service 不读取 DOM 或触发 UI。
