# TypeScript 重构最终验收

日期：2026-10-04。P0–P9 已按计划分阶段完成并保存本地 Git 检查点。
最终实现版本为 `8375f79`；随后提交仅更新验收报告与文档。
原基线 `be6d51c` 已包含横向显示与用户已有修改；未覆盖这些修改。

核心为 94 个实际 ES 模块，由 `src/main.ts` → `app/bootstrap.ts` →
`app/services.ts` 创建私有实例，生产仅加载一个 IIFE bundle。
原 `trainer-core`、业务全局、同名 MIDI 覆盖与临时 compatibility 均已移除。
保留原生 DOM、OSMD/Tone/webmscore、静态服务器、启动器与离线资源方式。

## 计划完成情况

| 阶段 | 最终实现与保留契约 | 验证依据 |
| --- | --- | --- |
| P0 | 保存基线、vendor 哈希、全局依赖、原模式与反复行为；合成谱例 | BASELINE、历史阶段报告 |
| P1 | domain/timing，原计算及时间单位；锁定工具链和内嵌源码映射 | Node timing、实际 source-map 行映射、干净构建 |
| P2 | 实例状态、唯一 key 表、偏好规范化和备份；Map/Set 身份保持 | preference/settings；实际两次 iframe reload |
| P3 | 独立键域、共享预览/遍历、参数化 LED/no-op | 两配置的 traversal/input/practice/device/LED |
| P4 | 唯一 MIDI decode/output/service；Tone 适配与独立路由 | MIDI 原始字节、设备 fixture；真实 Tone 节点/采样解码 |
| P5 | OSMD 私有图与 revision NoteRef；geometry/overlays/renderer/viewport | 图形 golden、Wait 重排身份、两布局/长谱、前台原生 rAF |
| P6 | 共用输入、匹配、提前预留、计分与延音；业务不读取具体 DOM/vendor | input/practice；阶段差分契约与 Node 测试 |
| P7 | 一个 coordinator、原模式分支/时钟/count-in/Loop/取消规则 | 三模式×两布局，受控时钟事件序列，真实静音 Tone/native timers |
| P8 | XML/MXL、转换/移调、真实 IndexedDB 与曲库 UI、原生控件 | loader/transpose/library/library-ui、native/preferences/keyboard/settings |
| P9 | 实际 imports/exports、显式 init/dispose、独立窄测试入口、最终 strict、旧槽位删除 | 完整矩阵、干净安装/build/watch、原启动器、静态资源、源代码审计 |

逐文件职责映射和运行命令见 [DEVELOPMENT.md](DEVELOPMENT.md)；完整检查点、
行为差分与回退说明见 [PROGRESS.md](PROGRESS.md)。
所有权与库存见 [STATE_OWNERSHIP.md](STATE_OWNERSHIP.md)、
[GLOBAL_DEPENDENCIES.md](GLOBAL_DEPENDENCIES.md)、GLOBAL_SYMBOLS.json、STATE_WRITES.md。

## 最终执行结果

| 检查 | 结果 | 原始证据 |
| --- | --- | --- |
| 生产与测试 strict | strict/noUncheckedIndexedAccess/exactOptionalPropertyTypes/verbatimModuleSyntax 全通过 | [clean check](validation/FINAL-clean-install-and-check.txt) |
| Node | 338/338，0 失败 | 同上 |
| 浏览器全集 | 21 套件×LED 默认/关闭 = 42 页，1,497/1,497 | [完整矩阵](validation/FINAL-browser-matrix.txt) |
| 干净安装/构建 | Git archive 当前实现，离线 npm ci；四产物字节相同，无工作区依赖 | clean check、[source audit](validation/FINAL-source-audit.txt) |
| build/watch | 类型错误退出 1且四产物保持；真实 watch 检出错误、修复恢复、恢复源码字节相同 | [watch](validation/FINAL-build-watch.txt) |
| 原 Windows 启动器 | Desktop 127.0.0.1、Wi-Fi 0.0.0.0；首页/connection-info 正常 | [启动器与资源](validation/FINAL-static-and-launchers.txt) |
| 生产 UI | 原 Desktop 启动器页面，16 首初始谱，Hot Cross Buns Loaded、一个真实 OSMD SVG | [生产烟测](validation/FINAL-production-smoke.txt) |
| 静态资源 | 20 路径 HTTP 200：应用/map、vendor、两种采样、初始库与 WASM/data | 启动器与资源 |
| Vendor/存储兼容 | vendor 哈希不变；assets/helper/server/launchers/version 不变；IndexedDB v1/备份/prefs 原契约 | source audit、library/settings/loader 矩阵 |
| 唯一实现与隔离 | 94 实际模块、3 应用槽位、4 lexical 边界候选；生产无测试 API/业务 Window 状态 | source audit、static-entry Node 检查、bootstrap 矩阵 |

测试使用内存偏好与随机 IndexedDB；native DB、FileReader、AbortController、DOM/SVG、
音频节点及事件仍执行实际实现。每页在应用销毁、自己数据库清理后发布通过终态。
设置套件真实 reload 两次，两配置均记录 boots=3/pageHides=2/databases=1。
销毁/重新初始化、迟到 read/fetch/loader/unlock/toolbar 回调和资源归零都有原断言；
生产构建不包含这些场景命令。原行为断言未降低，playback 每配置增加一项测试时钟销毁检查。

原显示基线中的受控 rAF 与 native 前台滚动检查分别记录；render 套件实测 visible 状态、
水平移动、33% 收敛和销毁停止。几何与反复使用真实 OSMD，调度用受控时钟比较事件/时长，
另以真实 Tone/native timers 记录静音同步目标，二者结论范围明确。

## 剩余手工验证与已知限制

- 实体 MIDI 的授权、热插拔、真实硬件输出，以及 WLED/helper/calibration 的实体路径未验证。
- 静音采样解码、真实节点与同步目标通过；可听音质、实际设备延迟和节拍同步未验证。
- pointer/mouse/touch 原生事件与触控语义通过；触屏实体设备、实际 macOS、LAN 客户端未验证。四个 Mac launcher 仅通过 Git Bash 语法检查。
- Source maps 的实际位置、内嵌源码和 HTTP 加载已验证；交互式 F12 断点未实测。
- D.C./D.S. 及任意复杂反复仍受原基线能力限制；真实 repeat/第一第二结尾用例通过，不承诺新增能力。
- 原普通 Pause/Reset、延迟 unlock、并发 loader、重复位置恢复和 Realtime 精度限制保留，见各阶段契约；显式最终 dispose 的失效/清理与普通操作区分。
- vendor 内部 load 失败、尚未返回公开 score handle 的 worker 无公开释放接口，限制仍见 P8_DATA_CONTRACT。
- 已验证静态部署资源方式；没有发布站点、推送 Git 或更改版本。推送前另遵照 DEV_NOTES。

这些设备/平台限制按计划第 8 节保留手工清单，未用模拟结果冒充验证。
不需要进一步核心迁移或数据 schema 变更。回退使用对应阶段 Git revert，
无需清除用户设置、备份或数据库；稳定经典入口检查点为 `7fe81d0`。
