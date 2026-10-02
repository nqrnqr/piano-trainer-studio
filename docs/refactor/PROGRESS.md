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

## P4–P9

状态：未开始，仍属于完整目标。

下一最小入口：P4a 分离 MIDI 输入／生命周期／输出／控件，保留当前 core 的有效输出行为并收敛三个同名覆盖；随后依序完成音频、渲染、判定、调度、数据/UI 和显式 bootstrap 的终态验收。完整目标仍活跃，P3 完成不代表整个重构完成。
