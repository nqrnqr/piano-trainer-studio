# 英语 / 简体中文切换验收

日期：2026-10-07（语言功能于 2026-10-06 实现，2026-10-07 调整默认语言）。此前已将传统谱进度滚动与位置 / 速度微调提交为
`6cfb7d3 feat: follow traditional scores by musical progress`，再实现语言切换。

## 使用

启动 `npm run serve` 后访问 `http://127.0.0.1:8080/`，在
**设置 → 语言 → 简体中文 / English** 选择语言。
切换即时生效，不需要重新加载曲谱；刷新会保留选择。默认简体中文，无效、缺失或读取失败的语言值回退为简体中文；已保存的 `en` 继续显示英文。
语言偏好存储为 `pt_language`，设置备份 / 导入包含该值；重置全部设置会即时恢复默认简体中文。

覆盖曲谱菜单、传输按钮、设置、练习、速度、循环、音频路由、显示、移调、快速帮助、
曲库动态操作与弹窗、版本 / 连接状态、权限提示、LED 校准和测试文案，以及原生提示 / 确认 / 错误弹窗。
MIDI、BPM、Wait for Me、Follow Me、Realtime、WLED 和调性等专业术语允许保持英文。
曲谱内文字、曲名、文件名、文件夹名和设备名保持原文，匹配界面词汇的名称也不翻译。
完整配置指南 / README 仍为英文，中文界面中的链接已明确标注；未知第三方错误保留原始诊断。

## 实现与边界

- `src/i18n/messages.ts` 使用英文源文案作为键，并为带参数的动态文案提供模板；参数保持原文。
  替换通过函数返回文本，文件名中的 `$&` 等不会被当成替换指令，也不插入 HTML。
- `src/i18n/language-controller.ts` 仅观察明确的界面容器，处理文本和 title、aria-label、placeholder、data-tooltip。
  英文源文案独立于显示内容保存，能即时切回，且服务在同一 DOM 重建后仍可恢复英文。
- 曲谱 SVG 和虚拟键盘的逐帧 DOM 不参与翻译；用户数据通过明确的跳过边界保护。
  动态弹窗移除时释放观察器，销毁时释放所有观察器和语言选择监听。
- 原生弹窗在现有组合端口翻译，保留 prompt 的原有参数数量与默认值；未替换生产浏览器全局函数。
  切换语言不调用谱面重排、播放调度、音符判定、计分或导航命令。
- 新增语言键沿用现有设置备份格式及白名单，无依赖升级或新增运行时依赖。

## 实际验证

| 执行项 | 结果 |
| --- | --- |
| `npm run build` | 通过，更新生产 / 测试 bundle 和 sourcemap |
| `npm run check` | 类型、生成一致性与 394/394 单元测试通过 |
| `git diff --check` | 通过，仅 LF / CRLF 提示 |
| `language.html` | 默认 LED 配置，44/44 项通过 |
| `language.html?led=off` | no-op LED 配置，43/43 项通过 |
| `library-ui-baseline.html?led=off` | 44/44 项通过 |
| `settings-baseline.html?led=off` | 11/11 项通过，实际 FileReader 与两次原生 iframe reload |
| `device-controls-baseline.html?led=off` | 19/19 项通过 |
| `native-controls-baseline.html?led=off` | 39/39 项通过 |

2026-10-07 重跑构建、完整检查和两套语言矩阵（共 87 项浏览器检查）。首次启动使用空语言偏好，
明确验证默认简体中文；另验证已保存英文的完整重载、无效偏好回退及重置后的简体中文。
存储读取异常也由单元测试覆盖。四套英文基线是 2026-10-06 的验证结果（共 113 项），
本轮未重跑；它们在 `module-test-frame.js` 中显式保存 `en`，继续验证用户主动选择的英文界面。

语言矩阵使用真实 OSMD、原生 DOM / MutationObserver、实际选择事件和独立浏览器存储。
验证了静态及动态界面、打开中的弹窗即时切换、英文回切、设备名存储、曲库同名保护、
中文原生 prompt、异步错误 alert、LED 选键状态、备份导入、完整页面重载、重置、无效偏好、
销毁 / 重建和 390px 视口。桌面中文设置截图已人工检查，选择框和设置操作均可读。

Wait 演奏中切换语言，正式位置与计分保持一致，原始 XML 与渲染 SVG 保持一致；
之后提交实际音符输入，正式位置仍正常推进。暂停稳定后观察器回调计数不再增加；
移除弹窗后其观察器释放，应用销毁后观察器数量为 0，迟到事件无效。
单元测试另外覆盖存储读取 / 写入异常、无依赖回退、模板参数、源文案保留与全部静态文案覆盖。

证据：[LED 开启](validation/language-led-on.txt)、[LED 关闭](validation/language-led-off.txt)、
[曲库](validation/language-library-ui-baseline.txt)、[设置导入](validation/language-settings-baseline.txt)、
[设备](validation/language-device-controls-baseline.txt)、[原生控制器](validation/language-native-controls-baseline.txt)、
[桌面截图](validation/language-settings-desktop.jpg)。构建及完整检查输出保留于本地忽略目录
`.cache/language-default-check.txt`（2026-10-07）及 `.cache/language-check.txt`（2026-10-06）。

## 未覆盖

未用实体 MIDI / WLED 硬件验证语言切换，也未实测其他浏览器、iPad / iPhone 和真实触屏。
390px 验证为真实浏览器中的窄 iframe。Realtime / Follow 在持续演奏中切换未单独采集轨迹；
本次实际演奏验证使用 Wait，原有调度 / 输入单元回归及原生控制器矩阵通过。
未重新运行上一批传统 / 横向滚动完整矩阵；本次没有修改这些滚动实现，原始滚动证据随上述提交保留。
