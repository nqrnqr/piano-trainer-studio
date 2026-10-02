# TypeScript 重构进度

执行日期：2026-10-02。首轮范围：P0、P1，遵照重构计划第 1、11 节。

## P0

- 状态：完成。
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

- 状态：进行中。
- 计划范围：锁定 Node/TS 开发环境；严格 typecheck/build；原样迁移 timing；内嵌 source map；静态生成产物与一致性检查。

## P2–P9

状态：未开始。本轮不扩展至剩余阶段。

P2 最小后续入口：读取 state 所有调用与动态字段；建立 LegacyAppState、ExpectedContext、
FollowAdvanceInfo、提前预留与 Map/Set 类型；先仅迁移 state 槽位并保持共享对象身份。
随后拆设置读写和备份格式，将下载／confirm／reload 留在 UI；测试首次默认值、强制设置、
`pt_scoreLayout` 恢复、异常数据及模式独立手配置，不修改 IndexedDB schema。
