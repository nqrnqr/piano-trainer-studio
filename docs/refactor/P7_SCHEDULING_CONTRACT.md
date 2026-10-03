# P7 原调度、时钟与取消契约

基线：`1ec34ee`。P7a 先迁移现有协调流程，P7b 再提取决策；不新增 tempo scheduler、光标时钟或乐谱重复展开。

| 资源/行为 | 原调度 | Pause/Reset 原规则 | 迁移所有者 |
| --- | --- | --- | --- |
| playback event timer | Tone.now/anchor 秒 → 毫秒 setTimeout；Wait empty 10ms，Follow remaining/full comfort，Realtime 累加 anchor | 不逐个取消；回调检查 isPlaying，部分同时检查 mode | playback coordinator + clock resource list |
| empty voice event | iterator.next → cursor.update → requestAnimationFrame(playbackLoop) | 不显式取消；loop 入口检查 playing | coordinator + clock |
| count-in | 首拍同步 click；后续每拍 wall-clock timeout；末拍再等一拍后 handoff | 不逐个取消；tick/handoff 检查 playing；快速暂停再播放仍可能让旧回调看到新的 playing=true | metronome/count-in + clock |
| metronome window | 先清旧 window；谱面 beat index → Tone 秒 → timeout 提前 8ms | 显式取消 scheduledMetronomeEventIds | metronome |
| Wait metronome | 不依赖输入推进；目标秒逐拍累加，delay 提前 8ms；numerator mod | 取消单 timeout，重置 counter/nextClick/measure；改 tempo 重建 | metronome |
| visual pulse | 按 Tone 目标提前 8ms；performance.now 120ms 去重；class 170ms | 取消 pending schedule 和 clear timeout、移除 class；lastPulse 时间保留 | metronome + UI pulse port |
| MIDI click attack | 目标时间提前 2ms timeout；回调只检查 metronome checkbox | 原先不由 Pause 显式取消 | metronome clock |
| MIDI click release | Channel 10，捕获当次 output；至少 20ms，默认 80ms | 原先不由 Pause 显式取消，输出回声均登记 | MIDI output |
| local metronome | MembraneSynth.triggerAttackRelease('64n', Tone 时间) | 不在 silencePlaybackOutputs 的 sampler/synth release 集合内 | metronome output |
| sustain | 35ms retrigger 与各 note duration；activeTimeouts 登记 | clearVisuals 才取消全部；Pause 默认不 clearVisuals | P6 sustain-state / coordinator |
| viewport rAF | 单 retargetable native frame | Pause/Reset ScoreDisplay.cancel | P5 viewport |
| Loop boundary | 先等当前 waitSeconds，不沿 realtime anchor 修正；miss → stop → reset/seek → update/scroll → clear visuals → optional count-in → reset score → start | 回调只检查 playing；沿真实 iterator seek | coordinator |

继续保留 `isPlaying`、`isAudioBusy`、`countInActive` 与 `followAdvanceInfo`。当前期望 context 在 paint 后的事件构建处设置；live iterator 随后预取下一步。几何的 painted snapshot 与实际 iterator 不能合并。

count-in 的 beats 优先当前 source measure 的 ActiveTimeSignature，其次第一小节，最后 4；沿用原 raw numerator，不借类型迁移加钳制。窗口 metronome 沿缓存 length 与 epsilon=1e-7 调度，保留原 beatOffsetSec 算式。measure timing cache 仍按实际 OSMD 反复遍历与 100000 限制构建，再沿原第一匹配位置恢复规则；不能改成新的线性时间线。

显式 dispose 可取消模块持有的全部 timer/rAF 并使迟到回调失效，为 P9 生命周期准备；普通 Pause/Reset 不新增 epoch 或批量取消。历史迟到回调在恢复播放后仍可能执行，必须作为原行为用例记录，独立修复不属于本次迁移。

## P7a 协调器搬运补充

- Play 在入口检查 cursor/playing，随后 await fullscreen/audio unlock；不在 await 后重新检查 playing。暂停发生于 pending unlock 时，旧 promise 仍可开始；两个 pending Play 也可能建立两次 count-in。这些旧语义保留。只在显式 dispose 后用 generation 忽略 pending start。
- Pause 的 clearTransient 不取消 activeTimeouts，不移回 painted iterator、不清除 sustained/held-correct；只清 expected/pending/context/preExpected 与 busy。随后 Transport.pause、window/Wait cancel、local/midi silence、pulse、latency、button、optional LED 清理的顺序固定。
- toolbar Reset 与 loaded-score Reset 是不同命令。前者沿 UI Loop min seek，后者不 seek；两者清 score/visual，且不能把前者合并成 stopPlaybackState 后改变顺序。score/hit Map/Set identity 与 pressed keys 的旧保留规则继续生效。
- Loop enforcement 沿 AppState.looper bounds，播放窗口回跳沿 UI min/max；这一历史区别不在迁移时统一。Loop callback 使用未修正的 waitSeconds，先 miss/stop/seek/paint/scroll/clearVisuals，再 optional count-in 和 score reset/start。
- 当前 event 捕获 entry array，并惰性投影领域字段；fallback 为第一 note 的 raw Length，不能换成 combined tie length。expected/context/feedback/keyboard/accompaniment 均先处理此 event，再 advance 真 iterator。数值 currentExpectedContext 仍不是完整 repeat token。
- Tone.Transport 仅 stop/pause/start 与 bpm.value；没有 schedule/scheduleRepeat 事件可取消。生产 audio/tone-transport 直接调用同一 API，UI 的原 seek/tempo 也使用这一个端口。
- playback-clock 的 timer/rAF 列表只为 dispose 所有权增加 bookkeeping；普通 Pause/Reset 不清空它，guard 与先前相同。dispose 在同一 coordinator 内取消 event clock 与 count-in/metronome，重复 dispose 不创建/重复释放资源。
- 实际 Tone 调用还有既有模式差异：Wait tick 的 local metronome 使用 Tone.now（含 context lookAhead），而钢琴使用 immediate time；Follow/Realtime 的播放窗口 click 使用 getLiveAudioTime/immediate。原生测试保存两种 target 和 count-in callback 之后的整拍 handoff，不在 P7 借同步断言调整 API 或消除旧偏移。输出静音，不能据此声明可听/硬件同步。
