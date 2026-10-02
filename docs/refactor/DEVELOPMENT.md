# 首轮 TypeScript 开发与运行

当前迁移范围只有 timing。应用继续使用原生 DOM、经典脚本、现有 vendor 和静态资源。
状态、练习、音频、MIDI、渲染及 LED 尚未迁移；下一步见 [PROGRESS.md](PROGRESS.md)。

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
