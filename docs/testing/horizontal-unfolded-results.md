# 横向展开乐谱验收结果

日期：2026-10-04。实施起点 `fddd3ac`；工作区交付，未提交、推送或部署。对应 [实施方案](../HORIZONTAL_UNFOLDED_SCORE_PLAN.md) H0–H6 和 [阶段记录](../HORIZONTAL_UNFOLDED_PROGRESS.md)。

横向显示现在按原谱 OSMD 的实际演奏顺序展开有限反复；Loop 使用右侧副本和有限窗口回收。传统布局继续使用原谱，练习、音频和 MIDI 调度继续消费原谱 NoteRef。派生 XML 和 SVG 仅在内存中存在。

## 实现与事件契约

`performance-trace` 使用同一 Sheet 的独立 iterator。真实 vendor 的 `clone()` 未完整复制反复状态，因此精确 seek 从起点重放到 traceStepIndex；预览和小节计时扫描不再重置正在播放的 iterator。扫描超过 100,000 步明确失败。

源音符按小节数组索引、谱表、时间容器、声部条目和音符序号映射；音高、时值仅作一致性校验。显示的不同出现使用 occurrence，正式事件另有 scoreRevision/runId/eventId/loopIteration。缩放、重绘和布局往返不会分配新事件或替换源音符身份。

| 路径 | 正式显示通知时机 |
| --- | --- |
| 新谱 | 原谱 load/render 完成后 navigate(load)，显示准备与最新事件原子提交 |
| Play 首帧／暂停后继续 | 既有 count-in 回调后进入 playbackLoop；同一个位置重复 present 保留 eventId |
| 音符／休止／空条目／谱内反复 | playbackLoop 读取当前源事件后 present，再建立待弹集合；随后 advance 仅预取 |
| Wait／Follow | 当前输入未完成时保持正式事件；命中后沿用原有等待窗口，到下一次 playbackLoop 才通知 |
| Loop | 既有末尾等待完成后 reset 源 iterator；count-in 保持上一事件；restart 时增加轮次并正式 present |
| Reset／Seek／Loop 范围导航 | 明确 navigate，新 run；第二份 A 的点击使用精确 traceStepIndex 和该副本轮次 |
| redraw／resize／zoom／布局切换 | 重投影当前事件、反馈与 debug 历史；准备期间推进时提交最新正式事件 |

转换保留多 part 同步、声部、backup/forward、和弦、休止、歌词及原小节编号，移除已消费的导航；在跳转或块首恢复属性及速度。tie 按同声部相邻攻击和准确时间连接，不能凭后续同音高配对。跨块 slur、渐强、踏板及歌词延长线携带完整有限连接上下文，主图裁切后删除范围外图元。所有块采用统一谱表间距、基线及上下留白，副本 SVG ID 有独立前缀。

## 本轮执行矩阵

命令 `npm run check` 通过：生产／测试严格类型检查、四个生成产物与干净构建一致、357/357 Node 测试。原基线 346 项，本轮新增 11 项，涵盖独立遍历、单事件反复、精确身份、Loop 地址／原点补偿、canonical MXL 和异步加载失效。完整输出：[horizontal-check.txt](validation/horizontal-check.txt)。

22 套核心浏览器测试各执行 LED 默认和关闭配置，共 44 页、1,555 项断言通过；明细和每页计数见 [horizontal-core-matrix.json](validation/horizontal-core-matrix.json)。核心页包括 bootstrap、三模式 playback/practice/input、MIDI/audio/metronome、loader/transpose/library、原生控件、反馈/debug、settings、LED 和实际生产生命周期。

| 新增真实浏览器页 | LED 默认 | LED 关闭 | 验证重点 |
| --- | --- | --- | --- |
| [horizontal-unfolded](horizontal-unfolded.html) | 648 | 648 | 四种路径／结构映射、三模式逐事件、第二遍恢复、100 轮 Loop、SVG ID 与资源界限 |
| [horizontal-notation](horizontal-notation.html) | 21 | 21 | 连接修复、长连接跨块、七种实际 vendor 导航探针 |
| [horizontal-interactions](horizontal-interactions.html) | 16 | 16 | 反馈/debug、快速缩放和布局、全屏、reduced-motion、加载取消及销毁、基线接缝 |
| [horizontal-production](horizontal-production.html) | 75 | 75 | 实际 app.js、原生计时、虚拟键盘、三模式 × 两布局、Loop 和缓存恢复 |
| [horizontal-motion](horizontal-motion.html?led=off) | — | 13 | 前台原生 rAF、有限反复轨迹、Loop 原点变化、手动历史与跟随开关 |

新增 9 页共 1,533 项断言；连同核心矩阵为 53 页、3,088 项。每页完整输出位于 `validation/horizontal-{unfolded,notation,interactions,production}-{default,off}.txt`。motion 的原生轨迹保存在 [horizontal-motion.txt](validation/horizontal-motion.txt)。最后的文件审计汇总由 [horizontal-file-manifest.json](validation/horizontal-file-manifest.json) 给出。

受控时钟测试验证正式事件／待弹集合／计分／源预取／源 NoteRef 不受布局影响；原有音频、MIDI 与调度断言保留。原生生产烟测加载 app.js，未安装测试 facade，通过实际工具栏和虚拟键盘完成每种布局 20 个重复事件，三模式最终计分均为 100%。pagehide persisted/pageshow 的缓存恢复为 native event 模拟；真实浏览器是否命中 bfcache 仍遵循项目已有手工验证限制。

一次并行页面验证中生产烟测的布局输入观察不一致；保留严格顺序和计分对照，增加每布局 OBSERVED 诊断，再串行复跑默认与关闭配置。最终记录是成功的独立复验，不将并行波动解释为实体输入性能结论。

## 谱例与实际导航能力

所有小节路径使用 **0 起点结构索引**，人工路径先写出，再比较实际原谱遍历和显示锚点。

| 谱例／导航 | 人工期望 | 实际 OSMD 1.9.7 | 结果 |
| --- | --- | --- | --- |
| simple-repeat.musicxml | 0,1,0,1,2 | 相同 | 两小节反复及三模式通过 |
| first-second-ending.musicxml | 0,1,2,0,1,3,4 | 相同 | 一房／二房通过 |
| horizontal-single.musicxml | 0,0,1 | 相同 | 单小节单和弦反复通过 |
| horizontal-voices.musicxml | 0,1,0,1,2 | 相同 | 两 part、三个谱表、同音多声部、和弦、装饰音、休止、异常编号通过 |
| 多个反复段 | 0,1,0,1,2,3,2,3 | 相同 | 通过 |
| D.C. al Fine | 0,1,2,0,1 | 相同 | 通过 |
| D.S. al Fine | 0,1,2,3,1,2 | 相同 | 通过 |
| D.C. al Coda | 0,1,2,0,1,3 | 相同 | 通过 |
| 单独 Fine | 0,1,2 | 相同 | 未进入返始过程时不停止，符合该谱例 |
| 嵌套反复 | 0,1,2,1,2,3,0,1,2,1,2,3 | 相同 | 本谱例通过；不泛化为任意嵌套语法 |
| repeat times="3" | 0,1,0,1,0,1,2 | 0,1,0,1,2 | vendor 忽略指定次数；显示忠实于实际演奏，不另写反复解释器 |

导航探针的实际路径逐条写入 notation 输出。未测试的跳转组合不承诺支持。有效 XML/MXL 继续使用原有规范化和移调器；派生模型不写入 rawData、原稿或备份。

`horizontal-connections.musicxml` 为 16 小节双谱表谱例，包含 13 小节 slur、块边界 tie、渐强／踏板／歌词延长、调号／拍号／速度改变、装饰音、C8/C1 加线音。两个块的同音谱表 Y 完全一致，高低音在共同裁切范围内；真实 SVG 截图已人工检查：[horizontal-connections.png](validation/horizontal-connections.png)。

## Loop、资源与真实滚动测量

生产上限：每块 8 个主要小节、最多挂载 7 个 SVG、模板 LRU 最多 16。原谱只有一个演奏引擎；显示 OSMD 串行创建，取出数值几何与 SVG 后立即释放。轮次用数学地址计算，不保存逐轮数组或逐轮 vendor 图。

100 轮短 Loop 共 400 个正式事件逐步验证；后 50 轮启用 count-in，交接前保持上一 eventId。实测最大挂载块 7、模板 2、音符映射 10、SVG 后代 671、模板后代 158；就绪采样的显示实例及让出回调均为 0（准备期间串行实例上限为 1）。原点变化前后的同一音符最大误差约 0.273 CSS px，低于 1 px。资源数量不随轮数增长。

有限谱宽度准备仍需遍历所有有限块；仅缓存 16 个模板，过期或远处模板可重新渲染。长连接所需上下文可能超过 8 小节；这增加单块准备成本，不增加 Loop 轮次缓存。准备在块间让出执行，所有让出计时器归属显示服务，取消／换谱／销毁会清理；同步 vendor render 仍受谱例复杂度影响，未做大型乐团长谱性能承诺。

真实前台 rAF 使用既有 90ms 跟随及 33% 目标；有限反复每事件 200ms 墙钟间隔、Loop 每事件 100ms 间隔，演奏推进使用受控测试时钟，滚动与 rAF 使用原生浏览器。585 CSS px 视口下有限反复逻辑 X／滚动不回退，稳定目标误差小于 1 px；16 轮原生动画采样跨越自动回收，逻辑位置前进。原点重设允许 scrollLeft 减小；主动历史导航后的误差记录不作为自动回收测量。手动重建已回收历史、关闭跟随固定所看窗口、重新开启回到当前 Loop 窗口均通过。

50%／150% 缩放保留事件，第二份 A 点击仍定位 traceStep 8。全屏实测 native=true、pseudo=false；reduced-motion 通过注入媒体偏好验证立即定位策略，未更改操作系统偏好。实际生产 Loop 与原生工具栏截图：[horizontal-production.png](validation/horizontal-production.png)。

## 边界与交付

- 锁定 OSMD 1.9.7、Tone、webmscore、工具链、启动器与静态音色路径未升级；21 个选定资产的 Git checkout 规范化哈希与起点一致，见 [horizontal-locked-assets.txt](validation/horizontal-locked-assets.txt)。
- app.js/app.js.map 与独立测试 bundle/map 已由构建重生成；生产 source map 不含 src/testing，生产 HTML 不加载 facade。
- 快速布局／缩放／换谱、过期 Blob 规范化、最新事件提交、pending render 销毁及页面缓存恢复已测；最终 dispose 无应用监听器、数据库连接或迟到 DOM 提交。
- MIDI/WLED 使用隔离 fixture，Tone 输出静音。实体键盘／LED、可听音频同步、触屏、macOS、LAN 客户端未在本轮验证。
- 指定重复次数的 vendor 限制、任意复杂导航和大谱同步排版成本如上所述。未更改已有曲库格式、用户文件或硬件设置。
