# P8 数据迁移契约

基线：`8d48051`。按 score IO/loader、library、UI 分别提交，不改变用户 schema、资源地址或转换算法。

## Score IO 与 loader

- 文件名判型仅识别 mxl/musicxml，其余默认 xml；title 只去 xml/musicxml/mxl 后缀。FileReader 对 mxl 用 ArrayBuffer，其余用 text；错误沿 reader.error 拒绝。
- 原始 string 不复制，ArrayBuffer slice，view 按 byteOffset/byteLength slice，Blob 保留 MIME slice。渲染和移调来源各复制一次，当前状态仍保留调用者原始对象。
- ZIP central directory 搜索、条目排序/深度、container full-path、解压 method 0/8、container 读取失败后 fallback 均保留。不借类型迁移加 CRC/ZIP64 或重新编码。
- MXL 直接 XML 提取仅供移调；异常时才调用原 MidiImport.normalizeScoreToMusicXml。失败的 warning 顺序与 null 返回保持。不能把 normalized XML 换成 MXL render source。
- OSMD load 使用原始 MXL 内容；重建 File 不强加 MIME，已有 File 原样返回，原 Blob filename fallback 保留。首个 instanceof File 在没有 File 全局时仍可抛错；本次不借迁移增加该环境的支持。其他格式 payload 原样传递。
- load 顺序：loaded-score reset → 非 skip 时 tempo 100% → 复制/提取 original → await OSMD.load → render → initSongUI → cursor reset/show/update/scroll → timeline invalidation → currentScore 字段 → await library markOpened/refresh → transpose notify → success/debug log。Promise 在全部步骤完成后 resolve，返回 undefined。
- error 顺序：console error → alert message → 原异常 rethrow。失败不回滚此前 reset/tempo 或已完成 state write，不新增加载 epoch、竞态 gate 或取消普通 load。
- direct selection 先检查原 converter-supported extension；转换后 load，否则 FileReader 后 load；成功后 close drawer。file change 的 finally 清空 input.value，异常仍向上传递。
- 文件输入在原 core 槽位显式 init；重复 init/dispose 去重/释放 listener。FileReader 的完成/error 从私有 pending set 移除，显式 dispose 才 abort 未完成读取并以 AbortError 拒绝，不影响普通加载或换谱。
- view slice 的 ArrayBuffer 类型断言只在 binary IO 边界：正常 FileReader/库来自 ArrayBuffer，运行时仍执行原 buffer.slice，不将 SharedArrayBuffer 转换成其他类型。Native load 后 reader.result 的非空断言保留原完成读的条件。
- transpose 的 originalRawData/name/type 与 skipTransposeReset 参数保持；重复移调继续从原始来源开始，reset 保留 original 元数据。transpose engine 与 converter 在后续子步骤迁移。

## 后续 library / UI 检查点

IndexedDB `pianoTrainerLibrary` v1、stores/indexes、transaction completion、backup 格式与 starter imports 沿旧实现；迁移前逐项记录细节。剩余 toolbar/practice/display/tempo/loop/transpose/settings 的 DOM/event 边界及全屏/触控资源在各子步骤继续清点。
