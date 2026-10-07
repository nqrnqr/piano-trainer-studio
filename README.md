# 🎹 Piano Trainer Studio — 完整配置指南

在浏览器中跟随乐谱练习钢琴，获得实时 MIDI 音符反馈和评分，也可以选配 LED 灯带提示。

## 项目来源

本项目基于 **ztbishop** 的开源项目 [Piano Trainer Studio](https://github.com/ztbishop/piano-trainer-studio) 继续开发。当前仓库增加了简体中文界面、TypeScript 模块化重构、横向展开乐谱和按演奏进度跟随谱面等改进，沿用原项目的 **AGPL v3.0** 许可证。

- [当前仓库](https://github.com/nqrnqr/piano-trainer-studio)
- [English documentation](https://github.com/nqrnqr/piano-trainer-studio/blob/main/README.en.md)
- [开发与回归检查说明](https://github.com/nqrnqr/piano-trainer-studio/blob/main/docs/refactor/DEVELOPMENT.md)

应用界面和本配置指南均默认使用**简体中文**。在应用的 **设置 → 语言** 中可切换为 English；界面选择立即生效，并保存在当前浏览器中。已保存的英文选择会保留，重置全部设置后恢复简体中文。指南页也提供独立的中英文切换入口。

## 在线使用

[打开 Piano Trainer Studio](https://nqrnqr.github.io/piano-trainer-studio/)

桌面端建议使用 Chrome。普通乐谱播放和练习无需安装 Node.js，也无需启动辅助程序；连接 MIDI 键盘时，需要使用支持 Web MIDI 的浏览器，并允许 MIDI 设备访问。

首次使用可按以下顺序操作：

1. 打开 **曲谱** 菜单，从入门曲库选择曲目，或导入自己的文件。
2. 需要连接键盘时，在 **设置 → MIDI 设置** 中选择 MIDI 输入设备。
3. 在 **练习** 菜单选择模式、练习手和播放手。
4. 点击 **播放** 开始练习；也可先点击乐谱中的小节，从指定位置开始。
5. 在 **更多** 菜单中调整速度、循环、谱面显示和移调。

新手建议先用 **Wait for Me** 熟悉音符，再用 **Follow Me** 练习节奏。

## 主要功能与练习模式

- 载入和播放 MusicXML / MXL 乐谱。
- 导入 MIDI、MuseScore 3.x 和 Guitar Pro 5.x 文件，并在浏览器中转换。
- MIDI 键盘输入、音符反馈、评分、虚拟键盘和可选 LED 提示。
- 传统谱面跟随、横向展开乐谱、变速、循环与移调。
- 曲库文件夹管理、批量导入和备份。

| 模式 | 使用方式 |
| --- | --- |
| Realtime | 按设定速度连续演奏，并记录练习反馈。 |
| Wait for Me | 等待你弹对当前音符后继续。 |
| Follow Me | 你练习一只手，应用跟随并播放另一只手。 |

## 下载并在电脑上运行

### 下载项目

[下载当前版本 ZIP](https://github.com/nqrnqr/piano-trainer-studio/archive/refs/heads/main.zip)，解压到电脑上的文件夹。无需安装 Git。

压缩包包含已生成的网页脚本以及网页所需的库，使用启动器时无需先构建前端。

### 安装与启动

1. 安装 [Node.js](https://nodejs.org/)。项目开发环境使用 Node.js 22.x，具体版本见仓库中的 `.nvmrc`。
2. Windows：打开 `Windows Launchers/Piano Trainer - Desktop.bat`。
3. macOS：打开 `Mac Launchers/Piano Trainer - Desktop.command`。
4. 在自动打开的浏览器中载入曲谱并练习。

如果网页没有打开，查看启动器窗口中的错误信息。macOS 如阻止 `.command` 文件运行，请在系统的隐私与安全设置中允许打开。

如使用终端，也可在项目目录运行：

    node local-web-server.js

然后访问 [本地应用](http://127.0.0.1:8080/)。

## 连接 MIDI 键盘

- 优先使用 USB 连接。蓝牙 MIDI 的可用性取决于设备、适配器和浏览器。
- 将键盘连接到**运行浏览器的设备**，然后在 **设置 → MIDI 设置 → MIDI 输入** 中选择它。
- 如需要将应用播放的音符发送到外部设备，再设置 MIDI 输出。
- CME WIDI Bud Pro 等适配器可将蓝牙 MIDI 作为 USB MIDI 设备提供给电脑。

检测不到键盘时，检查 USB 连接、浏览器 MIDI 权限及输入设备选择，然后刷新页面。桌面端可先用 Chrome 排查。

## iPad / iPhone

原项目推荐使用 [MIDIWeb](https://apps.apple.com/app/midiweb-browser/id6757226617) 连接 MIDI 设备；iOS 上的普通 Safari / Chrome 不能按桌面浏览器的方式使用本项目的 Web MIDI 输入。

1. 安装并打开 MIDIWeb。
2. 打开本项目的在线地址。
3. 连接 MIDI 设备，并在应用中选择输入设备。

如果使用蓝牙 MIDI，在 MIDIWeb 中打开蓝牙设备入口并连接设备，再回到应用选择它。

### 在局域网中使用

需要通过电脑托管网页或配合 WLED 使用时：

1. 让电脑、iPad 和 WLED 设备连接到同一局域网。
2. Windows：打开 `Windows Launchers/Piano Trainer - iPad (Wi-Fi).bat`。
3. macOS：打开 `Mac Launchers/Piano Trainer - iPad (Wi-Fi).command`。
4. 在 MIDIWeb 中打开启动器显示的局域网地址。

该本地服务器使用 **HTTP**，请按启动器显示的地址输入。在线 GitHub Pages 地址则使用 HTTPS。DDP 辅助程序通过电脑本地桥接工作，不适用于在 iPad 上直接发送 DDP。

## 乐谱格式与导入

| 格式 | 支持情况 |
| --- | --- |
| `.xml`、`.musicxml`、`.mxl` | 推荐使用，通常能保留更完整的乐谱信息。 |
| `.mid`、`.midi` | 转换后导入；MIDI 不包含完整的记谱信息。 |
| `.mscx`、`.mscz` | MuseScore 3.x 兼容性较好，MuseScore 4 及更新格式仍属实验支持。 |
| Guitar Pro 文件 | Guitar Pro 5.x 兼容性较好，较新版本仍属实验支持。 |

转换后的复杂乐谱可能需要修整。MuseScore 文件导入失败时，先在 MuseScore 中导出 MusicXML；Guitar Pro 文件可先用原软件或 TuxGuitar 导出兼容格式，再尝试导入。

## 曲库与备份

曲谱保存在当前浏览器的 **IndexedDB** 中，设置也保存在本地。浏览器清理网站数据、空间不足或更换浏览器时，数据可能丢失。

- **曲谱 → 备份曲库**：导出曲谱备份。
- **曲谱 → 导入曲库（合并）**：恢复或合并曲库。
- **设置 → 备份全部设置**：保存练习偏好、连接配置、语言和 LED 校准。
- 曲库支持文件夹、批量导入、重命名及单首乐谱保存。

本地地址、GitHub Pages 和其他域名的浏览器存储彼此独立。更换使用地址时，请先备份曲库和设置，再在新地址导入。

### 从哪里获取 MusicXML 乐谱

- [MuseTrainer](https://musetrainer.github.io/library/)：提供适合钢琴练习的 MusicXML 曲库。
- [PianoML](https://www.pianoml.org/library)：可浏览 MusicXML 乐谱。
- [OpenScore](https://fourscoreandmore.org/openscore/lieder/)：以十九世纪声乐与钢琴作品为主。
- [MuseScore](https://musescore.com/)：查看曲谱授权和可下载格式；并非所有作品都能免费下载。
- [MusicXML 资源目录](https://www.musicxml.com/music-in-musicxml/)：列出提供 MusicXML 内容的网站。

也可在 GitHub 搜索曲名，并加上 `extension:mxl` 或 `extension:musicxml`；通过搜索引擎检索时，可加上 `filetype:mxl` 或 `filetype:musicxml`。

## WLED / LED 配置（可选）

LED 灯带不是练习的必需设备。配置后可显示当前音符、后续音符和演奏反馈。

![钢琴与 LED 灯带示例](docs/screenshots/PianoSetup.jpg)

### 快速配置

1. 在 **设置 → LED 设置 → LED 灯** 中选择 **WLED**。
2. 填写 WLED 设备的局域网 IP 地址。
3. 将 **LED 数量** 设为实际使用的灯珠数量。可用“每米灯珠数 × 使用长度（米）”估算。
4. 点击 **测试灯带**，确认连接与灯珠数量。
5. 点击 **开始 LED 校准**，逐步校准灯珠与琴键的位置。

### 传输方式

| 方式 | 说明 |
| --- | --- |
| HTTP JSON（默认） | 可先用它检查连接；通常无需 DDP 辅助程序。浏览器是否允许访问局域网设备仍取决于使用地址与权限。 |
| DDP（低延迟，实验功能） | 通过电脑上的辅助程序发送 UDP 数据，需要 Node.js；不是由 GitHub Pages 服务器发送。 |

Windows DDP 启动器：`Windows Launchers/WLED Helper - Low Latency (DDP).bat`。

macOS DDP 启动器：`Mac Launchers/WLED Helper - Low Latency (DDP).command`。

在应用中选择 DDP 后，确认辅助程序连接状态。若在线 HTTPS 页面无法连接局域网 WLED，可使用前面的本地或局域网启动方式。

[阅读完整 LED / WLED 配置指南](docs/LED-Setup.html)

## 常用控制

| 菜单 | 主要用途 |
| --- | --- |
| 练习 | 练习模式、练习手、播放手及反馈。 |
| 速度 | BPM、速度比例和节拍器。 |
| 循环 | 设置反复练习的小节范围。 |
| 显示 | 谱面布局、缩放、虚拟键盘和显示选项。 |
| 移调 | 按调号或半音调整曲谱。 |

虚拟键盘可以在显示选项中关闭；乐谱区域右上角可切换全屏。

## 常见问题

### MIDI 没有反应

检查连接和浏览器权限，确认 MIDI 输入不是“无”。桌面端先试 Chrome；iPad / iPhone 可按上面的 MIDIWeb 流程操作。

### 曲谱导入失败或显示不完整

优先使用 MusicXML / MXL。其他格式需要转换，复杂乐谱或较新格式可能无法完整导入；先在 MuseScore、Guitar Pro 或 TuxGuitar 中转换后再试。

### MIDI 输出的节拍器听起来像钢琴音

应用可通过 MIDI 第 10 通道发送节拍器音符，但部分键盘未将该通道配置为打击乐。检查设备的 GM、鼓组或多音色接收设置。

### LED 不亮或不对齐

先确认 WLED IP、局域网连接和灯珠数量，再用 HTTP JSON 与“测试灯带”检查。连接正常后再做琴键位置校准；DDP 模式还需确认电脑上的辅助程序正在运行。

## GitHub Pages 自动发布

在仓库 **Settings → Pages** 中，发布源设为 **GitHub Actions**。每次推送到 `main`，`Deploy GitHub Pages` 工作流会安装开发依赖、检查类型和生成脚本、运行单元测试，然后发布网页及中英文指南。也可在 Actions 中手动运行。

检查失败时不会发布新站点。GitHub Pages 托管浏览器应用，WLED/DDP 辅助程序仍运行在自己的电脑上。

## 界面预览

![应用主界面示例](docs/screenshots/Screenshot.png)

## 致谢与许可证

感谢原作者 [ztbishop](https://github.com/ztbishop/piano-trainer-studio)，以及 OpenSheetMusicDisplay（OSMD）、Tone.js、Webmscore、WLED、MIDIWeb、MuseTrainer 和 Node.js 等项目。

本项目沿用 **GNU AGPL v3.0** 许可证，完整条款见仓库中的 [LICENSE](https://github.com/nqrnqr/piano-trainer-studio/blob/main/LICENSE)。
