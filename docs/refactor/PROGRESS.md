# TypeScript 重构进度

执行日期：2026-10-02。首轮范围：P0、P1，遵照重构计划第 1、11 节。

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

## P2–P9

状态：未开始。本轮不扩展至剩余阶段。

P2 最小后续入口：读取 state 所有调用与动态字段；建立 LegacyAppState、ExpectedContext、
FollowAdvanceInfo、提前预留与 Map/Set 类型；先仅迁移 state 槽位并保持共享对象身份。
随后拆设置读写和备份格式，将下载／confirm／reload 留在 UI；测试首次默认值、强制设置、
`pt_scoreLayout` 恢复、异常数据及模式独立手配置，不修改 IndexedDB schema。
