import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerLoopOverlay} from './loop-overlay';
import type {PianoTrainerOsmdAdapter} from '../score/osmd-adapter';
import type {LegacyAppState} from '../state/model';
// Stabilized notehead selection. Preserve candidate order, constants, dot rejection
// and chord cluster precedence; geometry does not decide matching or scoring.
export namespace PianoTrainerGeometry {
    export interface Anchor extends PianoTrainerDomain.SvgPoint {
        measureIndex: number;
        staffIndex: number;
    }
    export interface Ports {
        score: Pick<PianoTrainerOsmdAdapter.Service, 'getGraphicalNote' | 'getMeasureBox' |
            'getCursorElement' | 'getCurrentMeasureIndex' | 'getStaffTopY'>;
        document: Pick<Document, 'createElementNS'>;
        getSvg(): SVGSVGElement | null;
        getComputedStyle(node: Element): CSSStyleDeclaration;
        clearOverlays(): void;
        fallbackHands(): Pick<LegacyAppState['hands'], 'left' | 'right'>;
        describeNote(note: PianoTrainerOsmdVendor.Note, measure: number, staff: number): Readonly<Record<string, unknown>>;
        describeGraphicalNote(note: PianoTrainerOsmdVendor.GraphicalNote): Readonly<Record<string, unknown>>;
        debugLog(name: string, detail: Readonly<Record<string, unknown>>): void;
    }
    export function create(ports: Ports) {
        const engine = {
            unitsToPx: 10,
            noteAnchorCache: new WeakMap<PianoTrainerOsmdVendor.Note, Anchor>(),
            measureBoxCache: new Map<string, PianoTrainerLoopOverlay.Box>(),
            invalidate(): void { this.noteAnchorCache = new WeakMap(); this.measureBoxCache.clear(); ports.clearOverlays(); },
            getSvg(): SVGSVGElement | null { return ports.getSvg(); },
            getSvgViewBox(): DOMRect | SVGRect | null {
                const svg = this.getSvg();
                return svg?.viewBox?.baseVal || null;
            },
            getSvgClientRect(): DOMRect | null {
                const svg = this.getSvg();
                return svg ? svg.getBoundingClientRect() : null;
            },
            clientPointToSvg(clientX: number, clientY: number): PianoTrainerDomain.SvgPoint | null {
                const rect = this.getSvgClientRect();
                const viewBox = this.getSvgViewBox();
                if (!rect || !viewBox || rect.width === 0 || rect.height === 0)
                    return null;
                return {
                    x: ((clientX - rect.left) / rect.width) * viewBox.width + viewBox.x,
                    y: ((clientY - rect.top) / rect.height) * viewBox.height + viewBox.y
                };
            },
            getCursorSvgX(): number | null {
                const cursor = ports.score.getCursorElement();
                if (!cursor) return null;
                const rect = cursor.getBoundingClientRect();
                const point = this.clientPointToSvg(rect.left + rect.width / 2, rect.top + rect.height / 2);
                return point ? point.x : null;
            },
            resolveFeedbackAnchor(midi: number, targetStaffId: number | null, forceMIdx: number | null = null,
                anchorOrExactY: PianoTrainerDomain.SvgPoint | number | null = null): PianoTrainerDomain.SvgPoint | null {
                if (anchorOrExactY && typeof anchorOrExactY === 'object' && anchorOrExactY.x != null && anchorOrExactY.y != null) {
                    return {x: anchorOrExactY.x, y: anchorOrExactY.y};
                }
                let anchor = null;
                const cursor = ports.score.getCursorElement();
                if (cursor) {
                    const rect = cursor.getBoundingClientRect();
                    const center = this.clientPointToSvg(rect.left + rect.width / 2, rect.top + rect.height / 2);
                    if (center) {
                        let yPos;
                        if (typeof anchorOrExactY === 'number') yPos = anchorOrExactY;
                        else {
                            const mIdx = forceMIdx !== null ? forceMIdx : ports.score.getCurrentMeasureIndex();
                            if (!targetStaffId) {
                                const hands = ports.fallbackHands();
                                const fallbackStaffId = midi >= 60 ? hands.right : hands.left;
                                targetStaffId = fallbackStaffId ?? hands.right ?? 1;
                            }
                            const staffIdx = Math.max(0, (Number(targetStaffId) || 1) - 1);
                            const staffTopY = ports.score.getStaffTopY(mIdx, staffIdx);
                            const pitchMap = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
                            // Invalid pitches retain the original undefined-arithmetic NaN.
                            const step = (Math.floor(midi / 12) - 1) * 7 + (pitchMap[midi % 12] ?? NaN);
                            const fallbackAnchor = staffIdx === 0 ? 38 : 26;
                            yPos = staffTopY + (fallbackAnchor - step) * 5;
                        }
                        anchor = {x: center.x, y: yPos};
                    }
                }
                return anchor;
            },
            ensureGroup(id: string): Element | null {
                const svg = this.getSvg();
                if (!svg)
                    return null;
                let group = svg.querySelector(`#${id}`);
                if (!group) {
                    group = ports.document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    group.setAttribute('id', id);
                    group.setAttribute('pointer-events', 'none');
                    svg.appendChild(group);
                }
                return group;
            },
            makeNoteKey(sourceNote: PianoTrainerOsmdVendor.Note, measureIndex: number, staffIndex: number): string {
                const voice = sourceNote?.ParentVoiceEntry;
                const timestamp = voice?.Timestamp?.RealValue ?? 'na';
                const halfTone = sourceNote?.halfTone ?? 'na';
                const length = sourceNote?.Length?.RealValue ?? 'na';
                const staffId = sourceNote?.ParentStaff?.id ?? 'na';
                return `${measureIndex}|${staffIndex}|${staffId}|${timestamp}|${halfTone}|${length}`;
            },
            getNoteheadShape(graphicalNote: PianoTrainerOsmdVendor.GraphicalNote | null): PianoTrainerOsmdVendor.Shape | null {
                if (!graphicalNote)
                    return null;
                const directCandidates = [
                    graphicalNote.Notehead,
                    graphicalNote.notehead,
                    graphicalNote.NoteHead,
                    graphicalNote.noteHead,
                    graphicalNote.GraphicalNotehead,
                    graphicalNote.graphicalNotehead,
                    graphicalNote.graphicalNoteHead,
                    graphicalNote.NoteHeads?.[0],
                    graphicalNote.noteHeads?.[0],
                    graphicalNote.noteheadShape,
                    graphicalNote.NoteheadShape
                ].filter(Boolean);
                for (const candidate of directCandidates) {
                    if (candidate?.PositionAndShape?.AbsolutePosition) {
                        return candidate.PositionAndShape;
                    }
                }
                const mainShape = graphicalNote?.PositionAndShape;
                const mainCenterX = ((mainShape?.AbsolutePosition?.x ?? 0) + ((mainShape?.Size?.width ?? 0) / 2)) * this.unitsToPx;
                const mainCenterY = ((mainShape?.AbsolutePosition?.y ?? 0) + ((mainShape?.Size?.height ?? 0) / 2)) * this.unitsToPx;
                const seen = new WeakSet();
                const compactShapes: PianoTrainerOsmdVendor.Shape[] = [];
                const bannedPathPattern = /(fing|finger|technical|techniq|lyric|text|label|annotation|ornament|artic|dynam|tempo|express|rehears|string|pedal)/i;
                const visit = (node: unknown, depth = 0, path = '') => {
                    if (!node || typeof node !== 'object' || depth > 4)
                        return;
                    if (seen.has(node))
                        return;
                    seen.add(node);
                    if (path && bannedPathPattern.test(path))
                        return;
                    // Localized vendor reflection: inspect only the legacy shape surface.
                    const ps = Reflect.get(node, 'PositionAndShape') as PianoTrainerOsmdVendor.Shape | undefined;
                    if (ps?.AbsolutePosition && ps?.Size) {
                        const wPx = (ps.Size.width ?? 0) * this.unitsToPx;
                        const hPx = (ps.Size.height ?? 0) * this.unitsToPx;
                        if (wPx >= 3 && wPx <= 22 && hPx >= 3 && hPx <= 18) {
                            compactShapes.push(ps);
                        }
                    }
                    if (Array.isArray(node)) {
                        for (let idx = 0; idx < node.length; idx++) {
                            visit(node[idx], depth + 1, `${path}[${idx}]`);
                        }
                        return;
                    }
                    for (const key of Object.keys(node)) {
                        if (key === 'parent' || key === 'Parent' || key === 'sourceNote')
                            continue;
                        const nextPath = path ? `${path}.${key}` : key;
                        if (bannedPathPattern.test(nextPath))
                            continue;
                        try {
                            visit(Reflect.get(node, key), depth + 1, nextPath);
                        }
                        catch (e) { }
                    }
                };
                visit(graphicalNote, 0, 'graphicalNote');
                if (compactShapes.length === 0)
                    return null;
                compactShapes.sort((a, b) => {
                    const aw = (a.Size?.width ?? 0) * this.unitsToPx;
                    const ah = (a.Size?.height ?? 0) * this.unitsToPx;
                    const bw = (b.Size?.width ?? 0) * this.unitsToPx;
                    const bh = (b.Size?.height ?? 0) * this.unitsToPx;
                    const aArea = aw * ah;
                    const bArea = bw * bh;
                    const aCenterX = (a.AbsolutePosition.x + ((a.Size?.width ?? 0) / 2)) * this.unitsToPx;
                    const aCenterY = (a.AbsolutePosition.y + ((a.Size?.height ?? 0) / 2)) * this.unitsToPx;
                    const bCenterX = (b.AbsolutePosition.x + ((b.Size?.width ?? 0) / 2)) * this.unitsToPx;
                    const bCenterY = (b.AbsolutePosition.y + ((b.Size?.height ?? 0) / 2)) * this.unitsToPx;
                    const aAspect = aw / Math.max(ah, 0.001);
                    const bAspect = bw / Math.max(bh, 0.001);
                    const score = (area: number, aspect: number, cx: number, cy: number) => {
                        const areaPenalty = Math.abs(area - 70);
                        const aspectPenalty = Math.abs(aspect - 1.6) * 18;
                        const distPenalty = Math.abs(cx - mainCenterX) * 0.65 + Math.abs(cy - mainCenterY) * 0.45;
                        return areaPenalty + aspectPenalty + distPenalty;
                    };
                    return score(aArea, aAspect, aCenterX, aCenterY) - score(bArea, bAspect, bCenterX, bCenterY);
                });
                // The dense collected list passed the nonempty guard above.
                return compactShapes[0]!;
            },
            getSvgNoteheadAnchor(graphicalNote: PianoTrainerOsmdVendor.GraphicalNote | null, preferredAnchor: PianoTrainerDomain.SvgPoint | null = null, debugContext: Readonly<Record<string, unknown>> | null = null): PianoTrainerDomain.SvgPoint | null {
                if (!graphicalNote?.getSVGGElement)
                    return null;
                let root = null;
                try {
                    root = graphicalNote.getSVGGElement();
                }
                catch (e) {
                    root = null;
                }
                if (!root || !root.querySelectorAll)
                    return null;
                const rootBox = (() => {
                    try {
                        return root.getBBox();
                    }
                    catch (e) {
                        return null;
                    }
                })();
                const rootCenterX = rootBox ? (rootBox.x + rootBox.width / 2) : null;
                const rootCenterY = rootBox ? (rootBox.y + rootBox.height / 2) : null;
                const preferredX = preferredAnchor?.x ?? null;
                const preferredY = preferredAnchor?.y ?? null;
                const nodes = Array.from(root.querySelectorAll<SVGGraphicsElement>('*'));
                const candidates: {
                    node: SVGGraphicsElement;
                    box: DOMRect;
                    score: number;
                }[] = [];
                for (const node of nodes) {
                    if (!node || typeof node.getBBox !== 'function')
                        continue;
                    const tag = (node.tagName || '').toLowerCase();
                    if (!['path', 'ellipse', 'circle', 'polygon'].includes(tag))
                        continue;
                    let box;
                    try {
                        box = node.getBBox();
                    }
                    catch (e) {
                        continue;
                    }
                    const w = box?.width ?? 0;
                    const h = box?.height ?? 0;
                    if (w < 3 || w > 24 || h < 3 || h > 18)
                        continue;
                    const aspect = w / Math.max(h, 0.001);
                    if (aspect < 0.45 || aspect > 3.2)
                        continue;
                    const cx = box.x + w / 2;
                    const cy = box.y + h / 2;
                    const fill = (node.getAttribute('fill') || ports.getComputedStyle(node).fill || '').toLowerCase();
                    const stroke = (node.getAttribute('stroke') || ports.getComputedStyle(node).stroke || '').toLowerCase();
                    const filled = fill && fill !== 'none' && fill !== 'transparent' && !fill.includes('rgba(0, 0, 0, 0)');
                    const stroked = stroke && stroke !== 'none' && stroke !== 'transparent' && !stroke.includes('rgba(0, 0, 0, 0)');
                    // Geometry-only junk rejection:
                    // keep fixed17 scoring/fallback intact, but ignore tiny dot-like shapes
                    // that sit slightly to the right of the preferred notehead center.
                    const dx = preferredX == null ? 0 : Math.abs(cx - preferredX);
                    const dy = preferredY == null ? 0 : Math.abs(cy - preferredY);
                    const area = w * h;
                    const relDx = preferredX == null ? null : (cx - preferredX);
                    const relDy = preferredY == null ? null : (cy - preferredY);
                    // The conditions below require both preferred coordinates,
                    // so their correlated relative distances are non-null.
                    const isTinyDotLike = (w <= 9.5 && h <= 9.5) || area <= 52;
                    const isRoundDotLike = aspect >= 0.65 && aspect <= 1.55;
                    const isRightSideDotLike = preferredX != null && preferredY != null &&
                        relDx! >= 2 && relDx! <= 18 && Math.abs(relDy!) <= 5.6 &&
                        isTinyDotLike && isRoundDotLike;
                    const isVerticalDotLike = preferredX != null && preferredY != null &&
                        Math.abs(relDx!) <= 4.6 && Math.abs(relDy!) >= 2 && Math.abs(relDy!) <= 14 &&
                        isTinyDotLike && isRoundDotLike;
                    const isDiagonalRightDotLike = preferredX != null && preferredY != null &&
                        relDx! >= 2 && relDx! <= 14 && Math.abs(relDy!) >= 2 && Math.abs(relDy!) <= 8 &&
                        isTinyDotLike && isRoundDotLike;
                    if (isRightSideDotLike || isVerticalDotLike || isDiagonalRightDotLike) {
                        ports.debugLog('SVG_NOTEHEAD_REJECT_DOTLIKE', {
                            context: debugContext,
                            preferredAnchor,
                            rejected: {
                                x: cx,
                                y: cy,
                                w,
                                h,
                                area,
                                aspect,
                                dx: relDx,
                                dy: relDy,
                                reason: isRightSideDotLike ? 'right-side-dot' : (isVerticalDotLike ? 'vertical-dot' : 'diagonal-right-dot')
                            }
                        });
                        continue;
                    }
                    const areaPenalty = Math.abs(area - 70);
                    const aspectPenalty = Math.abs(aspect - 1.6) * 18;
                    const centerXPenalty = rootCenterX == null ? 0 : Math.abs(cx - rootCenterX) * 0.25;
                    const centerYPenalty = rootCenterY == null ? 0 : Math.abs(cy - rootCenterY) * 0.1;
                    const preferredXPenalty = preferredX == null ? 0 : Math.abs(cx - preferredX) * 0.5;
                    const preferredYPenalty = preferredY == null ? 0 : Math.abs(cy - preferredY) * 2.8;
                    const fillBonus = filled ? -18 : 0;
                    const strokePenalty = filled ? 0 : (stroked ? 6 : 10);
                    const score = areaPenalty + aspectPenalty + centerXPenalty + centerYPenalty + preferredXPenalty + preferredYPenalty + fillBonus + strokePenalty;
                    candidates.push({ node, box, score });
                }
                if (candidates.length === 0) {
                    ports.debugLog('SVG_NOTEHEAD_CANDIDATES_NONE', {
                        context: debugContext,
                        preferredAnchor
                    });
                    return null;
                }
                candidates.sort((a, b) => a.score - b.score);
                const selectCandidate = (() => {
                    if (preferredX == null && preferredY == null)
                        return candidates[0]!;
                    const annotate = (items: typeof candidates) => items.map(c => {
                        const cx = c.box.x + (c.box.width / 2);
                        const cy = c.box.y + (c.box.height / 2);
                        return {
                            entry: c,
                            cx,
                            cy,
                            xDistance: preferredX == null ? 0 : Math.abs(cx - preferredX),
                            yDistance: preferredY == null ? 0 : Math.abs(cy - preferredY)
                        };
                    });
                    const topScore = candidates[0]!.score;
                    const closeScoreCandidates = candidates.filter(c => (c.score - topScore) <= 18);
                    const closeScoreAnnotated = annotate(closeScoreCandidates);
                    const closeScoreMinCx = closeScoreAnnotated.length ? Math.min(...closeScoreAnnotated.map(item => item.cx)) : null;
                    const closeScoreMaxCx = closeScoreAnnotated.length ? Math.max(...closeScoreAnnotated.map(item => item.cx)) : null;
                    const closeScoreXSpan = (closeScoreMinCx == null || closeScoreMaxCx == null) ? Infinity : (closeScoreMaxCx - closeScoreMinCx);
                    const useChordClusterTieBreak = preferredY != null && closeScoreAnnotated.length > 1 && closeScoreXSpan <= 18;
                    const anchorNeighborhood = useChordClusterTieBreak
                        ? []
                        : annotate(candidates).filter(item => item.xDistance <= 14 && item.yDistance <= 10);
                    const geometricPool = useChordClusterTieBreak
                        ? closeScoreAnnotated
                        : (anchorNeighborhood.length > 0 ? anchorNeighborhood : closeScoreAnnotated);
                    if (geometricPool.length <= 1)
                        return geometricPool[0]?.entry || closeScoreCandidates[0] || candidates[0]!;
                    const ranked = geometricPool.sort((a, b) => {
                        if (useChordClusterTieBreak) {
                            if (a.yDistance !== b.yDistance)
                                return a.yDistance - b.yDistance;
                            if (a.xDistance !== b.xDistance)
                                return a.xDistance - b.xDistance;
                            return a.entry.score - b.entry.score;
                        }
                        if (a.xDistance !== b.xDistance)
                            return a.xDistance - b.xDistance;
                        if (a.yDistance !== b.yDistance)
                            return a.yDistance - b.yDistance;
                        return a.entry.score - b.entry.score;
                    });
                    const winner = ranked[0]?.entry || candidates[0]!;
                    const logType = useChordClusterTieBreak
                        ? 'SVG_NOTEHEAD_CHORD_CLUSTER_TIEBREAK'
                        : (anchorNeighborhood.length > 0 ? 'SVG_NOTEHEAD_ANCHOR_NEIGHBORHOOD_TIEBREAK' : 'SVG_NOTEHEAD_X_PROXIMITY_TIEBREAK');
                    ports.debugLog(logType, {
                        context: debugContext,
                        preferredAnchor,
                        topScore,
                        sameClusterXSpan: closeScoreXSpan,
                        usedAnchorNeighborhood: anchorNeighborhood.length > 0,
                        shortlisted: ranked.map(item => ({
                            x: item.cx,
                            y: item.cy,
                            w: item.entry.box.width,
                            h: item.entry.box.height,
                            score: item.entry.score,
                            xDistance: item.xDistance,
                            yDistance: item.yDistance
                        })),
                        chosen: {
                            x: winner.box.x + (winner.box.width / 2),
                            y: winner.box.y + (winner.box.height / 2),
                            w: winner.box.width,
                            h: winner.box.height,
                            score: winner.score
                        }
                    });
                    return winner;
                })();
                const best = selectCandidate.box;
                const selected = {
                    x: best.x + (best.width / 2),
                    y: best.y + (best.height / 2)
                };
                ports.debugLog('SVG_NOTEHEAD_CANDIDATES', {
                    context: debugContext,
                    preferredAnchor,
                    selected,
                    candidates: candidates.slice(0, 6).map(c => ({
                        x: c.box.x + (c.box.width / 2),
                        y: c.box.y + (c.box.height / 2),
                        w: c.box.width,
                        h: c.box.height,
                        score: c.score
                    }))
                });
                return selected;
            },
            getSafeFallbackAnchor(graphicalNote: PianoTrainerOsmdVendor.GraphicalNote | null, measureIndex: number, staffIndex: number): Anchor | null {
                const noteheadShape = this.getNoteheadShape(graphicalNote);
                const shape = noteheadShape || graphicalNote?.PositionAndShape;
                if (!shape?.AbsolutePosition)
                    return null;
                return {
                    x: (shape.AbsolutePosition.x + ((shape.Size?.width || 0) / 2)) * this.unitsToPx,
                    y: (shape.AbsolutePosition.y + ((shape.Size?.height || 0) / 2)) * this.unitsToPx,
                    measureIndex,
                    staffIndex
                };
            },
            getNoteAnchor(sourceNote: PianoTrainerOsmdVendor.Note, measureIndex: number, staffIndex: number): Anchor | null {
                if (this.noteAnchorCache.has(sourceNote)) {
                    const cached = this.noteAnchorCache.get(sourceNote);
                    ports.debugLog('ANCHOR_CACHE_HIT', {
                        note: ports.describeNote(sourceNote, measureIndex, staffIndex),
                        anchor: cached ? { x: cached.x, y: cached.y, measureIndex: cached.measureIndex, staffIndex: cached.staffIndex } : null
                    });
                    return cached!;
                }
                const debugContext = {
                    note: ports.describeNote(sourceNote, measureIndex, staffIndex),
                    noteKey: this.makeNoteKey(sourceNote, measureIndex, staffIndex)
                };
                const graphicalNote = ports.score.getGraphicalNote(sourceNote, measureIndex, staffIndex);
                if (!graphicalNote) {
                    ports.debugLog('ANCHOR_GRAPHICAL_NOTE_MISSING', debugContext);
                    return null;
                }
                let anchor: Anchor | null = null;
                let preferredAnchor: Anchor | null = null;
                const noteheadShape = this.getNoteheadShape(graphicalNote);
                if (noteheadShape?.AbsolutePosition) {
                    preferredAnchor = {
                        x: (noteheadShape.AbsolutePosition.x + ((noteheadShape.Size?.width || 0) / 2)) * this.unitsToPx,
                        y: (noteheadShape.AbsolutePosition.y + ((noteheadShape.Size?.height || 0) / 2)) * this.unitsToPx,
                        measureIndex,
                        staffIndex
                    };
                }
                else {
                    preferredAnchor = this.getSafeFallbackAnchor(graphicalNote, measureIndex, staffIndex);
                }
                ports.debugLog('ANCHOR_PREFERRED', {
                    ...debugContext,
                    graphical: ports.describeGraphicalNote(graphicalNote),
                    preferredAnchor
                });
                const svgAnchor = this.getSvgNoteheadAnchor(graphicalNote, preferredAnchor, debugContext);
                if (svgAnchor) {
                    anchor = {
                        x: svgAnchor.x,
                        y: svgAnchor.y,
                        measureIndex,
                        staffIndex
                    };
                }
                else {
                    anchor = preferredAnchor;
                }
                ports.debugLog('ANCHOR_FINAL', {
                    ...debugContext,
                    preferredAnchor,
                    svgAnchor,
                    finalAnchor: anchor
                });
                if (anchor)
                    this.noteAnchorCache.set(sourceNote, anchor);
                return anchor;
            },
            getMeasureBox(measureIndex: number, staffIndex = 0): PianoTrainerLoopOverlay.Box | null {
                const key = `${measureIndex}|${staffIndex}`;
                if (this.measureBoxCache.has(key))
                    return this.measureBoxCache.get(key)!;
                const box = ports.score.getMeasureBox(measureIndex, staffIndex, this.unitsToPx);
                if (box)
                    this.measureBoxCache.set(key, box);
                return box;
            }
        };
        return engine;
    }
    export type Service = ReturnType<typeof create>;
}
