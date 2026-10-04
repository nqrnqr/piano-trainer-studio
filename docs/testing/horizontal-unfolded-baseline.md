# 横向展开基线与人工期望

日期：2026-10-04；HEAD `fddd3ac`。`npm run check`：346/346 通过。

所有顺序以下均用 **0 起点结构索引**，不使用 MusicXML 的 number。

| 谱例 | 人工期望小节路径 | 目的 |
| --- | --- | --- |
| simple-repeat.musicxml | 0,1,0,1,2 | 两小节反复；第二份 0 应在第一份 1 右侧 |
| first-second-ending.musicxml | 0,1,2,0,1,3,4 | 一房/二房（现有五小节谱例） |
| horizontal-single.musicxml（新增） | 0,0,1 | 单小节单和弦反复 |
| horizontal-voices.musicxml（新增） | 0,1,0,1,2 | 多 part、多谱表、同音多声部、装饰音、休止、继承调号 |

旧横向模式只禁用换行，源 cursor 反复后回到原小节。旧 score-display 浏览器断言明确要求“Backward repeat/seek converges”；本轮需将自动反复与主动导航分开。

调度基线：coordinator 先建立当前待弹组，再 advance 预取下一组，Wait 满足输入前不 update 可见 cursor；Follow 使用既有命中后的延迟；Realtime 使用既有 anchorTime。
Loop 在既有等待窗口末尾 reset 到 min，小节范围以原谱表达；计分/反馈在 restart 时清空，count-in 时机保持。

保留三模式音频/MIDI路由与调度，显示服务不创建判定或音频事件。真实设备输出不在本轮自动测试范围。
