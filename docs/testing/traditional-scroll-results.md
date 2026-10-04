# 传统五线谱：换行后平缓归位执行记录

执行日期：2026-10-04。前序横向改动已提交为 `b1235dc`；本次传统改动未提交、未推送。

T0–T2 已完成。T3 的真实 OSMD 受控帧集成和受影响回归通过；新纵向策略的原生前台运动验收尚未通过采样条件，详见限制。本文没有把受控帧记录当作原生平滑度证明。

## 实现及参数

保留完整原谱、原 OSMD 换行和分页。按 `ParentMusicSystem` 对象身份缓存系统索引；使用实际 `BorderTop/Bottom` 和整组谱表范围覆盖高低加线、歌词、力度。adapter 输出页内 SVG 坐标，geometry 使用该页 `getScreenCTM()` 转成容器 CSS 内容坐标，包含 zoom、页偏移、边框和滚动偏移。

| 参数 | 最终值 |
| --- | --- |
| 系统顶部阅读带 | 视口高度 25%–35%，中心 30% |
| 上下安全边距 | `clamp(0.04H, 12, 32)` CSS px；上方实测悬浮控件遮挡优先 |
| 迟滞 | 3 CSS px |
| Wait 时长 | 650ms，与设定速度无关 |
| Follow / Realtime | `clamp(0.20 × Tline, 0.40, 1.20)` 秒 |
| 时值/速度估算失败 | 650ms |
| 当前光标不可见的纠正 | 最长 400ms |
| 插值 | 固定起点、目标、开始时间和 D 的 smoothstep |

参数沿用方案初始值。完整系统可见优先于精确落在 30%；第一页、末页和过高系统接受合法边界或当前光标的最小必要纠正。已经安全位于阅读带或其上方时保持位置。没有按音符位置、谱宽或 X 百分比推算时长。

只读时长查询复用独立 performance trace、小节实际时值和播放的四分拍等待计算，逐事件累计同时声部一次。有效 BPM 使用现有 `baseBpm × speedPercent`，其中倍率为 1、2 等；源小节速度沿用播放引擎的读取规则。到离开当前系统、原谱返回或 Loop 上界时停止，不累计后续反复轮次。

`performancePosition.changed` 早于 cursor.update，迭代器也会预取。纵向滚动合并本次同步更新到单次帧中，读取 painted 的 trace 索引和小节；只有正式事件与之匹配才采用其事件身份、原因及 Loop 轮次。Loop 提前 reset/update/scroll 时使用已画出的返回位置。播放协调器和音乐时钟没有改动。

同系统推进不改动画截止时间。新系统从实际 scrollTop 接管；完成后释放 rAF。暂停、跟随关闭、wheel/touch、重排、换谱、页面挂起和销毁取消所有本组件拥有的帧；纵向迟到回调有代际检查。重绘前保存 scrollTop，重建 SVG 后恢复，避免空容器把位置归零；重新检查可见性，并刷新当前反馈锚点。reduced-motion 使用相同目标直接归位。原谱反复、seek/reset、Loop 保留原传统 60%/0 阈值到 10% 的导航分支；横向 33%/90ms 参数及显示实现保留。

## 基线及排版对照

基线 `npm run check`：357/357 通过。四系统双谱表谱例包含 C8/C1 加线、歌词、力度和 90/180 BPM 变化。宽 1100px 的测试 iframe、约 698px 的音乐视口完整容纳前两个系统。源小节号从 0 开始：

| 系统 | 小节 | SVG 顶部 | SVG 底部 |
| --- | --- | ---: | ---: |
| 0 | 0–5 | 150.0 | 377.0 |
| 1 | 6–12 | 430.5 | 666.6 |
| 2 | 13–19 | 656.6 | 911.2 |
| 3 | 20–23 | 961.2 | 1179.7 |

新实现对上述系统数量、小节所属系统和四个上下边界逐一断言相等；100% 缩放恢复后再次对照。OSMD 默认忽略 XML print 换行标记，本测试使用其自然排版，没有更改 vendor 选项强制分行。曲名属于原谱页头，保留原始排版，不用它作为每个系统的滚动目标。

旧滚动通过实际逐事件播放复现：第二系统进入时从 0 滚到约 389.6px，光标顶部落在约 71.4px。基线保存了 415 个原生样本、scrollTo 参数和系统图形数据，见 [基线 JSON](validation/traditional-baseline.json)、[基线截图](validation/traditional-baseline.png) 和 [文本](validation/traditional-baseline.txt)。

## 新轨迹：受控帧、真实 OSMD/DOM

完整矩阵通过 49 项。音乐时钟受控，换行使用实际播放或输入推进；seek 仅用于导航场景。视口 rAF 单独以确定时间驱动。第二系统在进入时已经完整可见，下边界约 680.6px；直到 painted 从第一系统进入第二系统才开始移动，预取到下一系统时 scrollTop 仍为 0。

实测 CSS 容器 clientHeight 为 697px；布局基线设置值约 698px。新目标约 235.4px，浏览器量化后的 scrollTop 为 235.2px，系统顶部约 209.3px，即视口的 30%。完整双谱表与加线仍可见。以下时间为采样帧相对动画开始时间；采样观察发生在该帧写入之前，允许一帧差：

| 毫秒 | scrollTop | 系统顶部 | 系统底部 |
| ---: | ---: | ---: | ---: |
| 16.67 | 0.0 | 444.5 | 680.6 |
| 200.04 | 15.2 | 429.3 | 665.4 |
| 400.08 | 56.8 | 387.7 | 623.8 |
| 600.12 | 112.8 | 331.7 | 567.8 |
| 800.16 | 170.4 | 274.1 | 510.2 |
| 1000.20 | 215.2 | 229.3 | 465.4 |
| 1200.24 | 235.2 | 209.3 | 445.4 |

该段有 96 个关联样本；在约 1183.57ms 时进入目标 1px 内，D 为 1200ms，D 后一帧内精确完成。无超过 1px 的反向移动，无越过目标；之后继续八个事件且等待一秒仍保持位置。静止后帧数停止增长。

| 模式/速度 | 本次系统估计秒数 | D |
| --- | ---: | ---: |
| Realtime 100% | 10.6667 | 1200ms，上限 |
| Realtime 200% | 5.3333 | 1066.67ms |
| Follow 200% | 与 Realtime 200% 相同 | 1066.67ms |
| Wait 50% | 21.3333 | 650ms |
| Wait 200% | 不用于确定动画时长 | 650ms |

该系统在最后一个小节回到 90 BPM，所以估算包含行内两种源速度。行内改为 50% 没有重新启动当前动画。单元还验证弱起、附点/连音时间戳、同时声部、跨行长音、尾事件余量、不同实际时值、非法速度和反复出口。

完整逐帧事件身份、painted/traversal、系统边界、起点、目标、D 和实际位置见 [轨迹 JSON](validation/traditional-controlled-trajectory.json)；断言、时长和原生/模拟全屏观察见 [受控帧记录](validation/traditional-controlled.txt)。

## 执行结果

`npm run build` 生成生产及测试四个产物；`npm run check` 包含双入口类型检查、产物一致性和全部单元测试，最终 **382/382** 通过（原基线 357 项，新增 25 项）。见 [命令输出](validation/traditional-check.txt)。新增策略、几何、时值及帧生命周期测试保留原断言。

| 浏览器页面 | 条件 | 通过数 |
| --- | --- | ---: |
| traditional-scroll | 真实 OSMD，受控 viewport rAF | 49 |
| score-display | LED off，受控渲染/练习 | 30 |
| render-baseline | LED off，实际几何及既有横向原生 rAF | 19 |
| practice-baseline | LED off，双布局三模式 | 53 |
| playback-baseline | LED off，三模式播放/换谱矩阵 | 128 |
| horizontal-unfolded | LED off，原谱反复及 100 轮 Loop | 648 |
| horizontal-interactions | LED off，显示/反馈/取消 | 16 |
| production-lifecycle | 实际 app.js，缓存页事件模拟 | 29 |
| bootstrap-baseline | LED off / 默认 | 各 37 |
| native-controls-baseline | LED off | 39 |

对应回执为 `validation/traditional-regression-*.txt`。完整销毁后观察到 0 listeners、timers、intervals、frames 和数据库连接。传统矩阵覆盖：当前系统已在带内/其上方、Wait 稳定等待、暂停恢复、关闭/开启跟随、wheel/touch、原谱同系统与跨系统反复、Loop/count-in、快速连续换行、整行长音、双谱表高度差、50/100/150% 缩放、重排、130px 高视口、全屏 fallback、反向 seek、布局切换、换谱和 reduced-motion。

## 验证限制与已有问题

- **新纵向策略的原生前台运动尚待复验。** 多次运行中浏览器报告 visible，但原生 rAF 只交付约一秒间隔的少量样本；应用打开浏览器面板的结果是 queued。最新运行明确记录 `NATIVE_UNAVAILABLE`，没有宣称原生运动通过。见 [原生采样限制](validation/traditional-native-unavailable.txt)。旧基线的原生轨迹和现有横向原生检查通过，不能代替新纵向验收。
- resize 使用真实 iframe 尺寸变化，并派发 resize 事件验证原有重排入口；受限环境中自然事件交付较慢。全屏实际验证的是应用 fallback，`native:false, pseudo:true`；原生系统全屏仍需前台环境复验。visibility 取消/恢复及迟到帧在确定性单元中验证，生产 pagehide/pageshow 路径另有回归。
- 当前默认原谱使用单个 SVG 页；多页页偏移、zoom、边框和 CTM 在单元中验证，没有声称运行了原生多 SVG 页跨页场景。
- 新合成传统谱例切入横向时，OSMD 的速度标记渲染报 `hasMetronomeMark`。使用提交 `b1235dc` 的旧 test-app.js 独立复现了同样错误，见 [旧版探测回执](validation/traditional-prior-horizontal.txt)。本次没有改动横向显示来处理该既有谱例限制；布局切换回归使用已支持的原有 repeat fixture。临时旧产物和探测页面已清理。
- 未验证实体 MIDI/WLED、触屏硬件、可听同步和其他操作系统；本次没有修改这些模块。

## 本地复验

在项目根目录执行 `npm run build` 和 `npm run serve`，打开 [主应用](http://127.0.0.1:8080/)。选择传统布局并开启 Auto Scroll，导入 `docs/testing/fixtures/traditional-scroll.musicxml` 后演奏或使用 Realtime。

自动页面：[原生测试页](http://127.0.0.1:8080/docs/testing/traditional-scroll.html?led=off)。保持前台后点击 Run checks。若出现 `NATIVE_UNAVAILABLE`，先确认页面可见且没有被浏览器限制，再重载执行。[受控帧测试页](http://127.0.0.1:8080/docs/testing/traditional-scroll.html?led=off&frames=controlled) 执行确定性完整矩阵；它不能替代原生平滑度验收。成功后点击 Dispose after capture 清理隔离测试资源。
