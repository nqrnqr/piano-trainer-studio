# 严格模块与索引边界

P9g（2026-10-04）生产与独立测试入口均启用 `strict`、
`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、`verbatimModuleSyntax`。
核心文件没有关闭检查、any 或新增大范围类型转换。TypeScript 的实际 ESNext emit
用于识别纯类型导入，68 个文件中的 144 个名称改为显式 `import type`。
仅这一步转换前后，两套运行时 bundle 字节完全相同；source maps 随源码更新。

| 边界 | 证据与保留行为 |
| --- | --- |
| MIDI decode | 缺失 status 在原 bitwise 算术中为零；显式 `?? 0` 保持该结果。缺失/非法 note 或 velocity 仍拒绝，两字节 release 仍使用零力度。echo 端口接受实际短消息的 undefined bytes，并在解码前照常 pruning |
| ZIP little-endian reads | 原 bitwise 对缺失字节自动转零；`?? 0` 显式表达相同规则，不新增截断文件错误或改变现有 fallback/warning 顺序 |
| timing options | 原接口允许显式 undefined，默认值/NaN/fallback 行为保留；仅这些入口字段明确允许 undefined，不给全部可选字段统一放宽 |
| native listeners | owned record 总包含 options 字段，它可为 undefined；不是可有可无的 record 字段，removeEventListener 接收原值 |
| match / geometry choices | filter/push 构造 dense arrays，已通过非空 guard，sort 保持数量；首项非空断言只描述该局部不变量，不新设评分/几何 fallback |
| shared timeline | 应用以 push 建立 dense timeline，索引经过原 length/bounds 条件。原非法 sparse timeline 错误保持，不因迁移 silently skip |
| transpose spelling | 正常 integral MusicXML semitone 落在十二个拼写之一。非法/非整数来源仍保留原 missing-spelling 错误，不增加新拼写策略 |
| pitch fallback | 原非法 MIDI 索引产生 undefined arithmetic 的 NaN；显式 NaN fallback 保持原数值结果 |
| OSMD graph | 数组数量/索引由真实已加载 vendor 图提供，局部 `!` 保留原访问和错误/catch 路径；source-note iteration 保持 `in` 判洞与惰性读取顺序。vendor 只由 adapter 接触 |

未检查的运行时代码只保留现有第三方 vendor 和两个参数化 optional LED JS 工厂，
不作为核心 TS 的免检层。对应最小 vendor declarations、LED 类型化 ports、资源与
late callback 隔离仍受 TypeScript 检查；详见 [P9_LED_CONTRACT.md](P9_LED_CONTRACT.md)。
根 package 保持 CommonJS，本地服务器/启动器的执行契约保持。

P9g 阶段验证：335 个 Node cases；补充现有 MIDI case 的空洞/undefined/NaN bytes 与短系统消息
echo expiry 断言。12 个已迁移浏览器页面 421 项通过，保留几何 golden 与真实反复。
上述为 P9g 当时范围。最终两套 strict、338 个 Node cases、42 页 1,497 项浏览器断言、
干净安装/构建/watch、Windows 启动器与静态资源均通过，见 [FINAL_ACCEPTANCE.md](FINAL_ACCEPTANCE.md)。
实体硬件、可听同步与实际 macOS 等限制仍保留。

IndexedDB transaction 的 `Object.fromEntries` 转换限于 typed StoreName 列表构造的
`Pick<StoreMap,K>`；原生 v1 schema/keyPath 定义结果类型，不将任意 JSON 或第三方对象
整体转换为业务状态。相关事务、schema、abort/rollback 和错误行为均有单测及真实 IndexedDB 验证。
