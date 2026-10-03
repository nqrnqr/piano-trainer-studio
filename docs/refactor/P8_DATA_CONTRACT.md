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

## Scores UI 基线 a067b87

- 保留两个 selection arrays 的去重/falsy 过滤与退出 manage 时清空；system folders 为 __all__/__unfiled__/null，批量操作计数和选择规则不变。
- >=900px split view；窄屏保留 folders/scores/back。refresh 先更新 save button，再 init/尝试 starter/并行 folders+scores，然后修正选择和 view、重建原 DOM/classes。普通并发 refresh 不新增取消、合并或排序。
- folder picker/action menu 保留 label/order、Escape、overlay click、capture keydown 和 __cancel__ 返回。显示按原追加顺序；显式 dispose 才取消 owned overlays/listeners 和迟到 UI commit。
- file import 先 folder picker 再顺序 read/convert/save；成功 reset 两类 manage/select folder/view/refresh/open。取消不读取文件。save current 在 dialog await 后读取当前 score fields，保留原 live-state 行为；不是在 prompt 前冻结 score。
- row open 先 get full score，再 await load，成功 close drawer；错误仅 log。rename/move/delete 与 bulk 的 confirm/prompt、loaded ID/title、selected folder/view 写入位置、错误提示保持。
- backup export download 名称 Scores-Library-Backup.json、JSON indent=2、application/json、append/click/remove/revoke 顺序不变；import file.text/JSON.parse/repository/import/refresh，错误 alert 原固定文本。
- shell 保留 optional DOM、dataset markers、原 position/refresh/resize 注册顺序；显式 init/dispose 去重/移除自己的 listeners/resize rAF。普通关闭抽屉不会 dispose 或取消原数据操作，资源生命周期与交互生命周期分开。
- 原 loaded title 规则保留：row rename/single move 不刷新 loaded title，bulk move 在其原 await 后重新读库；row/bulk/cascade delete 只清 loaded library ID，显示中的乐谱仍可用。宽屏 bulk move 回 folders view，窄屏回 scores view。
- row 重建移除自己旧 listener，不取消已开始的普通命令；explicit dispose 才通过 generation 拦截迟到写入/overlay/input finally。pending overlays 在 dispose resolve __cancel__ 并释放 document capture listener，重新 init 不复活旧 callbacks。
- nullable option/state folder IDs 的非空断言只为 string includes 参数，runtime null 仍不匹配；converter/toolbar 重复 getter 保留原可用性条件和调用位置，未缓存成另一种读取顺序。error.message 保留原属性读取 receiver、truthy fallback 与 native alert coercion，不预先强制 String。
- 原 index 没有 btn-scores-import-files，静态监听实际为四个按钮加两个 input；动态 Add File 仍打开同一 picker。测试记录实际六个控件和两个 resize listener，没有添加按钮或修改产品布局。

## Native toolbar/display/tempo/audio level/loop UI 基线 4a9fb9e

- toolbar 保留 panel 顺序、按钮映射、下一 rAF 打开、transitionend target 检查及 180+40ms 后备关闭。普通 show/close 不取消旧 frame/timer；已有关闭回调可能作用于后来关闭的同一 panel，这是基线行为，显式 dispose 才取消资源。
- More/外部点击/库 picker 和 LED calibration exclusions、Scores 点击先 await refresh 再 toggle、intro 的 string true 检查/seen 写入顺序保持。初始 required btn-options 缺失明确报错，optional panels/buttons 可以缺失；原事件 target 在 Element 边界收窄。
- fullscreen 保留 requestFullscreen 的 await、WebKit 同步调用、异常 warning 与 pseudo fallback、native exit 条件及所有 labels/classes。普通并发请求不增加 epoch；explicit dispose 才拦截 await 后 UI 写入，旧 onclick/frame/transition callbacks 不进入重新 init 后的生命周期。
- Play/Reset 的 onclick 仍为赋值，销毁只清仍属于自己的 slot，不移除外部替换。preserveScroll 仍同步执行 callback、恢复 offsets、返回其结果；callback 抛错仍不执行恢复。resize 为 300ms debounce，clear feedback preserve scoring→render→LED panel 定位顺序保持。
- zoom 使用 parseInt(value,10)、50..150；input 只同步，change 才 state/save→OSMD zoom→clear/render。speed preview radix=10，而 committed percent/BPM 仍 parseInt 无 radix；percent 10..200，BPM 仅 min=1 且反算 percent 不再 clamp。DOM range 的 native sanitization 与 state 中数值不同仍保留。
- volume 0..100、boost 50..200，parseInt/falsy defaults、可选 DOM、storage→audio/MIDI 命令顺序不变；零 metronome level 为 -Infinity。input boost 不进入 MIDI output，display row 只按 instrument routing 决定可见性。
- loop 空 input 编辑不提交，change/blur clamp；crossed bound 按 changed ID 移动另一边。loader 的 range reset 保留 max/min/value/state 原写入顺序。hold 没有即时 step：320ms 后建立 170ms interval，click 仍单独 step；pointer capture/right-button/leave/buttons=0/document release/blur 行为保持。explicit dispose 清 owned timers/capture/style、invalidate callbacks，不修改普通停止规则。
- 每个 factory 不绑定资源；core 在原相对位置显式调用各段 init，P9 再统一 bootstrap。required inputs 的类型断言只在已校验 getter 返回，vendor zoom public property 和 optional cursor measure 只经 OSMD adapter；无 any/忽略检查。
