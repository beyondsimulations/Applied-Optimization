// core.js — pure helpers shared by the browser runtime (gamekit.js) and the
// Node checker (check.js). No DOM access. Loaded as a classic script in the
// browser and as an ES module in Node; both see globalThis.GamekitCore.
(function () {
  "use strict";

  // mulberry32: small seeded PRNG returning floats in [0, 1).
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function assertUniqueKeys(pieces) {
    const seen = new Set();
    for (const p of pieces) {
      if (seen.has(p.key)) throw new Error(`duplicate piece key "${p.key}"`);
      seen.add(p.key);
    }
  }

  // Match two piece lists by key. Order: the target list first (draw order of
  // the end state), then pieces that only exist in the source list.
  function pair(fromPieces, toPieces) {
    assertUniqueKeys(fromPieces);
    assertUniqueKeys(toPieces);
    const byKey = new Map(fromPieces.map((p) => [p.key, p]));
    const out = [];
    let entering = 0;
    for (const to of toPieces) {
      const from = byKey.get(to.key) || null;
      byKey.delete(to.key);
      out.push({ key: to.key, from, to, enter: from ? -1 : entering++ });
    }
    for (const from of byKey.values()) out.push({ key: from.key, from, to: null, enter: -1 });
    for (const p of out) p.entering = entering;
    return out;
  }

  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const isNumArray = (v) => Array.isArray(v) && v.every((x) => typeof x === "number");

  // A piece's color is a token name ("plan", "accent", "bad", ...) or an
  // [r, g, b] / [r, g, b, a] array. Always returns [r, g, b, a].
  function rgbOf(color, colors) {
    const c = isNumArray(color) ? color : colors[color] || colors.text || [0, 0, 0];
    return [c[0], c[1], c[2], c[3] == null ? 1 : c[3]];
  }
  function css(rgba) {
    const [r, g, b] = rgba.slice(0, 3).map(Math.round);
    const a = rgba[3] == null ? 1 : rgba[3];
    return a < 1 ? `rgb(${r} ${g} ${b} / ${+a.toFixed(3)})` : `rgb(${r} ${g} ${b})`;
  }

  // Copy of a piece with `paint` (a CSS color string) and a numeric `alpha`.
  function resolve(piece, colors) {
    const out = Object.assign({}, piece);
    out.paint = css(rgbOf(piece.color || "plan", colors));
    out.alpha = piece.alpha == null ? 1 : piece.alpha;
    return out;
  }

  function lerpPiece(from, to, t, fromColors, toColors) {
    const out = {};
    const keys = new Set(Object.keys(from).concat(Object.keys(to)));
    for (const k of keys) {
      const a = from[k];
      const b = to[k];
      if (k === "color") continue;
      if (typeof a === "number" && typeof b === "number") out[k] = a + (b - a) * t;
      else if (isNumArray(a) && isNumArray(b) && a.length === b.length) out[k] = a.map((v, i) => v + (b[i] - v) * t);
      else out[k] = t < 0.5 ? (a !== undefined ? a : b) : (b !== undefined ? b : a);
    }
    const ca = rgbOf(from.color || "plan", fromColors);
    const cb = rgbOf(to.color || "plan", toColors);
    out.paint = css(ca.map((v, i) => v + (cb[i] - v) * t));
    out.alpha = (from.alpha == null ? 1 : from.alpha) * (1 - t) + (to.alpha == null ? 1 : to.alpha) * t;
    return out;
  }

  // One frame of the morph at progress p in [0, 1]. Pieces in both lists
  // tween; pieces only in `from` fade out in the first half; pieces only in
  // `to` fade in one after another (staggered over the second half).
  function frame(pairs, p, fromColors, toColors) {
    const out = [];
    for (const pr of pairs) {
      if (pr.from && pr.to) {
        out.push(lerpPiece(pr.from, pr.to, ease(clamp01(p)), fromColors, toColors));
      } else if (pr.from) {
        const r = resolve(pr.from, fromColors);
        r.alpha *= 1 - ease(clamp01(p * 2));
        if (r.alpha > 0.001) out.push(r);
      } else {
        const start = 0.4 + (0.4 * pr.enter) / Math.max(1, pr.entering);
        const r = resolve(pr.to, toColors);
        r.alpha *= ease(clamp01((p - start) / 0.2));
        if (r.alpha > 0.001) out.push(r);
      }
    }
    return out;
  }

  // Parses the two forms a canvas returns from `ctx.fillStyle` into [r, g, b, a].
  function parseColor(s) {
    const str = String(s).trim();
    let m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(str);
    if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16), 1];
    m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/i.exec(str);
    if (m) return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] == null ? 1 : Number(m[4])];
    return null;
  }

  // Percent distance from the optimum. With an optimum of 0 a percentage is
  // undefined, so a non-zero score returns null instead of a misleading 0.
  function gap(score, optimum) {
    if (optimum === 0) return score === 0 ? 0 : null;
    return Math.round((100 * Math.abs(score - optimum)) / Math.abs(optimum));
  }

  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = (n) => String(n).split("").map((d) => SUP[Number(d)]).join("");

  function seconds(ms) {
    const s = ms / 1000;
    return (s < 0.01 ? s.toPrecision(1) : s.toFixed(2)) + " s";
  }

  // Think-card line from the solver's variable counts.
  // counts = { binary, integer, continuous, log10Combos }
  function thinkLine(counts, ms) {
    const n = counts.binary + counts.integer + counts.continuous;
    const time = "HiGHS: " + seconds(ms);
    if (counts.continuous > 0 || !Number.isFinite(counts.log10Combos)) {
      const kind = counts.binary + counts.integer === 0 ? "continuous decisions" : "decisions";
      return `${n} ${kind} → infinitely many plans · ${time}`;
    }
    const kind = counts.integer === 0 ? "yes/no decisions" : "whole-number decisions";
    const k = counts.log10Combos;
    const combos = k < 6 ? Math.round(Math.pow(10, k)).toLocaleString("en-US") : "10" + sup(Math.round(k));
    return `${n} ${kind} → ${combos} combinations · ${time}`;
  }

  // Canvas pixel buffer for a canvas shown at rectW × rectH CSS pixels. The
  // rect from getBoundingClientRect already includes reveal's slide scale.
  function pixelSize(rectW, rectH, dpr) {
    return { w: Math.round(rectW * dpr), h: Math.round(rectH * dpr) };
  }

  // "decides `x[i,j]` together" → text and code segments for the insight card.
  function codeSpans(str) {
    return String(str)
      .split("`")
      .map((text, i) => ({ code: i % 2 === 1, text }))
      .filter((s) => s.text !== "");
  }

  function formatScore(value, unit) {
    const n = (Math.round(value) + 0).toLocaleString("en-US"); // + 0 turns -0 into 0
    return unit ? `${n} ${unit}` : n;
  }

  // Draws text whose digits and capitals are centred on y: canvas's "middle"
  // baseline centres the font's em box, which leaves labels a little off the
  // middle of their boxes. align: "center" (default), "start" or "end".
  function fillCentred(ctx, text, x, y, align) {
    ctx.textAlign = align || "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, x, y + ctx.measureText("0").actualBoundingBoxAscent / 2);
  }

  globalThis.GamekitCore = {
    rng, pair, frame, resolve, assertUniqueKeys, parseColor, css, gap, thinkLine,
    pixelSize, codeSpans, formatScore, ease, fillCentred,
  };
})();
