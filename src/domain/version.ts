// Preserve the application's loose version comparison, including coercion/fallbacks.
namespace PianoTrainerVersion {
    export function compareSemverLoose(a: unknown, b: unknown) {
        const parse = (value: unknown) => String(value || '')
            .trim()
            .replace(/^[^\d]*/, '')
            .split(/[\.-]/)
            .map(part => {
            const n = Number(part);
            return Number.isFinite(n) ? n : 0;
        });
        const aa = parse(a);
        const bb = parse(b);
        const len = Math.max(aa.length, bb.length, 3);
        for (let i = 0; i < len; i++) {
            const av = aa[i] || 0;
            const bv = bb[i] || 0;
            if (av > bv)
                return 1;
            if (av < bv)
                return -1;
        }
        return 0;
    }
}
