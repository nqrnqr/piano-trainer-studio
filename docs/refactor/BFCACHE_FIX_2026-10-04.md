# 审查 P2 修复：可恢复页面生命周期

日期：2026-10-04。对应用户提供的 `REVIEW_2026-10-04.md` 中生产入口 pagehide 问题。
审查所述缺陷成立：旧 main.ts 在 persisted pagehide 中永久 dispose，恢复不重跑入口。

## 修改

- `src/main.ts` 按 PageTransitionEvent.persisted 分流，监听多轮 pagehide/pageshow。
  缓存挂起调用 suspend，缓存恢复调用 resume；最终离开才 dispose 并移除两个入口监听。
- `app/services.ts` 在同一应用实例内保存乐谱、计分、光标、设置、DOM 与控件监听。
  挂起暂停播放、释放虚拟/MIDI 按键，取消播放/count-in 的旧时钟及音符输出，
  断开 MIDI、停止 optional LED，关闭可重开的 IndexedDB 连接。恢复只重启这些外部连接，
  不重跑 init、不重新加载乐谱、不自动继续播放。重复 suspend/resume 去重，最终 dispose 不可恢复。
- coordinator 用独立 suspend epoch 失效旧 unlock/普通和 Loop count-in 回调；
  keyboard 用输入 epoch 取消旧 unlock attack、清 pointer capture/down markers，同时保留原键 DOM/绑定。
  Tone 只失效旧 pending attack/release，保留采样加载与音频节点，返回后照常接受新输入。
- 原普通 Pause/Reset/rebuild 的取消语义保持；新取消行为只用于页面挂起/最终清理。
  core 私有状态和生产 bundle 隔离保持，没有新增生产测试 API、存储 key/schema、vendor 或服务器修改。

pagehide/pageshow 的 persisted 含义及连接恢复方式依据
[web.dev 的 bfcache 说明](https://web.dev/articles/bfcache)。persisted=true 表示缓存意图，
不保证实际命中；缓存可能被浏览器淘汰，因此不能依赖后续 pageshow 才停止输出。

## 验证

- 346/346 Node：新增真实编译 main.ts 的 EventTarget 测试、普通最终离开、
  多轮缓存进入/恢复、旧 advance/unlock/count-in/Loop callbacks、keyboard capture/绑定、
  pending sampler attack/release 与同一音频节点继续可用。只在 main 入口单测替换 bootstrap 调用记录；
  行为浏览器测试执行实际服务图。
- 两套严格类型与四个生产/测试产物 clean comparison 通过。
- 原 21 套件 default/no-op 共42页、1,497项全部重新执行通过。
- 新 `/docs/testing/production-lifecycle.html` 保留原 HTML/vendor 与真正 `app.js/main.ts`，
  不换成 test-app、不使用 PianoTrainerTest。以 native PageTransitionEvent 验证两轮挂起/恢复，
  默认/关闭 LED 各29项：真实 XML/FileReader/OSMD、原键与图形身份、非默认计分、显示光标，
  Play/Reset、布局、MIDI replacement/hotplug、库连接关闭/重开、无重复 listener、最终不可恢复清理。
  使用内存偏好/随机 native DB、模拟 MIDI provider、真实 Tone 静音，结束删除自己的库。
- 本轮合计44页、1,555项；原始输出见 validation/BFCACHE-browser-regression.txt、
  BFCACHE-production-lifecycle.txt，Node/构建见 BFCACHE-check.txt。

## 真实导航与限制

另执行实际链接离开页面、目标页 `history.back()` 返回，前后均使用生产 bundle。
当前内置浏览器返回 navigationType=back_forward，但 pageshow.persisted=false，
notRestoredReasons=null，发生了普通重新加载；没有获得实际缓存命中。
证据见 [原生导航尝试](validation/BFCACHE-native-navigation.txt)。

事件模拟验证了入口及完整应用恢复路径，不能据此声称真实 bfcache 命中已验证。
保留页面中的 Prepare navigation check → Navigate away → Return → Check navigation return，
用于在可命中的浏览器中验证 trusted persisted=true 和恢复后的实际控件。
实体 MIDI/WLED、可听音频同步及其他平台的原手工限制保持。

回退：revert 此修复提交即可恢复前一实现，无数据迁移。
审查原文件保留不修改、不纳入本次修复提交；本轮仅本地 Git 提交，未推送。
