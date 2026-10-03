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

## Converter / transpose 迁移基线 e91ca87

- Converter 支持原 11 个 suffix；MXL 只在显式 transpose normalization 使用，不走普通 import 转换。脚本地址保持 assets/vendor/webmscore/webmscore.js，已存在 loader marker 立即 resolve，随后检查 window.WebMscore.ready；失败缓存、ready await 与 FileReader 先后保持。
- export 优先级 saveXml → saveMusicXml → saveMxml → saveMusicXML；保留 string/ArrayBuffer/view/buffer-like 的 UTF-8 解码与 byteLength=0 时的原 fallback。导入 catch 替换为原通用错误并 log，normalization 原错透传；两者 finally 都尝试 score.destroy 且忽略 destroy 错误。
- 移调使用原 sharp/flat、major/minor、signature preset 表及 mod/parseInt。key mode 取最短有向间隔，+6 不改成 -6。相同 signature 或 semitone=0 非 force 时保留原 XML 字节。key 检测沿原 major tonic lookup，即使 mode 是 minor；不借迁移修正旧规则。
- DOM XML 转换按 part/measure/child 原顺序，只改 key/pitch/harmony；alter=0 时删除子节点，不修改 note 的 timing、tie、slur、beam、accidental 等其他字段。每个 part 的 currentBias 独立，updateKeySignature=false 保留 fifths 并用当前调号 bias。
- transpose state Object.assign 默认值保持同一对象。availability 可从 currentScoreData fallback，但 apply 仍传 currentScoreOriginalData；不能悄悄统一旧不对称。apply/reset await load 后才写 active/label/status；错误只 log/status，不重新抛出。模式/数值在 await 后继续按旧读取位置观察。
- UI init 在原 transpose slot，控件绑定和最初 populate/sync 顺序保留。显式 dispose 可取消本模块的 pending UI commit/资源；普通加载、Pause、Reset 不新增 epoch。库/备份和其余 UI 仍单独记录。
- 普通 finally 保留 vendor destroy() 的 soft 行为；显式 dispose 对已返回且持有的 score 调 destroy(false) 一次，native Worker 实测以转换前已有 worker 为基线，不终止其他模块的 worker。迟到 score 返回会 hard destroy；迟到 export 不进入 load。vendor 内部 load 失败前尚未返回 handle 的 worker 无公开释放接口，本次不改 vendor 私有实现。

## 后续 library / UI 检查点

IndexedDB `pianoTrainerLibrary` v1、stores/indexes、transaction completion、backup 格式与 starter imports 沿旧实现；迁移前逐项记录细节。剩余 toolbar/practice/display/tempo/loop/settings 的 DOM/event 边界及全屏/触控资源在各子步骤继续清点。

## Library repository / backup 基线 779bc82

- 数据库 `pianoTrainerLibrary` version 1；folders/scores 均 keyPath=id。升级只在缺 store 时创建；folders by_name，scores by_folderId/by_lastOpenedAt/by_title，均 non-unique。不升级 schema。
- init 的第一次 open promise 缓存，失败也缓存；缺 indexedDB 在 open 前拒绝。transaction 在 tx.oncomplete 才 resolve executor 的 result（可为 request promise，沿 Promise assimilation），error/abort 保留 native tx.error 和原 fallback。executor 同步抛出先 reject，再尝试 abort。
- 列表按 String(name/title||'').localeCompare 排序；recent 只取 truthy lastOpenedAt，再降序、slice limit。folder 创建两次独立 Date.now，score 创建一次 now；rename/open/move 维持原读取次数和写入位置。
- delete empty folder 先 getAllScores；批量去重/过滤 falsy IDs，返回去重请求数，即使实际 ID 不存在。folder cascade 的 getAll onsuccess 与 move 的 get onsuccess 在同一 readwrite transaction 内发后续 put/delete，不借迁移改成事务外 await。
- backup version=1、exportedAt ISO；先 folders 再 scores。rawData 仅 ArrayBuffer 编成 bytes，其他内容 String(rawData??'')；decode kind=arraybuffer 仅 Array.isArray(bytes) 接受，否则空 buffer，其他 text 强制 String。
- import 不清库、不复用 IDs、不强制检查 version；folders/scores 非数组按空处理。folderId 只映射本次导入文件夹，否则 null。coercion/default/title/type/timestamp 规则及原读取顺序保持，异常回滚 native transaction；typed unknown boundary 不能增加拒绝合法旧备份的 schema 门槛。
- starter key `pt_starterLibraryImported_v1`。已 true 立即 false；未 seed 但已有 scores 时写 true 并 false；仅空库 fetch `new URL('assets/Starter_Scores.json', document.baseURI)`、cache=no-store，成功 import 后才写 true。HTTP/JSON/事务失败不写 flag。普通重复调用竞态不新增 dedup。
- 显式 dispose 才关闭本实例 DB 和 abort 自己尚未完成的 transactions/pending open；不在普通 CRUD、导入、换谱时取消操作。P9 bootstrap 统一拥有此生命周期，用户数据库数据保留。
- pending CRUD/export/starter 在原 await 后只检查 dispose generation，防止旧命令重开 DB 或发下一次查询/写入；普通操作 generation 不变。仅 dispose 为被 abort 的内部 request promise 加 rejection observer，避免 orphaned rejection，原 transaction/result 的错误和返回仍向调用者传递。
- Native store/result 类型只在 v1 keyPath + storeNames 的 IndexedDB 边界收窄；folderId 非空断言只供 string IDs 的 includes 参数（runtime null 仍不匹配）。backup 的 unknown 数组入口只执行原 Array.isArray，不新增 version/schema 拒绝；合法 v1 metadata 类型声明的局部断言保留 malformed entries 的原 native coercion/TypeError 和字段读取顺序。
