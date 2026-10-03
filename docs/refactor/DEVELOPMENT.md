# TypeScript 模块开发与验证

核心源码现在使用实际 ES 模块，生产入口为 `src/main.ts`，输出为单个 IIFE
`js/generated/app.js`。`src/app/services.ts` 显式创建应用实例与服务，
`bootstrap.ts` 只提供应用生命周期和加载/输入命令；业务对象不发布到 Window。
P9 仍进行中：旧浏览器基线需要迁移到窄测试入口，完整矩阵、剩余严格选项及最终启动器验收尚未完成。
阶段证据见 [PROGRESS.md](PROGRESS.md)，历史经典脚本说明保留于 [CLASSIC_DEVELOPMENT.md](CLASSIC_DEVELOPMENT.md)。

## 运行应用

使用原有 `Windows Launchers` / `Mac Launchers`，或运行：

```sh
npm run serve
```

也可以直接 `node local-web-server.js`；服务器和 helper 保持 CommonJS。
访问 `http://127.0.0.1:8080/`。提交包含静态 bundle，启动应用无需安装开发依赖或构建。
PowerShell 下可用 `$env:PIANO_TRAINER_APP_PORT = '8081'` 设置另一个端口。
音色、OSMD、Tone、webmscore/WASM、初始曲库和 helper 路径保持原值。

## 修改源码

验证环境为 Node `22.21.0` / npm `10.9.4`；开发依赖固定为 TypeScript `5.9.3` 和
esbuild `0.28.2`。根 package 不改为 `type: module`，没有新增运行时 npm 依赖。

```sh
npm ci
npm run typecheck
npm run build
npm run test:unit
npm run build:check
npm run check
```

本环境使用 `npm ci --cache .cache/npm --registry=https://registry.npmjs.org`，不修改用户全局 npm 配置。
`npm test` 与 `test:unit` 相同；单元测试先将真实模块转为独立 CommonJS 文件，
在 `.cache/test-modules` 的 VM/原生端口 fixture 中加载它们的实际导出与依赖。
此输出不会进入静态应用。

`build` 先分别检查生产与测试入口，再在内存中打包；失败保留现有静态产物。
生产输出只包含 `app.js` 和带内嵌 TS 源码的 `app.js.map`。
独立测试输出为 `docs/testing/generated/test-app.js` 和 map；生产 HTML 不加载它，
生产 bundle 没有测试 facade。两套输出均随源码提交，不手改生成文件。

`build:check` 检查完整生成目录与字节，Git checkout 中也拒绝未跟踪生成文件。
构建新增输出后先暂存 `js/generated` 和 `docs/testing/generated`，再执行检查。
下载 ZIP 没有 `.git` 时仍验证输出一致性。
`npm run watch` / `npm run build:watch` 观察 src/types/config，重新执行同一检查与构建流程；
实际失败/恢复验证确认保留最后成功输出，修复后两套 map 更新，恢复源码可重建相同字节。
`test:unit` 在 fresh checkout 自动创建自己的 `.cache`，替换前检查目录与嵌套链接。

P9h 在 Git archive 中使用 `npm ci --offline --cache <已验证的包缓存>` 干净安装三个固定
开发包，两套类型检查、四文件比较与 336 项测试通过；没有依赖工作区 node_modules 或临时源码。
Windows 原 Desktop / Wi-Fi BAT 直接运行成功，原生产页面从初始曲库加载真实 OSMD SVG，
20 个静态路径含 vendor、两种音频、初始库和 WASM/data 返回 HTTP 200。
Mac 四个 launcher 仅 shell syntax 检查通过，实际 macOS、LAN 客户端/实体硬件/可听仍未验证。

## 源码与所有权

| 原职责／迁移期入口 | 当前唯一源码与组成边界 |
| --- | --- |
| trainer-state、共享声明与首次运行 | `state/model.ts`、`domain/model.ts`、`state/app-state.ts`、`preferences.ts`、`settings-backup.ts`；bootstrap 分配实例并显式 init |
| trainer-timing / Window.PTTiming | `domain/timing.ts` 的模块导出；没有 Window 转发 |
| 可弹键域与 MIDI/LED 设置解析 | `domain/playable-range.ts`、`preference-values.ts`；`state/player-range.ts` 拥有每个应用的缓存 |
| midi.js | `midi/*.ts`、`ui/midi-controls.ts`；独立输入、设备与输出所有者 |
| 音频节点、路由与节拍器 | `audio/*.ts`、`domain/velocity.ts`、`score/measure-timing.ts`、`ui/tempo-pulse.ts` |
| score-display / feedback-engine 的图形 | `score/osmd-adapter.ts`、`render/*.ts`；私有 vendor 对象只在适配边界 |
| 判定、提前输入、计分、延音 | `practice/*.ts`；消费领域数据与类型化端口 |
| Play/Pause/Reset/Loop | `practice/playback-coordinator.ts` 与 `playback-state.ts`；保留唯一调度流程及原普通取消语义 |
| XML/MXL、转换与移调 | `score/musicxml-io.ts`、`score-loader.ts`、`score-conversion.ts`、`webmscore-adapter.ts`、`transpose-*.ts` |
| IndexedDB、曲库备份与抽屉 | `score/score-library.ts`、`library-backup.ts`、`ui/library-*.ts`、`scores-drawer.ts` |
| toolbar、practice/display/tempo/loop/settings 控件 | `ui/*.ts` 的原生 DOM 控制器，集中 owned listeners/markers/timers |
| 虚拟键盘、seek/status、staff assignment | `domain/keyboard-state.ts`、`app/*controller.ts`、`render/virtual-keyboard.ts`、对应 `ui/*controls.ts` |
| debug、版本更新与权限提示 | `ui/feedback-debug.ts`、`score/osmd-debug-observation.ts`、`app/update-controller.ts`、对应 UI |
| 保留的 LED / MIDI 扫灯 JS | `js/led.js`、`js/optional/midi-led-test.js` 发布工厂；`optional/led/*.ts` 注入类型化端口与资源所有者 |
| 所有 src/compatibility、trainer-core startup | 已移除；`app/services.ts` 创建/接线并统一 init/dispose，`main.ts` 启动并在 pagehide 销毁 |

初始化先保留 preferences/settings/transpose/toolbar/drawer/MIDI/debug 的原顺序，
再在原位置创建 OSMD，随后执行原 core 的分段控件、音频、偏好、MIDI 和 LED 初始化。
普通 Pause、Reset、换谱与 UI 行为仍使用既有命令；最终 dispose 才释放所有应用资源、
使 pending loader/update/conversion/read 等续发失效。重复 init/dispose 不添加第二套资源；
结束后重新启动使用新应用实例。

LED 默认启用；`?led=off` 或业务入口前的 `window.__PT_BOOT_OPTIONS__={ledEnabled:false}`
选择 no-op，不清除已有硬件设置。详细例外和资源契约见 [P9_LED_CONTRACT.md](P9_LED_CONTRACT.md)。
唯一公共运行时边界为现有 vendor、版本启动信息和两个显式 optional LED 工厂。

`npm run inventory:globals` 重建运行时边界及 ES imports/exports 库存；
`node scripts/inventory-state-writes.cjs` 重建直接写入位置。别名与私有资源的人工说明见
[STATE_OWNERSHIP.md](STATE_OWNERSHIP.md)。

## 当前浏览器验证与剩余迁移

在 `/docs/testing/bootstrap-baseline.html` 点击 **Run checks**，并重复 `?led=off`。
每种配置 37 项：真实 OSMD/XML、三模式/两布局、输入/暂停、复制快照、全局隔离、
重复 init/dispose、全量 native 资源归零和新实例。fixture 使用内存偏好与随机 IndexedDB，
结束关闭/删除自己的库；生产页面不安装测试 API。

测试 facade 位于 `src/testing/facade.ts`，只暴露 loadScore、dispatchInput、
readPracticeSnapshot、readViewportSnapshot 和明确的场景/生命周期命令。
不返回整个 AppState 或 OSMD；生产构建与测试构建入口分开。

`practice-baseline`、`input-baseline`、`traversal-baseline`、`render-baseline`、
`score-display`、`playback-baseline`、`midi-baseline`、`audio-baseline` 和 `metronome-baseline`
以及 `loader-baseline`、`transpose-baseline`、`library-baseline`、`native-controls-baseline`
以及 `preference-controls-baseline`、`keyboard-controls-baseline` 已迁移到窄 facade；
default/no-op 连同 bootstrap 共 32 页 1284 项通过。
原 53/40/30或33/19/30/127/20或21/23/28/28/52/38/39/39/36 项行为断言保留，playback 每配置新增
一项受控时钟销毁检查；几何与反复基线未替换。
`module-test-frame.js` 加载原生产 HTML/vendors 与独立测试 bundle，使用内存偏好和随机库。
测试完成先 dispose/清理库，再发布通过终态。身份捕获保留在测试实例内，返回 token/布尔观察；
销毁清空捕获引用。练习快照只复制所需字段、note ID、marker ID 与数值锚点。

播放测试通过 `ServicePorts` 注入 clock 与 audio-ready callback，生产默认调用原 Tone/native APIs；
测试入口的 `controlledPlayback` 选项不在生产 bundle。`testing/playback-checks.ts` 私有持有
timers/frames/count-in callbacks，facade 只提供触发、清理、时长及所有权快照。
不再加载旧 playback-clock-fixture 或修改 Window 工厂。完整矩阵涵盖速度、Pause/resume、
快速 Play/Pause、Reset、Loop/count-in、反复/结尾/结束/换谱与旧 pending callback gating。

MIDI 测试在原生 Web MIDI port fixture 上执行实际服务与控件，设备切换、消息解码、
回声与 init/dispose 均通过命令和复制快照观察，不暴露服务实例或状态引用。

音频与节拍器通过 `ServicePorts.audioTone/metronomeTone` 注入实际 Tone 节点的观察端口。
原生时钟不替换，30 个本地采样真实请求与解码，三模式的 count-in 交接、piano/click
时间偏移、MIDI percussion 与节点销毁/重建保持原断言；输出静音。
`module-test-frame.js` 的 lateFixtures 只在 vendor 后、bundle 前注入测试端口，生产默认仍用 Tone。

加载与移调测试通过 `testing/score-checks.ts` 执行实际 FileReader/controls/converter。
只复制所需元数据、原 XML 文本、移调字段和 pitch；原始数据/移调状态的 identity
在私有捕获中比较。Apply/Reset 的重复加载数观察实际 adapter.load，销毁恢复观察并清除引用。
实际 MXL、XML golden、webmscore worker 与本地 WASM 请求均保留原测试。

曲库测试通过 `testing/library-checks.ts` 的 CRUD/备份/明确事务场景执行真实仓库。
只返回复制记录、数据库 schema 字段与连接身份 token，原生 DB/store/request 保持私有。
独立测试仓库只在随机命名空间创建，facade dispose 统一关闭；事务 abort/rollback、
dispose 中的 pending read 和 starter flag/实际资产等原 38 项保持。

原生控件测试通过 `testing/controls-checks.ts` 执行五个实际 UI owner；
scroll/fullscreen/intro、zoom/tempo/level/loop/pointer-hold 与异步 toolbar generation 保持原断言。
`module-source-observer.js` 解析实际 test bundle map 的 VLQ，native fixture 从 bundle stack
恢复最近的 TS UI owner，跳过 controls-dom，保留原 listener/frame/timer/interval 归属规则。
`observeSources:true` 只在相应测试 iframe 预加载 map；新增 Node 对照检查实际数千映射位置和非法/无映射段。

偏好控件通过 `testing/preference-checks.ts` 的复制字段与私有 Realtime/pressed/reservations
身份观察执行实际 UI/default commands。source map fixture 保留 practice/staff/settings 的
原 listener 计数；异常偏好、默认恢复、FileReader 无效输入和完整 dispose 均保留原检查。

键盘测试通过 `testing/keyboard-checks.ts` 控制私有 readiness callbacks，保留实际 keyboard/seek
与输入服务。普通 release/rebuild 后旧 unlock attack、explicit dispose 后旧 attack 失效分别验证；
callback 捕获只返回 token，清理恢复实际 ready port。原 880 key/12 activation listeners、重建后
1772 个 owned handlers、实际 mouse/pointer/touch、OSMD seek、双乐器 staff 与键色均保持原断言。

其余曲库抽屉/UI 浏览器页面和原断言保留，
仍引用已经移除的经典全局接口，**尚未完成剩余窄 facade 迁移及模块入口的全量浏览器回归**。
新的 37 项启动检查不能代替这些行为矩阵；后续必须逐页迁移并保留原验证范围。
原生权限、实体 MIDI/WLED、可听同步、Mac 启动器不由静音模拟证明。
生产与测试入口已开启 noUncheckedIndexedAccess、exactOptionalPropertyTypes 和
verbatimModuleSyntax，局部不变量/原错误路径见 [STRICT_MODULE_CONTRACT.md](STRICT_MODULE_CONTRACT.md)。
干净安装/重建、Windows 原启动器和静态资源门槛已验证；全量浏览器迁移仍归 P9。

## 调试与回退

浏览器加载 `js/generated/app.js.map`，其中嵌入当前 TS 模块；单元检查验证 timing 表达式的行映射。
在 F12 Sources 选择相应 TS 文件；无需将 src 作为独立运行时脚本加载。
P9e 前的稳定经典入口为 `7fe81d0`。回退本模块入口提交即可恢复原槽位/工具链；
不更改或清除用户设置、备份或数据库。只有本地提交，推送前另遵照 DEV_NOTES 的版本约定。
