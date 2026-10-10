// pilgrims.js — lecture 09: pilgrim groups want to reach the Jamarat bridge at
// their preferred hour, but the bridge takes only 30,000 pilgrims per hour.
// Students move groups within their shuttle times; a move costs the group's
// size times the hours moved, squared.
(function () {
  const { fillCentred, formatScore: fmt, thinkLine, wrapText } = GamekitCore;
  const HOURS = Array.from({ length: 12 }, (_, k) => 6 + k); // 6:00 … 17:00
  const NAMES = "ABCDEFGHIJ";
  const UNIT = 10000; // pilgrims per figure
  const ROOM = 6; // figures the bridge chart has room for in an hour; more show as "+n"

  const penalty = (g, h) => g.n * (h - g.pref) ** 2; // the lecture's f[s,t], computed in advance
  const total = (p, plan) => p.groups.reduce((s, g, k) => s + penalty(g, plan[k]), 0);
  const load = (p, plan, h) => p.groups.reduce((s, g, k) => s + (plan[k] === h ? g.n : 0), 0);
  const clock = (h) => `${h}:00`;
  const POINTS = ["penalty point", "penalty points"];

  // The rule of thumb: in the order of their wishes, each group takes the
  // nearest free hour it may use (null when a group finds none).
  function firstCome(p) {
    const plan = [];
    const order = p.groups.map((_, k) => k).sort((a, b) => p.groups[a].pref - p.groups[b].pref || a - b);
    for (const k of order) {
      const g = p.groups[k];
      const free = HOURS.filter((h) => h >= g.lo && h <= g.hi && load(p, plan, h) + g.n <= p.cap);
      if (!free.length) return null;
      plan[k] = free.reduce((a, b) => (Math.abs(b - g.pref) < Math.abs(a - g.pref) ? b : a));
    }
    return plan;
  }
  // The best timetable, hour by hour over the set of groups already placed:
  // the puzzle generator's yardstick (12 hours × 1,024 sets).
  function bestPenalty(p) {
    const G = p.groups;
    const all = (1 << G.length) - 1;
    let cost = new Map([[0, 0]]);
    for (const h of HOURS) {
      const next = new Map();
      const can = G.map((g, k) => k).filter((k) => G[k].lo <= h && h <= G[k].hi);
      for (const [mask, c] of cost) {
        const open = can.filter((k) => !(mask >> k & 1));
        const pick = (from, m, size, add) => {
          // every group whose last allowed hour is now must be placed by now
          if (G.every((g, k) => g.hi > h || m >> k & 1)) {
            if (!next.has(m) || next.get(m) > c + add) next.set(m, c + add);
          }
          for (let i = from; i < open.length; i++) {
            const k = open[i];
            if (size + G[k].n <= p.cap) pick(i + 1, m | (1 << k), size + G[k].n, add + penalty(G[k], h));
          }
        };
        pick(0, mask, 0, 0);
      }
      cost = next;
    }
    return cost.has(all) ? cost.get(all) : Infinity;
  }

  // Layout in board units. Columns are hours between the groups' labels and
  // their penalties; the bridge chart sits under the rows, the hint below it.
  // Wide (slides, pages) fills the board's height; compact (phones) is spaced
  // by the text size, and so is the board's height.
  function lay(view) {
    const em = (view && view.em) || 3;
    const compact = !!(view && view.compact);
    const w = compact ? 100 : (view && view.w) || 100;
    const lab = 3.4 * em;
    const cw = (w - lab - 2.2 * em) / HOURS.length;
    const top = 1.8 * em; // the hour labels above
    if (compact) {
      const rh = 1.8 * em; // a finger's height; the hour follows the finger along the row
      const uh = 0.8 * em; // a figure in the bridge chart
      const bridge = top + 10 * rh + 0.6 * em;
      const hint = bridge + ROOM * uh + 0.4 * em;
      return { lab, cw, top, rh, bridge, uh, hint, w, every: cw < 1.6 * em ? 2 : 1, h: hint + 2.6 * em + 0.5 };
    }
    const h = (view && view.h) || 70;
    const rh = Math.max(1.15 * em, Math.min(1.6 * em, (h - top - 0.6 * em - ROOM * 0.95 * em - 1.6 * em) / 10));
    const uh = Math.min(1.1 * em, (h - top - 10 * rh - 0.6 * em - 1.6 * em) / ROOM);
    const bridge = top + 10 * rh + 0.6 * em;
    return { lab, cw, top, rh, bridge, uh, hint: bridge + ROOM * uh + 0.3 * em, w, every: 1 };
  }
  const col = (L, h) => L.lab + (h - HOURS[0] + 0.5) * L.cw; // an hour's centre

  Gamekit.game("pilgrims", {
    title: "Schedule the Jamarat Bridge",
    task: "Ten pilgrim groups want to cross the Jamarat bridge at their preferred hour (outlined), but it takes " +
      "only 30,000 pilgrims an hour (a figure is 10,000). Tap an hour in a row to move that group; a move costs " +
      "figures × hours².",
    goal: "min",
    unit: ["penalty point", "penalty points"],
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: (em) => lay({ compact: true, em }).h },
    // groups: preferred hour, size in figures of 10,000 pilgrims, first and last allowed hour
    class: {
      cap: 3,
      groups: [[13, 2, 8, 17], [15, 1, 12, 17], [13, 1, 9, 15], [13, 2, 10, 14], [12, 1, 8, 14],
        [12, 1, 10, 14], [12, 2, 8, 15], [13, 1, 7, 17], [12, 1, 11, 13], [11, 2, 7, 15]]
        .map(([pref, n, lo, hi]) => ({ pref, n, lo, hi })),
    },
    check: { optimum: 7 },

    // Random days keep the wishes clustered around midday and draw sizes and
    // shuttle times. Resampled until first come, first served finds a place
    // for every group but costs at least 1.5 times the best timetable, so the
    // mechanism text holds for every puzzle.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      const wishes = [11, 12, 12, 13, 13, 13, 13, 14, 14, 15];
      for (;;) {
        const groups = Array.from({ length: 10 }, () => {
          const pref = wishes[int(0, wishes.length - 1)];
          const reach = int(1, 4);
          return { pref, n: int(1, 2), lo: Math.max(6, pref - reach - int(0, 2)), hi: Math.min(17, pref + reach) };
        });
        const p = { cap: 3, groups };
        const figures = groups.reduce((s, g) => s + g.n, 0);
        if (figures < 14 || figures > 17) continue;
        const rule = firstCome(p);
        const best = bestPenalty(p);
        if (rule && best > 0 && total(p, rule) >= 1.5 * best) return p;
      }
    },
    start(p) { return p.groups.map((g) => g.pref); }, // everyone at their preferred hour: the bridge overflows

    // a press on a group's row moves the group to that hour, and it follows
    // the finger along the row until release; its shuttle times stop it
    pointer(p, plan, ui, e, view) {
      const L = lay(view);
      if (e.type === "down") {
        const row = Math.floor((e.y - L.top) / L.rh);
        ui.drag = row >= 0 && row < p.groups.length && e.x >= L.lab ? { k: row, was: plan[row] } : null;
        ui.msg = null;
      }
      if (!ui.drag) return undefined;
      const k = ui.drag.k;
      if (e.type === "up" || e.type === "cancel") {
        const was = ui.drag.was;
        ui.drag = null;
        if (e.type === "up" || plan[k] === was) return undefined;
        const back = plan.slice();
        back[k] = was; // the browser took the touch: back to where the group was
        return back;
      }
      const g = p.groups[k];
      const at = HOURS[0] + Math.floor((e.x - L.lab) / L.cw);
      const h = Math.min(g.hi, Math.max(g.lo, at));
      ui.msg = h === at ? null : `Group ${NAMES[k]}'s shuttles allow ${clock(g.lo)} to ${clock(g.hi)}.`;
      if (plan[k] === h) return undefined;
      const next = plan.slice();
      next[k] = h;
      return next;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const out = [];
      p.groups.forEach((g, k) => {
        const y = L.top + (k + 0.5) * L.rh;
        out.push({ key: `row-${k}`, kind: "row", k, n: g.n, y, x1: col(L, g.lo) - L.cw / 2, x2: col(L, g.hi) + L.cw / 2,
          px: col(L, g.pref), cw: L.cw, rh: L.rh, color: "muted" });
        out.push({ key: `slot-${k}`, kind: "slot", x: col(L, plan[k]), px: col(L, g.pref), y, cw: L.cw, rh: L.rh,
          pen: penalty(g, plan[k]), right: L.w - 0.4 * L.cw, color: "plan" });
      });
      HOURS.forEach((h) => {
        out.push({ key: `bridge-${h}`, kind: "bridge", x: col(L, h), y: L.bridge, cw: L.cw, uh: L.uh,
          load: load(p, plan, h), cap: p.cap, color: "neutral" }); // red only past the capacity, also in the reveal
      });
      if (!(view && view.locked)) {
        out.push({ key: "hint", kind: "hint", x: 0, y: L.hint, w: L.w, color: ui.msg ? "bad" : "muted",
          text: ui.msg || "Tap or drag a group along its row." });
      }
      return out;
    },

    drawBoard(ctx, p, view) {
      const L = lay(view);
      const em = view.em;
      ctx.font = `${em}px ${view.font}`; // the same size as the HTML text around the board
      ctx.fillStyle = view.css.muted;
      const last = HOURS[HOURS.length - 1]; // every label on wide boards; on narrow ones every second, ending at the last hour
      HOURS.forEach((h) => { if ((last - h) % L.every === 0) fillCentred(ctx, String(h), col(L, h), L.top - 0.8 * em); });
      fillCentred(ctx, "Bridge", 0.2 * em, L.bridge + ROOM * L.uh - 0.6 * L.uh, "start");
      // the bridge's capacity: a line above the third figure
      ctx.strokeStyle = view.css.muted;
      ctx.lineWidth = 0.3;
      ctx.setLineDash([0.6 * em, 0.4 * em]);
      const cy = L.bridge + (ROOM - p.cap) * L.uh;
      ctx.beginPath();
      ctx.moveTo(L.lab, cy);
      ctx.lineTo(L.lab + HOURS.length * L.cw, cy);
      ctx.stroke();
      ctx.setLineDash([]);
    },

    drawPiece(ctx, piece, view) {
      const em = view.em;
      ctx.font = `${em}px ${view.font}`;
      if (piece.kind === "row") { // the group's letter and size, its allowed hours and its wish
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, NAMES[piece.k], 0.2 * em, piece.y, "start");
        for (let f = 0; f < piece.n; f++) pilgrim(ctx, 1.55 * em + f * 0.75 * em, piece.y, em, view.css.text);
        const alpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha * 0.14;
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x1, piece.y - 0.42 * piece.rh, piece.x2 - piece.x1, 0.84 * piece.rh);
        ctx.globalAlpha = alpha;
        const s = Math.min(0.62 * piece.rh, 0.7 * piece.cw);
        ctx.strokeStyle = view.css.text;
        ctx.lineWidth = 0.35;
        ctx.strokeRect(piece.px - s / 2, piece.y - s / 2, s, s);
      } else if (piece.kind === "slot") { // the assigned hour, joined to the wish, and the row's penalty
        const s = Math.min(0.62 * piece.rh, 0.7 * piece.cw);
        ctx.strokeStyle = piece.paint;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(piece.px, piece.y);
        ctx.lineTo(piece.x, piece.y);
        ctx.stroke();
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x - s / 2, piece.y - s / 2, s, s);
        if (piece.pen > 0.5) { // only a moved group has a penalty
          ctx.fillStyle = view.css.text;
          fillCentred(ctx, fmt(piece.pen), piece.right, piece.y, "end");
        }
      } else if (piece.kind === "bridge") { // the hour's pilgrims, stacked; red past the capacity
        const n = Math.round(piece.load);
        const shown = n > ROOM ? ROOM - 1 : n; // the top place then says how many more
        for (let f = 0; f < shown; f++) {
          const y = piece.y + (ROOM - f - 0.5) * piece.uh;
          pilgrim(ctx, piece.x, y, Math.min(em, 1.15 * piece.uh), f < piece.cap ? piece.paint : view.css.bad);
        }
        if (n > ROOM) {
          ctx.fillStyle = view.css.bad;
          fillCentred(ctx, `+${n - shown}`, piece.x, piece.y + 0.5 * piece.uh);
        }
      } else if (piece.kind === "hint") {
        ctx.fillStyle = piece.paint;
        wrapText(ctx, piece.text, piece.w).forEach((line, n) => fillCentred(ctx, line, piece.x, piece.y + (n + 0.5) * 1.3 * em, "start"));
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible(p, plan) {
      for (const h of HOURS) {
        const n = load(p, plan, h);
        if (n > p.cap) return `${clock(h)}: ${fmt(n * UNIT)} pilgrims, but the bridge takes ${fmt(p.cap * UNIT)}`;
      }
      const k = p.groups.findIndex((g, j) => !(plan[j] >= g.lo && plan[j] <= g.hi));
      return k < 0 || `Group ${NAMES[k]} is outside its shuttle times`;
    },
    score(p, plan) { return total(p, plan); },

    // Lecture 9's scheduling model with one path and no time shift: x_s_t = 1
    // when group s crosses the bridge at hour t, only for the hours it may use.
    model(p) {
      const v = p.groups.flatMap((g, s) => HOURS.filter((h) => h >= g.lo && h <= g.hi).map((h) => [s, h]));
      const x = ([s, h]) => `x_${s}_${h}`;
      return [
        "Minimize",
        " penalty: " + v.map((q) => `${penalty(p.groups[q[0]], q[1])} ${x(q)}`).join(" + "),
        "Subject To",
        ...p.groups.map((_, s) => ` one_${s}: ${v.filter((q) => q[0] === s).map(x).join(" + ")} = 1`),
        ...HOURS.map((h) => {
          const at = v.filter((q) => q[1] === h);
          return at.length ? ` bridge_${h}: ${at.map((q) => `${p.groups[q[0]].n} ${x(q)}`).join(" + ")} <= ${p.cap}` : null;
        }).filter(Boolean),
        "Binary",
        " " + v.map(x).join(" "),
        "End",
        "",
      ].join("\n");
    },
    decode(p, values) {
      return p.groups.map((g, s) => {
        const h = HOURS.find((t) => Math.round(values[`x_${s}_${t}`] || 0) === 1);
        if (h == null) throw new Error(`HiGHS gave group ${NAMES[s]} no hour`);
        return h;
      });
    },
    // one choice per group among its allowed hours, not every x_s_t as a yes/no decision
    think(p, r) {
      const log10Combos = p.groups.reduce((t, g) => t + Math.log10(g.hi - g.lo + 1), 0);
      return thinkLine({ binary: 0, integer: p.groups.length, continuous: 0, log10Combos }, r.ms);
    },

    insight(p, yours, optimal) {
      const same = total(p, yours) === total(p, optimal);
      let diff = same
        ? `Your timetable costs ${fmt(total(p, yours), POINTS)}, as few as the best one.`
        : `Your timetable costs ${fmt(total(p, yours), POINTS)}, while the best one HiGHS found costs ` +
          `${fmt(total(p, optimal))}.`;
      const gaps = p.groups.map((g, k) => ({ k, d: penalty(g, yours[k]) - penalty(g, optimal[k]) })).sort((a, b) => b.d - a.d);
      if (!same && gaps[0].d > 0) {
        const k = gaps[0].k;
        const moved = (plan) => Math.abs(plan[k] - p.groups[k].pref);
        const best = moved(optimal) ? `moves ${fmt(moved(optimal), ["hour", "hours"])}` : "stays at its wish";
        diff += ` The biggest difference: group ${NAMES[k]} (${fmt(p.groups[k].n * UNIT)} pilgrims) moves ` +
          `${fmt(moved(yours), ["hour", "hours"])} in yours and ${best} in the best one.`;
      }
      const rule = total(p, firstCome(p));
      return {
        diff,
        mechanism: `First come, first served, each group taking the nearest free hour in the order of the wishes, costs ` +
          `${fmt(rule)} points here, ${fmt(rule - total(p, optimal))} more than the best timetable. With squared ` +
          "penalties, one group moved 3 hours costs as much as nine moved 1 hour each, so it pays to share the moves.",
        model: "Lecture 9's model computes the penalty `f[s,t]` for every group and allowed hour in advance, so even " +
          "squared penalties keep the objective linear in `X[s,t,p]`. The bridge row is `Σ n[s]·X[s,t,p] = b[r,t]·U[r,t]` " +
          "with `U[r,t] ≤ 1`, here with one path and no time shift.",
      };
    },

    describe(p, plan) {
      const rows = p.groups.map((g, k) => `group ${NAMES[k]} at ${clock(plan[k])} (wish ${clock(g.pref)})`);
      return `${rows.join(", ")}. ${fmt(total(p, plan), POINTS)}.`;
    },
  });

  // A pilgrim figure about 0.6 em wide, centred on (x, y): a head and a robe.
  function pilgrim(ctx, x, y, em, paint) {
    ctx.fillStyle = paint;
    ctx.beginPath();
    ctx.arc(x, y - 0.28 * em, 0.15 * em, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 0.1 * em, y - 0.1 * em);
    ctx.lineTo(x + 0.1 * em, y - 0.1 * em);
    ctx.lineTo(x + 0.28 * em, y + 0.38 * em);
    ctx.lineTo(x - 0.28 * em, y + 0.38 * em);
    ctx.closePath();
    ctx.fill();
  }
})();
