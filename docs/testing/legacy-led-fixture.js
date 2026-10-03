// Test-only observation; file reads and fetch still use native implementations.
(() => {
 const readers=[],signals=[],NativeReader=window.FileReader,originalFetch=window.fetch.bind(window);
 window.FileReader=class extends NativeReader {constructor(){super();readers.push(this);}};
 window.fetch=(input,options)=>{if(String(input).includes('/win&T=1'))signals.push(options.signal);return originalFetch(input,options);};
 window.__PT_LEGACY_LED_FIXTURE__={readers,signals};
})();
