// metro.js — lecture 12: on match day, fans queue at four metro stations.
// Students set each station's gate (riders admitted per minute); admitted
// riders spread over the stadium and the fan zone by the station's mix and
// load every track section on their way. Admit as many as the sections take.
(function () {
  const { fillCentred, formatScore: fmt, wrapText } = GamekitCore;
  const GATE = 10; // a gate admits at most 10 riders per minute
  // the network in map units (100 × 72): two lines crossing at Central;
  // station names start at their station, so neighbours never collide
  const MAP_H = 72;
  const NODES = {
    A: { name: "Airport", x: 4, y: 12, label: "above" },
    O: { name: "Old Town", x: 34, y: 12, label: "above" },
    U: { name: "University", x: 4, y: 62, label: "below" },
    W: { name: "West Bay", x: 34, y: 62, label: "below" },
    C: { name: "Central", x: 59, y: 37, label: "right" },
    S: { name: "Stadium", x: 93, y: 12, label: "above" },
    F: { name: "Fan Zone", x: 93, y: 62, label: "below" },
  };
  const ORIGINS = ["A", "O", "U", "W"];
  // track sections: their course on the map and which riders use them
  // (`all` for every rider from these stations, `to` for those heading there)
  // (`quiet`: it takes more than a gate admits, so its load needs no label)
  const SECTIONS = [
    { id: "AO", path: [[4, 12], [34, 12]], all: ["A"], quiet: true },
    { id: "OC", path: [[34, 12], [58, 36]], all: ["A", "O"] },
    { id: "UW", path: [[4, 62], [34, 62]], all: ["U"], quiet: true },
    { id: "WC", path: [[34, 62], [58, 38]], all: ["U", "W"] },
    { id: "CS", path: [[60, 36], [84, 12], [93, 12]], to: "S" },
    { id: "CF", path: [[60, 38], [84, 62], [93, 62]], to: "F" },
  ];
  // riders per minute on a section, in tenths (mixes are in tenths)
  const load10 = (p, plan, sec) => ORIGINS.reduce((sum, o, k) => sum + plan[k] * (sec.all
    ? (sec.all.includes(o) ? 10 : 0) : sec.to === "S" ? p.mix[k] : 10 - p.mix[k]), 0);
  const total = (plan) => plan.reduce((s, x) => s + x, 0);
  const fits = (p, plan) => SECTIONS.every((sec) => load10(p, plan, sec) <= 10 * p.cap[sec.id]);
  const tenths = (v) => (v % 10 ? (v / 10).toFixed(1) : String(v / 10));
  const UNIT = ["rider per minute", "riders per minute"];

  // The rule of thumb: the same gate everywhere, as wide as the tracks take.
  function equalGates(p) {
    let k = GATE;
    while (k > 0 && !fits(p, ORIGINS.map(() => k))) k--;
    return ORIGINS.map(() => k);
  }
  function best(p) { // all 11⁴ gate settings
    let top = -1;
    for (let m = 0; m < (GATE + 1) ** 4; m++) {
      const plan = ORIGINS.map((_, k) => Math.floor(m / (GATE + 1) ** k) % (GATE + 1));
      if (total(plan) > top && fits(p, plan)) top = total(plan);
    }
    return top;
  }

  // Layout in board units. Wide (slides, pages): the map on the left, the
  // gates in a column on the right with the hint below them. Compact
  // (phones): the gates above the map in two columns; the board's height
  // follows the text size.
  function lay(view) {
    const em = (view && view.em) || 3;
    const block = (x, y, w) => ({ x, y, w, h: 3.8 * em });
    if (view && view.compact) { // the gates above the map, so they stay clear of the panel at the bottom
      const k = (100 - 2 * em) / 100;
      const ky = 0.8 * k; // a flatter map, so gates and map fit on one screen
      const gates = ORIGINS.map((_, i) => block((i % 2) * 51, 0.3 * em + Math.floor(i / 2) * 4.5 * em, 47));
      const y0 = 9.3 * em + 1.6 * em;
      const hint = { x: 0, y: y0 + MAP_H * ky + 1.4 * em, w: 100 };
      return { k, ky, x0: em, y0, gates, hint, h: hint.y + 2.6 * em + 0.5 };
    }
    const w = (view && view.w) || 100;
    const h = (view && view.h) || 70;
    const pw = 10.5 * em;
    const k = Math.min((w - pw - 3 * em) / 100, (h - 3.6 * em) / MAP_H);
    const gates = ORIGINS.map((_, i) => block(w - pw, 0.4 * em + i * 4.4 * em, pw));
    return { k, ky: k, x0: em, y0: 1.8 * em + (h - 3.6 * em - MAP_H * k) / 2, gates, hint: { x: w - pw, y: 0.4 * em + 17.6 * em, w: pw } };
  }
  const pt = (L, [x, y]) => [L.x0 + x * L.k, L.y0 + y * L.ky];
  const gauge = (b, em) => ({ x: b.x, y: b.y + 1.5 * em, w: b.w, h: 1.1 * em }); // the 10 cells of a gate
  const inside = (e, b) => e.x >= b.x && e.x <= b.x + b.w && e.y >= b.y && e.y <= b.y + b.h;

  Gamekit.game("metro", {
    title: "Set the Metro Gates",
    task: "Match day: fans queue at four metro stations. Set each station's gate, the riders it admits per minute; " +
      "they spread over the stadium and the fan zone by the station's mix and load every track on their way. Admit " +
      "as many as the tracks take.",
    goal: "max",
    unit: UNIT,
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: (em) => lay({ compact: true, em }).h },
    // mix: tenths of a station's riders heading for the stadium; cap: riders per minute a section takes
    class: { mix: [9, 4, 3, 7], cap: { AO: 14, OC: 13, UW: 14, WC: 11, CS: 13, CF: 11 } },
    check: { optimum: 24 },

    // Random match days draw new mixes and capacities. Resampled until equal
    // gates admit at least 2 riders per minute fewer than the best gates, so
    // the mechanism text holds for every puzzle.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      for (;;) {
        const p = { mix: ORIGINS.map(() => int(1, 9)),
          cap: { AO: 14, OC: int(10, 15), UW: 14, WC: int(10, 15), CS: int(9, 15), CF: int(9, 15) } };
        if (total(equalGates(p)) <= best(p) - 2) return p;
      }
    },
    start() { return ORIGINS.map(() => GATE); }, // no inflow control: every gate wide open

    // a press on a gate sets it to the cell under the finger, and it follows
    // the finger along the gauge until release
    pointer(p, plan, ui, e, view) {
      const L = lay(view);
      const em = (view && view.em) || 3;
      if (e.type === "up" || e.type === "cancel") { ui.drag = null; return undefined; }
      if (e.type === "down") {
        const k = L.gates.findIndex((b) => inside(e, b));
        ui.drag = k >= 0 ? k : null;
      }
      if (ui.drag == null) return undefined;
      const g = gauge(L.gates[ui.drag], em);
      const x = Math.max(0, Math.min(GATE, Math.round(((e.x - g.x) / g.w) * GATE + 0.5)));
      if (x === plan[ui.drag]) return undefined;
      const next = plan.slice();
      next[ui.drag] = x;
      return next;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const out = [];
      SECTIONS.forEach((sec) => {
        const ten = load10(p, plan, sec);
        out.push({ key: `track-${sec.id}`, kind: "track", path: sec.path.map((q) => pt(L, q)).flat(),
          load: ten / 10, cap: p.cap[sec.id], label: sec.quiet ? "" : `${tenths(ten)}/${p.cap[sec.id]}`,
          color: ten > 10 * p.cap[sec.id] ? "bad" : "plan" });
      });
      Object.entries(NODES).forEach(([id, n]) => {
        const [x, y] = pt(L, [n.x, n.y]);
        out.push({ key: `node-${id}`, kind: "node", id, x, y, color: "text" });
      });
      ORIGINS.forEach((o, k) => {
        out.push({ key: `gate-${o}`, kind: "gate", o, k, ...L.gates[k], value: plan[k], mix: p.mix[k], color: "plan" });
      });
      if (!(view && view.locked)) {
        const over = SECTIONS.filter((sec) => load10(p, plan, sec) > 10 * p.cap[sec.id]).length;
        out.push({ key: "hint", kind: "hint", ...L.hint, color: over ? "bad" : "muted",
          text: over ? `${fmt(over, ["track is", "tracks are"])} over capacity.` :
            "Drag a gate along its cells, or tap a cell." });
      }
      return out;
    },

    drawBoard() {},

    drawPiece(ctx, piece, view) {
      const em = view.em;
      ctx.font = `${em}px ${view.font}`; // the same size as the HTML text around the board
      if (piece.kind === "track") { // a thick track, filled with its riders up to its capacity
        const pts = [];
        for (let i = 0; i < piece.path.length; i += 2) pts.push([piece.path[i], piece.path[i + 1]]);
        const len = pts.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
        const line = (to) => { // the polyline from its start to `to` of its length
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          let left = to;
          for (let i = 1; i < pts.length && left > 0; i++) {
            const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
            const f = Math.min(1, left / d);
            ctx.lineTo(pts[i - 1][0] + f * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + f * (pts[i][1] - pts[i - 1][1]));
            left -= d;
          }
        };
        ctx.lineJoin = "miter";
        ctx.lineCap = "butt";
        ctx.lineWidth = 1.0 * em;
        ctx.strokeStyle = view.css.muted;
        const alpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha * 0.3;
        line(len);
        ctx.stroke();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = piece.paint;
        ctx.lineWidth = 0.7 * em;
        line(len * Math.min(1, piece.load / piece.cap));
        ctx.stroke();
        // its load against its capacity, on a patch halfway along
        let mid = len / 2;
        let at = pts[0];
        for (let i = 1; i < pts.length; i++) {
          const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          if (mid <= d) { at = [pts[i - 1][0] + (mid / d) * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + (mid / d) * (pts[i][1] - pts[i - 1][1])]; break; }
          mid -= d;
        }
        if (piece.label) {
          const tw = ctx.measureText(piece.label).width + 0.5 * em;
          ctx.fillStyle = view.css.bg;
          ctx.fillRect(at[0] - tw / 2, at[1] - 0.65 * em, tw, 1.3 * em);
          ctx.fillStyle = piece.paint === view.css.bad ? view.css.bad : view.css.text;
          fillCentred(ctx, piece.label, at[0], at[1]);
        }
      } else if (piece.kind === "node") {
        const n = NODES[piece.id];
        if (piece.id === "S") stadium(ctx, piece.x, piece.y, em, view);
        else if (piece.id === "F") screen(ctx, piece.x, piece.y, em, view);
        else { // a station: a ring, the interchange a bigger one
          const r = piece.id === "C" ? 0.85 * em : 0.6 * em;
          ctx.beginPath();
          ctx.arc(piece.x, piece.y, r, 0, 2 * Math.PI);
          ctx.fillStyle = view.css.bg;
          ctx.fill();
          ctx.lineWidth = 0.28 * em;
          ctx.strokeStyle = view.css.text;
          ctx.stroke();
        }
        ctx.fillStyle = view.css.text;
        const gap = 1.5 * em;
        const origin = ORIGINS.includes(piece.id); // origins' names start at their station, the ends' are centred
        const nx = origin ? piece.x - 0.6 * em : piece.x;
        if (n.label === "above") fillCentred(ctx, n.name, nx, piece.y - gap, origin ? "start" : "center");
        else if (n.label === "below") fillCentred(ctx, n.name, nx, piece.y + gap, origin ? "start" : "center");
        else fillCentred(ctx, n.name, piece.x + 1.3 * em, piece.y, "start");
      } else if (piece.kind === "gate") { // a station's gate: its riders per minute as cells, and where they go
        const v = Math.round(piece.value);
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, NODES[piece.o].name, piece.x, piece.y + 0.6 * em, "start");
        fillCentred(ctx, `${v}/min`, piece.x + piece.w, piece.y + 0.6 * em, "end");
        const g = gauge(piece, em);
        const cw = g.w / GATE;
        const alpha = ctx.globalAlpha;
        for (let c = 0; c < GATE; c++) {
          ctx.fillStyle = c < v ? piece.paint : view.css.muted;
          ctx.globalAlpha = alpha * (c < v ? 1 : 0.3);
          ctx.fillRect(g.x + c * cw + 0.08 * em, g.y, cw - 0.16 * em, g.h);
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = view.css.muted;
        fillCentred(ctx, `${piece.mix * 10}% to the stadium`, piece.x, piece.y + 3.35 * em, "start");
      } else if (piece.kind === "hint") {
        ctx.fillStyle = piece.paint;
        wrapText(ctx, piece.text, piece.w).forEach((line, n) => fillCentred(ctx, line, piece.x, piece.y + (n + 0.5) * 1.3 * em, "start"));
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.lineCap = "butt";
    },

    feasible(p, plan) {
      const over = SECTIONS.find((sec) => load10(p, plan, sec) > 10 * p.cap[sec.id]);
      if (!over) return true;
      const [a, b] = [over.path[0], over.path[over.path.length - 1]].map(([x, y]) => Object.values(NODES).find((n) => Math.abs(n.x - x) < 2 && Math.abs(n.y - y) < 2).name);
      return `${a} to ${b}: ${tenths(load10(p, plan, over))} riders per minute, but it takes ${p.cap[over.id]}`;
    },
    score(p, plan) { return total(plan); },

    // Lecture 12's inflow model for one period: x_o = riders admitted per
    // minute at station o; a section carries the share of every station's
    // riders whose path uses it.
    model(p) {
      const x = (k) => `x_${ORIGINS[k]}`;
      return [
        "Maximize",
        " admitted: " + ORIGINS.map((_, k) => x(k)).join(" + "),
        "Subject To",
        ...SECTIONS.map((sec) => ` ${sec.id}: ` + ORIGINS.map((o, k) => {
          const share = sec.all ? (sec.all.includes(o) ? 10 : 0) : sec.to === "S" ? p.mix[k] : 10 - p.mix[k];
          return share ? `${share / 10} ${x(k)}` : null;
        }).filter(Boolean).join(" + ") + ` <= ${p.cap[sec.id]}`),
        "Bounds",
        ...ORIGINS.map((_, k) => ` 0 <= ${x(k)} <= ${GATE}`),
        "General", // whole riders per minute, like the gates
        " " + ORIGINS.map((_, k) => x(k)).join(" "),
        "End",
        "",
      ].join("\n");
    },
    decode(p, values) { return ORIGINS.map((o) => Math.round(values[`x_${o}`] || 0)); },

    insight(p, yours, optimal) {
      const same = total(yours) === total(optimal);
      let diff = same
        ? `Your gates admit ${fmt(total(yours), UNIT)}, as many as the best ones.`
        : `Your gates admit ${fmt(total(yours), UNIT)}, while the best gates HiGHS found admit ${fmt(total(optimal))}.`;
      const k = ORIGINS.map((_, i) => i).sort((a, b) => Math.abs(optimal[b] - yours[b]) - Math.abs(optimal[a] - yours[a]))[0];
      if (!same && yours[k] !== optimal[k]) {
        diff += ` The biggest difference: ${NODES[ORIGINS[k]].name} admits ${fmt(yours[k])} per minute in yours and ` +
          `${fmt(optimal[k])} in the best.`;
      }
      const eq = total(equalGates(p));
      return {
        diff,
        mechanism: `Opening every gate equally admits ${fmt(eq, UNIT)} here, ${fmt(total(optimal) - eq)} fewer than the ` +
          "best gates. A gate only sets how many riders enter, not where they go: each rider loads every track on the " +
          "way, so a station whose riders head for a full track must open less, and the others can open more.",
        model: "Lecture 12's capacity constraint adds up, for every track, the inflow `X[o,p]` times the share of riders " +
          "whose path uses it, `q[o,d,p] / Σ q[o,f,p]`, and keeps it within `α·c[e]`. Minimizing the queues is the same " +
          "as maximizing these admissions; here with one period, no travel times and whole riders per minute.",
      };
    },

    describe(p, plan) {
      return ORIGINS.map((o, k) => `${NODES[o].name} admits ${plan[k]} per minute`).join(", ") +
        `. ${fmt(total(plan), UNIT)} in total.`;
    },
  });

  // A stadium seen from above, centred on (x, y): a bowl around a pitch.
  function stadium(ctx, x, y, em, view) {
    ctx.fillStyle = view.css.text;
    ctx.beginPath();
    ctx.ellipse(x, y, 1.3 * em, 0.9 * em, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = view.css.bg;
    ctx.fillRect(x - 0.65 * em, y - 0.38 * em, 1.3 * em, 0.76 * em);
  }
  // A fan zone's public screen on its stand, centred on (x, y).
  function screen(ctx, x, y, em, view) {
    ctx.fillStyle = view.css.text;
    ctx.fillRect(x - 1.2 * em, y - 0.9 * em, 2.4 * em, 1.3 * em);
    ctx.fillRect(x - 0.12 * em, y + 0.4 * em, 0.24 * em, 0.5 * em);
    ctx.fillRect(x - 0.6 * em, y + 0.85 * em, 1.2 * em, 0.18 * em);
    ctx.fillStyle = view.css.bg;
    ctx.fillRect(x - 1.0 * em, y - 0.7 * em, 2.0 * em, 0.9 * em);
  }
})();
