# Optional legacy LED 参数化契约

两份硬件JS保留，`create(ports)`是唯一启动契约。加载文件只发布显式Window factory，不读取
外部AppState或核心命令；创建实例只分配私有对象、生成原helper session ID，不绑定DOM或网络。
应用提供typed narrow state、storage keys、range/MIDI/UI命令与native资源owner。LED不访问OSMD，
音乐预览与单手提前输入仍由已迁移核心维护。当前classic compatibility暂在原槽位组装，P9 bootstrap
将接管同一工厂；不能把classic脚本顺序作为最终模块系统。

普通行为与b77d935逐步对照：settings normalization/save/rerender、calibration payload/date/MIME/
append-click-remove-revoke、mapping/reverse/clamp、RGB/brightness、MIDI channel/velocity/note-off、
HTTP/helper URL/payload/sequence/session/fallback/status、扫灯hold/gap/step均保持。mode/IP更改仍
调用update init并触发原automatic checks，不取消普通并发。原默认migration仍禁用。

原生LED UI为31 listeners/21 dataset markers，MIDI test为1/1；重复init仅binding去重，保留原
state刷新顺序。owner持有自己timer/interval/rAF、pointer capture、pending FileReader、request
AbortController、download links/URLs和可结束的wait。completed requests/readers不再owned。
只explicit dispose释放资源、递增generation；fresh activate不改变旧token。await/catch/finally、
Promise callbacks与captured native callbacks均验证generation，不会恢复旧retry/输出/frame。
pending waits被解析为false，扫灯与flush不会永久悬挂。外部timer/marker不删除。

FileReader普通parse/error/alert仍旧顺序，silent native error/abort仍silent；dispose清自己的
callbacks并abort pending native read。下载普通click异常仍原warn/alert，残留owned资源在explicit
dispose释放。MIDI test仅有自己active run/notes时执行dispose stop；普通Stop仍旧行为。硬件
note-off抛错记录真实错误，native cleanup仍完成。核心继续拥有同一hardwareLEDState Map。

修正原adapter的plural `stopHealthChecks()`错误：实际方法为singular `stopHealthCheck()`。
重复dispose只cleanup一次；旧captured rAF在fresh start失效，不创建第二个LED循环。三个无消费者
staff Window forwards和原ambient LED命令删除，typed contract只描述仍被应用调用的接口。

测试：326项Node、232个生成文件；28页991项浏览器（default/no-op），3,000 ordinary commands、
10传输routes、2完整/取消MIDI sweeps旧版对照。新native页面20MB FileReader pending→abort、
captured old callback失效/fresh import、本地native fetch/signal.abort、calibration hold与resources归零。
偏好在内存、DB随机且结束只删除自己库；fixture不模拟native read/fetch。模拟输出不证明实体
WLED/MIDI或可听同步，最终bootstrap/严格配置/启动器门槛留后续P9。
