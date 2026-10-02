# P6 输入与判定迁移契约

基线：`7a53e65`。迁移保持共享对象、Map/Set 身份及原调用顺序；数组仍按原算法替换。调度推进留到 P7。

| 入口 | 读取 | 写入 | 副作用顺序 |
| --- | --- | --- | --- |
| triggerVirtualKey / press | playing、mode、practice、calibration、expected、sustain | pressedKeys；预留与持有集合；分数；wrong flag；expected.hit | pressed.add → audio on → calibration（可提前返回）→ expected match → satisfied/sustain match → repeat carry → realtime upcoming → single hand grace → debug → feedback → score/held → score UI → hit=true → Wait/Follow advance → keyboard/LED 呈现 |
| triggerVirtualKey / release | reservation.allowTapCarry、held incorrect marker | pressed/held/preExpected 删除；不允许 tap carry 的预留删除；错音历史 | 删除输入状态 → held incorrect 转 released → overlay → audio off → keyboard/LED |
| findExpectedMatchForMidi | expected、debug flag、显示 cursor X | 无 | 过滤未命中同音；单候选或无 X 取首项；否则稳定排序取最近 X；保留候选与选择日志 |
| buildExpectedNotesFromEntries | source entry/staff/hand、practice、mode、BPM/speed、range、reservation/pressed | expected/visual/out-of-range 数组；wrong flag；命中与持有；correct；已消费/过去预留 | 清空数组 → 按 entry/note 原顺序过滤 → staff\|midi 去重与最长 visual 合并 → 发布数组 → 清 wrong flag → 消费预留并逐音 feedback/score → 清预留 → 一次 score UI → debug |
| processMissedNotes | expected.hit、mode、wrong flag | wrong（每个未命中项） | 非 suppressed 项逐音 feedback → wrong++ → 最后一次 score UI；不把漏音标为 hit |
| single hand grace | hand、playing、mode、context、shared timeline、expected.hit | reservation、held、preExpected | 只在当前期望全中/空时预留下一个练习手事件；Follow 允许释放后携带；Realtime ≤1.05 拍允许 tap carry |
| realtime upcoming | context、shared traversal index、timeline、practice | reservation、held、preExpected | 从当前遍历索引向前找 ≤1.1 拍目标；只允许持续按住，不允许 tap carry |
| visual sustain | pending/sustained、mode、谱面 timestamp | pending 数组清空；sustained；activeTimeouts | 同小节同谱表同音忽略；跨小节同音先移除/重绘，35ms 后重启；有 finite endTimestamp 的 Wait/Follow 沿谱面过期，其余沿原 duration timer 过期 |

同音跨谱表保留两个期望对象，匹配逐次消费；同谱表同音保留首次对象，只有首项 anchor 缺失时采用后项 anchor/ref。tie 长度按原显式链接/Notes 查找和循环保护计算；不改成新的连音展开算法。隐藏/cue/rest/tie continuation 不产生攻击期望，可见 grace 沿用现有行为。

反馈状态由 practice 管理，几何通过端口解析，SVG 由 render 绘制。Keyboard 原呈现入口内的谱面 sustain pruning / preExpected 标记移入 practice 端口，调用位置不变。计时器仍登记到原 activeTimeouts，由原 clearVisuals 取消，P6 不新增取消规则。
