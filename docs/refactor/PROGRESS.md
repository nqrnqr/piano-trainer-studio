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

## P7 后续–P9

P7a 接着迁移 Play/Pause/Reset、playbackLoop/checkWaitModeAdvance 与 Loop 协调，按契约保留现有时钟/取消规则。P7b 再从同一个循环提取模式策略，保留实际 OSMD repeat traversal 与 painted/prefetch 两个位置；P8 数据/UI、P9 显式 bootstrap/module/dispose 尚未开始。当前检查点不代表 P7a 或完整重构完成。
