// wind.js — lecture 02: build wind turbines on candidate sites; neighbours in a
// turbine's wind shadow can't be built. Adding sites shows how long a loop
// that tries every plan would run as the problem grows.
(function () {
  const { fillCentred } = GamekitCore;
  const START = 10;    // sites on the map at first
  const STEP = 10;     // sites added per tap on the button
  const RATE = 1e9;    // combinations per second: a generous loop
  const W = 160;       // the world: 160 × 100 units, sites at least SEP apart
  const H = 100;
  const SEP = 7;
  const SHADOW = 15;   // two turbines closer than this take each other's wind
  const YEAR = 365.25 * 24 * 3600;
  const UNIVERSE = 13.8e9; // age of the universe in years

  // Two layouts in board units: the map, then the loop clock with the button,
  // both flush with the task text above. On slides the board stretches to the
  // stage's width (view.w), so the map spans the whole column.
  const COMPACT = { h: 101, map: { x: 0.15, y: 0.15, w: 99.7, h: 66.85 }, more: { x: 0.15, y: 85, w: 40, h: 13 },
    clock: [0, 76.25], reach: 5 }; // clock: left edge and the middle of its two lines
  const WIDE_H = 70;
  function lay(view) {
    if (view && view.compact) return COMPACT;
    const w = (view && view.w) || 100;
    return { h: WIDE_H, map: { x: 0.15, y: 0.15, w: w - 0.3, h: 54.85 }, more: { x: 0.15, y: 59.5, w: 22, h: 9 },
      clock: [25.5, 64], reach: 3.5 }; // the clock's two lines centred on the button
  }

  const fmt = (n) => n.toLocaleString("en-US");
  const plural = (n, word) => `${fmt(n)} ${word}${n === 1 ? "" : "s"}`;
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const power = (n) => "2" + String(n).split("").map((d) => SUP[d]).join("");
  const two = (x) => Number(x.toPrecision(2));
  const built = (p, plan) => p.e.map((_, i) => i).filter((i) => i < plan.n && plan.on[i]);
  const energy = (p, plan) => built(p, plan).reduce((s, i) => s + p.e[i], 0);
  const near = (p, i, j) => Math.hypot(p.x[i] - p.x[j], p.y[i] - p.y[j]) < SHADOW;
  // pairs of built turbines that stand in each other's wind shadow
  function clashes(p, plan) {
    const b = built(p, plan);
    const out = [];
    for (let a = 0; a < b.length; a++) for (let c = a + 1; c < b.length; c++) if (near(p, b[a], b[c])) out.push([b[a], b[c]]);
    return out;
  }
  // energy of "always build the biggest free site" (ties: the more central site)
  function biggestFirst(p, n) {
    const on = [];
    let sum = 0;
    for (const i of p.e.map((_, k) => k).filter((k) => k < n).sort((a, b) => p.e[b] - p.e[a] || a - b)) {
      if (on.every((j) => !near(p, i, j))) { on.push(i); sum += p.e[i]; }
    }
    return sum;
  }

  // How long a loop needs for all 2^n combinations, at RATE per second.
  function loopTime(n) {
    const s = Math.pow(2, n) / RATE;
    const y = s / YEAR;
    if (s < 1e-3) return `${two(s * 1e6)} µs`;
    if (s < 1) return `${two(s * 1e3)} ms`;
    if (s < 60) return plural(two(s), "second");
    if (s < 3600) return plural(two(s / 60), "minute");
    if (s < 86400) return plural(two(s / 3600), "hour");
    if (y < 1) return plural(two(s / 86400), "day");
    if (y < 1e6) return plural(two(y), "year");
    if (y < 1e9) return `${two(y / 1e6)} million years`;
    if (y < UNIVERSE) return `${two(y / 1e9)} billion years`;
    return `${fmt(two(y / UNIVERSE))}× the age of the universe`;
  }

  // Turbine size in world units: hub height grows with energy (3–12 GWh).
  const hub = (e) => 2.6 + (3 * (e - 3)) / 9;
  // The map shows the first n sites (the most central ones) as large as fits;
  // each "+10 sites" zooms out to the next ring.
  function zoom(L, p, n) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let i = 0; i < n; i++) {
      x0 = Math.min(x0, p.x[i]); x1 = Math.max(x1, p.x[i]);
      y0 = Math.min(y0, p.y[i]); y1 = Math.max(y1, p.y[i]);
    }
    x0 -= 4; x1 += 4; y0 -= 9; y1 += 2; // room for blades and towers
    const m = L.map;
    const s = Math.min(m.w / (x1 - x0), m.h / (y1 - y0), 1.4);
    return { s, ox: m.x + (m.w - (x1 - x0) * s) / 2 - x0 * s, oy: m.y + (m.h - (y1 - y0) * s) / 2 - y0 * s };
  }
  const at = (z, p, i) => [z.ox + p.x[i] * z.s, z.oy + p.y[i] * z.s];
  const inside = (e, b) => e.x >= b.x && e.x <= b.x + b.w && e.y >= b.y && e.y <= b.y + b.h;

  Gamekit.game("wind", {
    title: "Build the Wind Farm",
    task: "Build the turbines with the most energy: tap a site. Bigger turbines give more, but no turbine may " +
      "stand in another's wind shadow. Add sites to see how long a loop that tries every combination would " +
      "need, at a billion per second.",
    goal: "max",
    unit: "GWh",
    board: { w: 100, h: WIDE_H, stretch: true },
    compactBoard: { w: 100, h: COMPACT.h },
    // puzzle(rng) with seed 4: site positions in world units, energy in GWh per year
    class: {
      x: [
        75.1, 90.2, 95.5, 79.5, 66.3, 57.9, 73.7, 84.4, 53.6, 56.1, 50.4, 64.7, 111, 104.6, 58.3, 98.2, 89.6,
        116.8, 118.9, 53.3, 37, 98.7, 113.9, 105.1, 36.4, 110.5, 124.6, 130.7, 26, 54.6, 64.1, 29.8, 129.5,
        89.1, 21.6, 126.1, 81.6, 35.5, 137.4, 104.9, 142.5, 24.1, 64.9, 107.2, 121, 25.8, 17.5, 76.3, 44.4,
        149.3, 129.4, 30.8, 117.2, 37.3, 144.8, 134.5, 150.4, 52.1, 147.8, 126, 9.7, 79.3, 142.2, 156.7,
        145.6, 122.2, 1.7, 13.1, 157.6, 140.5, 99.7, 10.8, 156, 22.6, 60.1, 1, 157.3, 152.8, 119.2, 110.8,
        149.4, 142.1, 136.4, 25.3, 32.4, 124.8, 0.9, 32.2, 136.1, 7.6, 9.8, 3.1, 157.5, 142.4, 12.4, 151.6,
        13, 151.4, 1.8, 159,
      ],
      y: [
        54.8, 43.9, 51.7, 39.6, 40.4, 46.5, 63.8, 34.3, 54.2, 38.3, 45.3, 33, 53.9, 35.4, 68.8, 28.1, 25.9,
        60.6, 42.2, 29.6, 46.5, 74.9, 31.4, 26.2, 34.7, 76.8, 67.8, 40.2, 52.4, 80.1, 82.6, 65.9, 33.2, 14.7,
        46.2, 26.9, 87.1, 75.3, 66.1, 86.5, 38.5, 28.2, 90.1, 11.7, 16.5, 75.2, 66.3, 92.6, 13.2, 45.8, 19.2,
        18.3, 87.6, 85.4, 68.8, 78.9, 58.7, 91.7, 33.3, 85.4, 62.4, 3.8, 77.5, 47.1, 24.8, 9.5, 48.5, 23.4,
        38.4, 16.9, 99.1, 76.7, 68.3, 86.5, 99.9, 35.2, 28.9, 77.3, 2.7, 100, 18, 87.7, 92.1, 93.1, 96.3,
        97.4, 24, 0.7, 1.9, 89.9, 8.3, 11.3, 11.7, 98.8, 97.4, 3.8, 0.9, 99.8, 95.9, 2.6,
      ],
      e: [
        8, 10, 9, 10, 4, 10, 12, 7, 11, 9, 9, 8, 11, 9, 6, 10, 3, 11, 7, 5, 11, 4, 7, 9, 11, 6, 11, 6, 9, 11,
        4, 7, 9, 12, 11, 10, 11, 5, 3, 10, 3, 10, 8, 12, 11, 9, 11, 12, 6, 4, 7, 8, 8, 8, 8, 11, 3, 7, 5, 3,
        5, 9, 10, 6, 9, 11, 8, 8, 12, 10, 10, 12, 7, 7, 12, 8, 10, 4, 11, 10, 8, 11, 6, 9, 7, 3, 8, 5, 8, 9,
        4, 8, 3, 8, 9, 4, 4, 6, 4, 12,
      ],
    },
    check: { optimum: 51, plans: (p) => [{ n: p.e.length, on: p.e.map(() => false) }] }, // also all 100 sites

    puzzle(rng) {
      const s = [];
      while (s.length < 100) {
        const x = Math.round(rng() * W * 10) / 10;
        const y = Math.round(rng() * H * 10) / 10;
        if (s.some((q) => Math.hypot(q.x - x, q.y - y) < SEP)) continue;
        s.push({ x, y, e: 3 + Math.floor(rng() * 10) });
      }
      const d = (q) => Math.hypot((q.x - W / 2) / (W / H), q.y - H / 2);
      s.sort((a, b) => d(a) - d(b));
      return { x: s.map((q) => q.x), y: s.map((q) => q.y), e: s.map((q) => q.e) };
    },
    start(p) { return { n: Math.min(START, p.e.length), on: p.e.map(() => false) }; },

    pointer(p, plan, ui, e, view) {
      if (e.type !== "down") return undefined;
      const L = lay(view);
      if (plan.n < p.e.length && inside(e, L.more)) return { n: Math.min(p.e.length, plan.n + STEP), on: plan.on };
      // nearest turbine within reach, measured to the middle of its icon
      const z = zoom(L, p, plan.n);
      let best = null;
      let bestDist = Math.max(L.reach, 2 * z.s);
      for (let i = 0; i < plan.n; i++) {
        const [x, y] = at(z, p, i);
        const d = Math.hypot(e.x - x, e.y - (y - 0.6 * hub(p.e[i]) * z.s));
        if (d <= bestDist) { best = i; bestDist = d; }
      }
      ui.sel = best;
      if (best === null) return undefined;
      const on = plan.on.slice();
      on[best] = !on[best];
      return { n: plan.n, on };
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const z = zoom(L, p, plan.n);
      const out = [];
      // the wind shadows, as one piece so overlapping circles tint the map evenly
      const zones = [];
      for (let i = 0; i < plan.n; i++) {
        const [x, y] = at(z, p, i);
        zones.push(x, y, plan.on[i] ? SHADOW * z.s : 0);
      }
      out.push({ key: "shadow", kind: "shadow", zones, map: L.map, color: "plan" });
      const b = built(p, plan);
      const cl = clashes(p, plan);
      const bad = new Set(cl.flat());
      for (const [i, j] of cl) {
        const [x1, y1] = at(z, p, i);
        const [x2, y2] = at(z, p, j);
        out.push({ key: `clash-${i}-${j}`, kind: "clash", x1, y1, x2, y2, color: "bad" });
      }
      const blocked = (i) => !plan.on[i] && b.some((j) => near(p, i, j));
      for (let i = 0; i < plan.n; i++) {
        const [x, y] = at(z, p, i);
        out.push({ key: `site-${i}`, kind: "turbine", x, y, h: hub(p.e[i]) * z.s,
          on: plan.on[i] ? 1 : 0, alpha: blocked(i) ? 0.3 : 1,
          color: bad.has(i) ? "bad" : plan.on[i] ? "plan" : "muted" });
      }
      if (ui.sel != null && !(view && view.locked)) {
        const [x, y] = at(z, p, ui.sel);
        out.push({ key: "label", kind: "label", x, y: y - 1.5 * hub(p.e[ui.sel]) * z.s, map: L.map,
          text: `${p.e[ui.sel]} GWh`, color: "text" });
      }
      out.push({ key: "clock", kind: "clock", x: L.clock[0], y: L.clock[1],
        line1: `${power(plan.n)} combinations: a loop needs`, line2: loopTime(plan.n),
        color: Math.pow(2, plan.n) / RATE >= YEAR ? "bad" : "text" });
      // greyed out, not hidden, when no sites can be added: the clock keeps its place
      const can = plan.n < p.e.length && !(view && view.locked);
      out.push(Object.assign({ key: "more", kind: "button", label: `+${STEP} sites`, on: can ? 1 : 0,
        color: can ? "neutral" : "muted" }, L.more));
      return out;
    },

    drawBoard(ctx, p, view) {
      const m = lay(view).map;
      ctx.strokeStyle = view.css.muted;
      ctx.lineWidth = 0.3;
      ctx.strokeRect(m.x, m.y, m.w, m.h);
    },

    drawPiece(ctx, piece, view) {
      ctx.font = `${view.em}px ${view.font}`; // the same size as the HTML text around the board
      ctx.textBaseline = "middle";
      if (piece.kind === "shadow") {
        const m = piece.map;
        ctx.save();
        ctx.beginPath();
        ctx.rect(m.x, m.y, m.w, m.h);
        ctx.clip();
        ctx.beginPath();
        for (let k = 0; k < piece.zones.length; k += 3) {
          const [x, y, r] = piece.zones.slice(k, k + 3);
          if (r < 0.05) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, 2 * Math.PI);
        }
        ctx.globalAlpha *= 0.11;
        ctx.fillStyle = piece.paint;
        ctx.fill(); // nonzero winding: the union of all circles, tinted once
        ctx.restore();
      } else if (piece.kind === "clash") {
        ctx.strokeStyle = piece.paint;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([1, 0.8]);
        ctx.beginPath();
        ctx.moveTo(piece.x1, piece.y1);
        ctx.lineTo(piece.x2, piece.y2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (piece.kind === "turbine") {
        turbine(ctx, piece);
      } else if (piece.kind === "label") {
        // a card above the turbine, kept inside the map
        const m = piece.map;
        const w = ctx.measureText(piece.text).width + view.em;
        const h = view.em * 1.6;
        const x = Math.max(m.x, Math.min(m.x + m.w - w, piece.x - w / 2));
        const y = Math.max(m.y, piece.y - h - 0.6);
        ctx.fillStyle = view.css.bg;
        ctx.fillRect(x, y, w, h);
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = view.css.muted;
        ctx.strokeRect(x, y, w, h);
        ctx.textAlign = "center";
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, piece.text, x + w / 2, y + h / 2);
      } else if (piece.kind === "clock") {
        ctx.fillStyle = view.css.muted;
        fillCentred(ctx, piece.line1, piece.x, piece.y - 0.62 * view.em, "start");
        ctx.font = `600 ${view.em}px ${view.font}`; // emphasis by weight and colour only
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, piece.line2, piece.x, piece.y + 0.62 * view.em, "start");
      } else if (piece.kind === "button") {
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = piece.paint;
        ctx.strokeRect(piece.x, piece.y, piece.w, piece.h);
        const alpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha * piece.on;
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x, piece.y, piece.w, piece.h);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = piece.on > 0.5 ? view.css.bg : piece.paint;
        ctx.textAlign = "center";
        fillCentred(ctx, piece.label, piece.x + piece.w / 2, piece.y + piece.h / 2);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible(p, plan) {
      const k = clashes(p, plan).length;
      if (k === 0) return true;
      return k === 1 ? "Two turbines stand in each other's wind shadow"
        : `${k} pairs of turbines stand in each other's wind shadow`;
    },
    score(p, plan) { return energy(p, plan); },

    model(p, plan) {
      const ids = p.e.map((_, i) => i).filter((i) => i < plan.n);
      const rules = [];
      for (const i of ids) for (const j of ids) if (i < j && near(p, i, j)) rules.push(` shadow_${i}_${j}: x_${i} + x_${j} <= 1`);
      return [
        "Maximize",
        " energy: " + ids.map((i) => `${p.e[i]} x_${i}`).join(" + "),
        "Subject To",
        ...(rules.length ? rules : [" none: x_0 >= 0"]), // LP format needs at least one row
        "Binary",
        " " + ids.map((i) => `x_${i}`).join(" "),
        "End",
        "",
      ].join("\n");
    },
    decode(p, values, plan) {
      return { n: plan.n, on: p.e.map((_, i) => i < plan.n && Math.round(values[`x_${i}`] || 0) === 1) };
    },

    insight(p, yours, optimal) {
      const n = yours.n;
      const ky = built(p, yours).length;
      const ey = energy(p, yours);
      const eo = energy(p, optimal);
      let diff = ky === 0
        ? "You built no turbines."
        : `Your ${plural(ky, "turbine")} ${ky === 1 ? "gives" : "give"} ${ey} GWh.`;
      diff += ey === eo
        ? " That's as much energy as the best plan."
        : ` The best plan builds ${built(p, optimal).length} and gets ${eo} GWh.`;
      const g = biggestFirst(p, n);
      if (g < eo) diff += ` Always building the biggest free site gives only ${g} GWh here.`;
      let mechanism = `Each extra site doubles the combinations a loop must try: ${n} sites are ${power(n)} ` +
        `combinations, which take ${loopTime(n)} at a billion per second.`;
      if (n < p.e.length) mechanism += ` ${p.e.length} sites would take ${loopTime(p.e.length)}.`;
      return {
        diff,
        mechanism,
        model: "A solver like HiGHS doesn't try every combination: it proves that whole groups of them can't beat " +
          "the best one found so far and skips them. That's why we write a model, with one yes/no variable per " +
          "site, `X[i]`, and one rule per pair of neighbours, `X[i] + X[j] <= 1`, and let the solver search.",
      };
    },

    describe(p, plan) {
      return `${built(p, plan).length} of ${plan.n} sites built: ${energy(p, plan)} GWh. ` +
        `A loop trying all 2 to the power of ${plan.n} combinations needs ${loopTime(plan.n)}.`;
    },
  });

  // A turbine standing at (x, y), always in the same pose (one blade up), so
  // only its size differs: a tower and three blades, drawn as plain strokes.
  // Free sites are grey and lighter, built ones solid; blocked sites come in
  // faded (piece.alpha).
  function turbine(ctx, piece) {
    const { x, y, h } = piece;
    const hy = y - h;
    const blade = 0.5 * h;
    ctx.strokeStyle = piece.paint;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    const alpha = ctx.globalAlpha;
    if (piece.on < 0.5) ctx.globalAlpha = alpha * (0.55 + 0.45 * piece.on); // a free site: a lighter, grey turbine
    ctx.beginPath(); // tower and blades in one stroke: overlaps at the hub are painted once
    ctx.moveTo(x, y);
    ctx.lineTo(x, hy);
    for (const deg of [-90, 30, 150]) {
      const a = (deg * Math.PI) / 180;
      ctx.moveTo(x, hy);
      ctx.lineTo(x + Math.cos(a) * blade, hy + Math.sin(a) * blade);
    }
    ctx.lineWidth = 0.1 * h;
    ctx.stroke();
    ctx.globalAlpha = alpha;
  }
})();
