# 共享状态的迁移契约与所有权

P2 保留一个 `const AppState` 词法对象。Map/Set 泛型、null 和动态字段按实际代码建模；
`types/legacy-state.d.ts` 不能当作所有旧 JS 已完成严格检查的证明。旧消费者逐阶段迁移。

直接写入清单见 [STATE_WRITES.md](STATE_WRITES.md)。生成脚本使用 TypeScript AST 收集赋值、
增减、Map/Set 与数组变更；经由别名的变更需人工审阅，主要如下。

| 组 | 当前写入者和别名 | 计划最终所有者 |
| --- | --- | --- |
| modeSettings、practice、playback | core 的 `normalizeFollowModeSettings` / `getCurrentModeSettings` / `setFollowPracticeHand` 返回或持有 `follow`、`settings` 引用；复选框监听修改它们 | settings commands / practice coordinator |
| expectedNotes / hit、score、提前预留 | feedback 构造／漏音与 core 输入、提前输入；`expectedMatch.hit` 和 `expected.hit` 通过局部引用变更 | expected-notes / input-matching / scoring |
| 当前谱与移调源 | core loader、ScoresUI、TransposeUI 的 `state = ensureTransposeState()`；同一个 transpose 对象 | score-loader / transpose commands |
| 真实遍历、当前期望、预览 timeline | core playback 与 ensureLedPreviewTimelineBuilt；OSMD iterator 暂在 core | traversal / practice coordinator |
| feedback / debug 历史与几何锚点 | feedback、FeedbackDebug，ScoreDisplay 通过 `expected` 引用重写 anchor | geometry / overlays；业务与显示数据逐步分开 |
| played / held / pending / timers | core 输入与调度、feedback 构造／提前预留，LED 键域刷新 | practice / audio scheduler |
| 音频与 MIDI 路由、通道、回声 | preferences 初始化、core UI、midi listeners | audio / midi services；偏好命令更新 |
| LED / WLED 状态 | led.js、core 虚拟键盘、midi LED test | optional adapter |
| 共享键域 | src/domain/playable-range.ts 纯计算；src/state/player-range.ts 缓存，旧键盘／判定消费者转发 | domain / explicit controller |
| library 抽屉、选中项、管理模式 | ScoresUI 和 toolbar | UI controllers |

运行中追加的字段：`wledDdpLastSendOk`、`wledDdpLastSendAt`、`wledDdpLastError`、
`scoreLibrarySelectedFolderIds`、`scoreLibraryFolderManageMode`。初始对象仍没有这些 own properties。
左／右谱表分配可以是 null。future 显示事件没有 signature，timeline 事件有；它们是不同接口。
移调 UI 使用 `semitone`，targetKey 可为 null；没有按草案猜测字段值。

核心时间单位保留别名与字段名：谱面全音符、Tone 秒、performance 毫秒；数字别名本身不提供品牌隔离。
`logicalNote` 当前为 unknown 的不透明源引用；P5 转入 adapter 的 NoteRef 映射，业务不得依赖它的字段。
模式初值是三个有效值，但旧 core 直接接收 persisted string；类型保留此历史事实，后续 UI 边界需显式判别。

设置 key 单一来源是 `src/state/preference-keys.ts` 的 `PREFERENCE_STORAGE_KEYS`，旧常量为别名。
Reset / backup 白名单顺序及排除项不变，包含 `pt_scoreLayout`，不包含 update override / 其他应用的键。
首次默认值与 input velocity / live low latency 强制开启规则保留。
`getStoredNumber` 将缺失值转成 0 的旧行为保留；需要 fallback 的调用使用原 getClampedNumber。

设置备份先检查 unknown 的对象结构，再处理受支持的自有属性。受支持值按原 String 规则保存，
不是借迁移修改备份格式；没有支持的键时先拒绝，不清理现有设置。下载、alert、FileReader 和 reload
已移至 `src/ui/settings-controls.ts`；backup service 不读取 DOM 或触发 UI。
