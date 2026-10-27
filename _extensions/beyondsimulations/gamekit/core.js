// core.js — pure helpers shared by the browser runtime (gamekit.js) and the
// Node checker (check.js). No DOM access. Loaded as a classic script in the
// browser and as an ES module in Node; both see globalThis.GamekitCore.
(function () {
  "use strict";

  // The runtime's own texts per language (a game's texts are the game's). The
  // browser runtime picks one from the page's `lang`; Node (check.js) and
  // languages without a table use English.
  const TEXTS = {
    en: {
      locale: "en-US", decimal: ".",
      optimize: "Optimize", why: "Why?", reset: "Reset", fresh: "New", freshLabel: "New puzzle", close: "Close",
      yours: "Yours", optimal: "Optimal", showYours: "Show yours", showOptimal: "Show optimal", you: "You",
      thinking: "Thinking…", ready: "Ready: press Optimize to compare with the best plan.",
      missing: (name) => `Gamekit: game "${name}" was not found.`, qr: "QR code: ",
      solverLoad: "The solver failed to load.", solver: "Solver: ",
      decisions: "decisions", continuous: "continuous decisions", yesNo: "yes/no decisions",
      whole: "whole-number decisions", infinite: "infinitely many plans", combinations: "combinations",
      and: "and",
    },
    // German without du or Sie, so it fits courses of either kind
    de: {
      locale: "de-DE", decimal: ",",
      optimize: "Optimieren", why: "Warum?", reset: "Reset", fresh: "Neu", freshLabel: "Neue Aufgabe", close: "Schließen",
      yours: "Eigener", optimal: "Optimal", showYours: "Eigenen Plan zeigen", showOptimal: "Optimalen Plan zeigen",
      you: "Eigener Plan",
      thinking: "Rechne …", ready: "Bereit: „Optimieren“ vergleicht den Plan mit dem besten.",
      missing: (name) => `Gamekit: Das Spiel „${name}“ wurde nicht gefunden.`, qr: "QR-Code: ",
      solverLoad: "Der Solver konnte nicht geladen werden.", solver: "Solver: ",
      decisions: "Entscheidungen", continuous: "stetige Entscheidungen", yesNo: "Ja/Nein-Entscheidungen",
      whole: "ganzzahlige Entscheidungen", infinite: "unendlich viele Pläne", combinations: "Kombinationen",
      and: "und",
    },
  };
  let T = TEXTS.en;
  // "de", "de-DE", "DE" → the German table; returns the table now in use.
  function setLang(lang) {
    T = TEXTS[String(lang || "").slice(0, 2).toLowerCase()] || TEXTS.en;
    return T;
  }

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
    // a canvas serializes color-mix() as color(srgb 0.35 0.36 0.37)
    m = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i.exec(str);
    if (m) return [Math.round(m[1] * 255), Math.round(m[2] * 255), Math.round(m[3] * 255), m[4] == null ? 1 : Number(m[4])];
    return null;
  }

  // WCAG relative luminance and contrast ratio of two [r, g, b] colors
  function luminance(c) {
    const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(a, b) {
    const x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  // A fill token moved away from the background in 4% steps until it reaches
  // 4.5:1, so that text in the page color on a fill stays readable in every
  // theme and mode. Toward black above luminance 0.179 (where black contrasts
  // more than white), toward white below. Alpha is kept but not measured: a
  // translucent fill blends with the page and gets no real guarantee.
  function fillOnBg(c, bg) {
    const end = luminance(bg) > 0.179 ? 0 : 255;
    let out = c;
    for (let i = 0; i < 25 && contrast(out, bg) < 4.5; i++) {
      out = [...c.slice(0, 3).map((v, k) => v + (end - v) * 0.04 * (i + 1)), c[3]];
    }
    return out.map((v, k) => (k < 3 ? Math.round(v) : v));
  }

  // Percent distance from the optimum. With an optimum of 0 a percentage is
  // undefined, so a non-zero score returns null instead of a misleading 0.
  function gap(score, optimum) {
    if (optimum === 0) return score === 0 ? 0 : null;
    return Math.round((100 * Math.abs(score - optimum)) / Math.abs(optimum));
  }

  // 12 → "¹²" or "₁₂": a minus is raised or lowered too, anything else (a
  // decimal point) stays as it is instead of vanishing
  const digitsIn = (table, minus) => (n) =>
    String(n).split("").map((d) => (d >= "0" && d <= "9" ? table[Number(d)] : d === "-" ? minus : d)).join("");
  const sup = digitsIn("⁰¹²³⁴⁵⁶⁷⁸⁹", "⁻");
  // for names like X₁ or P₁₂ in a game's texts
  const subscript = digitsIn("₀₁₂₃₄₅₆₇₈₉", "₋");

  function seconds(ms) {
    const s = ms / 1000;
    return (s < 0.01 ? s.toPrecision(1) : s.toFixed(2)).replace(".", T.decimal) + " s";
  }

  // Think-card line from the solver's variable counts.
  // counts = { binary, integer, continuous, log10Combos }
  function thinkLine(counts, ms) {
    const n = counts.binary + counts.integer + counts.continuous;
    const time = "HiGHS: " + seconds(ms);
    if (counts.continuous > 0 || !Number.isFinite(counts.log10Combos)) {
      const kind = counts.binary + counts.integer === 0 ? T.continuous : T.decisions;
      return `${n} ${kind} → ${T.infinite} · ${time}`;
    }
    const kind = counts.integer === 0 ? T.yesNo : T.whole;
    const k = counts.log10Combos;
    const combos = k < 6 ? Math.round(Math.pow(10, k)).toLocaleString(T.locale) : "10" + sup(Math.round(k));
    return `${n} ${kind} → ${combos} ${T.combinations} · ${time}`;
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

  // unit: a string, or [singular, plural] (e.g. ["crate", "crates"]); digits:
  // decimal places for games whose optimum is not whole (default 0)
  function formatScore(value, unit, digits) {
    const f = Math.pow(10, digits || 0);
    const r = Math.round(value * f) / f + 0; // + 0 turns -0 into 0
    const n = r.toLocaleString(T.locale, { maximumFractionDigits: digits || 0 });
    const u = Array.isArray(unit) ? unit[r === 1 ? 0 : 1] : unit;
    return u ? `${n} ${u}` : n;
  }

  // Draws text whose digits and capitals are centred on y: canvas's "middle"
  // baseline centres the font's em box, which leaves labels a little off the
  // middle of their boxes. align: "center" (default), "start" or "end".
  const centredBaseline = (ctx, y) => y + ctx.measureText("0").actualBoundingBoxAscent / 2;
  function fillCentred(ctx, text, x, y, align) {
    ctx.textAlign = align || "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, x, centredBaseline(ctx, y));
  }

  // Words into lines no wider than `w` at the context's current font.
  function wrapText(ctx, text, w) {
    const lines = [];
    let line = "";
    for (const word of text.split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > w) { lines.push(line); line = word; } else line = next;
    }
    return line ? [...lines, line] : lines;
  }

  // ["a", "b", "c"] → "a, b and c" in the page's language ("a, b und c")
  function joinList(xs) {
    return xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} ${T.and} ${xs[xs.length - 1]}`;
  }

  // One line in several fonts, e.g. a bold label and its value or a symbol with a
  // subscript: runs = [[text, font, dy?], …], dy moves a run down (board units).
  // Like fillCentred: centred on y (measured on the first run's font) and align
  // "center" (default), "start"/"left" or "end"/"right". Leaves the first run's
  // font set and returns the line's width.
  function fillRuns(ctx, runs, x, y, align) {
    ctx.font = runs[0][1];
    const base = centredBaseline(ctx, y);
    const widths = runs.map(([text, font]) => { ctx.font = font; return ctx.measureText(text).width; });
    const total = widths.reduce((a, b) => a + b, 0);
    const a = align || "center";
    let px = a === "end" || a === "right" ? x - total : a === "center" ? x - total / 2 : x;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    runs.forEach(([text, font, dy], i) => {
      ctx.font = font;
      ctx.fillText(text, px, base + (dy || 0));
      px += widths[i];
    });
    ctx.font = runs[0][1];
    return total;
  }

  // a game's goal: "max" or "min", or a function of the puzzle when the direction
  // differs between puzzles; check.js and a game's own texts read it here
  const goalOf = (def, puzzle) => (typeof def.goal === "function" ? def.goal(puzzle) : def.goal);

  globalThis.GamekitCore = {
    rng, pair, frame, resolve, assertUniqueKeys, parseColor, css, contrast, fillOnBg, gap, thinkLine, seconds,
    pixelSize, codeSpans, formatScore, ease, fillCentred, wrapText, setLang, joinList, subscript, fillRuns, goalOf,
  };
})();
