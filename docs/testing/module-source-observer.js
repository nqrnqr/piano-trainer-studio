// Test entry only: resolve actual bundled stack frames through the served map.
// Native resource fixtures retain their original nearest-owner attribution.
window.createModuleSourceObserver = function (payload) {
    const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const digits=new Map([...alphabet].map((character,index) => [character,index]));
    let source=0,originalLine=0,originalColumn=0,name=0;
    const lines=payload.mappings.split(';').map(line => {
        let column=0;
        return line ? line.split(',').map(segment => {
            const fields=[];
            let value=0,shift=0;
            for(const character of segment) {
                const digit=digits.get(character);
                if(digit===undefined)throw Error('Invalid source map digit');
                value+=(digit&31)*2**shift;
                if(digit&32) {shift+=5;continue;}
                fields.push(value&1 ? -(value>>1) : value>>1);value=0;shift=0;
            }
            if(shift||![1,4,5].includes(fields.length))throw Error('Invalid source map segment');
            column+=fields[0];
            if(fields.length===1)return {column,position:null};
            source+=fields[1];originalLine+=fields[2];originalColumn+=fields[3];
            if(fields.length===5)name+=fields[4];
            if(!payload.sources[source])throw Error('Invalid source map source');
            return {column,position:{source:payload.sources[source],originalLine,originalColumn}};
        }) : [];
    });
    function positionAt(line,column) {
        const entries=lines[line];
        if(!entries||!Number.isInteger(line)||column<0)return null;
        let low=0,high=entries.length;
        while(low<high) {const middle=(low+high)>>1;if(entries[middle].column<=column)low=middle+1;else high=middle;}
        return low ? entries[low-1].position : null;
    }
    function stackSources(stack) {
        return [...String(stack||'').matchAll(/test-app\.js(?:\?[^\s:)]*)?:(\d+):(\d+)/g)]
            .map(match => positionAt(Number(match[1])-1,Number(match[2])-1)?.source)
            .filter(Boolean);
    }
    function nearestUi(stack,modules) {
        for(const source of stackSources(stack)) {
            const match=source.match(/\/ui\/([\w-]+)\.ts$/);
            if(!match||match[1]==='controls-dom')continue;
            return modules.includes(match[1])?match[1]:undefined;
        }
    }
    return Object.freeze({positionAt,stackSources,nearestUi,
        includesSource:(stack,suffix) => stackSources(stack).some(source => source.endsWith(suffix))});
};
