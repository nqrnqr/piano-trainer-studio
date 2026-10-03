# TypeScript 重构进度

执行日期：2026-10-02。首轮完成 P0、P1；用户随后授权继续完成 P2–P9，完整目标保持进行中。

## P0

- 状态：完成。
- Git 检查点：`c1e175a` — `test: establish TypeScript refactor behavior baseline (P0)`。
- 范围：干净基线识别、vendor 版本／哈希、启动顺序、全局依赖／覆盖、关键行为测试与手工清单。
- 迁移映射：无运行时代码迁移；仅新增 docs/refactor、Node 测试、练习测试页及自制反复谱例。
- 类型／接口：本阶段无 TS；测试运行原 JS 和真实 OSMD。
- compatibility：保留全部经典脚本与全局接口；词法符号列表由 inventory 脚本生成。
- 行为是否改变：无；应用 JS、HTML 入口、vendor、helper 及启动器保持原样。
- 命令：`node --test tests/unit/*.test.cjs`；`node scripts/inventory-legacy-globals.cjs`；`node local-web-server.js`。
- 测试：Node 41/41；原显示页 30/30；新增练习／真实反复页 53/53；全部通过。
- 未验证：实体 MIDI/LED、真实音频同步、Mac、触屏、完整复杂重复结构与原生前台滚动，详见 BASELINE。
- 回退：移除本阶段新增文档、脚本和测试；没有用户数据变更。
- 下一阶段入口：P1 根工具链及 src/domain/timing.ts，替换唯一 timing 槽位。

## P1

- 状态：完成。
- 范围：最小根工具链、严格 timing 类型、唯一生成加载槽位、source map、静态交付与产物一致性检查。
- 迁移映射：`js/trainer-timing.js`（已移除）→ `src/domain/timing.ts` → `js/generated/domain/timing.js` / `.map`。
- 新增类型：`PianoTrainerTiming.MeasureTimingInfo`、`RemainingMeasureWaitOptions`、`TraversalWaitOptions`、`Api`、全音符时间／四分拍别名；`types/legacy-timing.d.ts` 描述 Window 成员。
- compatibility：仍以经典脚本提供同一个 `window.PTTiming` 对象。core 四处调用及浏览器测试保留；API 空对象初始化断言及有限性检查后非空断言已解释。无核心 any 或禁用检查。
- 行为是否改变：无；逐句保留 fallback、默认参数、epsilon、正向／反向／跳结尾比较、返回单位。HTML 仅替换原 timing 槽位，版本参数／脚本顺序不变。
- 工具链：Node 22.21.0 / npm 10.9.4 / TypeScript 5.9.3；只新增一个开发依赖与锁文件，未改根包为 ESM，未升级 vendor 或 helper。
- 命令：`npm ci`、`npm run build`、`npm run check`、`npm run inventory:globals`；本环境 npm cache 指向 `.cache/npm`。完整运行方法见 DEVELOPMENT。
- 已执行验证：
  - 干净 `npm ci` 成功；strict typecheck 成功；两个产物与干净临时输出完全一致。
  - Node 43/43（保留 P0 41 项，新增唯一入口／source map 两项）通过。
  - 浏览器显示 30/30、练习与真实反复 53/53 通过；结果与遍历事件见 `validation/P1-browser.txt`。
  - 从 P0 提交读取旧脚本，和生成 JS 对比 43,904 次结果，含 undefined/null/NaN/Infinity 与异常长度，完全一致。
  - 故障注入：内容漂移、缺 map、额外未跟踪产物均被拒绝；类型错误导致构建失败而现有 JS/map 保持原字节；恢复后检查通过。
  - 现有 CommonJS 静态服务器首页、生成 JS/map、Wi-Fi connection-info 均 HTTP 200；`/src` 仍 404，map 含内嵌 TS。
  - 浏览器仅有 P0 已记录的注入环境 MutationObserver 异常及 core 成功加载日志；无新增项目异常。
- 未验证：F12 交互断点（已自动验证映射行和内嵌源码）、实体 MIDI/WLED、真实音频同步、Mac 启动器与原生前台滚动。启动器源码未改，实际执行其共用 Node 服务入口；未点击平台启动器。
- 回退：revert P1 提交即可恢复旧 timing 与槽位；不涉及用户设置／数据库。生成目录仅由构建脚本管理。
- 下一阶段最小入口：P2 的 state 类型与偏好验证；本轮结束于 P1。

## P2

- 状态：完成。
- Git 检查点：f391f64 — refactor: type shared state and settings boundaries (P2)。
- 范围：状态及嵌套结构类型化、唯一偏好 key 表、读取／默认值与备份服务、设置 UI 边界。
- 迁移映射：trainer-state.js → src/state/{app-state,preference-keys,preferences,settings-backup}.ts 和 src/ui/settings-controls.ts。
- 类型：LegacyAppState、PianoTrainerDomain 下的期望／反馈／提前预留／预览／路由／键域结构；动态字段 optional，Map/Set 明确泛型。
- 行为：保留共享身份、初始化、key、白名单、强制默认值、导入 coercion 和跳过首次 seed；未变更 IndexedDB。
- 所有权：STATE_WRITES.md 收集 349 个直接写入点，STATE_OWNERSHIP.md 补充别名变更与最终边界。
- 验证：strict 类型检查和构建通过；完整 Node 53/53（含 10 项设置专项）、显示 30/30、练习与反复 53/53、真实 FileReader／两次 reload 设置 10/10 通过。旧／新状态与偏好 540 次比较一致。结果见 validation/P2-browser.txt；14 个产物由干净临时目录重建并比较。
- 验证范围：保留首次默认值／特殊强制值、既有／异常配置、备份往返／错误拒绝／恢复默认、共享 Map/Set 身份、模式独立手配置、布局持久化与重载恢复；设置测试结束还原原有支持键。
- 未验证：实体 MIDI/WLED 与真实音频、Mac 等前述硬件清单仍未实测；旧 JS 业务消费者尚未全部受类型检查。
- 命令：npm run build、npm run typecheck、npm run build:check、npm test；浏览器三测试页。STATE_WRITES 可用 node scripts/inventory-state-writes.cjs 重建。
- 回退：revert P2 检查点恢复原 state 及脚本槽位；不迁移或清除用户数据，P0/P1 保持。

## P3

- 状态：完成。
- 第一子步骤检查点：a7af73c — refactor: extract shared playable range from LED (P3)。第二子步骤为共享时间线、非硬件 UI 与 optional/no-op 边界。
- 映射：led.js 的 normalizePlayerPianoType、derivePlayerRangeFromKeyboardSize 及 MIDI 范围／归一化位置计算 → src/domain/playable-range.ts；共享缓存及旧名转发 → src/state/player-range.ts。FULL_PIANO_* / PLAYER_PIANO_SIZES 常量迁往 domain。
- 依赖方向：纯 domain 函数不读 AppState、DOM、storage、Tone、OSMD 或硬件；state 提供同一个 range cache 给旧键盘／判定／预览入口，LED none 仍工作。
- 行为：保留奇数裁剪、Number coercion、88-key fallback、范围包含端点与位置不夹紧规则；旧 led.js 不再定义这些函数。
- 验证：64/64 Node 测试（新增 11 项键域专项）通过；旧／新范围 40 次比较一致；显示 30/30、练习／真实反复 53/53 通过，见 validation/P3-range-browser.txt；18 个生成文件与干净临时重建一致。
- 共享 timeline 映射：core 的 attack filter、签名、预览 note 收集、timeline 构建、位置恢复、遍历索引与 future 查询 → src/score/score-traversal.ts。工厂注入最小 Cursor/Iterator、State、谱表／手分配、键域与 debug ports；无 DOM、Tone、LED 或全局 OSMD 依赖。旧函数名仅由 src/compatibility/score-traversal.ts 转发；单手提前预留、keyboard、playback 继续消费同一实例。旧 ledPreview* cache 字段保留，状态身份不变。
- 非硬件映射：led.js 的 permission help、connection status、update controls → src/ui 对应三个 TS 文件；player range 控件也迁入 UI。MIDI 连接读当前设备的临时 callback，P4a 再替换实现。
- LED 边界：src/optional/led/legacy-led-adapter.ts 定义 Output 与 no-op；src/compatibility/optional-led.ts 临时组装。core 不再直接访问 LedEngine/WLEDController、不再拥有 LED rAF。旧 MIDI LED 写入／清屏回到 led.js，wipeHardwareLEDs 只转发适配器。helper 与 vendor 未改。
- 配置与 UI：默认保留旧 LED；?led=off 或宿主 __PT_BOOT_OPTIONS__.ledEnabled=false 选择 no-op（显式 boolean 优先）。不增改设置 key，关闭时隐藏／禁用 LED 设置，保留 MIDI 错误提示、键域、音乐时间线、键盘与提前输入。旧 LED 设置变化触发的更新检查保留；首次更新检查在原位置独立初始化。
- 算法不变：保留 100000 步上限、按小节／时间戳恢复到首个匹配位置、当前／向前／重启索引查找、手过滤、同音跨谱表保留、按 staff|midi 合并。反复访问同一位置的恢复歧义仍是已知旧局限，未顺便修复；unit 固定其行为。谱表解析可能返回 null，PreviewNote／EarlyGraceReservation 的 staffId 据运行时事实补齐 nullable。
- 验证：75/75 Node（新增 6 项共享遍历／提前输入、2 项 adapter 生命周期、3 项非硬件 UI）通过；strict typecheck、34 个产物与干净临时构建比较通过。两种 adapter 各显示 30/30、三模式×两布局／反复 53/53；真实 OSMD 提前输入专项 legacy 30/30、no-op 33/33。记录见 validation/P3-browser.txt。
- no-op 专项：以既有 WLED/DDP 配置启动，确认不改保存值、无 LED 输出帧、无发现／重连 timer、无 WLED/helper 请求；MIDI 提示和更新 UI 可用。Follow 释放的提前 tap 与 Realtime 持有的提前 key 在目标事件计分一致。提前输入用实际 OSMD iterator 与判定函数，显式前进至目标以隔离 timer 抖动；完整练习页另验证真实调度。
- 清单：GLOBAL_SYMBOLS 重建为 588 个候选，唯一残余同名函数覆盖仍是计划 P4a 收敛的三个 MIDI 函数；直接 AppState 写入为 319 处，工厂的 cache 写入通过同一注入对象实现，未删除状态语义。
- 未验证：实体 MIDI/WLED、真实音频同步、Mac 启动器仍按基线手工清单保留。LED default 启动／输出循环烟测通过，不能据此声称硬件已验证。
- 命令：npm run build、npm run check；浏览器 score-display、practice-baseline、traversal-baseline 默认与 ?led=off；两个 inventory 脚本。
- 回退边界：还原本子步骤的函数与常量槽位，不改偏好／数据库或时间算法。

## P4a

- 状态：完成；P4b 尚未开始。
- 范围／映射：midi.js 输入解析／echo → src/midi/midi-input.ts；Web MIDI access／设备监听 → midi-service.ts；当前 core 生效的 Note On/Off、expression、silence → midi-output.ts；设备／通道 DOM 与持久化 → src/ui/midi-controls.ts。旧 MIDI LED strip 测试 → js/optional/midi-led-test.js，由 optional adapter 初始化，helper 未改。原 midi.js 删除，HTML 只加载唯一新实现。
- 类型／依赖：TrainerNoteInput 含 kind、note、velocity、source、1..16 channel、performance 毫秒 receivedAtMs。Any=0 仅为筛选配置。service 内部使用 DOM 自带的 Web MIDI 类型；UI 读设备 metadata，output 只读 send 端口。decoder／echo 不读 DOM、Tone 或 OSMD；service 不读 storage；状态和时钟经参数注入。
- compatibility：src/compatibility/midi.ts 提供旧名、service/output/controls 组装以及 dispatchTrainerNoteInput → triggerVirtualKey。core/LED 不再读 midiAccess 或 activeMidiInput；output 的 normalizeLiveVelocity 暂由原 core 单一实现提供，P4b 迁出。播放循环／音频调度未改。
- 行为基线：core 的有效力度 0→1、65.5 不取整、非有限值→100、夹紧 1..127，输出通道取 AppState 而非过期 DOM。echo 先过滤再筛通道，严格小于 120ms 及 256→128 截取不变；零力度 Note On 与两字节 note release 不变。expression 与 silence 的 CC 顺序不变，scheduled release 仍取回调时所选输出。
- 明确边界完善：释放被移除的 input listener、同 ID 新对象重绑、pending access 在 dispose 后失效、init 不重复、UI listener 可清除／重绑。这是计划要求的生命周期清理，均有独立用例；未调整练习匹配。损坏／缺少数据／范围外 note 或 velocity 不再进入领域桥接，有效 MIDI 字节行为完全相同；null device name 的旧 DOM String coercion 保留。
- 验证：82/82 Node；strict typecheck 与 44 个产物的干净构建比较通过；从 P3 读取原 callback，对 30,720 组有效字节／通道组合比较一致。显示 30/30、练习／真实反复 53/53；实际启动／DOM／OSMD 的模拟 MIDI default 20/20、no-op 21/21，通过后还原临时偏好。结果见 validation/P4a-browser.txt。
- 浏览器专项：saved device 自动绑定、Note On/Off/zero velocity／Any／指定通道／非音符、实际判定命中、唯一 output 与过期 DOM 通道、echo 过期、None／switch／unplug／reconnect、UI 和 service init/dispose/reinit、LED 控件缺失时输入输出均可用。fixture 在当前 index 的启动前注入，仅测试页使用。
- 清单：GLOBAL_SYMBOLS 595 个候选／33 classic scripts，同名函数覆盖为零。state inventory 改成动态扫描当前 src 与 legacy slots（336 个直接写入），别名／端口所有权补充在 STATE_OWNERSHIP。
- 未验证：实体 MIDI 权限／设备／硬件输出、真实音频、Mac 仍按基线手工清单；模拟 provider 不冒充硬件。普通测试浏览器的 Web MIDI permission denied 路径仍能显示独立提示。
- 命令：npm run build、npm run check；MIDI/显示/练习浏览器页；两个 inventory 脚本。回退：revert 本阶段恢复原 midi slot 和 core 输出；不改用户 key／数据库／vendor，P3 optional 边界保留。

## P4b

- 状态：完成（2026-10-03），完整目标仍进行中。
- 范围：Tone 节点、样本加载／解锁、延迟 profile、释放、力度／音量和音频／MIDI 路由；原 playbackLoop、metronome、count-in、时钟未改。
- 迁移映射：core 资源／音频 helper → `src/audio/tone-adapter.ts`；输入与播放路由 → `src/audio/audio-routing.ts`；normalizeLiveVelocity → `src/domain/velocity.ts`；codec probe → `src/ui/audio-capabilities.ts`。MIDI output 改用唯一的领域力度算法；没有保留 core 副本。无消费者且读不存在 lowLatencySynth 的 dead helper 已删除。
- 新类型／端口：Tone 14.8.49 最小已用接口，`AudioOutput.Ports/Service/LiveOptions` 与 routing 的 State/Ports/Destinations。状态为只读窄 Pick；opaque Synth token 用 unknown。资源 assertion 仅位于 init 后或 epoch/dispose 保护下；没有 any 或忽略检查。
- compatibility：`src/compatibility/audio.ts` 组装无资源 factory，core 在原节点创建位置 init。五个全局转发仍供 core 的 profile、load/unlock/time、播放 destinations 调用；输入／暂停／音量改为直接端口委托。UI 音量校验／存储和播放计时留在后续阶段。
- 原行为：30 个样本与 codec fallback、Triangle envelope/max polyphony、Follow 5ms 参数、样本加载 promise/cache failure、等待加载后 unlock、fresh immediate/now time、retrigger/gain floor、正时长 release、local boost 与独立未 boost MIDI 力度、local→MIDI 顺序、CC silence 均保留。未加载时 global guard 不读 hands、pause 不取消旧 one-shot release、NaN duration 由原 setTimeout coercion 处理等旧语义都有特征测试。
- 严格模式差异：真实浏览器发现 Tone latencyHint 只有 getter；旧 sloppy JS 忽略写入，TS strict 会抛 warning。使用 Reflect.set 保留静默 false 与可写字段赋值；抛错 setter 仍走原 warning。vendor 未修改。
- 生命周期完善：重复 init 不多分配；dispose 释放三个节点、取消 owned timers，并用 epoch 阻止加载／unlock／release 的迟到结果影响新实例。只在显式 dispose 生效；pause 取消规则不改变。P9 再统一启动／销毁所有权。
- 验证：95/95 Node（新增 13 项资源／异步／路由行为测试）；strict typecheck 与 54 文件产物干净比较通过。真实 Tone audio default/no-op 各 23；MIDI 20/21；显示 30、三模式／两布局练习／真实反复 53，共 170 项浏览器检查，见 validation/P4b-browser.txt。30 个本地 sampler 请求及解码成功；全局函数覆盖为零（578 候选、38 classic scripts），336 个直接 state 写入。
- 测试隔离：一次 no-op audio 运行与 MIDI 页的同 origin channel 偏好改写重叠，固定 channel 断言失败；保持原断言、关闭另一页并重载串行通过。DEVELOPMENT 已记录这些 fixture 必须依次运行，不能并发改同一 storage。
- 未验证：目标音频静音，真实 context／node／解码通过不等于可听音质、硬件延迟或节拍器同步；实体 MIDI/WLED、Mac、触屏仍需手工检查。
- 命令：npm run build/check，显示／练习／MIDI／audio 浏览器页与两个 inventory 脚本。回退：revert 本阶段恢复音频 core 与 MIDI 的原归一化连接；不修改用户 key、数据库、vendor 或其他阶段。
- 下一阶段最小入口：P5 OSMD adapter、score-display 与几何／绘制位置／NoteRef；保留 render 生命周期和两个位置语义。

## P5

- 状态：完成（2026-10-03）；完整目标仍活跃。
- 范围：OSMD 最小对象接口／图形查询／measure bounds、private painted snapshot、revision-scoped NoteRef；score-display、纵横 viewport、render lifecycle、几何与反馈／Loop SVG。播放／判定分支尚保留旧实现，继续 P6/P7。
- 迁移映射：score-display.js → `src/render/score-viewport.ts`（旧文件已移除）；feedback 的 renderScoreAndRefreshGeometry → score-renderer，GeometryEngine → geometry-engine，draw/render feedback → feedback-overlay，Loop drawing → loop-overlay；图形 exact-source lookup／system box／cursor.iterator → `src/score/osmd-adapter.ts`。feedback-engine 仅保留输入判定／期望构造、反馈记录与 Loop 推进。
- 类型／接口：OSMD 1.9.7 最小 Renderer/Cursor/Note/Shape/GraphicalMeasure；NoteRef readonly revision/id 和数值位置观察；各 render factory 的窄命令／状态／DOM／clock ports。domain/ExpectedNote 不再保存 logicalNote，constructor 与 dedupe fallback 改成 noteRef。相同 pitch/time 的源对象保留不同 ref；旧同 staff/pitch expected 去重规则不变。
- compatibility：`src/compatibility/{geometry,score-rendering}.ts` 暂时组装与旧名转发，供 core、feedback/debug、optional LED 及旧测试。factory 没有 render/rAF 副作用，ScoreDisplay.init 仍在 core 原位置执行。剩余 vendor 访问的旧业务消费者由 P6/P7/P8 逐阶段迁走。
- 原行为：render → invalidate geometry/overlay/debug → refresh anchors & restore painted cursor → feedback → Loop → debug 顺序未改。真正 iterator 预取位置／身份与完整 repeat state 保留；仅 adapter 暂写 private iterator，在 finally 恢复。cloning 保留 prototype、所有 enumerable 字段并浅拷贝数组，不把 measure/time 观察值当作完整 token。
- 几何规则：沿用 units=10、shape 探索上限/annotation ban、dot rejection、候选评分、X neighborhood 与 same-stem chord 的 Y 优先、exact-source 查找和 measure/system padding；没有改 beam 布局。两个局部 vendor 断言（完整 iterator clone、bounded shape reflection）及 nullable distance/cache assertion 有明确条件，无 any 或忽略检查。
- 生命周期：viewport init 去重／dispose 释放四类 DOM listener 和 rAF；adapter 重复 afterRender 不叠加 update wrapper，换 cursor／dispose 只释放自己的 hook，不覆盖外部 owner。Sheet identity 或 dispose 增加 revision、清除 ref map；geometry 在 render 后失效旧 cache。P9 再统一销毁入口。
- 特征测试说明：保留原 anchor refresh 的 horizontal/changingLayout 条件；layout switch 保留 realtimeWrongPress 标记，zoom/resize 的既有 visual cleanup 清空它。新增断言先误以为 zoom 也保留 flag；检查原 core 明确写 false 后，拆成分别验证原行为的断言，没有改计分或减少已有检查。
- 验证：109/109 Node（新增 14 项 snapshot/NoteRef/renderer/viewport/geometry/overlay）；strict typecheck、70 文件的干净生成比较通过。读取 e6f8095 原 Geometry，20,000 组 SVG candidate/fallback 比较完全一致。真实 OSMD 固定 1200px complex fixture，两布局 42 个 expected/anchor 记录与原 P4b snapshot 误差小于 0.01px，golden 源提交／vendor／宽度保存在 geometry.p4b.json；临时旧脚本采集后已删除，最终只加载新实现。
- 浏览器：默认／no-op 各显示 30、三模式×两布局练习及真实反复 53、render 专项 19；共享时间线／提前输入 30/33，实际启动的模拟 MIDI 桥接 20/21，共 308 项检查。前台 visibility=visible 下原生 rAF 的移动、33% 收敛及 dispose 均通过。render 专项还验证 hidden/cue、same-pitch staff refs、Wait relayout/zoom 状态身份、Loop shading/brackets、换谱旧 ref 失效。完整记录见 validation/P5-browser.txt。
- 清单：590 个 global candidates／45 classic slots，同名函数覆盖为零；335 个直接 AppState 写入，renderer 中别名 anchor/flag 写入及 ref/cache 所有权在 STATE_OWNERSHIP 记录。
- 未验证：实体 MIDI/LED、可听音频／metronome 同步、Mac 字体／启动器和触屏设备；前台 native scroll 的一次实测不代表各硬件帧率。没有升级 vendor、调整 storage/db/helper、重写匹配／时间算法。
- 命令：npm run build/check，两个 inventory 脚本，显示／practice／render／traversal 浏览器页；.cache 的原算法比较。回退：revert 本阶段恢复旧 display/feedback 与 expected logical source 字段；不清空用户数据或回退音频/MIDI。
- 下一入口：P6 建立 expected-notes、input-matching、early-grace、scoring；先列出原输入状态与副作用顺序，再迁移共用判定。

## P6

- 状态：完成（2026-10-03）；完整目标仍活跃。
- 范围：input-controller、input-matching、early-grace、expected-notes、scoring、feedback-state、sustain-state。MIDI dispatch 与 virtual key wrapper 同进 handle(TrainerNoteInput)，source/channel/receivedAtMs 保留；音频监听、keyboard/LED、calibration、advance 命令由端口委托。没有新增模式调度器。
- 迁移顺序与副作用：先记录 [P6_INPUT_CONTRACT.md](P6_INPUT_CONTRACT.md)，再迁出输入。preserved pressed.add → audio → matching/reservation → feedback/score/held/UI → hit → existing advance → render；release 的 marker transfer/render 在 audio off 前。scoring 负责增量，score reset 仍由既有加载/重置流程执行。
- 期望：OSMD adapter 的惰性 domain projection 和 revision-scoped ref 隔离源对象；practice 明确过滤 hidden/cue/rest/tie continuation、手分配和键域。按原 entry/note 顺序、staff|midi 去重，首次 anchor 缺失时才采用后项 source ref；same pitch 跨谱表仍分两次命中/计分。tie length 迁入 adapter，保持 Notes/NextNote/nextNote 的优先级与 cycle guard。
- 提前输入：共享 traversal timeline，无 LED 依赖；Follow released tap carry、Realtime held upcoming 1.1 拍、single-hand tap 1.05 拍、当前全部命中 gate 和 repeat occurrence index 规则保持。消费 reservation 仍逐 expected 计分、最后一次 UI 更新，并按原规则清理已消费/过去/无期望目标。
- 延音：谱面 expiry、same measure duplicate、cross measure 同音先清除后 35ms 重触发、wall-clock expiry、activeTimeouts 登记保持。keyboard 内的 pruning/preExpected 写入改成同位置调用 sustain-state。feedback history 与 visual cleanup 已归 feedback-state；P7 再迁总取消规则。
- 类型核对：真实 resolver 的 staffId 可为 null，Expected/Sustain/OutOfRange 据此收窄，Number(staffId)-1 保留旧算术。PTTiming 接口补 nullable timestamp，原值传递；保留 null 与 undefined 的旧算术差异并加用例。domain/practice 没有 vendor refs，practice 不读 DOM、storage、Tone 或 OSMD；没有 any 或忽略类型检查。
- 验证：137/137 Node（新增 28 项输入/构建/预留/反馈/延音行为用例，P3 的 early fixture 改连新端口）；strict typecheck 与 86 文件干净生成比较通过。基线 7a53e65 的 3,000 组 expected 构建、3,000 个输入序列/24,000 次事件、1,000 组 sustain/timer 逐项比较；把 opaque ref 还原为源身份后，状态、副作用、诊断与 debug frame 完全一致。
- 浏览器：default/no-op 两条路径各 input 40、display 30、practice 53、render 19、audio 23；traversal 30/33、MIDI 20/21，总计 434 项。真实 OSMD 与 mouse/pointercancel DOM 事件、same-pitch staff、partial chord、repeat suppression、grace/hidden/cue、非练习手、tie sustain、range、实际重复/结尾和 audio loading/routing 全通过。记录见 validation/P6-browser.txt。新 fixture 的 muted audio unlock 为已完成 promise，真实 Tone 独立 audio baseline 验证。
- 清单：604 个 global candidates、53 classic slots、同名函数覆盖为零；290 个直接 AppState 写入，practice 的 state aliases 在 STATE_OWNERSHIP 与 input contract 单独说明。旧 feedback-engine 只剩 Loop 推进，随 P7 迁出。
- 未验证：实体 MIDI/LED/WLED、可听音质/硬件延迟/metronome 同步、Mac/触屏；生产仍是迁移期 classic composition，完整 bootstrap/module/dispose 收尾属于 P9。用户偏好、库格式、vendor 和 helper 未改变。
- 命令：npm run build/check、两个 inventory 脚本、input/display/practice/render/traversal/MIDI/audio 浏览器页及 .cache 的旧算法对照。回退：revert 本阶段恢复旧输入/feedback 入口桥接，保留此前 MIDI、audio、render 的独立模块。
- 下一入口：P7a 先记录 Play/Pause/Reset、count-in/metronome 与 playbackLoop 的时钟/资源/取消契约，再搬运现有 coordinator；P7b 再提取模式策略，保留一个循环及实际 OSMD 反复。

## P7a：时钟、节拍器与小节缓存检查点

- 状态：第一子步骤完成（2026-10-03）；P7a 的播放协调器仍待迁移，完整目标保持活跃。
- 范围：原 count-in、Wait 连续节拍、播放窗口节拍、visual pulse、MembraneSynth、MIDI Channel 10 click 与 measure timing cache。先记录 [P7_SCHEDULING_CONTRACT.md](P7_SCHEDULING_CONTRACT.md)，再迁移；Play/Pause/Reset、playbackLoop/checkWaitModeAdvance 与 Loop 边界推进仍是原 JS。
- 映射：core 的节拍器/计数/资源 → `src/audio/{playback-clock,metronome,metronome-output}.ts`；小节缓存 → `src/score/measure-timing.ts`；pulse DOM → `src/ui/tempo-pulse.ts`；percussion bytes/release → MIDI output。`src/compatibility/metronome.ts` 暂时组装并提供旧名，factory 不创建 timer/node，core 在原位置初始化 MembraneSynth。
- 行为：沿用原 Tone 秒、performance 毫秒与 wall-clock timeout；首拍同步、末拍再等完整一拍、raw count-in numerator、Wait modulo/tempo rebuild、窗口 epsilon 与 beatOffsetSec 公式、pulse 120ms 去重/170ms 清理、MIDI attack -2ms/捕获 output release 均未改。实际反复构建缓存、100000 上限、首个匹配位置恢复及 repeat boundary 的零长度保持。
- 取消：普通 Pause 保持原逐项取消规则，不添加 generation reset；快速 Pause/Resume 可能让旧 count-in 回调再次接管、暂停后的已排 MIDI attack 仅由 checkbox gate，均有特征测试。显式 dispose 才取消所有 owned timer/rAF 并失效迟到 callback，供 P9 使用。
- 类型：Tone 最小声明补 MembraneSynth，OSMD 补 source measure/time signature；measure cache、clock resource list 和 metronome counters 为私有字段。无 any/忽略检查；source-measure/cached lookup 与 count-in loaded assertion 保留旧语义。经典入口检查区分 timing 算法和 measure cache，并仍要求两算法只有一个实现、缓存只有一个加载槽位。
- 验证：159/159 Node（新增 20 项时钟/节拍器/缓存、2 项 percussion 输出），strict typecheck 与 98 文件干净生成比较通过，见 validation/P7a-metronome-check.txt。基线 1ec34ee 的 1200 个流/14400 个动作、1800 个窗口/1168 个 timer callback、800 组缓存比较一致，包括状态、事件顺序、delay 与 restore 命令。
- 浏览器：default/no-op 各 metronome 19、audio 23、display 30、practice 53，traversal 30/33，共 313 项通过，见 validation/P7a-metronome-browser.txt。真实 Tone nodes/native timers 与实际 OSMD 验证 count-in cadence、最后整拍、Wait 无输入 tick/stop、Follow target time、Channel 10 bytes、pause/dispose/reinit；MIDI provider 模拟、声音静音。偏好 fixture 串行运行并恢复。
- 清单：603 个 global candidates/59 classic slots，同名函数覆盖为零；284 个直接 AppState 写入，模块 aliases/私有资源记入 STATE_OWNERSHIP。用户 key、库格式、vendor、helper 与启动器未改。
- 未验证：可听音频与硬件节拍同步、实体 MIDI/WLED、Mac/触屏；当前 muted native timer 验证不能代替这些手工检查。P7 全阶段矩阵待协调器/策略完成后验收。
- 命令：npm run build/check、两个 inventory 脚本、metronome/audio/display/practice/traversal 浏览器页、.cache/metronome-parity.cjs 原算法对照。回退：revert 本检查点恢复原节拍器/cache 槽位与 MIDI click bridge；不清空用户数据，P6 输入迁移保留。

## P7a：播放协调器检查点

- 状态：完成（2026-10-03）；P7a 两个子步骤均已迁出，完整目标仍活跃。P7b 模式策略尚待分离。
- 映射：core 的 Play/Pause/Reset、checkWaitModeAdvance/playbackLoop、feedback-engine 的 Loop enforcement → `src/practice/playback-coordinator.ts`；clearVisuals/clearTransient → playback-state。`src/audio/tone-transport.ts` 原样调用 Transport 的 stop/pause/start/bpm；`src/ui/playback-controls.ts` 读取必需 Loop 与可选 metro controls，core 原 DOM binding 暂时保留。
- 唯一实现：旧 coordinator/core 函数、feedback-engine.js 与 HTML 槽位均已删除。`src/compatibility/playback.ts` 在 practice composition 后无资源组装并提供旧名；factory 本身不分配 node/timer/listener。静态入口断言只加载一个循环/输入推进/Play 实现。
- 数据边界：OSMD adapter 捕获 entries 并惰性投影 PlaybackEvent；领域数据不含 vendor 对象，原 keyboard 仅在 composition 边界取回 capture。当前 displayed event/context 先建立，再 advance/prefetch；fallback 仍是首个 note 的 raw Length，与 combined tie 区分。真实 repeats/ending 与第一匹配位置恢复规则未改。
- 行为：Follow comfort=.6、命中后 Math.round 毫秒、Realtime 累加 anchor、Wait empty 10ms、Follow empty 的双 window 调用、already-hit 0ms、空 voice rAF、tempo 更新、伴奏 defer/flush、miss→paint→scroll→loop 顺序保留。Reset/loaded-score Reset 不合并；Loop enforcement 用 state bounds、窗口回跳用 UI bounds，waitSeconds 不沿 anchor 修正。
- 生命周期：Pause 保留原 sustain/event timers 与 prefetched cursor，ClearVisuals 才取消 activeTimeouts；rapid Pause/Resume 的旧回调和 pending unlock/两个 Play 的原行为都有用例。显式 dispose 才取消 owned clock 与 metronome/count-in、失效 pending async start，重复 dispose 幂等。没有新增 Tone.Transport schedule 事件、tempo scheduler 或 iterator 时钟。
- 类型：coordinator/transient state 仅依赖领域数据、窄 state 和命令端口，不读 DOM/Tone/OSMD/storage。adapter 的 loaded cursor/source assertion 保留原调用条件，required UI 缺失明确报错；optional LED 无影响。无 any/忽略检查，严格类型检查与 108 文件干净生成比较通过。
- Node：182/182（新增 23 项协调器/异步/生命周期/惰性 projection；P0 的 8 项调度断言仍保留并接新 coordinator），见 validation/P7a-coordinator-check.txt。基线 3a76224 的 700 流/6300 动作、399 timer callback/11 frame callback、150 Play/count-in 比较，状态、时长、副作用与 iterator 命令完全一致。
- 浏览器：完整受影响矩阵 default/no-op 各 playback 127、metronome 28、input 40、practice 53、display 30、render 19、audio 23，traversal 30/33、MIDI 20/21，共 744 项；最终结果见 validation/P7a-coordinator-browser.txt。新 playback 页用实际 toolbar/OSMD/input、受控 clock/count-in，覆盖三模式×两布局的 Play/viewport/prefetch、正确/错误/漏音、速度/取整、Pause/Resume/rapid、Reset/Loop/count-in/UI min、28 事件反复/结尾、歌曲结束、播放中换谱与旧 timer gate。
- 原生音频：另用真实 sampler/synth/MembraneSynth、native timer 和实际 coordinator startup，验证三模式 first-piano/window target、count-in 末拍完整 handoff，保存 NATIVE_SYNC 记录。Wait 的 Tone.now/lookAhead 相对 immediate piano 偏移是原行为；Follow/Realtime window 用 immediate，不以断言消除差异。场景间显式 dispose 隔离已记录的旧 pending callbacks。输出静音，实体/可听同步仍未验证。
- 清单：612 global candidates/63 classic slots、同名函数覆盖为零；229 直接 AppState 写入，state aliases/owned timers 见 STATE_OWNERSHIP 与 scheduling contract。偏好、库 schema/格式、vendor/helper/启动器未改。
- 命令：npm run build/check、两个 inventory 脚本、全部 playback/metronome/input/practice/display/render/audio/MIDI/traversal 页、.cache/playback-parity.cjs。回退：revert 此 coordinator 检查点恢复完整旧循环与槽位；不同时运行半套旧/新 timer，不清空用户数据，上一 metronome 检查点保留。

## P7b：模式策略

- 状态：完成（2026-10-03）；P7 两部分均完成，完整目标仍活跃，P8/P9 尚待完成。
- 范围：`src/practice/mode-policy.ts` 提取 Wait/Follow/Realtime 的 input/timed、伴奏/metronome deferral、relative/accumulated anchor、Follow comfort/hit delay 与 callback guard；coordinator 仍拥有唯一循环、时钟、状态写入和全部副作用。没有引入新状态机、tempo scheduler 或 repeat 展开。
- 观察位置：displayed 为 advance 前的 measure/timestamp，prefetched 为 advance 后的位置。Follow window 使用 displayed，timing 使用两者；数字不是完整恢复 token，实际 repeat/ending context 仍由 OSMD adapter 保持。
- 读取顺序：模式在原 decision 边界重新解析，包括 audio/sustain effects 之后和 timer 执行时。Follow 恰好 .6 保留 remaining，短于 .6 恢复 full；missing/nonfinite info 保留 Wait-only 10ms fallback。invalid saved mode 仍走 timed branch，普通 Pause/Reset 不添加取消规则。
- 验证：192/192 Node（新增 10 项 threshold/取整、immutable input、displayed/prefetched、invalid Follow info、重入模式变化和 callback guard）；strict typecheck 与 110 文件干净生成比较通过，见 validation/P7b-check.txt。
- 对照：基线 `9f62db2` 的 2,000 流/48,000 动作、1,461 timer/50 frame callbacks、200 Play/count-in/dispose；其中 1,000 流的时钟每次读取变化，400 流在 audio/sustain 内切换 mode。状态、事件顺序、精确 delay、clock read order、iterator commands、dispose 均一致，命令为 `.cache/mode-policy-parity.cjs`。
- 浏览器：744/744；default/no-op 各 playback 127、practice 53、input 40、display 30、metronome 28、audio 23、render 19，MIDI 20/21、traversal 30/33。沿 P7 全矩阵检查三模式×两布局、输入/评分、Play/count-in/Pause/Resume/Reset/Loop、速度、换谱、实际 repeats/endings、native Tone/metronome 同步目标。最终记录见 validation/P7b-browser.txt；静音模拟输出不能证明可听或实体硬件同步。
- 清单：613 global candidates/64 classic slots、同名函数覆盖为零；229 直接 AppState 写入。纯策略无状态/资源写入；偏好、库 schema/格式、vendor/helper/启动器未改。映射与读取契约已更新。
- 回退：revert 本 P7b 提交恢复整个 P7a coordinator 与 HTML slot。无需同时运行旧/新循环，无数据迁移。P7a 的调度/时钟端口保留。

## P8a：XML/MXL IO 与 loader 检查点

- 状态：第一子步骤完成（2026-10-03）；P8 仍进行中，converter/transpose engine、library/backup、其余 UI 控制器尚待迁移。
- 映射：core score IO/ZIP/payload → `score/musicxml-io.ts`；load/reset/render/cursor/currentScore/library/transpose notification → `score/score-loader.ts`；native FileReader 与 file input → `ui/score-file-{reader,controls}.ts`。增加 domain ScoreFile/ScoreLoadOptions，OSMD load 仅由 adapter 调用。旧 block 删除，compatibility/score-data 提供仍需的少量旧名，core 在原位置 init。
- 数据与返回：MXL 原始内容与中性 MIME 用于 render，container-selected XML 仅用于 transpose；原 canonical fallback、byteOffset slice、metadata/source identity、load Promise 完成时机及异常 rethrow 均保持。失败不回滚此前 reset/state。先记录 P8_DATA_CONTRACT.md，再迁移；没有新增 load epoch、用户 schema 或 converter 逻辑。
- 生命周期：input init 去重/dispose 移除自己的 listener；reader 显式 dispose abort 私有 pending reads 并以 AbortError 拒绝，完成/error 已移除。普通换谱/加载不会调用 dispose。native event target 收窄；binary slice assertion 与 reader.result loaded assertion 的条件在契约记录，无 any/忽略检查。
- Node：206/206（新增 14 项 stored/deflated MXL、container/fallback、原始 payload/MIME、async completion、error state/order、native reader/DOM command/dispose）；strict typecheck 与 122 文件干净生成一致，见 validation/P8a-loader-check.txt。静态入口验证唯一 loader/ZIP/read/direct-selection 实现。
- 对照：基线 `8d48051`，500 组加载与 500 组 ZIP/view 对照，含 binary/Blob/view、normalized fallback、skip/reset、library/render/load 失败；状态、副作用、错误、原始和 render bytes、directory selection 完全一致。命令 `.cache/score-data-parity.cjs`。
- 浏览器：649/649；default/no-op 各 loader 24、playback 127、input 40、practice 53、display 30、render 19，traversal 30/33。真实 FileReader/file input change、XML/MXL、SVG、transpose +2/reset 与 source/speed、无效 XML alert/rejection、actual MIDI → MusicXML、local WASM 路径 200；同时回归播放换谱、输入、练习、display/render 与 shared traversal。最终记录见 validation/P8a-loader-browser.txt。WASM 在 worker 内加载，frame performance 不能代替资源验证；检查实际转换与相对 HEAD 响应。
- 清单：610 global candidates/70 classic slots、同名函数覆盖为零；217 直接 AppState 写入，loader aliases 在 STATE_OWNERSHIP 说明。vendor/helper、用户偏好、库格式/数据和启动器未改。
- 回退：revert 本 score IO/loader 提交，恢复原 core block 与 HTML slots；不变更或清空用户库，P7 保留。完整 P8 数据/UI、P9 module/bootstrap 验收尚未完成。

## P8 其余步骤与 P9

下一入口：处理剩余 preferences/practice/routing/keyboard/core controls。P9 再完成显式 bootstrap、源码 import/export、单 bundle、窄测试 facade 与 init/dispose 验收。整个重构尚未完成。

## P8a：转换与移调检查点

- 状态：第二子步骤完成（2026-10-03）；P8 仍进行中，library/backup 与其余 UI 尚待迁移，完整目标保持活跃。
- 映射：midi-import.js → `score/score-conversion.ts` / `webmscore-adapter.ts`；transpose-engine.js → `score/transpose-engine.ts`；transpose-ui.js → `score/transpose-controller.ts` / `ui/transpose-controls.ts`。旧三个文件与槽位删除，只有生成实现生效。FileReader 共用 private pending registry，converter compatibility 惰性组装，transpose compatibility 在原位置 init。
- 类型与行为：vendor export 为 unknown，仅 adapter 解码/检查；保留 11 个 suffix、四种 export 优先级、字节视图/UTF-8、错误 log/wrap/透传、finally soft destroy 和 Promise 时机。移调 preset/bias/parseInt、key 最短间隔、minor 的旧 tonic lookup、timewise 的旧结构规则、original-source 与 load 后 live mode 读取均保持；不修正历史算法或重设计 UI。边界断言见 P8_DATA_CONTRACT，无 any 或忽略检查。
- 生命周期：普通转换仍 soft destroy，已返回 score handle 私有持有，显式 dispose 才 hard destroy 一次；迟到 score 释放、迟到 export/result 不加载。script marker 的缓存/失败/ready 顺序保持，显式 dispose 释放自己的 script/reader；captured old callbacks 不影响新生命周期。UI init 去重、dispose 移除六类 listener，pending apply/reset 不提交迟到 UI。vendor 在 load 失败、尚未返回 handle 时的内部 worker 无公开释放接口，未改 vendor；P9 再协调完整 loader/bootstrap notification。
- Node：231/231（新增 15 converter、10 transpose/controller/UI 用例）；strict typecheck 与 136 文件干净产物比较通过，见 validation/P8a-transform-check.txt。
- 对照：基线 e91ca87，2,000 原生 XML DOM transforms 的全部输出字符串、key metadata、errors 一致；600 conversion/normalization commands 的 metadata、errors、read/load/export/destroy 顺序一致。保存 40 个 golden 用于可复现浏览器检查，不保留第二套旧算法。临时命令 `.cache/compare-score-conversion.cjs`，原生对照捕获页已删除。
- 浏览器：default/no-op 各 loader 28、transpose 52、playback 127、input 40、practice 53、display 30、render 19，traversal 30/33，共 761 项。actual MIDI/WASM conversion 与 native Worker accounting 证明普通 soft、显式 dispose/reconvert/release，并保留转换前已有 worker；实际 slider/mode/signature/Apply/Reset、source/speed/state identity、重复 init/dispose 均通过。记录见 validation/P8a-transform-browser.txt；硬件与可听同步仍未验证。
- 清单：620 global candidates/74 classic slots、重复函数定义为零；216 直接 AppState 写入，transpose alias/资源所有权已记录。vendor/helper、用户 schema、偏好格式、资源地址和启动器未改。
- 回退：revert 本检查点恢复原 converter/transpose 文件与槽位，上一 score IO/loader 保留；无需清空数据库或偏好，不同时加载旧/新实现。后续从 library repository/backup 开始。

## P8b：曲库 repository 与备份检查点

- 状态：数据 repository/backup 子步骤完成（2026-10-03）；P8 仍进行中，scores-ui 与剩余 core UI 控制器尚待迁移，P9/完整目标保持活跃。
- 映射：score-library.js → `domain/library.ts`、`score/library-backup.ts`、`score/score-library.ts`、`compatibility/score-library.ts`。旧文件与 slot 删除，只有生成实现；未消费的全局 ID/binary helpers 不再转发，旧 scores-ui/loader 消费同一个 ScoreLibrary 与 folder label。
- 数据边界：保留 pianoTrainerLibrary v1、两个 id stores/四个 nonunique indexes、首次 open/失败缓存、tx.complete 后 executor result 的 Promise assimilation、native error/abort 与同步 throw→abort。CRUD 的 dedup/count、callbacks 内 put/delete、排序/recent、timestamp 读取次数均保持。backup 原 Array.isArray/default/coercion、ArrayBuffer-only 编码、新 ID/本次 folder map、未知 version 和 malformed entry rollback 保持，不新增 schema 门槛。局部 IndexedDB/unknown 类型边界见 P8_DATA_CONTRACT，无 any/忽略检查。
- starter：原 flag/key、document.baseURI 相对 URL/cache=no-store、已有内容跳 seed、成功事务后写 true 与失败不写 flag保持。普通并发不新建 dedup，用户数据/资源不变。
- 生命周期：显式 dispose 关闭 owned DB/abort transactions、reject pending open、close late connection；await 后 generation 阻止旧 CRUD/export/starter 续发/重开 DB。仅 dispose 为 abort 的 internal read promise 加 rejection observer，native pending read 实测无 orphaned rejection。重复 dispose 无第二次资源释放，reinit 保留数据库内容；普通 CRUD/import/换谱不取消操作。
- Node：246/246（新增 15 项 schema/complete/error/CRUD/byte/backup/starter/dispose/pending command 用例），strict typecheck 与 144 文件干净生成比较通过，完整输出见 validation/P8b-library-check.txt。
- 对照：基线 779bc82，10 流×60 次真实 IndexedDB 命令；每步返回/错误、完整 folder/score record states、字节和精确时间戳一致。独立旧/新数据库使用同种 native engine，结束删除21个测试库；临时 baseline capture 页已删除，不长期保留双实现。
- 浏览器：552/552；default/no-op 各 library 38、loader 28、playback 127、practice 53、display 30。library 的 native CRUD/move/delete/cascade、v1 schema、MXL backup roundtrip/新 ID/映射、invalid rollback、actual Starter_Scores.json、seed flags/错误、pending dispose、实际旧 drawer/loader markOpened均通过。每次 library fixture 关闭并删除自己的六个临时数据库，偏好全在内存，未改用户库；结果和对照见 validation/P8b-library-browser.txt。
- 清单：611 global candidates/77 classic slots、重复函数为零；216 直接 AppState writes，repository 无 state 写入。vendor/helper、用户偏好/schema/backup格式、相对资源及启动器不变。实体硬件、可听同步、Mac/Windows launcher 的最终验证仍待 P9。
- 回退：revert 本 library 检查点恢复完整原文件/槽位，转换/loader 子步骤保留；无需清库、恢复偏好或转换已有数据。下一入口为 scores-ui 的 drawer/folder/list/import/backup UI 分层及生命周期。

## P8c：曲库抽屉与管理控件检查点

- 状态：完成（2026-10-03）；P8 剩余 toolbar/core controls 与 P9 尚待完成，完整目标保持活跃。
- 映射：scores-ui.js → domain/library-view、ui/library-controls-state/dialogs/actions/list/scores-drawer、compatibility/scores-ui。旧文件与 slot 删除，七个模块在原位置加载；原 Window.ScoresUI 十个方法完整保留，增加显式 init/dispose。无第二套算法或全局 helper forwards。
- 行为：原 DOM/classes/文字、>=900px split、窄屏 folders/scores/back、selection/manage、loaded badge、native picker/menu/Escape、顺序 mixed import、save current 的 await 后 live state、row/bulk/cascade 及 loaded title/ID 的旧差异保持。备份 filename/MIME/indent/revoke、错误提示与普通 concurrent refresh 顺序保持；不改变 schema、偏好或用户交互。
- 生命周期：factory 无查询/listener 副作用；原 shell slot init，重复 init 保持六个实际静态控件与两个 resize listener。重建释放旧 row handlers，普通已开始命令仍完成；普通 drawer close 不取消 picker/data。显式 dispose 才释放 own overlays/key capture/rows/static/resize listeners、取消 own frames并失效 pending awaits/input finally；reinit 不复活旧 callbacks。
- 类型：view 是纯规则，UI 只依赖 narrow state/typed command ports。nullable IDs、converter/toolbar getter、error property coercion 的局部边界见 P8_DATA_CONTRACT；无 any/忽略检查。全套 strict typecheck、158 文件干净生成比较与 258/258 Node（新增 12 UI actions/selection/async/dispose）通过，见 validation/P8c-scores-ui-check.txt。
- 对照：基线 a067b87，384 组 native DOM/state/command snapshots 覆盖 600/899/900/1200px、两视图、六种 folder selection、四种 manage 与 empty/populated；另比 init error、starter warning、四种 picker 与两种 action-menu DOM/cancel。原结果完全一致，临时旧实现捕获页已删除。命令 .cache/create-library-ui-parity.cjs，仅保留结果。
- 浏览器：758/758；default/no-op 各 library UI 44、library 38、loader 28、playback 127、practice 53、input 40、render 19、display 30。新 UI fixture 使用实际 XML/MXL/MIDI converter、OSMD loader、native DOM events/IndexedDB/rAF；确认取消和实际确认删除均覆盖，测试库关闭后只删自己的数据，偏好仅内存。报告 validation/P8c-scores-ui-browser.txt。静音模拟不能证明实体 MIDI/可听输出；launcher 最终验证仍归 P9。
- 清单：591 global candidates/83 classic slots、重复函数零；186 direct AppState writes，UI state alias/owned resources 已记录。vendor/helper、用户数据/偏好/schema、资源和启动器不变。所有临时 parity files 删除，native tests 返回的原 success console.error/invalid JSON error 和权限拒绝是已知预期。
- 回退：revert 本 UI 检查点恢复完整旧 scores-ui 与原 slot，repository/loader/converter 保留，无数据迁移或清库。下一入口为 core 练习/显示/tempo/loop/settings/fullscreen/touch keyboard 控件与 toolbar 外壳，再进入 P9 imports/bundle/bootstrap/test facade。

## P8d：工具栏、显示、速度、音量与循环控件检查点

- 状态：完成（2026-10-03）；P8 剩余 preferences/practice/routing/keyboard/score-seek/settings bindings、P9 尚待完成，完整目标保持活跃。
- 映射：toolbar-ui.js → ui/toolbar、compatibility/toolbar；core 的 fullscreen/Play/Reset/zoom/resize → ui/display-controls，speed/metronome options → ui/tempo-controls，audio levels/boost → ui/audio-level-controls，loop range/count-in/hold → ui/loop-controls。共享 controls-dom 校验 required/optional 原生类型与 event targets；compatibility/native-controls 在原 core 各绑定位置显式 init，factory 无监听/timer/查询副作用。
- 原顺序：toolbar 下一 rAF、transitionend target 与 220ms fallback、普通旧动画回调不取消；More/外部点击/intro seen/await Scores refresh 保持。全屏 native await/WebKit 同步/fallback、scroll callback 返回；zoom input preview/change commit、300ms debounce→clear feedback/render/LED 定位；speed radix 差异、BPM 反算 percent 不 clamp/native range sanitization；levels storage→numeric audio/MIDI；loop empty/blur/crossing、320ms→170ms hold 与独立 click 均保持，详细见 P8_DATA_CONTRACT。
- 生命周期：只 explicit dispose 清自己的监听/两个 onclick slots（外部替换保留）、toolbar frames/transition/timers、display debounce、loop hold timers/capture/style并失效旧 callbacks/await。普通 close、Pause、resize retarget等仍沿旧语义。重复 init/dispose 不产生第二套资源，reinit 不复活旧帧、fullscreen continuation、onclick 或 hold callbacks。
- 类型与清理：UI 只持有 Pick state、typed commands 和 native DOM，不读 vendor 私有对象；OSMD zoom/optional measure 集中 adapter，增补原 public zoom 声明，无 vendor 升级。无 any/忽略检查。旧 toolbar 文件/slot、空 legacy-playback.d.ts 与无消费者的 helpers forwards 删除；LED 自己读取 overlay，只继续消费 closeToolbarPanel。
- Node：270/270（新增 12 组动画/async/资源、intro、fullscreen、zoom/debounce、tempo/radix、levels、loop/hold和 DOM target 用例），strict typecheck 与 174 文件干净生成比较通过。唯一 runtime implementation/旧文件缺失的 static entry gate 保留；报告 validation/P8d-native-controls-check.txt。
- 对照：基线 4a9fb9e，300×40 numeric/fullscreen/loop 与 200×40 toolbar/open/close/intro/frame/timer 命令，共 20,000。每步返回、state、DOM values/classes/attrs、storage、输出顺序及 timers/frames/intervals 一致；临时旧实现只在 .cache/native-controls-parity.cjs，无第二套生产/长期测试实现。
- 浏览器：882/882；default/no-op 各 native controls 39、library UI 44、playback 127、display 30、render 19、input 40、practice 53、loader 28、audio 23、metronome 28、settings 10。原生控件监听数 toolbar/display/tempo/audio/loop=15/8/8/8/45，另有两个 onclick；dispose 后 own listener/frame/timer/interval 及 slots 清零。实际 pointer/timers、native DOM/OSMD、default/no-op 和 stored preferences 往返通过。
- 全屏：单独 trusted click 实测 native=true/pseudo=false/active=true；Exit click 后三者均 false，label 正确恢复。临时捕获页已删除并关闭自己的测试库。受影响音频/节拍器页仍保留真实节点/原生 cadence 与三模式同步目标，输出静音，不证明实体 MIDI/可听质量。报告 validation/P8d-native-controls-browser.txt。
- 验证修正：新 resource fixture 原先把 async caller 中的六个 library-list handlers 计成 toolbar，真实创建 stack 证实来源，改为最近 UI 创建者（跳过 shared binder）；清零要求未降低，两个配置均通过。新测试入口的 syntax/API/key 错误修正，既有 gate 未隐藏。浏览器自动审核曾因账户额度失败，提示时间过去后原工具审核恢复，未绕过审批或换浏览器。
- 清单：524 global candidates/90 classic slots、重复函数零；168 direct AppState writes，UI aliases/资源所有权已记录。偏好/key/backup/schema、vendor/helper/资源/启动器未改。回退本检查点恢复整个原 toolbar/core controls block 和 slots，无需清库或重置偏好；先完成剩余 P8 控件，再切 P9。

## P8e：练习、谱表分配、偏好应用与设置按钮检查点

- 状态：完成（2026-10-03）；P8 剩余 virtual keyboard/score-seek/score UI，P9 imports/bundle/bootstrap/test facade/兼容层收尾仍待完成，完整目标保持活跃。
- 映射：core hand/mode routing → domain/hand-routing；assignment commit → app/hand-assignment-controller、DOM → ui/hand-assignment-controls；mode/feedback/keyboard visibility/audio routing prefs → ui/practice-controls；apply persisted/reset defaults → ui/preference-controls；settings buttons/file input/confirmation → ui/settings-actions。两个 compatibility 文件只组装/转发，新增八个 classic slots；core 从 1,420 行减至 646 行。
- 类型：hand domain 无 DOM/vendor/storage，assignment app 只接受捕获帧的 typed commands；UI 使用 narrow Pick state、集中 native input/select/button getters 和 event target 检查。OSMD staves/frame 捕获只在 adapter，LED reset/sync 只在 optional compatibility，debug 最小声明暂供未迁移 JS。无新增 any/忽略检查/大范围断言。
- 行为：Follow 互补手、独立 mode objects、未知 saved mode 字符串及 Realtime fallback；mode change 的 pause/clear/silence/transient、两次 latency profile、随后 live volume reads；Wait 保留 saved routing、最后 MIDI sync 覆盖 disabled 的旧行为均保持。staff right 无效不提交，有效同一帧 build→render，空帧才清三个原数组。详细顺序见 P8_DATA_CONTRACT。
- 偏好：逐句保留 apply/reset 的 storage/state/DOM/commands；使用 P2 实际 getClampedNumber（null/empty 为 default），不把其他 Number(null) 语义套入此函数。reset 五个 MIDI native change 的顺序、staff defaults、optional LED controls 和 device reload 默认保持。settings button clear/click、File|null|undefined→原 FileReader→立即 clear、原 confirm/alert/下载行为不改。
- 生命周期：三个实际 listener sets 为 practice 22、staff 2（load 后）、settings actions 4；重复 init/dispose 不产生第二套，dispose 只移除 own listeners/markers，generation 使旧 handlers 不进入新生命周期，外部 markers 保留。同步 preference apply/reset 不拥有 timer；普通按钮 dispose 不取消已开始的 P2 settings FileReader，统一文件命令生命周期归后续 P9。
- 清理：无消费者的 parse/getCurrent/setFollow/normalize/clone/noop LED init 和 low-latency forward 删除；旧角色/active hand/format/default assignment 与 apply/reset/routing aliases 仍供 core、MIDI、LED 和测试使用。Window.syncTrainerRoutingUiState 保留原 facade。
- Node：282/282（新增 12 组 domain/模式/调用顺序/路由/target/默认值/staff frame/文件绑定/资源用例）；strict typecheck 与 190 文件干净生成比较通过。原 P2 routing 测试改读唯一 TS 工厂，断言保持；静态入口单实现 gate 增补八模块。报告 validation/P8e-preference-controls-check.txt。
- 对照：基线 6145dfc，300×30 共 9,000 次 mode/routing/staff/preferences/native change 命令；每步 return、state/mode objects、全量 local/session settings、DOM value/check/disabled/class/label/text/marker/listener 与 command effects 一致。原实现只从 Git 抽到 ignored .cache，不在生产或长期测试保持双实现；结果 validation/P8e-preference-controls-parity.txt。
- 浏览器：1,003/1,003，26 页；default/no-op 各 preference 39、playback 127、practice 53、input 40、display 30、loader 28、native controls 39、render 19、audio 23、metronome 28、library UI 44、settings 11，MIDI 20/21。真实 OSMD、radio/checkbox/select/file、native frame/timer、设置 FileReader/reload、曲库交互全部通过。新 fixture 仅 memory prefs/random native DB，结束删除；修改同 origin preferences 的旧 fixtures 串行关闭，render 前台等到终态，所有自建标签已关闭。
- 验证修正：MIDI 权限失败时 channel lists 未填充，native value='1' 会 sanitize 为空；测试用既有 production MIDI UI 方法填 options，生产行为未改。settings fixture 原未把 led=off 传入 reload，现传播并新增 actual port 断言，每配置由10增11。错误 loader URL 换成已核实路径、partial render 输出等终态后才计数；既有断言未隐藏/降低。
- 清单：513 global candidates/98 classic slots、重复函数零；97 direct AppState writes，迁出 state aliases/资源所有权已补文档。设置 key/v1 backup/DB schema、vendor/helper/资源/启动器未改。实体 MIDI、可听音质/同步和 launcher 的最终门槛仍归 P9，静音/模拟结果不替代硬件结论。
- 回退：revert 本检查点恢复完整 core blocks/slots 与旧声明，已稳定 native/loader/library 子步骤保留；无需清库或重置偏好。下一入口：键盘呈现与 pointer/touch 输入资源、OSMD staff identity/score UI/seek adapter，然后完成真实源码模块、单 bundle、显式生命周期与测试 facade。

## P8f：键盘、谱表身份、谱面定位与 score UI 检查点

- 状态：完成（2026-10-03）；P8 数据流程、曲库与核心 UI 迁移完成，整个目标尚有 P9 imports/bundle/bootstrap/test facade/兼容层收尾与最终验收，保持活跃。
- 映射：core keyboard priority/render → domain/keyboard-state、app/keyboard-controller、render/virtual-keyboard；原 pointer/mouse/touch/audio activation → ui/virtual-keyboard-controls；native click → ui/score-seek-controls + app/score-seek-controller；loaded score/status → app/score-ui-controller + ui/score-status。compatibility/keyboard-and-score-controls 仅组装；新增九个 modules/slots，core 从646减至55行，只保留原启动顺序。
- OSMD：staff identity map/大小写 aliases/global staff顺序/Number fallback 归 adapter 私有；真正 iterator provider、graphic/staff/tempo 数值观察也在 adapter。domain/UI/controller 无 raw OSMD/private graph；原 LED 的三个 staff Window forwards 暂留。旧 dead resume flag/visibility callback、inline visual helper、无消费者的 format/bind/cursor forwards 和对应 ambient declarations 删除。
- 行为：expected/future/pressed priority 与 ties、sustain→pending 覆盖、depth=0 frame collect、held carry/expired held、display merged map 与 hardware base cache 身份/changed-only、normal first recognized class/calibration eight classes 保持。keyup/global blur marker、late unlock/ordinary rebuild、actual repeat seek/inclusive first box/Loop guards、tempo二次读取/loaded UI/reset percentage 原顺序保持，详见 P8_DATA_CONTRACT。
- 生命周期：factories cold；keyboard 激活12+88×10=892 listeners、seek1。普通 rebuild 保留 detached handlers 与 pending old-key attack（owned1772/connected892），只 explicit dispose 移除全部自己资源/capture/key DOM、释放自己 active MIDI并失效旧 unlock continuation。外部 pressed notes 保留，重复 init/dispose/fresh lifetime 已测。普通 Pause 不扩张资源取消规则。
- Node：297/297（新增15组 keyboard/controller/DOM/input/staff/seek/score UI/async lifetime）；strict typecheck与208文件干净产物比较通过，static entry唯一实现/模块槽位 gate 保留。完整输出见 validation/P8f-keyboard-check.txt。
- 对照：cff8434，5,000 display/preview/hardware +3,000 native pointer/mouse/touch/unlock/rebuild +3,000 seek guards/real repeat iterator命令，每步state、DOMclasses/datasets/styles、资源数与effects完全一致；另12 staff aliases/coercions。旧实现只由 Git 抽到 ignored .cache/keyboard-and-score-parity.cjs，不作为第二套生产/长期算法。结果 validation/P8f-keyboard-parity.txt。
- 浏览器：30页、1,138/1,138；default/no-op各 keyboard36、playback127、practice53、input40、display30、render19、loader28、native39、preferences39、libraryUI44、audio23、metronome28、settings11，traversal30/33、MIDI20/21。实际 Touch/Pointer/Mouse、OSMD repeat/两instrument staff、原生 rAF/timers/音频节点、resources disposal均通过；同origin偏好页串行关闭，memory fixtures结束删除自己的随机DB，全部自建标签关闭。报告 validation/P8f-keyboard-browser.txt。
- 测试修正：刚 load 的 pending right 同音按原顺序覆盖 sustained left；新fixture原假设独立，现增加覆盖断言，再清pending验证独立sustain/future/held。生产算法无改动，原断言保留。静音/模拟测试不证明实体MIDI/可听质量与同步；启动器/静态最终门槛留P9。
- 清单：511 global candidates/107 classic slots、重复函数零；90 direct AppState writes，新增private resources/narrow state aliases已记录。vendor/helper、schema/backup/settings keys、资源与启动器不变。
- 回退：revert本检查点恢复完整core keyboard/seek/UI blocks/slots与旧staff map，之前P8子步骤保留；不清库/改偏好。下一入口：迁移debug/settings file commands剩余生命周期，参数化legacy LED，然后真实imports/单bundle/bootstrap/窄test facade与最终验收。

## P9a：设置文件与调试 UI 生命周期准备

- 状态：准备子步骤完成（2026-10-03）；P9整体仍进行中，源码imports/single bundle/bootstrap/optional LED参数化/test facade/严格配置/最终验收尚未完成，完整目标活跃。
- 映射：最后核心feedback-debug.js→ui/feedback-debug、score/osmd-debug-observation、compatibility/feedback-debug；旧file/slot删除。原P2 settings-controls的global commands→PianoTrainerSettingsFiles cold factory、compatibility/settings-files在原位置init。controls-dom slot前移且唯一，空legacy-traversal及迁移后ambient declarations删除。
- 行为：settings payload/JSON/date filename/MIME/DOM click-remove/revoke、read parse/import/原警告与alert/reload、ordinary silent read error/abort保持。debug flags、两次startup读pref、seq/history/filter/trim、SVG ring/label/attributes、event/anchor/toggle/heartbeat logs与原一致；vendor观察与UI分开，不迁入生产matching/geometry算法。
- 生命周期：settings explicit dispose abort own pending readers/remove callbacks/gate captured old onload，已完成reader/外部reader保留；只dispose清ordinary失败download残留的own links/URLs。debug持有一个native checkbox/marker、4000ms interval、own SVG groups；重复init无第二套、dispose释放onlyown且generation防旧callback复活，external同名group/marker/interval保留。原无消费者Window.__ptDebugHeartbeat删除，private clock仍原cadence。
- 验证：307/307 Node（新增10组commands/async/dispose/DOM/history/vendor用例）；strict typecheck与216文件clean build一致。static gate检查旧debug file不存在/new slots唯一。报告validation/P9a-ui-lifetime-check.txt。
- 对照：基线1ee9834，2,500 debug/native checkbox/heartbeat/history/SVG commands+500 settings export/import/error/dialog commands，所有return/state/SVG attrs/text/native bindings/log/effects逐步一致；64 vendor snapshots完全一致。仅ignored .cache/settings-debug-parity.cjs从Git抽旧实现，结果P9a-ui-lifetime-parity.txt。
- 浏览器：14页568/568，default/no-op各settings-debug20、render19、preferences39、settings11、input40、playback127、loader28。新页真实FileReader abort→DONE/callback null、captured old read无import/alert/reload、fresh read、native SVG/history/reload/own resources/external layer保留；原settings成功FileReader/reload往返未替换。所有自建标签关闭，memory偏好/random DB结束仅删除自己数据。报告P9a-ui-lifetime-browser.txt；实体硬件/可听质量/launcher最终门槛仍未验证。
- 清单：514 global candidates/110 classic slots、重复函数零；77 direct AppState writes。附带清除P8f browser report末尾多余空行。vendor/helper、settings/schema/backup/user data/resource/launcher不变。
- 回退：revert本准备检查点恢复完整debug/原settings global commands与slots；之前P8保持，无数据迁移。下一入口：player-range/connection/update/header显式factories、parameterized optional legacy LED，模块imports/bootstrap/bundle与窄测试入口。

## P9b：键域、连接状态与更新控件生命周期准备

- 状态：准备子步骤完成（2026-10-03）；P9整体仍进行中，parameterized optional LED/真实imports/bootstrap/bundle/test facade/最终严格与运行验收尚未完成，完整目标活跃。
- 映射：player-range-controls变typed UI factory；connection-status变无资源readonly factory；update-controls→domain/version +app/update-controller +native UI，两个compatibility只组装actual consumers，controls-dom唯一slot前移。旧helper globals不再转发，remaining核心业务均TS；header version bootstrap与legacy LED仍需最终entry契约。
- 行为：range normalize/filter/held Map identity/output order/preview reset/save-rerender选项、status label/coercion/native selected port、loose semver/manifest unknown/string fallback/error/status、URL appv/t/hash/override cleanup/local download vs remote reload原样保持。
- 关键startup：LED setLedOutputMode/setWledIp再次调用initUpdateControls，原本每次读saved config/clear status/check updates。仍保持所有普通checks及并发completion order，不能整个init早退；仅native button listener/marker去重。player init也仍原read/prune/sync顺序。
- 生命周期：range owns一个select listener/marker；update UI owns一个button listener/marker；generation防captured old listeners复活。update controllerowns pending AbortControllers，explicit dispose只abort own requests，fetch/JSON await与catch/finally后的旧commit/UI/reload均失效；已完成/外部controller保留。UI dispose不自动cancel普通request，最终bootstrap分别dispose两个owners。
- 验证：315/315 Node（新增8组prune/DOM/port/read/并发/dispose/JSON/URL/button用例）；strict typecheck与224文件clean build一致，static slot唯一gate保留，P3原device-ui assertions只改typed factory harness无降低。报告P9b-device-controls-check.txt。
- 对照：基线d1480fb，1,000 range/state/DOM/storage/optional-output +400 connection status/labels/visibility +600 update JSON/error/local/remote/URL/storage/UI commands，每步return/state/full DOM/storage/write effect order/request URL/cache一致。仅ignored .cache/device-controls-parity.cjs Git临时抽取旧函数，结果P9b-device-controls-parity.txt。
- 浏览器：16页632/632，default/no-op各new device19、preference39、MIDI20/21、input40、playback127、settings11、loader28，traversal30/33。实际native select/keyboard/Map/states、version.json/native fetch/signal.abort、old finally不写UI、freshchecks/resources归零、WLED connection labels均通过。新页memory prefs/random DB结束只删自己库，同origin旧页串行关闭，全部自建标签关闭。报告P9b-device-controls-browser.txt；静音/模拟不能证明实体MIDI/可听同步，launcher最终门槛待P9。
- 测试修正：VM async跨realm的response/JSON microtasks须等到controlled phase确实开始；用setImmediate确认JSON正在await、第二请求完整完成后才完成第一请求，保留普通completion order断言。parity新增storage writes统一计数，排除只由new harness添加的save-range diagnostic marker；实际storage操作顺序仍逐项比较，生产行为无改动。
- 清单：505 candidates/114 classic slots、重复函数零；53 direct AppState writes。vendor/helper、prefs/schema/backup/data、资源/启动器未改。
- 回退：revert本检查点恢复三个原global modules与slots；之前P8/P9a保留，无数据迁移。下一入口：明确并参数化legacy LED/MIDI LED factory contract，再统一源码imports/bundle/bootstrap与窄test facade。

## P9c：参数化 optional legacy LED 启动契约

- 状态：准备子步骤完成（2026-10-03）；P9 imports/single bundle/bootstrap/test facade/最终严格配置与启动验收仍待完成，完整目标活跃。
- 两份保留JS只发布`Window.PianoTrainerLegacyLed.create` / `PianoTrainerLegacyMidiLedTest.create`。应用state/命令/storage/native DOM/fetch/resources由typed ports传入；校准、传输与扫灯实例私有。classic compatibility在原slot显式创建，后续bootstrap直接接管。native资源与async generation契约见`P9_LED_CONTRACT.md`。
- 原adapter调用不存在的`stopHealthChecks()`，现使用实际`stopHealthCheck()`；真实optional dispose已验证。重复dispose去重，旧rAF在fresh start不会创建第二循环。无消费者的三个staff Window forwards、原LED/MIDI-test ambient commands与清空的legacy-midi/practice声明文件删除；硬件无需OSMD/staff对象。
- 验证：326/326 Node（新增10组retained JS/接口/资源/async、1组旧rAF重入），strict typecheck/232文件干净build一致，static entry验证唯一factory slots与旧forwards缺失。`validation/P9c-legacy-led-check.txt`。
- 对照：b77d935，3,000普通LED commands逐步state/DOM/storage/effect/frame/MIDI/下载一致；10 HTTP/helper成功/失败/JSON/fallback routes、2完整/取消MIDI sweeps一致。旧源码仅临时Git抽到ignored .cache；`P9c-legacy-led-parity.txt`。
- 浏览器：28页991/991。default/no-op：新LED19/6、traversal30/33、MIDI20/21；practice53/input40/playback127/preferences39/device19/keyboard36/render19/native39/settings11/loader28/debug20各两配置。真实FileReader abort/fresh read、local native fetch/AbortSignal、长按计时器、dispose/reinit及无迟到请求均通过。全部自建标签关闭，内存偏好/随机DB结束只删除自己数据；`P9c-legacy-led-browser.txt`。不证明实体WLED/MIDI/可听同步。
- 新fixture误读不存在的AppState.osmd，改为adapter measure count；sweep对照改为创建时callback读取同一个range对象，保留全部行为断言。native资源统计分别记录listeners与markers。最终报告只记录成功的唯一页面。
- 清单：117 classic slots、453 candidates、重复函数零、53 direct writes（LED为闭包内注入state alias）。vendor/helper、存储/DB/备份、音色/WASM/启动器不变；经典组成尚非最终模块化。
- 回退：revert本检查点恢复原LED scripts/ambient/slots，之前P8/P9a/P9b保留，不清用户数据。下一入口：真实imports/exports、唯一typed bootstrap与单bundle、有限test entry；最终严格配置/clean install/原启动器验收。

## P9d：显式状态分配与偏好启动命令

- 状态：准备检查点完成（2026-10-03）；P9 整体进行中，尚未切换 imports/bundle/bootstrap/test facade。
- `state/app-state` 分离 fresh state factory 与显式 metadata read；`state/preferences` 将原顶层 seed/read/forced writes 移入 init，notice 属于实例；`settings-backup` 注入 storage/time/notice commands；`player-range` 缓存属于注入的应用 state。纯 normalizers 移到 `domain/preference-values`，MIDI UI 显式接收 document/storage/keys/normalizers/persistence ports。
- 四个临时 compatibility slot 在原位置创建实例/调用 init，保留 metadata→seed→channels/flags→backup/range 的顺序、原 key/coercion/默认值/备份格式及 Map/Set 身份。模块加载不读取 Window/storage、不创建应用实例；dispose 只取消自身 notice/init 标记，不写存储。仅显式 init 在同生命周期去重。
- 331/331 Node：新增五组 cold import/creation、实例与缓存隔离、精确 startup write order、init/dispose、private notice/import skip 和 metadata precedence；原测试改用显式 commands，断言未降低。strict typecheck 与 242 个生成文件 byte comparison 通过，报告 `validation/P9d-cold-state-check.txt`。
- 浏览器 20 页 763/763：default/no-op 各 settings11/preferences39/MIDI20或21/traversal30或33/LED19或6/playback127/loader28/render19/input40/practice53。实际 FileReader/重新加载、持久化、native DOM/MIDI/OSMD、三模式两布局均通过；所有自建标签关闭。报告 `validation/P9d-cold-state-browser.txt`。实体硬件、可听同步、最终 launcher 验收仍未验证。
- 清单：122 classic slots、439 lexical candidates、重复函数零；53 direct state writes。vendor/helper、设置/DB/schema/备份、资源路径与启动器不变。回退此检查点恢复原 state startup/slots，无数据迁移。下一步直接完成源码 imports/exports、统一显式 bootstrap 和单 bundle，再迁移测试入口。

## P9e：真实模块、单 bundle 与统一应用生命周期

- 状态：模块入口检查点完成（2026-10-04）；P9 整体仍进行中。原浏览器全集尚未迁移到 facade，剩余严格配置、干净安装/静态部署/启动器验收待完成。
- 映射：94 个核心 TS 文件改为实际 imports/exports；domain 共享模型归 `domain/model.ts`，状态模型归 `state/model.ts`。29 个 compatibility、trainer-core、旧生成槽位及七个无消费者 ambient 文件删除。唯一组装为 `app/services.ts`，`bootstrap.ts` 提供 init/dispose/loadScore/dispatchInput，`main.ts` 启动并在 pagehide 销毁。
- 构建：固定 esbuild 0.28.2 与 TypeScript 5.9.3，ESNext/Bundler 严格检查后在内存打包；生产 app.js/map、独立 test-app.js/map 共四文件，失败保留上次输出。CommonJS 服务器/helper、原 vendor、资源、settings/DB/schema/backup 与启动器保持。完整文件树/字节/Git 跟踪检查防止陈旧或额外产物。
- 生命周期：显式分配 fresh state，原 preferences→UI→OSMD→core 初始化顺序保持。重复 init 去重，dispose 永久结束该实例，新应用通过 factory 重新创建；first-run timer、监听、转换/读取/更新/播放/音频/MIDI/LED 等均有所有者。loader 的晚到 canonical/vendor/library continuation 失效；延音服务释放原 activeTimeouts 列表之外的自己 native timers，普通 Pause/Reset 规则保持。
- 类型与测试：生产不发布业务 Window 对象；测试入口只给窄命令和复制快照，不返回完整 state/vendor。Node harness 加载实际 CommonJS 模块与依赖，不剥离 imports；335/335（新增三组 loader dispose/新实例和一组 sustain timer 代际隔离）。source-map 验证 timing 原表达式映射。报告 `validation/P9e-module-bootstrap-check.txt`。
- 浏览器：模块入口 default/no-op 各 37/37，共 74，真实 XML/OSMD、三模式×两布局、输入/暂停、快照隔离、重复启动/销毁、全部 native listeners/timeouts/intervals/rAF 归零及新实例。报告 `validation/P9e-module-bootstrap-browser.txt`；自建标签关闭，memory prefs/random DB 结束只删除自己库。
- 验证边界：这 74 项不替代原全量行为矩阵。既有浏览器页面与原断言保留，但仍使用已删除全局，下一步逐页迁移窄 facade 后全量执行。最终 noUncheckedIndexedAccess/exactOptionalPropertyTypes 与 launcher 尚未验证；实体 MIDI/WLED、可听同步及 Mac 不能由当前环境模拟结果证明。
- 清单：三个静态应用槽位、四个运行时候选、94 ES 模块、重复函数零；52 direct state writes，别名资源见 STATE_OWNERSHIP。历史经典开发文档独立保留，当前 DEVELOPMENT/ARCHITECTURE 已更新。
- 回退：revert 本检查点恢复 `7fe81d0` 的经典入口与工具链；不清库或改用户数据。下一步完成原浏览器 facade 迁移、全量回归和最终门槛。仅本地 Git 提交，不推送。

## P9f：练习、输入、共享遍历与谱面浏览器 facade

- 状态：五个原套件迁移检查点完成（2026-10-04）；P9 全量目标保持活跃，剩余调度/音频/MIDI/数据/UI suites 与最终严格/启动门槛未完成。
- 映射：practice/input/traversal/render/score-display 原 Window/词法 globals → `testing/practice-checks.ts`、`render-checks.ts` 明确场景命令与复制观察。实际服务/算法只在生产模块中；测试 facade 没有 AppState/vendor 对象，原生键盘事件、OSMD 实际反复与几何 golden 均保持。
- 身份验证：跨 staff note IDs、feedback marker 转移 token、iterator/expectation/ref identity、immutable refs/source resolution 在私有捕获中观察，不返回引用。snapshot 复制期望、锚点、预留/延音/越界数据；facade dispose/recreate 清空捕获。adapter 增加只读 system count，vendor 仅补最小 MusicPages 数量边界。
- Fixture：共用 `module-test-frame.js` 加载原 HTML/vendors 与测试 bundle，注入 LED 选项、内存偏好/随机 IndexedDB；无用户数据迁移/清除。通过终态延后到 dispose 与 DB cleanup 完成。原 display 确定性 rAF 与 render 前台原生 rAF 分别保留，最终取消自己 frames。
- 浏览器：12 页 421/421，default/no-op 各 practice53/input40/render19/display30/bootstrap37，traversal30/33。涵盖三模式×两布局、错误/部分/完整和弦、misses、tie/隐藏/cue、early carry、25键域、真反复/结尾、逐音符 SVG golden、identity/重排、48/240小节与390px滚动；自建标签均关闭。`validation/P9f-practice-render-facade-browser.txt`。
- 验证：生产/测试类型检查、四文件 clean bundle comparison 与 335/335 Node 通过；`validation/P9f-practice-render-facade-check.txt`。原断言数量一致；no-op 无 health/reconnect 检查改观察资源所有者 timers/intervals 均零，比单独两个私有 timer 字段覆盖更完整。
- 未验证：其余原浏览器套件仍引用已删全局；当前 421 项不代表全量完成。noUncheckedIndexedAccess/exactOptionalPropertyTypes 预检已定位诊断，下一检查点处理；launcher/clean install/static gates 待完成，实体硬件/可听/Mac 依旧未验证。
- 回退：revert 本测试迁移检查点恢复 P9e facade/测试文件；无需清库或改设置。下一步迁移剩余 suites 并完成严格配置。只有本地提交。

## P9g：最终严格配置与显式类型导入

- 状态：严格模块检查点完成（2026-10-04）；P9 其余 suites/clean install/static/launcher 门槛尚未完成，完整目标活跃。
- 配置：生产及独立测试入口统一 strict/noUncheckedIndexedAccess/exactOptionalPropertyTypes/verbatimModuleSyntax。144 个纯类型导入名、68 文件依据 TypeScript 实际 emit 明确为 `import type`，无核心检查豁免或 any。
- 索引与可选字段：局部 dense/nonempty/bounds 不变量明确，原 sparse/vendor/malformed source 错误保留。MIDI 短消息在解码前仍 prune echo，缺失/非法 bytes 仍拒绝；ZIP 原缺字节 bitwise→0 和非法 pitch→NaN 显式表达。timing 显式 undefined 默认语义与 listener record 的 options 字段准确建模。详见 `STRICT_MODULE_CONTRACT.md`，没有修改匹配/几何/时序算法。
- 类型导入验证：在严格输入修正后的同一源码上比较类型导入转换前/后，生产与测试运行时 JS 均 byte-identical，只有 map 内容随 TS 变更；`validation/P9g-type-import-runtime.txt`。未将此结论泛化为所有严格修正代码字节相同。
- Node：335/335，现有 MIDI cases 增加 holes/undefined/NaN 与短系统消息 expiry，timing 原显式 undefined/NaN 和 ZIP fallback/error 断言保留。四文件 clean bundle comparison 和两套类型检查通过，`validation/P9g-strict-modules-check.txt`。
- 浏览器：12 页 421/421，default/no-op 各 practice53/input40/render19/display30/bootstrap37、traversal30/33。既有几何 golden、三模式×两布局、early reservation/错音/tie、真实反复、原生 scroll/full disposal 再次通过，所有自建标签关闭；`validation/P9g-strict-modules-browser.txt`。
- 清单：94 ES modules、三个应用 slots、四个 runtime candidates、重复函数零、52 direct state writes；库存行号重建。原 vendor/LED JS 为明确类型化边界，资源/prefs/DB/schema/backup/启动器不变。
- 未验证与下一步：剩余 playback/MIDI/audio/metronome/数据/UI 浏览器 facade 仍待迁移；clean install/静态部署/原 launcher 门槛待完成。实体硬件/可听与 Mac 环境不可由模拟证明。回退本检查点恢复上一严格配置与源码，不清数据；继续剩余套件，仅本地提交。

## P9h：干净安装、失败构建恢复与原 Windows 启动器

- 状态：运行工具链检查点完成（2026-10-04）；P9 剩余浏览器 facade 全集仍未完成，完整目标活跃。
- 干净来源：`git archive 1838069` 解压到 ignored `.cache/p9h-clean-source`，无 .git/node_modules/内层 .cache；固定开发包由已验证缓存 `npm ci --offline --cache .../.cache/npm` 安装（3 packages，0 vulnerabilities）。原四份静态产物 clean comparison 通过。
- 实际问题：原 unit preparer 在首次 checkout 对不存在的 .cache 调用 realpath，ENOENT。现安全创建 cache，校验绝对/实际目标及顶层/嵌套链接后替换输出。fresh checkout/stale output 回归新增一个 Node case；fixture 在工作区独立空目录运行，避免本环境 native bundler 对系统 Temp 父目录的限制。
- Candidate 验证：该 Git archive 只应用本检查点的 preparer fix、新回归 case 和 build:watch alias；`npm run check` 336/336、两套严格类型和四文件产物一致，`validation/P9h-clean-check.txt`。当前工作区同命令 336/336，`validation/P9h-workspace-check.txt`。生产业务与 bundle 未修改。
- Build/watch：真实 regular build 类型错误 exit1，四产物 hashes 保持；真实 native --watch 发现错误仍保持旧产物，合法编辑更新两份内嵌 map，恢复源码四 hashes 完全一致。5 项，`validation/P9h-build-watch.txt`。watcher 已终止，临时错误源码已恢复。
- Windows：原 Desktop BAT 在独立8084直接启动，日志确认服务该源码包；生产页面原 Scores 控件列出16个 starter scores、加载 Hot Cross Buns/Loaded badge、真实OSMD一个SVG。原 Wi-Fi BAT 在8085直接绑定0.0.0.0，app/connection-info HTTP200及URLs正确。所有自建 Browser 标签与这两棵启动器进程已关闭；未中断原8081验证服务或其他用户进程。报告 `P9h-desktop-production-browser.txt`、`P9h-wifi-launcher.txt`。
- 静态：20 个真实资源请求含 icons/style、两个optional factory、prod app/map/version、Tone/OSMD、starter JSON、mp3/ogg及webmscore JS/WASM/data，均HTTP200；原生产map不含测试源码/入口。`validation/P9h-static-resources.txt`。没有上线/推送或改服务/launcher/schema/prefs，正常生产启动的曲库行为保持。
- Mac：原四个 .command 在 Git Bash `-n` 语法检查通过，`validation/P9h-mac-launcher-syntax.txt`；Windows 环境不能证明 macOS `open`/平台执行。LAN客户端、实体MIDI/WLED/可听同步未验证，明确保留手工限制。
- 回退：revert 本工具链检查点恢复原 preparer/命令，生产 bundle 不受影响。下一步继续剩余 playback/MIDI/audio/metronome/数据/UI browser facade，保留全部原断言。只作本地 Git 提交。

## P9i：真实播放调度与受控端口 facade

- 状态：原 playback suite 迁移检查点完成（2026-10-04）；P9 尚有 MIDI/audio/metronome/数据/UI suites 未迁移，完整目标活跃。
- 映射：旧 Window factory monkeypatch、playback-clock-fixture.js 与全局状态访问 → `testing/playback-checks.ts` 的私有 controlled clock/count-in + façade commands/复制观察。旧 fixture 删除；共用 test frame 仅在独立入口传 controlledPlayback flag，生产不存在测试选项/API。
- 组成端口：`app/services.ts` 接收可选类型化 playbackClock/ensurePlaybackReady，未传时仍使用原 Tone/performance/native timer/rAF/audio ready。没有新调度器/tempo算法；测试提供控制时间和 muted readiness，真实 coordinator/OSMD/DOM/input/Transport 仍为同一生产实例。
- 观察：private timers/frames/count-in callback 不返回到 Window。fire/finish/clear/setTime/readClock 命令保留原 clock order/due/epoch，快照复制 delays/counts 与原 service owned resources。换 Sheet 通过 adapter revision（真实 Sheet identity 变化时更新）及 fileName 观察，不返回 vendor Sheet。
- 行为：原 127 项每配置全部保留，新增一个 final disposal 检查，default/no-op 各128。三模式×双布局、首次 count-in、错音/命中/misses、10/500/333/1000÷3 等原等待值、BPM变化、Pause残留callback gating、resume/rapid PlayPause、Reset/Loop/count-in、真实反复与一/二结尾28 events、song end/换谱均通过。
- 浏览器：14 页677/677，playback128/practice53/input40/render19/display30/bootstrap37各default/no-op，traversal30/33；几何golden/原生scroll及普通native应用销毁归零复跑。通过终态在完整dispose/随机DB cleanup之后发布，所有自建标签关闭。`validation/P9i-playback-facade-browser.txt`。
- 静态/Node：两套最终严格配置、四文件 clean comparison、336/336 Node；生产 test API/配置与test source map隔离gate保持，`validation/P9i-playback-facade-check.txt`。94 ES modules、3slots、4runtime candidates、52 direct writes，inventory已更新。原生产启动器/vendor/resources/DB/settings/backup不改。
- 下一步：剩余 native fixture 对单bundle的资源归属需要用实际 source map/显式注入适配，不能删除资源断言。继续 MIDI/audio/metronome/loader/library/transpose及UI suites；当前677项不替代全量。Mac实际/实体硬件/可听/LAN客户端限制保持。回退本检查点恢复P9h组成端口与测试文件，不清数据，只有本地提交。

## P9j：原生 MIDI 协议与设备控件 facade

- 状态：MIDI suite 迁移检查点完成（2026-10-04）；P9 audio/metronome/数据/UI suites 尚未完成，完整目标活跃。
- 映射：原 MIDI globals/AppState → `testing/midi-checks.ts` 的服务/控件生命周期、输出与复制通道观察；实际输入通过 native MIDI fixture 和原生 select change，练习快照只返回复制后的来源/通道/力度信息。fixture 不修改模块工厂，也不返回应用内部状态。
- 行为：原 default20/no-op21 全部保留，覆盖 raw messages/零力度/通道/回声/device switching/监听释放/重新初始化/缺失 LED DOM。原 cleanup 对 MIDI 释放命令的参数形状错误已改为实际输入清理命令，最终完整 dispose/随机库 cleanup 后发布终态。
- 浏览器：受影响 MIDI/bootstrap/input/playback 两种配置共8页451/451；此前其余已迁移套件结果保持，累计16页718项。`validation/P9j-midi-facade-browser.txt`，自建标签均关闭。
- 静态/Node：生产与测试最终严格配置、四文件 clean comparison、336/336 Node；`validation/P9j-midi-facade-check.txt`。只新增测试命令与构建后的 test bundle，生产 bundle/vendor/数据结构/设置/资源/启动器不改。
- 下一步：audio/metronome fixture 改为显式 Tone port 注入，保留实际节点、资源加载和原生计时；之后迁移数据/UI 与资源归属断言。当前718项不替代全量；实体硬件、可听、Mac与LAN客户端限制保持。回退本检查点恢复P9i测试入口/页面，无需清库，只有本地提交。

## P9k：真实 Tone 音频与原生节拍器 facade

- 状态：audio/metronome 原套件迁移检查点完成（2026-10-04）；P9 数据/UI suites 尚未完成，完整目标活跃。
- 映射：旧 Window audio/metronome factory monkeypatch → ServicePorts.audioTone/metronomeTone 明确类型化 vendor 端口。原 fixture 保留实际 Volume/PolySynth/Sampler/MembraneSynth 与所有原参数、方法、日志；只观察测试端口分配的节点，不暴露业务状态。默认生产继续用原 Tone，未增加时钟/调度算法。
- 测试入口：独立 main 接入 fixture 所有的端口，facade 提供音量/路由/音色/采样与 metronome 场景命令、复制 timing/count-in/resource 观察。共用 frame lateFixtures 在实际 vendor 后、唯一 app slot 前安装，保留原入口顺序。HTML memory preferences/random DB，不写真实设置。
- 音频：每配置原23项保留，实际30个选定格式本地采样请求/解码、真实 context 解锁、Follow/Wait latency profile、UI固定力度/MIDI monitoring boost与输出力度、低延迟选择、40ms MIDI释放、原silence CC序列、decibel/UI和实际节点 dispose/reinit。
- 节拍器：每配置原28项保留，真实 OSMD repeat timing cache、同步首拍/四次250ms原生count-in及1000ms handoff、Wait stop/Follow immediate、Ch10 note75 velocity59/80ms release、Pause/Dispose gating与pulse清除；三模式真实coordinator+muted piano/click节点的原time-offset/handoff容差和NATIVE_SYNC记录保持。
- 浏览器：audio/metronome/bootstrap/playback/MIDI/input两种配置共12页553/553；已迁移范围累计20页820项。`validation/P9k-audio-metronome-facade-browser.txt`，通过终态在dispose与自己的DB cleanup之后发布，自建标签全关闭。
- 验证：生产与测试最终严格类型、四文件clean comparison、336/336 Node；`validation/P9k-audio-metronome-facade-check.txt`。库存仍94 production ES modules/3slots/4runtime candidates/52 direct state writes。原vendor/资源/版本/DB schema/备份/设置/启动器不改。
- 边界：静音测试证明实际context/节点/时钟计算与资源加载，实体音响可听质量/硬件延迟、MIDI/WLED、Mac/LAN客户端仍需手工验证。数据/UI剩余全局测试不能由820项替代。
- 回退：revert本检查点恢复P9j测试入口与组成端口，用户数据无需改动。下一步数据loader/library/transpose和UI资源归属迁移；只有本地Git提交，不推送。

## P9l：原生乐谱加载、转换与移调 facade

- 状态：loader/transpose 原套件迁移检查点完成（2026-10-04）；P9 曲库/UI suites 尚未完成，完整目标活跃。
- 映射：原词法 loader/converter/TransposeUI/TransposeEngine 与 AppState/OSMD访问 → testing/score-checks.ts 的明确命令和复制元数据。原 XML transform 结果 structuredClone 后返回，避免泄露 module preset 引用；first pitch 读真实 adapter领域数据，状态/原数据 identity 私有捕获只返布尔。
- 加载计数：原测试 monkeypatch Window.loadScoreIntoApp → 私有 actual osmdAdapter.load 观察，所有 Apply/Reset仍实际load且原1/2/3调用数保持；dispose/recreate 恢复方法、清除捕获。生产源码与 bundle 不改，不增加替代加载实现。
- Loader：每配置原28项全部保留，真实 FileReader text/binary/native file-input、XML/MXL渲染、compressed bytes/canonical original source、transpose/reset/speed保存、invalid XML alert/reject/old metadata保留；实际webmscore MIDI转换、相对WASM HTTP200、soft worker生命周期、explicit dispose一次/fresh worker/final release保持。
- Transpose：每配置原52项，原 e91ca87 XML golden 未修改；native events/key matching error/positive-negative Apply/reset/unchecked signature/source与speed/state identity、重复init单load、dispose无listeners/fresh init均通过。
- 浏览器：loader/transpose/bootstrap/playback/render两种配置共10页528/528；已迁移累计24页980项。validation/P9l-loader-transpose-facade-browser.txt；终态在完整dispose/worker与自己的DB cleanup之后发布，所有自建标签关闭。
- 验证：两套最终严格检查、四文件clean comparison、336/336 Node，validation/P9l-loader-transpose-facade-check.txt。只有test bundle与测试源码/页面变更，vendor/生产逻辑/资源/用户DB/prefs/schema/backup/启动器不变。
- 回退：revert本检查点恢复P9k测试入口/页面，无需清数据；继续曲库事务/备份/UI与资源归属迁移。当前980项不替代全量；实体硬件/可听/Mac/LAN客户端限制保持，只有本地提交。

## P9m：原生曲库事务、schema 与备份 facade

- 状态：原 library suite 迁移检查点完成（2026-10-04）；P9 library-ui/其他UI suites 及最终全量仍未完成，完整目标活跃。
- 映射：Window repository factory/ScoreLibrary/内部 AppState与DB直接访问 → testing/library-checks.ts 的明确 CRUD/backup/starter/transaction 场景命令。主仓库和独立scope仓库均为实际生产create；仅复制返回记录与native schema，WeakMap connection token观察identity，不向Window返回DB/store/request或整个service/state。
- 类型：score-library getIndexedDB端口缩为实际仅使用的open，不改变runtime或DB schema；独立入口声明隔离fixture的最小scoped/storage端口。test factory所有仓库均由facade dispose统一close，cleanup只删fixture自己随机库。原fetch调用包装保留，避免原生函数this调用限制。
- 原断言：每配置38项完整保留，native v1 stores/index/keyPath/nonunique、CRUD trim/sort/defaults/null vs undefined/binary clone、batch requested count/cascade/markOpened、v1备份fresh IDs/folder mapping/every byte、unknown version coercion、malformed backup native rollback、starter真实相对asset/occupied/error/flag、dispose/reinit与pending read无orphaned rejection、实际drawer与loaderawait markOpened。
- 浏览器：library/loader/transpose/bootstrap两种配置共8页310/310，累计26页1056项；validation/P9m-library-facade-browser.txt。全部自建标签关闭，终态在所有owner关闭与自己DB cleanup之后发布。
- 验证：生产/测试最终strict、四文件clean comparison、336/336 Node；validation/P9m-library-facade-check.txt。生产JS保持，仅最小类型端口导致source map更新；vendor/asset/schema/backup格式/用户数据/设置/启动器不改。
- 回退：revert本检查点恢复P9l接口/测试入口，无需清库。下一步UI资源归属用actual bundle source map适配原生fixture，保留listener/timer/frame计数和原assertions；当前1056项不替代全量。实体硬件/可听/Mac/LAN客户端限制保持，只有本地提交。

## P9n：单 bundle 的原生 UI 资源归属与控件 facade

- 状态：原 native-controls suite 迁移检查点完成（2026-10-04）；P9 其余UI suites与最终全量尚未完成，完整目标活跃。
- 归属：旧fixture匹配 /ui/module.js stack → module-source-observer.js 解析实际served test-app.js.map，VLQ/binary search还原source。继续只观察最近UI owner、跳过controls-dom、不把较远异步toolbar调用算给library-list；原native add/remove/rAF/timer/interval APIs和计数不替换。
- Loader：observeSources:true 在fixture前载入map/helper；只嵌入sources/mappings，不嵌入源码，JSON中的小于号转义。没有生产resource hook或固定生成行号。两项meaningful Node将实际数千bundle位置与Node SourceMap逐字段对照，并测试unmapped/invalid段与caller过滤。
- 映射：原 toolbar/display/tempo/audio-level/loop globals/AppState/OSMD → controls-checks.ts 明确命令、复制字段/looper与private score/context identity capture。fullscreen callback return与native scroll保留；isolated late-refresh toolbar同一实际factory/privateowner，dispose统一释放引用。adapter只补最小readonly zoom观察，不返回vendor。
- 浏览器：每配置原39项保留，native panel transitions/outside/picker/intro/navbarposition、实际OSMD/looprange/zoomrender身份、tempo preview/transport/原无上限BPM、volume保存/metro/loop prefs、empty/crossed/stepper/pointerhold320/170ms、fullscreen denialfallback/accessibility/scroll、resize资源、dispose无后续写入/freshlistener counts、captured late refresh gating。两配置native/bootstrap/render/display/playback共10页506/506，累计28页1134项。validation/P9n-native-controls-facade-browser.txt。
- 验证：两套final strict、四文件clean comparison、338/338 Node（新增source map两个case），validation/P9n-native-controls-facade-check.txt。清单仍94 production ES modules/3slots/4runtime candidates/52directwrites。source map与TS对应，所有自建标签关闭与自己库cleanup完成。
- 边界：其余native fixture尚待逐页接入maphelper与narrow facade，不能把旧regex失效造成0计数当成通过；当前1134项不替代全量。vendor/schema/backup/userdata/设置/启动器不变，实体硬件/可听/Mac/LAN客户端限制保持。
- 回退：revert本检查点恢复P9m测试入口、adapter观察和原fixture，无数据迁移。下一步剩余preferences/keyboard/device/debug/settings/library-ui/legacy-led，只有本地提交，不推送。
