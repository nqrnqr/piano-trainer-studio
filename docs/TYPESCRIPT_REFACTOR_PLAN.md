# Piano Trainer Studio：渐进式 TypeScript 重构计划

日期：2026-10-02\

用途：交给后续执行者（GPT-6.1 Sol）按阶段实施。\

状态：P0–P9 已于 2026-10-04 分阶段执行完成。本文保留原计划与分析时结构；当前实现、验证证据和手工限制见 [最终验收](refactor/FINAL_ACCEPTANCE.md) 与 [进度记录](refactor/PROGRESS.md)。

## 1. 目标与实施原则

在现有可运行项目上逐步建立类型、模块边界和验证能力。最终核心前端采用 TypeScript，保留原生 DOM UI、OSMD、Tone.js、Web MIDI、现有乐谱库和静态部署方式。

执行原则：

1. 每阶段独立构建、运行、验证并交付。一个阶段失败时，回到上一个可运行状态，不能靠继续大改消除问题。
2. 分开进行“移动代码”“补充类型”“改变依赖接口”。同一变更不同时重写算法、调整产品行为和更换框架。
3. 先迁移依赖少的模块，播放调度和练习引擎放到后期。
4. 保留当前音符匹配、提前按键容错、节拍计算、反复遍历及光标行为。发现旧问题先记录，另做有独立用例的修复。
5. 保留已有工作区修改。分析时横向显示功能及测试文件尚有未提交改动；它们属于本次重构的基线，不能从旧 HEAD 覆盖回来。
6. LED 硬件、校准、WLED helper 暂不迁移为核心 TS 模块；仍被练习功能使用的共享逻辑必须先提取。
7. 不引入 React/Vue、状态管理框架、服务端业务层，也不升级 OSMD/Tone/webmscore。工具链只增加实际需要的开发依赖。
8. 用户未另行指定执行范围时，建议第一轮只完成 P0、P1，留下验证报告。后续逐阶段推进，不把本计划理解为一次性重写授权。

### 执行顺序概览

| 阶段 | 交付重点 | 风险 |
| --- | --- | --- |
| P0 | 基线、全局依赖清单、关键行为用例 | 低 |
| P1 | 最小编译链、timing 首次迁移 | 低 |
| P2 | 共享状态、设置和持久化类型 | 中 |
| P3 | 共享时间线／键域归位、LED 可选边界 | 中高 |
| P4 | MIDI 服务、音频适配及路由 | 中高 |
| P5 | OSMD 适配、渲染生命周期、光标与反馈几何 | 高 |
| P6 | 输入判定、提前按键、计分 | 高 |
| P7 | 现有调度迁移、模式分支拆分 | 最高 |
| P8 | 乐谱数据流程、乐谱库、UI 控制器 | 中 |
| P9 | 显式 bootstrap、源码模块化、兼容层收尾 | 高 |

风险表示回归影响与验证成本，不是工期估计。具体执行清单见第 7 节。

## 2. 当前项目的实际结构

以下行数来自本次检查，仅帮助识别体量，定位时优先搜索函数名。

| 文件 | 约行数 | 实际职责与迁移关注点 |
| --- | ---: | --- |
| `js/trainer-core.js` | 4,259 | 初始化、偏好应用、OSMD 加载、MXL 解包、Tone 音频、节拍器、播放调度、三种练习模式、提前按键、键盘渲染、部分 MIDI 输出、LED 预览、UI 事件 |
| `js/led.js` | 2,240 | LED/WLED；同时包含 MIDI 权限提示、连接状态、更新检查、可弹奏键域等非 LED 功能 |
| `js/scores-ui.js` | 1,179 | 乐谱抽屉、列表、文件操作、文件夹和管理交互 |
| `js/feedback-engine.js` | 1,168 | SVG 几何、音头锚点、覆盖层、期望音符构建、匹配、漏音计分、滚动入口和重绘入口 |
| `js/midi.js` | 491 | MIDI 设备管理、输入解码、通道筛选、输出、回声过滤、设备 UI、LED 测试控制 |
| `js/trainer-state.js` | 470 | 大型共享 `AppState`、持久化、设置备份恢复、默认值、MIDI 通道规范化；也含下载和提示等 UI 副作用 |
| `js/transpose/transpose-engine.js` | 375 | MusicXML 解析与移调；相对独立，但依赖浏览器 XML API |
| `js/score-library.js` | 374 | IndexedDB、乐谱与文件夹数据、备份序列化、初始乐谱导入 |
| `js/feedback-debug.js` | 358 | 调试标记和日志；不应拥有生产匹配规则 |
| `js/toolbar-ui.js` | 315 | 工具栏与弹窗外壳 |
| `js/transpose/transpose-ui.js` | 263 | 移调 UI、状态同步、触发重新加载乐谱 |
| `js/midi-import.js` | 220 | webmscore 转换和 WASM 资源加载；与实时 MIDI 输入无关 |
| `js/score-display.js` | 159 | 显示偏好、单行排版、平滑横向滚动、重绘时保留已显示光标 |
| `js/trainer-timing.js` | 68 | 遍历所需等待时长的纯计算，是首个 TS 迁移候选 |

### 2.1 启动与部署

- 前端根目录没有 `package.json`、TS 配置或前端构建链；`helper/package.json` 只服务 WLED helper。
- `index.html` 通过 `document.write` 按顺序加载经典脚本，并附带版本查询参数。
- 第三方库来自 `assets/js` 和 `assets/vendor`，音色来自本地 `assets/audio`。
- 全局 `const`/`let`、全局函数与 `window.*` 混合使用。顶层 `const AppState` 不等于 `window.AppState`，不能机械替换访问方式。
- `local-web-server.js` 是 CommonJS 静态服务器，默认 `127.0.0.1:8080`，有允许访问的根路径清单。
- Windows/Mac 启动脚本直接运行本地服务器，当前使用者不需要先执行前端构建。
- 必须保留相对资源路径、自定义域名／静态托管、已有启动器及离线资源使用方式。

### 2.2 主要耦合和隐含契约

**共享状态和 DOM 都在充当模块接口。** 大量函数直接读写 `AppState`，再读取复选框、下拉框决定业务行为。现在不能把其中一个来源直接删掉；先记录实际优先级，再把读取集中到边界。

**全局函数存在覆盖。** `midi.js` 与 `trainer-core.js` 都定义了 `getSelectedMidiOutOutput`、`sendMidiOutNoteOn`、`sendMidiOutNoteOff`。按当前加载顺序，core 的后加载定义生效。例如 Note On 的力度规范化并非两个版本完全一致。迁移必须保留当前有效行为，再收敛为唯一实现。

**真实播放位置与显示位置不同。** `playbackLoop()` 会预先调用 `Iterator.moveToNext()`，画面稍后才更新。横向模式保存最后绘制的迭代器快照；重绘时暂用该快照定位，随后恢复真正的播放迭代器。把两者合并会导致 Wait 等待期间光标提前。

**几何和判定混在反馈模块中。** `buildExpectedNotesFromEntries` 不只是构造数组，还处理提前按键预留、命中状态与计分副作用。不能未经验证就改写成无副作用的纯函数。

**名称带 LED 的逻辑不一定可删除。** `findSingleHandPracticeTimelineWindow()` 调用 `ensureLedPreviewTimelineBuilt()`；这个时间线用于单手提前按键和后续事件判断。虚拟键盘、键域过滤也依赖 `led.js` 中的函数。

**初始化靠脚本执行产生副作用。** 事件监听、默认值写入、键盘创建、音频加载、MIDI 请求和 LED 动画循环分散在文件顶层。最终需要显式初始化入口，但应最后统一切换启动方式。

### 2.3 当前验证能力及缺口

已有 `docs/testing/score-display.html`、`score-display.integration.js` 和合成 MusicXML，上一轮通过 30 项显示集成检查。覆盖实际 OSMD、三种模式的基本推进、布局切换、滚动、缩放、窄屏、长谱及反馈锚点更新。

该测试有明确边界：

- 在 iframe 内注入脚本，直接使用全局变量和函数；转成模块后不能继续依赖这种隐式可见性。
- 为避免后台浏览器暂停动画，替换了测试 iframe 的 rAF；不能用其证明真实帧率、音频延迟或浏览器动画调度正常。
- 输入通过 `triggerVirtualKey` 模拟，没有验证实际 Web MIDI 消息解析、权限、设备断连或硬件输出。
- 反向定位用例不等于实际 MusicXML 反复、第一／第二结尾、D.C./D.S. 的完整验证。
- 尚无统一的类型检查、纯逻辑测试或完整练习引擎回归入口。

## 3. 必须保持的行为

这些是阶段验收标准，不作为本次重构中的产品改进项。

### 乐谱与显示

- 默认传统多行；横向模式整曲单个系统，左右手谱表保持对应关系。
- 横向跟随目标约为视口 33%；开头允许由边界限制位置，曲尾保留滚动空间。
- 尊重 Auto Scroll、缩放、全屏和减少动态效果设置；暂停取消正在进行的跟随，Reset 跟随重置位置。
- 反复沿用已有遍历顺序，发生反向跳转时向左返回；不把乐谱展开成新的线性演奏副本。
- 重绘不重置计分、期望音符命中状态或实际播放迭代器；反馈锚点按新几何刷新。
- 保留梁组、同音和弦错位音头、附点、装饰音、隐藏／cue 音符等已稳定的锚点规则。
- 原始 `.mxl` 仍直接传给 OSMD；为移调提取 XML 的路径与原谱渲染路径保持区分。

### 练习与时间

- Wait 等待当前需练习的音符，保留现有伴奏触发和推进顺序。
- Follow 保留练习手／伴奏手关系、剩余拍时、最小等待和晚到后的处理。
- Realtime 保留原有时间基准、BPM／速度倍率、计分窗口和漏音处理。
- 保留单手提前按键、按住到下一事件、已命中音符抑制重复错判、连音延音、空事件和键域过滤。
- 反复／跳过结尾的等待时间继续按当前小节可播放的剩余长度计算，不能直接用负时间戳差。
- Tone 时钟秒、`performance.now()` 毫秒、谱面全音符单位和四分音符拍数必须区分。
- 保留 count-in、节拍器、Loop、暂停／继续／重置及切换曲目的现有语义。

### 输入、音频、数据

- MIDI Note On 速度 0 按 Note Off 处理；保留通道筛选和输出回声过滤。
- 虚拟键盘与 MIDI 输入继续进入同一判定入口；保留鼠标、触控释放和失焦清理。
- 保留输入力度、实时监听、音色加载、低延迟路径及本地音频／MIDI 输出路由。
- 设置 key、默认值、备份格式以及 IndexedDB 名称 `pianoTrainerLibrary`、版本 1 和 store 保持兼容。
- 保留移调、原谱恢复、乐谱库及现有导入格式；无需把它们改成新的产品交互。

## 4. 目标职责边界

下列是终态目录建议，逐阶段建立，不先创建一堆空模块。文件按职责拆分，不能只为达到某个行数而切割。

```text
src/
  app/
    bootstrap.ts                 # 组装依赖、初始化顺序、销毁
    trainer-controller.ts        # UI 命令与各服务协调
  domain/
    music.ts                     # 音高、谱表、位置、时间单位
    practice.ts                  # 期望音符、模式、计分、提前输入
    ports.ts                     # 模块接口
    timing.ts                    # 原 timing 算法
    playable-range.ts            # 可弹奏键域
  state/
    app-state.ts                 # 迁移期仍保留原共享对象身份
    preferences.ts               # 设置读写、解析、默认值
    settings-backup.ts           # 备份格式；文件下载由 UI 执行
  score/
    score-loader.ts              # 加载流程、来源和元数据
    musicxml-source.ts           # XML/MXL 原始数据与解包
    conversion-service.ts        # 原 midi-import，封装 webmscore
    transpose.ts                 # XML 移调
    score-library.ts             # IndexedDB 与序列化
    osmd-adapter.ts              # 第三方对象和私有字段边界
    score-traversal.ts           # 迭代器、预览时间线、恢复
  render/
    score-renderer.ts            # render / invalidate / overlay 生命周期
    score-viewport.ts            # 布局、横向跟随、纵向跟随
    geometry-engine.ts           # 音头定位与坐标换算
    feedback-overlay.ts          # 反馈 SVG
    loop-overlay.ts              # 循环区域 SVG
    virtual-keyboard.ts          # 键盘 DOM 呈现；不负责判定
  practice/
    practice-engine.ts           # 共用状态推进；唯一协调流程
    expected-notes.ts            # 保留原有期望音符构建语义
    input-matching.ts            # 匹配与错音抑制
    early-grace.ts               # 提前输入预留
    scoring.ts                   # 命中、漏音及计分
    policies/                    # 原分支提取，避免三个独立播放循环
      wait.ts
      follow.ts
      realtime.ts
  audio/
    tone-adapter.ts              # Tone、音色与 context 配置
    audio-routing.ts            # 本地与 MIDI 输出路由
    playback-scheduler.ts        # 现有定时协调规则
    metronome.ts                 # count-in、节拍器、视觉脉冲通知
  midi/
    midi-service.ts              # 权限、设备、连接生命周期
    midi-input.ts                # 消息解析、通道和回声筛选
    midi-output.ts               # 唯一的 MIDI 输出实现
  ui/
    toolbar.ts
    practice-controls.ts
    display-controls.ts
    midi-controls.ts
    score-library-controls.ts
    transpose-controls.ts
    settings-controls.ts
    connection-status.ts
    update-controls.ts
  optional/led/
    legacy-led-adapter.ts        # 核心与旧 LED 的窄接口
  debug/
    feedback-debug.ts
    test-facade.ts               # 仅测试入口使用
  compatibility/
    legacy-globals.d.ts          # 迁移期；随调用点迁移逐步删除
types/
  vendor/                       # 与本地库匹配的最小声明
tests/
  unit/
  fixtures/
  integration/
js/generated/                   # 编译产物，兼容现有静态服务器路径
```

### 4.1 依赖方向

- `domain` 不读取 DOM、localStorage、Tone 或 OSMD。
- `practice` 只依赖领域数据、必要的只读状态和端口，不遍历 SVG，不操作 MIDI 设备。
- `score` 负责解析与遍历；OSMD 图形对象通过适配器交给渲染层。
- `render` 根据当前**显示位置**及反馈数据绘制，不决定是否判对，也不推进谱面事件。
- `midi` 把原始消息变成统一输入；`audio` 接收播放指令，不判断音符对错。
- `ui` 发出命令、读取展示数据，不成为另一份练习状态存储。
- `app` 组装上述模块。初期可使用构造参数／工厂参数和回调，不引入全局事件总线或 DI 框架。
- `optional/led` 消费核心提供的预览／显示数据。核心练习模块不导入 LED 硬件实现。

### 4.2 状态管理迁移方式

先补类型和记录所有写入位置，再逐步建立所有权。不要第一阶段把 `AppState` 改成不可变 store。

| 状态组 | 最终主要写入者 |
| --- | --- |
| 当前谱、原始文件、移调来源、加载状态 | score-loader / trainer-controller |
| 播放状态、实际遍历位置、期望上下文、模式状态 | practice-engine / scheduler |
| 命中、错音、漏音、提前预留 | input-matching / scoring |
| 显示布局、缩放、视口、已绘制光标 | renderer / viewport |
| 音频路由、音量、播放资源 | audio 服务；用户偏好由 settings 命令更新 |
| 设备连接、通道、回声记录 | midi 服务 |
| 工具栏、文件夹选择、弹窗 | UI 控制器 |

过渡期保持 `AppState` 和内部 Map/Set 的对象身份，避免旧模块持有失效引用。UI 本地草稿与已提交业务状态需要区分。新状态分组先用访问器／窄接口接入，最后再改变数据布局。

## 5. 核心类型和接口设计

先按运行时事实建模；下面是目标接口草案，不能直接替换现有对象结构。P1/P2 的 legacy 类型应保持现有字段名及可空情况。

```ts
type PracticeMode = 'wait' | 'follow' | 'realtime';
type ScoreLayout = 'traditional' | 'horizontal';
type HandRole = 'left' | 'right';
type InputSource = 'midi' | 'ui';
type MidiChannel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

// 初期使用有明确单位的字段名；这些别名本身不提供单位隔离。
type MidiNote = number;           // 在输入边界验证整数 0..127
type MidiVelocity = number;       // 0..127，Note On 0 在解码时转为释放
type WholeNoteTime = number;
type AudioTimeSeconds = number;   // Tone 时钟，不能与 performance.now() 相减
type MonotonicMilliseconds = number;

interface TrainerNoteInput {
  kind: 'note-on' | 'note-off';
  note: MidiNote;
  velocity: MidiVelocity;
  source: InputSource;
  channel: MidiChannel | null;    // UI 输入无 MIDI 通道
  receivedAtMs: MonotonicMilliseconds;
}

interface ScoreLocation {
  measureIndex: number;           // 从 0 开始；UI 小节号从 1 开始
  timestampWhole: WholeNoteTime;
  staffId: number;                // 保留现有全局谱表映射，不能一律当作数组下标
}

interface TraversalPosition {
  measureIndex: number;
  timestampWhole: WholeNoteTime;
  occurrenceIndex: number | null; // 在能够确定遍历次序时填写
}

interface NoteRef {
  scoreRevision: number;
  id: string;
}

interface SvgPoint { x: number; y: number; }
interface ClientPoint { clientX: number; clientY: number; }

interface ExpectedNote {
  note: MidiNote;
  staffId: number;
  location: ScoreLocation;
  source: NoteRef;
  hit: boolean;
  anchor: SvgPoint | null;
}

interface PendingPlaybackNote {
  note: MidiNote;
  velocity: MidiVelocity;
  durationMs: number;
  toLocalAudio: boolean;
  toMidiOut: boolean;
}

interface PracticeScore { correct: number; wrong: number; }
type Unsubscribe = () => void;
```

类型落地要求：

- `measureIndex + timestamp` 不能作为唯一播放事件 ID：反复演奏可能访问同一谱面位置多次。需要时另加遍历序号，不顺便改现有匹配算法。
- 同一时刻、同一 MIDI 音高可能有不同声部／谱表的音符。`NoteRef` 不能仅由音高或时间戳生成。
- P2 初期保留当前 `ExpectedNote` 的 `midi`、`mIdx`、`logicalNote` 等字段；到渲染适配器阶段才把 OSMD 引用封装成不透明引用。
- `NoteRef` 的对象映射由 OSMD adapter 持有，换谱时失效；不能通过 JSON 序列化 OSMD 对象，也不能拿旧谱引用查询新谱几何。
- `EarlyGraceReservation`、`FollowAdvanceInfo`、`ExpectedContext`、延音状态、反馈历史分别按实际字段建 interface。`Map` 的 key、value 及 `Set<number>` 必须显式声明。
- `ScoreRawData` 要覆盖现有实际输入类型：字符串、ArrayBuffer，以及必要的 File/Blob/ArrayBufferView；在 loader 边界规范化。
- MIDI 通道选择中的 `0 = Any` 仅属于输入筛选配置，不可作为真正的输出通道。
- `unknown` 用于外部 JSON、导入数据及第三方错误，经过检查后才进入应用状态。TS 类型不会自动验证备份文件内容。

### 5.1 模块端口

| 端口 | 提供的能力 | 明确不负责 |
| --- | --- | --- |
| `ScoreSource` | 加载原始数据、返回谱信息及源引用 | UI 弹窗、演奏推进 |
| `ScoreTraversal` | 当前事件、前进、预览、捕获／恢复不透明位置 | 滚动、音频播放、计分 |
| `ScoreRenderer` | 加载绘制、重排、获取显示光标、刷新几何 | 改变实际演奏进度 |
| `ScoreViewport` | 显示模式、跟随当前位置、取消动画 | 下一音符推断 |
| `PracticeEngine` | start/pause/reset、接收统一输入、提供练习快照 | MIDI 消息字节、Tone 私有接口、DOM |
| `AudioOutput` | 解锁／准备、播放、释放、停止全部声音 | 计分和模式规则 |
| `MidiService` | 设备信息、订阅输入、发送输出、释放监听 | SVG 和曲谱遍历 |
| `PreferencesStore` | 读取、规范化、保存、备份 | 下载链接和确认弹窗 |
| `OptionalLedOutput` | 接收既有预览数据、清屏、dispose | 构造练习时间线或驱动播放 |

接口先从真实调用点提取最小参数和返回值，不预先实现完整抽象框架。捕获／恢复位置必须保留反复遍历状态；不能用 `(measureIndex, timestamp)` 重建位置就宣称等价于完整 token。

### 5.2 第三方类型边界

- 检查本地 OSMD/Tone/webmscore 的实际版本、API 和构建信息，记录校验值。不要安装另一版本的运行时库以获得类型。
- 优先使用能与本地版本匹配的声明；否则在 `types/vendor` 中声明真实使用到的最小接口。
- OSMD 私有 `cursor.iterator` 及绘制快照技巧只允许出现在 adapter 内。该适配器需保留专项集成测试。
- 不给业务层声明 `osmd: any`、`Tone: any`，不添加 `[key: string]: any` 让所有访问通过。
- Web MIDI 声明先检查所选 TS 的 DOM 库；缺失时添加匹配的类型依赖，避免重复声明。
- 核心 TS 启用严格检查；少数确实不可描述的 vendor 操作集中在适配器并记录原因、访问字段和测试。

## 6. 编译与运行策略

### 6.1 P1：保留经典脚本，先引入 tsc

新增根 `package.json`、lockfile、`tsconfig.legacy.json`，不要修改 helper 的包用途。不要在根包设置 `"type": "module"`，否则可能破坏现有 CommonJS 本地服务器。

首个迁移：`src/domain/timing.ts` → `js/generated/domain/timing.js`。HTML 在原 timing 脚本槽位加载产物，继续提供 `window.PTTiming`。同一实现只加载一次。

建议配置起点（实际 Node/TS 版本在 P1 确认并锁定）：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "none",
    "moduleDetection": "legacy",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "noEmitOnError": true,
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true,
    "inlineSources": true,
    "rootDir": "src",
    "outDir": "js/generated"
  },
  "include": ["src/**/*.ts", "types/**/*.d.ts"],
  "exclude": ["node_modules", "assets", "helper", "js/generated"]
}
```

注意事项：

- 迁移期 `.ts` 仍采用经典脚本／IIFE，不能混入 `import` / `export` 后继续用 `module:none`。
- 全局类型放入独立命名空间或 `.d.ts` 中；分别描述全局词法绑定与 Window 成员。迁移实现后移除对应的 ambient 声明，避免重复定义。
- 初期不把整个旧 `js` 目录纳入严格检查。JS 和生成脚本运行时共存；可按文件补 JSDoc 做分析，但不能将“允许 JS”当成完成 TS 迁移。
- `strict` 对已经迁移的核心代码生效；`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes` 可在分模块准备好后开启，最后纳入终态检查。
- 输出放在已有允许访问的 `js` 路径下。源码映射使用内嵌源码，验证 F12 能定位到 TS；不必为调试开放整个仓库。
- 暂时将生成产物随阶段一起交付，保证原启动器和静态下载包可直接运行；产物只由脚本生成。开发者编辑 `src`，不手改 `js/generated`。
- 构建检查应能从干净临时输出重建并比较产物，检查内容差异及未跟踪新文件，避免源码更新但提交旧产物。
- 保留现有 `?v=...` 资源版本机制。清理过期生成文件只限已确认的生成目录。

计划提供命令：

| 命令 | 约定职责 |
| --- | --- |
| `npm run typecheck` | 仅检查当前 TS 迁移范围，不输出 |
| `npm run build` | 类型检查成功后生成浏览器 JS 与 source map |
| `npm run build:watch` | 监听并编译 TS；编译失败时明确显示错误 |
| `npm run serve` | 调用现有 `node local-web-server.js` |
| `npm run test:unit` | 运行已建立的纯逻辑用例 |
| `npm run test:integration` | 建立自动化 runner 后才加入；此前明确给出浏览器测试入口 |

前端开发可使用两个终端：一个 `build:watch`，一个 `serve`，修改后刷新。不要为保留旧启动器增加运行时联网安装依赖的步骤。

### 6.2 P9：统一源码模块，再构建一个浏览器入口

当核心的全局依赖已经集中到 compatibility 层后，切换为源码 `import/export`。建议采用 `tsc --noEmit` 检查 + esbuild 打包为单个浏览器 IIFE `js/generated/app.js`，继续在 vendor 之后加载。

这样保留静态服务器、HTML 和现有缓存版本路径，不要求引入开发服务器框架。此时才增加 esbuild，使用单独的模块 TS 配置；移除旧 `module:none` 编译入口。

必须解决：

- TS 构建不会检查由 esbuild 擦除的类型，`typecheck` 必须先成功；单纯 bundle 成功不是验收。
- 不再把 `import './legacy.js'` 当作保持全局作用域和执行顺序的办法。需显式导出、依赖注入和 `bootstrap`。
- 对需要保留的旧 LED，采用参数化初始化适配器。不能把依赖顶层全局状态的 LED 脚本原封不动放到 bundle 前后碰运气。
- vendor 与 WASM/音色仍作为原路径静态资源；业务 bundle 不重新打包整套第三方库。
- 生产入口不加载测试 facade；测试构建另有入口暴露有限能力。
- 一个 bundle 只执行一次初始化，不能与迁移期脚本列表重复加载。

## 7. 分阶段执行清单

每个阶段都包含：范围、可运行检查点、专项验证、回退方式。跨阶段之前先完成本阶段记录，不把未通过的行为变化留给下一阶段。

### P0：固定基线，补关键行为测试

**范围**

1. 阅读现有架构、实践模式说明、开发备注和当前 diff，确认新横向模式被包含。
2. 记录本地库版本／哈希、现有启动步骤、浏览器版本、测试数据和目前已知问题。
3. 建立 `docs/refactor/BASELINE.md`、`PROGRESS.md` 与 `GLOBAL_DEPENDENCIES.md`。
4. 列出全局符号定义者、消费者、是否有副作用、执行顺序；标记同名 MIDI 覆盖行为。
5. 重跑现有显示测试。补 timing、原始 MIDI 消息、Wait/Follow/Realtime 行为特征用例。
6. 补一份真实反复记号的小谱和第一／第二结尾小谱。基线本身失败的行为单独记录，不伪造通过。

**验收**：原 JS 不变时用例可运行；已知缺口和测试限制可复现。生成一份手工验证清单，避免每阶段从头猜测验收内容。

P0 的纯计算测试可以先用 Node 测试环境加载现有 `PTTiming` 脚本；浏览器相关测试沿用测试页方式。此时不依赖尚未建立的 TS 编译链，也不为了可测试性先重写运行时实现。

**回退**：仅新增文档与测试，不影响应用入口。若保存 Git 检查点，遵循当次用户授权和仓库规则，不自动提交他人的未提交改动。

### P1：最小工具链与 timing 首迁移

**范围**

1. 建立第 6 节的根编译配置、锁文件、脚本和 source map。
2. 为 `MeasureTimingInfo`、遍历等待参数、`PTTiming` 定义类型。
3. 将 68 行 timing 实现逐句迁移，保持默认参数、fallback、比较条件和返回单位。
4. HTML 只替换 timing 的加载路径；旧实现不再被加载，迁移映射中注明新的唯一源文件。

**验收**：typecheck/build、正常时间推进、向后反复、跳过结尾、缺少／异常长度的测试通过；原启动器和显示测试正常；F12 能断到 TS 源码。

**回退**：仅恢复 timing 的 HTML 槽位及对应源／产物，其他模块没有依赖新的运行时抽象。

### P2：状态和设置类型化

**范围**

1. 建立 `LegacyAppState` 及其嵌套结构，记录动态增添字段；Map/Set 和 optional/null 语义明确。
2. 把 `trainer-state.js` 迁入 TS，首先保持字段位置、初始化时机、对象身份与 localStorage key。
3. 再拆出偏好读取、规范化和备份格式；下载、弹窗和 reload 留在 settings UI 边界。
4. 建立唯一设置 key 表，纳入 `pt_scoreLayout`。保留首次运行的默认值与特殊强制设置。

**验收**：新用户默认值、已有配置、备份导入导出、恢复默认、模式独立手配置均与基线一致；重新加载仍恢复显示模式。

**回退**：恢复旧 state 脚本槽位，不迁移用户数据或更改数据库版本。

### P3：提取共享键域／时间线，建立 LED 边界

**范围**

1. 从 `led.js` 提取可弹奏键域、MIDI 权限说明和连接状态；更新检查迁往对应 UI/服务。
2. 从 core 提取 `ensureLedPreviewTimelineBuilt`、事件签名、遍历索引、预览查询和位置恢复为 `score-traversal` 的共享实现。
3. 先移动再逐步更名为 `previewTimeline` 等中性名称；保留临时旧名转发，记录消费者迁移情况。
4. 验证提前按键、虚拟键盘仍使用同一个共享事件来源。
5. 引入可选 LED adapter 与 no-op adapter。旧 LED 保留为独立可选实现，不强制 TS 化，不修改 helper。

**特别约束**

- 不把整份 LED 文件直接删除；`isMidiInPlayerRange` 等仍影响核心判定。
- 核心不再无条件启动 LED 专属 rAF／硬件发现。用单独配置选择 no-op；实际默认启用行为与 UI 调整需记录，不能悄悄丢弃已有 LED 设置。
- 关闭 LED 后，音乐时间线仍要构建，键域仍要生效，MIDI 输入错误提示仍能显示。
- 位置恢复和遍历上限先按原实现保留；反复访问同一位置的已知局限另行登记。

**验收**：LED 开关／no-op 两种情况下，三种练习模式与提前按键用例一致；no-op 不连接 WLED、不启动 LED 专用循环；已保留的旧 LED 路径至少通过启动烟测。

**回退**：恢复旧转发和调用点，不删除设置、不调整练习时间算法。

### P4：MIDI 输入输出与音频边界

拆成两个可独立交付的小阶段，避免设备层和音频层同时变动。

**P4a — MIDI**

- 从 `midi.js` 分离消息解析、设备生命周期、输出和设备选择 UI。
- `onmidimessage` 输出 `TrainerNoteInput`，暂由桥接调用原 `triggerVirtualKey`。
- 收敛重复函数，先验证当前 core 的有效实现，再迁到 `midi-output.ts`，不要任选其中一份。
- 通道变更、热插拔、重新绑定和回声过滤的时机保持一致；监听可释放且不会重复注册。

**P4b — 音频**

- 从 core 提取 sampler、低延迟 synth、解锁和释放、力度／音量、路由函数。
- 新增 Tone adapter；保留 Follow 的 context profile、采样加载回退和当前播放时间参数。
- 此阶段不改 `playbackLoop`、节拍器调度方式或计时基准。
- MIDI 文件转换继续属于 score conversion，与 MIDI service 分开。

**验收**：原始 MIDI 消息测试包含按下、释放、零力度 Note On、通道 Any／指定通道、非音符消息及回声；设备监听不会重复。音频包括 UI/MIDI 监听、本地／MIDI 输出独立路由、暂停释放、未解锁与音色未加载情形。实体设备缺席时报告未验证项目。

**回退**：分别恢复输入桥接或音频桥接，不同时回退无关阶段。

### P5：OSMD 与渲染模块迁移

**范围**

1. 建立 OSMD 最小接口，集中第三方对象访问、cursor、iterator 和图形字段。
2. 迁移 `score-display.js`，注入容器、偏好和 cursor provider；保留跟随算法与布局选项。
3. 把 `renderScoreAndRefreshGeometry` 移到 renderer，显式保留 render → invalidate → 显示位置恢复／锚点刷新 → feedback／loop／debug 的顺序。
4. 从 feedback 文件提取 GeometryEngine、反馈覆盖层和 Loop 覆盖层；先原样搬运，不改音头选择规则。
5. 封装已绘制光标快照；分别定义真实遍历位置与显示位置。限制私有字段访问范围。
6. 逐步以 `NoteRef` 替代核心数据中的 OSMD `logicalNote`，适配器保持到源对象的映射。

**验收**：完整显示测试 + beam、同音和弦、附点、装饰音、隐藏音符专项；在 Wait 卡住时切换模式／缩放，当前音、命中状态、分数、实际迭代器均保持；切换曲目后旧锚点无效。补一次原生 rAF 下的前台滚动观察。

**回退**：以渲染入口和 adapter 为边界恢复上一实现，不改 practice 数据流程。

### P6：输入判定、反馈状态与计分

**范围**

- 先提取 `triggerVirtualKey` 中的输入状态和判定部分，音频监听、虚拟键盘显示与 LED 分别委托。
- 迁移 `findExpectedMatchForMidi`、`buildExpectedNotesFromEntries`、`processMissedNotes`、提前按键和延音状态。
- 为每个函数记录读取状态、写入状态及调用副作用，先保留顺序，再收窄传入依赖。
- `expected-notes` 继续识别 tie、cue、隐藏音符和键域；`scoring` 负责分数变化；feedback-overlay 只绘制结果。
- 保留当前同音匹配与重音抑制规则，不能以 Map 结构调整顺便改变去重语义。

**验收**：同音跨谱表、和弦只弹部分、重复按键、按住跨事件、提前按键后释放、非练习手音符、漏音、连音与范围外音符均有行为测试；模拟输入与虚拟键盘走同一条核心路径。

**回退**：恢复原判定入口的桥接，保留已经稳定的 MIDI 和音频模块。

### P7：播放调度、节拍器和模式分支

这是风险最高的一阶段，拆成 P7a / P7b。必须在 P5/P6 验证稳定后进行。

**P7a — 搬运现有调度**

- 提取 Play/Pause/Reset、count-in、metronome、`playbackLoop` 及 `checkWaitModeAdvance`，保持原时钟、setTimeout 顺序与窗口计算。
- 对 timer、rAF、Tone.Transport 事件建立清晰资源清单；先描述原取消规则，避免借生命周期整理改变播放表现。
- 封装当前时钟／调度接口以便测试，生产适配器仍调用原 API。

**P7b — 分离模式规则**

- 从共用推进流程提取 Wait／Follow／Realtime 的决策分支，保留一个 playback coordinator。
- 先保持 `isPlaying`、`isAudioBusy`、`countInActive` 等现有语义；需要合并状态机时必须单独验证状态迁移映射。
- 显式区分“正在显示的当前事件”与“已经预取的下一事件”。
- 保留实际 OSMD 反复顺序，不新增重复段落展开、独立光标计时器或新 tempo scheduler。

**验收**：三模式 × 两布局；正确／错误／漏音；首次 count-in、暂停／继续、快速 Play/Pause、Reset、切换曲目、速度变化、Loop 边界、反复和结尾跳转、空事件、歌曲结束。比较事件顺序和计算出的时长，真实浏览器另测音频与节拍器同步。

**回退**：恢复整个旧 coordinator，不保留半套旧 timer 与半套新调度同时工作。发现迟到回调等旧问题时单列修复，不在类型迁移中悄悄改变。

### P8：乐谱数据流程与 UI 收尾

**范围**

- 拆出 core 的 XML/MXL 读取、ZIP 处理、loader、移调来源维护；沿用既有转换流程。
- 迁移 IndexedDB repository、备份格式及初始乐谱导入，保持事务完成与返回时机。
- 将 `scores-ui.js` 按抽屉、文件夹／列表、导入／备份交互拆分；不重设计界面。
- 完成 toolbar、practice、display、tempo、loop、transpose、settings UI 控制器迁移。
- 将 DOM ID、事件绑定、输入校验集中在 UI 边界；核心通过类型化命令收取数值和选项。
- 原生事件目标需检查类型；必需 DOM 缺失可明确报错，可选 LED DOM 缺失须正常工作。

**验收**：XML、MXL、至少一个转换格式、移调／恢复、library 新建／移动／删除／备份／恢复、设置持久化；正常导入与错误导入；全屏和触控键盘。检验音色、WASM、初始库的相对资源请求均成功。

**回退**：按 loader、library、UI 控制器分别回退；不更改用户数据库 schema。

### P9：显式启动入口与移除临时兼容层

**范围**

1. 清点所有迁移模块与剩余全局符号，确保源文件有明确的唯一职责和所有权。
2. 给服务和 UI 统一显式 init/dispose，把原顶层调用放进 `bootstrap` 并保留等效初始化顺序。
3. 按第 6.2 节引入源码模块和单 bundle；vendor 与 optional LED 的启动契约必须先明确。
4. 将集成测试改为测试入口注入的 facade，例如 loadScore、dispatchInput、readPracticeSnapshot、readViewportSnapshot；禁止长期暴露整个内部状态和 OSMD。
5. 移除已无消费者的全局声明、旧转发、旧 HTML 脚本槽位及重复实现。
6. 完成剩余严格配置，记录仅在 vendor／LED compatibility 中存在的例外。
7. 更新启动说明、架构说明、测试命令和逐文件迁移映射。

**验收**：全量回归；干净安装／构建；直接运行已有启动器；静态资源部署；生产 bundle 不含测试 API；重复 init/dispose 不产生第二套输入监听或播放循环。

**回退**：恢复上阶段 HTML 脚本列表和编译配置。不要在同一个阶段升级 vendor 或改用户存储结构，使入口切换保持可逆。

## 8. 测试与验收矩阵

测试应验证行为与边界，不为每个 getter 写镜像测试，也不只断言“函数被调用”。

| 范围 | 必须验证的行为 | 时机 |
| --- | --- | --- |
| Timing | 正向间隔、反向反复、小节跳过、剩余长度、缺失 timing fallback | P0/P1/P7 |
| 设置 | 默认值、已有值、异常值、备份往返、布局恢复 | P2/P8 |
| 共享时间线 | LED 关闭后提前输入仍工作；遍历序列与基线一致 | P3/P6 |
| MIDI | 解码、零力度、通道、回声、设备切换与监听释放 | P4a |
| 音频 | 监听／伴奏路由、力度、加载／解锁、释放、低延迟选择 | P4b/P7 |
| 渲染 | 两种布局、反馈音头、重排、私有 cursor 适配、长谱 | P5 |
| 判定 | 和弦、同音、提前／延后、持有／释放、休止和隐形音符 | P6 |
| 调度 | 三模式、BPM、Loop、count-in、暂停／重置、反复／结尾 | P7 |
| 数据 | XML/MXL、移调、转换、IndexedDB、备份、无效文件 | P8 |
| 启动 | 本地启动器、相对路径、离线资源、初始化一次 | P1/P9 |

补充验证策略：

1. 纯函数优先使用轻量测试运行器或 Node 自带 test；P1 根据已锁定 Node 版本选择稳定的编译后运行方式，不依赖未确认的原生 TS 执行特性。
2. XML DOM、SVG 和 OSMD 集成使用真实浏览器。仅靠 DOM mock 无法证明几何正确。
3. 调度测试注入假时钟，验证事件序列和期望间隔；不能把后台标签页真实定时的偶然抖动当作算法回归。
4. 原生 rAF、真实音频、Web MIDI 权限和硬件至少保留手工清单。测试设备缺席时注明未验证，不能用模拟测试替代结论。
5. 原有测试可先继续运行，但要记录 iframe 内 rAF 替换的影响，结束后恢复／销毁测试实例。
6. 每阶段只重跑受影响范围及固定烟测；播放、渲染、启动阶段做完整矩阵。
7. 静态检查、构建成功与功能通过分别报告；不能用 `node --check` 代替浏览器运行。

### 推荐基线谱例

- 简单双谱表：四分音符、左右手交替、同时和弦、休止。
- 连音与同音：跨小节 tie、同音和弦错位、附点、装饰音、隐藏／cue 音符。
- 反复：简单反复、第一／第二结尾、手工 Loop；D.C./D.S. 按基线能力记录，不在迁移时承诺新增支持。
- 时间：弱起小节、拍号变化、BPM 变化、较长休止。
- 显示：48 小节＋XML 换行、240 小节长谱、390px 窄屏。
- 数据：XML、原始 MXL、带移调的谱、一个 webmscore 转换输入。

测试文件用合成或已授权数据。基线事件快照可记录：遍历序号、小节索引、谱面时间、显示位置、期望音符、分数、计划等待长度。避免序列化整棵 OSMD 对象。

## 9. 每阶段交付格式

在 `docs/refactor/PROGRESS.md` 记录：

```text
阶段：P?
状态：未开始 / 进行中 / 完成 / 存在明确阻塞
本阶段范围：
迁移映射：旧文件/函数 → 新文件/函数
新增类型和接口：
保留的 compatibility 及其消费者：
行为是否改变：原则上无；任何差异逐项说明
运行命令：
已执行测试与结果：
未验证项目及原因：
如何回退：
下一阶段最小入口：
```

阶段完成门槛：

- 当前 TS 范围严格检查通过，编译产物与源码一致。
- 页面能从原入口加载，控制台没有新增异常。
- 相关行为测试和烟测通过，已有失败未被隐藏或降低断言。
- 一项功能只有一份生效实现；没有同时加载旧 JS 和迁移后的 JS。
- 没有新增未解释的核心 `any`、`@ts-nocheck` 或大范围类型断言。
- 回退不需要清除用户数据或覆盖其他阶段／用户修改。

## 10. 最终完成标准

- 乐谱渲染、MIDI、音频、练习、状态和 UI 的核心实现有 TS 源码与明确接口。
- `trainer-core` 的大部分职责已迁出；剩余入口只负责组装和命令协调。不要用硬性行数迫使合理逻辑被拆散。
- 练习业务不依赖 DOM/OSMD/Tone 具体对象；适配层有必要的例外且可测试。
- 全局接口只保留明确的 vendor、可选 legacy LED 和版本启动信息，不再靠同名函数覆盖工作。
- 三练习模式与两显示模式完整验证，重复段落仍按基线遍历和回跳。
- 关闭 LED 时核心完全可运行；共享键域／时间线不被当成 LED 删除。
- 本地启动、静态发布、资源加载、设置与数据库兼容。
- 构建、测试、调试、阶段记录及剩余限制都有文档。

## 11. 给后续执行者的首轮任务

可直接使用下面的任务描述：

> 阅读 `docs/TYPESCRIPT_REFACTOR_PLAN.md`，以当前工作区（包含横向乐谱功能）为基线，仅执行 P0 和 P1。先保留并识别现有改动，建立最小验证基线，再迁移 trainer-timing 到 TypeScript。保留传统脚本启动顺序、现有 UI 和播放行为，不升级 vendor，不整体重写 trainer-core，不删除 LED 共享逻辑。交付可运行的编译产物、源码映射、测试结果、迁移映射和本地运行步骤。完成后更新 `docs/refactor/PROGRESS.md`，列出 P2 的最小后续任务。

## 12. 依据与参考

项目依据：`docs/ARCHITECTURE.md`、`docs/DEV_NOTES.md`、`docs/Practice Mode Behaviors.txt`、本轮检查的源码和 `docs/testing`。既有架构文档对 timing／feedback 的警告应作为专项验收要求；本计划的分阶段迁移不意味着可以忽略这些历史约束。

编译方案参考官方文档，具体依赖版本在执行 P1 时锁定：

- [TypeScript：从 JavaScript 迁移](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)：支持逐步迁移，源文件与输出目录应分开。
- [TypeScript：module 配置](https://www.typescriptlang.org/tsconfig/module.html)：经典脚本过渡与后续模块构建需要分别配置。
- [TypeScript：noEmitOnError](https://www.typescriptlang.org/tsconfig/noEmitOnError.html)：类型检查失败时阻止生成新产物。
- [esbuild：TypeScript 支持](https://esbuild.github.io/content-types/#typescript)：打包会移除类型，需另行运行 TypeScript 检查。
