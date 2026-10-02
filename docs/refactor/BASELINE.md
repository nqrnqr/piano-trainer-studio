# 重构基线（P0）

日期：2026-10-02（Asia/Shanghai）。代码起点：`be6d51c`。
执行范围遵照计划第 1、11 节，首轮完成 P0、P1，P2–P9 留给逐阶段推进。
开始时在 `main`，`git status --short` 为空；横向模式与已有显示测试已提交，未覆盖任何用户改动。
仓库及父目录未发现 AGENTS.md。

## 环境与运行

- Windows / PowerShell；Node `v22.21.0`、npm `10.9.4`。
- `node local-web-server.js`；默认 `127.0.0.1:8080`。本轮 8080 已占用，使用独立 8081：

  ```powershell
  $env:PIANO_TRAINER_APP_PORT = '8081'
  node local-web-server.js
  ```

- Windows / Mac Desktop 和 Wi-Fi 启动器直接调用 CommonJS 服务器；不要求 npm 安装或前端构建。
- `index.html` 通过版本参数同步加载经典脚本，资源位于本地 assets。
- 使用 Codex 内置 Chromium 浏览器测试，Chrome `154.0.0.0`。
  user-agent：`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36`。
- 基线应用版本 `1.2.4`；本轮只做本地提交，不推送，保持 manifest 版本。推送前遵照 DEV_NOTES 更新版本。

## Vendor 固定值

OSMD bundle 自报 `1.9.7-release`；webmscore 本地 package 声明 `0.21.0-a`。
Tone bundle 版本常量为 `14.8.49`。所有 vendor 保持不变；没有用另一运行时版本替代本地库。

| 文件 | 字节 | SHA-256 |
| --- | ---: | --- |
| assets/js/opensheetmusicdisplay.min.js | 1206486 | 9ab640955523a62944793a4560c78ebfe2852b8ee896c3e94b6895022b9f39ed |
| assets/js/Tone.js | 349171 | 5b27d5f0ff5abda3ec2535df4b21e090c26552f95ef64e61bf3cad8f3415f6e8 |
| assets/vendor/webmscore/webmscore.js（实际转换入口） | 319271 | afdfd201b2e941fb2b4e3558c788f7daffa1c023e52c7fc128f88c1f634e4af9 |
| assets/vendor/webmscore/webmscore.cdn.mjs | 347154 | ccf2785c6eb45af4bd4fbeb82f9a9a0ac004e915b0e730df742311b39448c6e3 |
| assets/vendor/webmscore/webmscore.lib.wasm | 10978591 | 7b304a1ebd92bedd7c00185da6f3941b288927ab4aaa09fb870dbf4739518237 |
| assets/vendor/webmscore/webmscore.lib.mem.wasm | 5214695 | 00fe23709a2e6eb5fe0dae037aa6807e739ef1bc31c27a220f42fedfa6e47999 |

## 已执行行为基线

命令：`node --test tests/unit/*.test.cjs`，41/41 通过，P0 不依赖 TS 工具链。

| 范围 | 验证内容与结果 |
| --- | --- |
| Timing（28 项） | 正向／相邻小节／反向反复／跳结尾、实际与名义长度、弱起、缺失 callback、异常值、epsilon、默认参数、namespace 身份；全部通过 |
| MIDI（5 项） | 原始 callback 的按下／释放／零力度、Any／指定通道、非音符消息、120ms 回声、切换／None 解绑、core 覆盖与力度；全部通过 |
| 调度（8 项） | 原函数与假时钟：部分和弦阻塞、伴奏／sustain／cursor 顺序、Wait 10ms、Follow 剩余时间／晚到／最小舒适等待、暂停取消、Realtime 不走 Wait；全部通过 |
| 显示（30 项） | `/docs/testing/score-display.html`：实际 OSMD，两布局、三模式、预取／绘制分离、锚点刷新、缩放、重置、反向 seek、390px、240 小节超宽 SVG；全部通过 |
| 练习及真实反复（53 项） | `/docs/testing/practice-baseline.html`：三模式 × 两布局，错音／部分和弦／重复正确键／完整命中／释放／漏音／暂停；真实反复与第一、第二结尾遍历；全部通过 |

合成谱例均为测试自制，无外部曲谱授权依赖：

- `continuous-score.musicxml`：48 小节双谱表，显示测试另构造 240 小节。
- `fixtures/simple-repeat.musicxml`：实际反复记号，小节顺序 `1 → 2 → 1 → 2 → 3`。
- `fixtures/first-second-ending.musicxml`：`1 → 2 → 3 → 1 → 2 → 4 → 5`。
- 浏览器输出 SNAPSHOT 保存每步的谱面时间（全音符单位）、小节、下一位置、四分拍等待数；三个结构跳转等待均为 1 拍。

## 已知问题与验证限制

- 现有 DEV_NOTES 已记录部分反复／结尾转换处 realtime 节拍精度限制；两个小谱通过不代表所有重复结构都已验证。
- 原显示测试替换 iframe rAF；不证明原生帧率、真实音频时延或后台调度。新增练习页保留原生 rAF，但不以其证明音频同步。
- 浏览器工具注入环境在基线页载入时出现 `MutationObserver.observe` 的 Node 类型异常，无项目源码 URL；两页均出现。记录原始现象，不在本轮重构中修复或认作新增项目回归。
- core 会以 `console.error` 打印 `File loaded successfully.`；不是加载失败，新旧均如此。
- MIDI 测试运行原文件的真实事件处理函数，但设备与 DOM 选择控件为 stub；不能证明实体权限、热插拔、硬件输出或端到端延迟。
- 调度单测提取原函数，只在既有边界注入假时钟；函数提取依赖当前列首花括号格式，迁移时应换为显式测试入口。
- iframe 应用仍可能请求 MIDI 权限或初始化 sampler；测试关闭声音、节拍器与硬件路由。运行于独立测试页，结束暂停；重载 iframe 可完全恢复测试前状态。
- D.C./D.S.、真实音频／节拍器、触屏设备、原生前台平滑滚动、实体 MIDI/WLED、Mac 启动器未实测。

## 手工验证清单

每阶段使用受影响项目及固定烟测，不需要重做所有硬件项：

- [ ] Desktop / Wi-Fi 启动器可直接打开首页，无构建前置要求；Mac 在对应设备实测。
- [ ] 浏览器 F12 可从生成 JS 断到 TS，source map 正常；核心无新增异常。
- [ ] 三模式 × 两布局：count-in、暂停／继续／Reset、速度与 Loop、结束、换曲。
- [ ] Wait／Follow：单手提前按下、按住到下一组、释放、伴奏与连音。
- [ ] 原生前台 rAF：横向 33% 跟随、反向重复、缩放／切布局时显示光标不提前。
- [ ] 实体 MIDI：权限、16 通道／Any、速度 0、设备断连／重连、释放无挂音、回声。
- [ ] 音频：UI／MIDI 监听、输入力度、本地／输出独立路由、音色未加载、未解锁、节拍同步。
- [ ] LED none 和启用：键域过滤与单手提前输入一致；WLED/helper 实体路径。
- [ ] 设置既有值／新用户／备份导入导出；XML、原始 MXL、移调恢复、转换、IndexedDB 库操作。

P1 的自动化结果及确认范围见 [PROGRESS.md](PROGRESS.md)，未勾选手工项不得报告通过。
