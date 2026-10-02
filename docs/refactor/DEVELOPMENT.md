# 首轮 TypeScript 开发与运行

当前已迁移 timing、状态、设置、键域/共享遍历、MIDI、音频、渲染与输入判定；P7 正迁移调度。
应用继续使用原生 DOM、经典脚本、现有 vendor 和静态资源；完整目标见 [PROGRESS.md](PROGRESS.md)。

## 运行应用

直接使用现有 `Windows Launchers` / `Mac Launchers` 内的启动器，或者：

```sh
node local-web-server.js
```

访问 `http://127.0.0.1:8080/`。不需要 npm 安装或构建；仓库随附编译产物。
服务器保留 CommonJS，helper 有自己的 package.json，不要混用其依赖。
如默认端口已占用，可在 PowerShell 设置 `$env:PIANO_TRAINER_APP_PORT = '8081'` 再启动。

## 修改源码与验证

验证环境：Node `22.21.0`（.nvmrc）、npm `10.9.4`，唯一开发依赖 TypeScript `5.9.3`。
锁文件固定依赖版本、官方 registry 地址与 integrity；没有新增运行时 npm 依赖。

```sh
npm ci
npm run typecheck
npm run build
npm test
npm run build:check
```

也可用 `npm run check` 执行 typecheck、产物一致性检查和 Node 测试。
`build:check` 只检查，不更新产物；构建新文件后先 `git add js/generated`，以免漏交付。
有 Git 元数据时未跟踪生成文件也会导致检查失败；下载 ZIP 没有 .git 时仍检查完整输出树。
本环境的全局 npm cache 不可写，使用 `npm ci --cache .cache/npm --registry=https://registry.npmjs.org`。
无需改动用户的全局 npm 配置。

- 唯一 timing 源码：`src/domain/timing.ts`。
- 静态输出：`js/generated/domain/timing.js` 与 `timing.js.map`，必须随源码一起提交。
- `types/legacy-timing.d.ts` 只描述 Window.PTTiming；全局词法 AppState 未改为 Window 属性。
- P2 状态／设置唯一源码为 `src/state/*.ts` 与 `src/ui/settings-controls.ts`，原 trainer-state.js 已删除。HTML 依次加载 key 表、state、preferences、backup、settings UI，然后保持其他脚本的相对顺序。
- `types/legacy-state.d.ts` 描述共享对象，`src/domain/practice.ts` 描述嵌套数据；未迁移 JS 的访问尚不受 TS 检查，不能视为整个核心已迁移。
- P3 的键域纯计算在 `src/domain/playable-range.ts`，AppState 缓存／旧接口在 `src/state/player-range.ts`；共享时间线在 `src/score/score-traversal.ts`，旧名仅在 compatibility 转发。权限／连接／更新 UI 已移出 LED。
- LED 默认继续启用。打开 `index.html?led=off` 可选择 no-op，也可由宿主在业务脚本前设置 `window.__PT_BOOT_OPTIONS__ = {ledEnabled:false}`。显式 boolean 配置优先；无额外存储 key，不清空既有 LED/WLED 偏好。no-op 隐藏并禁用 LED 设置，保留 MIDI 提示、键域、音乐预览、虚拟键盘与提前输入。
- LED 专用 rAF 由 `src/optional/led/legacy-led-adapter.ts` 持有，可 start/dispose；no-op 不初始化 LED 控件或硬件，不创建该循环。经典脚本组装在 `src/compatibility/optional-led.ts`，P9 再移至显式 bootstrap。旧 LED JS 与 helper 不要求 TS 化。
- P4a 的 MIDI source 是 `src/midi/{midi-input,midi-service,midi-output}.ts` 与 `src/ui/midi-controls.ts`，原 js/midi.js 已移除。仅 `src/compatibility/midi.ts` 提供旧名转发和桥接；三个同名覆盖已收敛。服务与 UI 都有 init/dispose，pending access 用 generation token 失效；optional MIDI LED 测试保持独立 JS。
- P4b 的音频节点、样本加载／解锁、延迟配置、音量与释放在 `src/audio/tone-adapter.ts`；输入／播放路由在 `src/audio/audio-routing.ts`，共同力度算法在 `src/domain/velocity.ts`。factory 不分配节点，core 在原节点创建位置调用 init；`src/compatibility/audio.ts` 暂时组装与转发五个调度消费者接口。Tone 最小类型位于 `types/vendor/tone.d.ts`，vendor 文件未改。
- P5 的 OSMD 最小声明在 `types/vendor/osmd.d.ts`，private cursor snapshot 与 NoteRef 在 `src/score/osmd-adapter.ts`。显示、render 生命周期、几何、反馈与 Loop SVG 在 `src/render/*.ts`；旧 score-display.js 已删除，旧 feedback-engine 现在只保留 P7 的 Loop 推进。ExpectedNote 持有不可变 NoteRef，换 Sheet 后旧 ref 失效。compatibility 两个文件暂供经典消费者组装／转发；viewport.init/dispose 可释放自己的事件和帧。
- P6 的输入/匹配/提前预留/期望/计分/反馈状态/延音位于 `src/practice/*.ts`；只依赖领域数据与端口。OSMD 适配器提供惰性数据和 tie 长度，`src/compatibility/practice.ts` 暂作组装与旧名转发。副作用契约与 state aliases 见 P6_INPUT_CONTRACT.md；旧 feedback-engine 只剩 P7 的 Loop 推进。
- P7a 的 count-in/节拍器在 `src/audio/metronome.ts`，原时钟的资源所有权在 playback-clock，MembraneSynth 在 metronome-output，pulse DOM 在 `src/ui/tempo-pulse.ts`；小节缓存位于 `src/score/measure-timing.ts`。compatibility/metronome 暂组装，core 在原节点位置 init。Pause 不等同 dispose，取消差异和旧迟到回调语义见 P7_SCHEDULING_CONTRACT.md；播放协调器与模式策略仍待迁移。
- `npm run build` 先在 `.cache` 新目录编译，成功才替换 compiler 专属的 `js/generated`；失败保留现有输出。
- 不手改生成文件。构建清理只作用于校验过的生成／临时目录，拒绝向工作区外解析的路径和符号链接。
- 输出与 TS 源使用 LF，保证 Windows / Unix 重建时 source map 字节稳定。
- 经典脚本阶段禁止顶层 import/export；命名空间中导出的类型不生成模块或运行时 namespace。
- `strict` / `noEmitOnError` 已开启；其余旧 JS 不纳入类型检查。更严格的索引／optional 配置留给后续阶段。

P1 仅有初始化空 namespace 的局部类型断言，以及 `Number.isFinite` 后的非空断言。
可选参数保留原 JS 的默认空对象与未提供字段时的算术结果。无 `any`、忽略检查指令或 vendor 宽泛声明。

## 浏览器集成

先启动静态服务器，在以下页面点击 **Run checks**：

- `/docs/testing/score-display.html`：30 项原有显示检查。
- `/docs/testing/practice-baseline.html`：53 项三模式／两布局／真实反复与结尾检查。
- `/docs/testing/settings-baseline.html`：真实 FileReader、错误导入、两次重载、布局恢复与设置还原；只在可丢弃的本地测试 origin 运行。
- `/docs/testing/traversal-baseline.html`：30 项共享时间线、三模式／两布局提前输入、键域、权限／更新 UI 和旧 LED 启动检查。添加 `?led=off` 为 33 项，额外验证原有 WLED 配置保留、无发现／重连 timer 与无网络请求。
- 显示与练习页也接受 `?led=off`，每种 adapter 各跑 30／53 项。traversal 的 no-op 页面会暂设本地 WLED 地址和 DDP 配置，结束／离开页面会恢复这些设置；请使用可丢弃的本地 origin。
- `/docs/testing/midi-baseline.html`：读取当前 index.html，向测试 iframe 在启动前插入模拟 Web MIDI provider；生产入口没有 fixture API。运行真实 DOM 选择／通道、原始消息到 OSMD 判定、输出／回声、热插拔及 init/dispose。默认 20 项，`?led=off` 21 项（含 LED 设备 DOM 缺失）。临时 MIDI/LED 偏好在结束／离开页面时还原；仅在可丢弃的本地 origin 使用。模拟结果不能证明真实设备或音频正常。
- `/docs/testing/audio-baseline.html`：真实 Tone context／节点、30 个本地样本下载及解码，输出静音；记录 common input、播放路由和释放传给实际 Tone 的参数，并记录模拟 MIDI bytes。默认与 `?led=off` 各 23 项。测试入口注入的 Tone 端口包装不修改生产源码；临时 MIDI/LED 偏好结束／离开时恢复。未加载／失败／迟到回调使用 Node 假时钟与 deferred promise；可听音质、硬件延迟和音频／节拍器同步仍需手工检查。
- `/docs/testing/render-baseline.html`：默认与 `?led=off` 各 19 项。1200px 固定 iframe 的复杂合成 MusicXML，比较两布局 42 个实测 SVG 锚点与 `geometry.p4b.json`（来源 commit e6f8095、OSMD 1.9.7）；验证 cue/hidden、same-pitch source identity、Wait 重排/zoom、Loop、换谱失效与 viewport lifecycle。该页保留原生 rAF，并要求 visibility=visible；前台运行以完成两个 native follow 断言，不能以后台超时视为算法回归。golden 不适合作 Mac 字体验证的替代。
- `/docs/testing/input-baseline.html`：默认与 `?led=off` 各 40 项，实际 OSMD 的跨谱表同音、部分和弦、same-staff 去重、grace/hidden/cue、tie sustain、非练习手和键域；真实 virtual key 的 mouse/pointercancel DOM 事件与 MIDI domain bridge 进入同一 typed controller。仅测试 iframe 暂以已完成 promise 替换 audio unlock，音频输出静音；真实 Tone 另用 audio-baseline 验证。这不是触屏设备或实体 MIDI 检查。
- `/docs/testing/metronome-baseline.html`：默认与 `?led=off` 各 19 项。当前入口创建真实 Tone MembraneSynth，测试包装端口记录实际调用并静音；原生 timer 验证同步首拍、4 拍节奏、末拍完整等待、Wait 连续 tick/stop、Follow immediate target、模拟 MIDI Channel 10 attack/release、pause/dispose/reinit 与 pulse DOM。实际 OSMD repeat cache 保留零长度边界；Node 假时钟另验证精确 delay/顺序及 rapid Pause/Resume 旧回调。该页暂改 MIDI/LED 偏好并恢复，需串行；不证明可听音质或实体同步。

修改／恢复同一 origin 偏好的测试页需依次运行并关闭，再打开下一页；并发运行 MIDI／audio 等
fixture 会互相改写启动期间读取的 saved channel/device。显示与 practice 的声音路由关闭不证明实体音频表现。

页面通过 iframe 注入测试脚本；生产 index.html 不加载测试 API。结束会暂停，重载 iframe
恢复完整应用状态。显示页用受控 rAF；硬件和音频路由关闭。不要据此声称实体 MIDI 或音频延迟已验证。
最终输出含真实反复事件快照，保存于 [P1-browser.txt](validation/P1-browser.txt)。

`timing.js` 的 sourceMappingURL 指向同目录 map，含完整 TS 源；无需开放 `/src`。
自动测试确认两项算法的生成行映射到 TS 对应行，HTTP 确认 map 可访问。
手工调试：F12 → Sources → `src/domain/timing.ts`，在等待计算处下断点后 Play；本轮未进行 F12 交互断点验证。

## 阶段回退

P0 检查点为 `c1e175a`。P1 回退恢复 timing 原脚本及 HTML 原槽位，并删除 P1 的 src、类型和生成文件。
可对 P1 提交执行 `git revert`，保留 P0 基线、测试与其他工作。不会清空设置或变更 IndexedDB。
推送前再遵照 DEV_NOTES 的版本更新约定；本轮只有本地提交。
