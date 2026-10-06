// boards.js — lecture 04: a board workshop builds skateboards and surfboards
// with limited cutting and finishing hours (tutorial 04-01's factory). Students
// drag the production plan around the feasible region; the dashed line through
// it joins all plans with the same profit. The best plan sits at a corner.
(function () {
  const { fillCentred, formatScore: fmt } = GamekitCore;
  const MAX = 20; // both axes run from 0 to 20 boards

  // Two layouts in board units. Wide: the chart on the left and the
  // workshop's table on the right (the board stretches to the slide's width,
  // view.w). Compact (phones): the table below the chart.
  // The table: per board its profit and hours in both departments, then the
  // hours the plan uses. Columns: board icon, profit, cutting, finishing.
  // The tick row sits below the chart's bottom, clear of the plan's marker, and
  // the x-axis title below it; both follow the text size.
  function lay(view) {
    const em = (view && view.em) || 3;
    const rows = (y0, s) => {
      const tick = y0 + MAX * s + 1.35 * em;
      return { tick, xTitle: tick + 1.5 * em };
    };
    if (view && view.compact) {
      const r = rows(9, 70 / MAX);
      return Object.assign({ w: 100, h: 134, x0: 10, y0: 9, s: 70 / MAX,
        table: { x: 0, w: 100, y: r.xTitle + 1.6 * em, row: 7 } }, r);
    }
    const w = (view && view.w) || 100;
    // the table needs about 13 text sizes; on a narrow page the chart gives way
    const tw = Math.max(w * 0.38, 13 * em);
    const s = Math.min(50 / MAX, (w - tw - 14) / MAX);
    return Object.assign({ w, h: 70, x0: 8, y0: 7, s, table: { x: w - tw, w: tw, y: 11, row: 7.5 } }, rows(7, s));
  }
  // right edges of the profit, cutting and finishing columns; the profit column
  // keeps room for a board icon, a gap and "150 €" on narrow tables
  function cols(t, em) {
    const p = Math.max(t.x + 0.34 * t.w, t.x + 5.6 * em);
    const end = t.x + t.w;
    return [p, p + (end - p) / 2, end];
  }
  const X = (L, a) => L.x0 + a * L.s; // skateboards → board x
  const Y = (L, b) => L.y0 + (MAX - b) * L.s; // surfboards → board y

  const used = (p, plan, k) => p.use[k][0] * plan[0] + p.use[k][1] * plan[1];
  const profit = (p, plan) => p.profit[0] * plan[0] + p.profit[1] * plan[1];
  const boards = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const plural = (plan) => `${boards(plan[0], "skateboard")} and ${boards(plan[1], "surfboard")}`;
  const DEPTS = ["Cutting", "Finishing"];

  // The corners of the region: the origin, the two axis corners, and where
  // both departments are full.
  function corners(p) {
    const [[ca, cb], [fa, fb]] = p.use;
    const [hc, hf] = p.hours;
    const det = ca * fb - cb * fa;
    return [[0, 0], [Math.min(hc / ca, hf / fa), 0], [(hc * fb - cb * hf) / det, (ca * hf - hc * fa) / det],
      [0, Math.min(hc / cb, hf / fb)]];
  }
  // Where a line u·(a, b) = h enters and leaves the chart square.
  function across(u, h) {
    const pts = [];
    for (const a of [0, MAX]) { const b = (h - u[0] * a) / u[1]; if (b >= 0 && b <= MAX) pts.push([a, b]); }
    for (const b of [0, MAX]) { const a = (h - u[1] * b) / u[0]; if (a > 0 && a < MAX) pts.push([a, b]); }
    return pts.slice(0, 2);
  }

  Gamekit.game("boards", {
    title: "Plan the Board Workshop",
    task: "Plan a week in the board workshop: drag the square to choose how many skateboards and surfboards " +
      "to build. Earn the most profit without running out of cutting or finishing hours.",
    goal: "max",
    unit: "€",
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: 134 },
    // tutorial 04-01: profit 100 / 150 € per board; cutting 2 / 4 h of 40 h,
    // finishing 4 / 3 h of 60 h per skateboard / surfboard
    class: { profit: [100, 150], use: [[2, 4], [4, 3]], hours: [40, 60] },
    check: { optimum: 1800 },

    // Random workshops keep the shape: surfboards need more cutting,
    // skateboards more finishing, and the profit ratio lies between the two
    // departments' ratios, so the best plan is the one corner where both are
    // full (whole boards) and the mechanism text holds; every corner of the
    // region is a whole-board plan.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      for (;;) {
        const use = [[int(1, 3), int(3, 6)], [int(3, 6), int(1, 3)]];
        const best = [int(4, 13), int(2, 8)];
        const hours = use.map((u) => u[0] * best[0] + u[1] * best[1]);
        const prof = [int(6, 14) * 10, int(10, 20) * 10];
        const r = prof[0] / prof[1];
        if (!(use[0][0] / use[0][1] < r && r < use[1][0] / use[1][1])) continue;
        const p = { profit: prof, use, hours };
        const c = corners(p);
        // whole-board corners on the axes, at most 18 boards so their labels stay on the board
        if (!Number.isInteger(c[1][0]) || !Number.isInteger(c[3][1])) continue;
        if (c[1][0] > 18 || c[3][1] > 18 || c[1][0] < best[0] + 2 || c[3][1] < best[1] + 2) continue;
        return p;
      }
    },
    start() { return [0, 0]; },

    pointer(p, plan, ui, e, view) {
      const L = lay(view);
      const a = Math.round((e.x - L.x0) / L.s);
      const b = Math.round(MAX - (e.y - L.y0) / L.s);
      // only a press on the chart starts a drag; a drag that leaves it stays on its edge
      if (e.type === "down") ui.drag = a >= -1 && a <= MAX + 1 && b >= -1 && b <= MAX + 1;
      if (e.type === "up" || e.type === "cancel") { ui.drag = false; return undefined; }
      if (!ui.drag) return undefined;
      const next = [Math.max(0, Math.min(MAX, a)), Math.max(0, Math.min(MAX, b))];
      return next[0] === plan[0] && next[1] === plan[1] ? undefined : next;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const em = (view && view.em) || 3;
      const locked = !!(view && view.locked);
      const out = [];
      const [a, b] = plan;
      // the dashed line joins all plans with the profit of this one
      const line = across(p.profit, profit(p, plan));
      const ends = line.length === 2 ? line : [[a, b], [a, b]];
      out.push({ key: "iso", kind: "iso", x1: X(L, ends[0][0]), y1: Y(L, ends[0][1]), x2: X(L, ends[1][0]),
        y2: Y(L, ends[1][1]), color: "plan" });
      out.push({ key: "drop", kind: "drop", x: X(L, a), y: Y(L, b), ox: L.x0, oy: Y(L, 0), color: "plan" });
      // tick labels make way for the plan's own numbers on the axes
      for (let v = 0; v <= MAX; v += 5) {
        out.push({ key: `tx-${v}`, kind: "tick", x: X(L, v), y: L.tick, text: String(v), alpha: Math.abs(v - a) < 2.5 ? 0 : 1,
          color: "muted" });
        if (v) out.push({ key: `ty-${v}`, kind: "tick", x: L.x0 - 1.2, y: Y(L, v), text: String(v), right: 1,
          alpha: Math.abs(v - b) < 2.5 ? 0 : 1, color: "muted" });
      }
      out.push({ key: "va", kind: "value", x: X(L, a), y: L.tick, text: String(a), color: "plan" });
      // left of the axis, and left of the marker when it sits close to the axis
      out.push({ key: "vb", kind: "value", x: Math.min(L.x0 - 1.2, X(L, a) - 0.45 * em - 0.9), y: Y(L, b), text: String(b),
        right: 1, color: "plan" });
      const cs = corners(p);
      const best = cs[2].map(Math.round); // the corner where both departments are full
      if (locked && a === best[0] && b === best[1]) { // the optimal plan shows the corners and what they earn
        // labels sit inside the region, towards its middle: the department icons are outside
        const mid = [cs.reduce((m, q) => m + q[0], 0) / 4, cs.reduce((m, q) => m + q[1], 0) / 4];
        cs.slice(1).forEach(([ca, cb], k) => {
          out.push({ key: `corner-${k}`, kind: "corner", x: X(L, ca), y: Y(L, cb), left: ca > mid[0] ? 1 : 0,
            down: cb > mid[1] ? 1 : 0, text: `${fmt(profit(p, [ca, cb]))} €`, color: "muted" });
        });
      }
      // the plan's profit: up and right of the marker, flipped where it would leave the chart
      const text = `${fmt(profit(p, plan))} €`;
      const lw = (text.length * 0.55 + 0.5) * em; // about as wide as the text
      out.push({ key: "plan", kind: "plan", x: X(L, a), y: Y(L, b), text, label: locked ? 0 : 1,
        left: X(L, a) + 0.45 * em + 0.6 + lw > X(L, MAX) + 2 ? 1 : 0, down: Y(L, b) - 2.2 * em < L.y0 ? 1 : 0,
        color: "plan" });
      const t = L.table;
      const c = cols(t, em);
      p.use.forEach((u, k) => { // the hours the plan uses, under each department's column
        const h = used(p, plan, k);
        out.push({ key: `dept-${k}`, kind: "dept", x: c[k + 1], w: c[k + 1] - c[k] - 1, y: t.y + 3 * t.row,
          used: h, cap: p.hours[k], color: h > p.hours[k] ? "bad" : "plan" });
      });
      return out;
    },

    drawBoard(ctx, p, view) {
      const L = lay(view);
      const em = view.em;
      ctx.font = `${em}px ${view.font}`; // the same size as the HTML text around the board
      const c = corners(p);
      ctx.beginPath(); // the plans that fit into both departments' hours
      c.forEach(([a, b], k) => (k ? ctx.lineTo(X(L, a), Y(L, b)) : ctx.moveTo(X(L, a), Y(L, b))));
      ctx.closePath();
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = view.css.neutral;
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = view.css.muted;
      ctx.lineWidth = 0.3;
      ctx.beginPath(); // axes
      ctx.moveTo(L.x0, L.y0);
      ctx.lineTo(L.x0, Y(L, 0));
      ctx.lineTo(X(L, MAX), Y(L, 0));
      ctx.stroke();
      // axis titles with their boards
      ctx.fillStyle = view.css.text;
      const ty = L.y0 - 0.95 * em; // above the chart
      surfboard(ctx, L.x0 + 0.9 * em, ty, em, view.css.text);
      fillCentred(ctx, "Surfboards", L.x0 + 2.1 * em, ty, "start");
      const tw = ctx.measureText("Skateboards").width;
      fillCentred(ctx, "Skateboards", X(L, MAX), L.xTitle, "end");
      skateboard(ctx, X(L, MAX) - tw - 1.15 * em, L.xTitle, em, view.css.text);
      // each department's hours: a line, tagged with its icon where it leaves the region
      p.use.forEach((u, k) => {
        const ends = across(u, p.hours[k]);
        if (ends.length < 2) return;
        ctx.strokeStyle = view.css.muted;
        ctx.lineWidth = 0.35;
        ctx.beginPath();
        ctx.moveTo(X(L, ends[0][0]), Y(L, ends[0][1]));
        ctx.lineTo(X(L, ends[1][0]), Y(L, ends[1][1]));
        ctx.stroke();
        // the end outside the region (beyond the other department's limit)
        const outer = ends.find(([a, b]) => p.use[1 - k][0] * a + p.use[1 - k][1] * b > p.hours[1 - k] + 1e-9) || ends[0];
        const inner = ends.find((e) => e !== outer) || ends[1];
        const dx = inner[0] - outer[0], dy = inner[1] - outer[1], d = Math.hypot(dx, dy);
        const x = X(L, outer[0] + (dx / d) * 2.5), y = Y(L, outer[1] + (dy / d) * 2.5);
        ctx.fillStyle = view.css.bg;
        ctx.fillRect(x - 0.65 * em, y - 0.65 * em, 1.3 * em, 1.3 * em);
        ctx.strokeStyle = view.css.muted;
        ctx.lineWidth = 0.25;
        ctx.strokeRect(x - 0.65 * em, y - 0.65 * em, 1.3 * em, 1.3 * em);
        (k ? brush : saw)(ctx, x, y, em, view.css.muted);
      });
      // the workshop's table: what a board earns and needs (the plan's hours are pieces)
      const t = L.table;
      const tc = cols(t, em);
      saw(ctx, tc[1] - 0.6 * em, t.y, em, view.css.text);
      brush(ctx, tc[2] - 0.6 * em, t.y, em, view.css.text);
      ctx.fillStyle = view.css.muted;
      fillCentred(ctx, "Profit", tc[0], t.y, "end");
      [skateboard, surfboard].forEach((icon, i) => {
        const y = t.y + (i + 1) * t.row;
        icon(ctx, t.x + 0.9 * em, y, em, view.css.text);
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, `${fmt(p.profit[i])} €`, tc[0], y, "end");
        fillCentred(ctx, `${p.use[0][i]} h`, tc[1], y, "end");
        fillCentred(ctx, `${p.use[1][i]} h`, tc[2], y, "end");
      });
      ctx.fillStyle = view.css.muted;
      fillCentred(ctx, "Used", t.x, t.y + 3 * t.row, "start");
    },

    drawPiece(ctx, piece, view) {
      const em = view.em;
      ctx.font = `${em}px ${view.font}`;
      if (piece.kind === "iso") {
        ctx.strokeStyle = piece.paint;
        ctx.lineWidth = 0.35;
        ctx.setLineDash([1.2, 0.9]);
        ctx.beginPath();
        ctx.moveTo(piece.x1, piece.y1);
        ctx.lineTo(piece.x2, piece.y2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (piece.kind === "drop") { // thin lines from the plan to both axes
        ctx.strokeStyle = piece.paint;
        ctx.lineWidth = 0.2;
        ctx.beginPath();
        ctx.moveTo(piece.ox, piece.y);
        ctx.lineTo(piece.x, piece.y);
        ctx.lineTo(piece.x, piece.oy);
        ctx.stroke();
      } else if (piece.kind === "tick") {
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, piece.text, piece.x, piece.y, piece.right ? "end" : "center");
      } else if (piece.kind === "value") { // the plan's numbers on the axes
        ctx.fillStyle = piece.paint;
        ctx.font = `600 ${em}px ${view.font}`;
        fillCentred(ctx, piece.text, piece.x, piece.y, piece.right ? "end" : "center");
      } else if (piece.kind === "corner") {
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x - 0.6, piece.y - 0.6, 1.2, 1.2);
        tag(ctx, view, piece.text, piece.x, piece.y, 0.5 * em, 0.75 * em, piece.left > 0.5, piece.down > 0.5, piece.paint);
      } else if (piece.kind === "plan") { // the plan: a square marker, with its profit
        const r = 0.45 * em;
        ctx.fillStyle = view.css.bg;
        ctx.fillRect(piece.x - r - 0.3, piece.y - r - 0.3, 2 * r + 0.6, 2 * r + 0.6);
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x - r, piece.y - r, 2 * r, 2 * r);
        if (piece.label > 0.5) {
          tag(ctx, view, piece.text, piece.x, piece.y, r + 0.6, r + 0.9 * em, piece.left > 0.5, piece.down > 0.5, piece.paint);
        }
      } else if (piece.kind === "dept") { // hours used / available, with a bar below
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, `${fmt(piece.used)}/${piece.cap}`, piece.x, piece.y, "end");
        const by = piece.y + 0.75 * em;
        ctx.strokeStyle = view.css.muted;
        ctx.lineWidth = 0.25;
        ctx.strokeRect(piece.x - piece.w, by, piece.w, 0.55 * em);
        ctx.fillRect(piece.x - piece.w, by, piece.w * Math.min(1, piece.used / piece.cap), 0.55 * em);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible(p, plan) {
      for (let k = 0; k < 2; k++) {
        const h = used(p, plan, k);
        if (h > p.hours[k]) return `The plan needs ${fmt(h)} ${DEPTS[k].toLowerCase()} hours, but only ${p.hours[k]} are available`;
      }
      return true;
    },
    score(p, plan) { return profit(p, plan); },

    model(p) {
      return [
        "Maximize",
        ` profit: ${p.profit[0]} skate + ${p.profit[1]} surf`,
        "Subject To",
        ` cutting: ${p.use[0][0]} skate + ${p.use[0][1]} surf <= ${p.hours[0]}`,
        ` finishing: ${p.use[1][0]} skate + ${p.use[1][1]} surf <= ${p.hours[1]}`,
        "End",
        "",
      ].join("\n");
    },
    decode(p, values) { return [Math.round(values.skate || 0), Math.round(values.surf || 0)]; },

    insight(p, yours, optimal) {
      const hours = (plan) => `cutting ${fmt(used(p, plan, 0))} of ${p.hours[0]} h, finishing ${fmt(used(p, plan, 1))} of ${p.hours[1]} h`;
      const same = yours[0] === optimal[0] && yours[1] === optimal[1];
      const diff = same
        ? `Your plan is the best one: ${plural(yours)} for ${fmt(profit(p, yours))} €, with both departments fully used.`
        : `Your plan: ${plural(yours)} for ${fmt(profit(p, yours))} €, ${hours(yours)}. The best plan: ` +
          `${plural(optimal)} for ${fmt(profit(p, optimal))} €, with both departments fully used.`;
      return {
        diff,
        mechanism: "The dashed line joins all plans with the same profit. Pushing it outwards raises the profit, " +
          "and the last part of the region it touches always includes a corner: a best plan of a linear model " +
          "can always be found at a corner of its region.",
        model: "In JuMP, every `@constraint` draws a boundary line like these, and so does each bound like " +
          "`x >= 0` in `@variable`: the corners are where two boundary lines meet. HiGHS finds the best corner " +
          "among infinitely many plans in milliseconds.",
      };
    },

    describe(p, plan) {
      return `${plural(plan)}: ${fmt(profit(p, plan))} € profit. Cutting ${fmt(used(p, plan, 0))} of ` +
        `${p.hours[0]} hours, finishing ${fmt(used(p, plan, 1))} of ${p.hours[1]} hours.`;
    },
  });

  // A label with a background patch, dx / dy away from (x, y): to the right and
  // up by default, to the left or down where asked.
  function tag(ctx, view, text, x, y, dx, dy, left, down, paint) {
    const em = view.em;
    const w = ctx.measureText(text).width + 0.5 * em;
    const tx = left ? x - dx - w + 0.25 * em : x + dx;
    const ty = down ? y + dy : y - dy;
    ctx.fillStyle = view.css.bg;
    ctx.fillRect(tx - 0.25 * em, ty - 0.65 * em, w, 1.3 * em);
    ctx.fillStyle = paint;
    fillCentred(ctx, text, tx, ty, "start");
  }

  // Icons, about one text size tall, centred on (x, y).
  function skateboard(ctx, x, y, em, color) { // side view: a deck with kicked-up tails on two wheels
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 0.14 * em;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x - 0.8 * em, y - 0.32 * em);
    ctx.lineTo(x - 0.6 * em, y - 0.1 * em);
    ctx.lineTo(x + 0.6 * em, y - 0.1 * em);
    ctx.lineTo(x + 0.8 * em, y - 0.32 * em);
    ctx.stroke();
    for (const wx of [x - 0.42 * em, x + 0.42 * em]) {
      ctx.beginPath();
      ctx.arc(wx, y + 0.18 * em, 0.15 * em, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  function surfboard(ctx, x, y, em, color) { // a long board, nose to the right, with a fin
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - 0.85 * em, y);
    ctx.quadraticCurveTo(x - 0.5 * em, y - 0.32 * em, x + 0.2 * em, y - 0.26 * em);
    ctx.quadraticCurveTo(x + 0.7 * em, y - 0.18 * em, x + 0.9 * em, y);
    ctx.quadraticCurveTo(x + 0.7 * em, y + 0.18 * em, x + 0.2 * em, y + 0.26 * em);
    ctx.quadraticCurveTo(x - 0.5 * em, y + 0.32 * em, x - 0.85 * em, y);
    ctx.closePath();
    ctx.moveTo(x - 0.62 * em, y + 0.2 * em); // fin
    ctx.lineTo(x - 0.42 * em, y + 0.5 * em);
    ctx.lineTo(x - 0.36 * em, y + 0.22 * em);
    ctx.closePath();
    ctx.fill();
  }
  function saw(ctx, x, y, em, color) { // a circular saw blade
    ctx.fillStyle = color;
    ctx.beginPath();
    const R = 0.42 * em, r = 0.32 * em;
    for (let k = 0; k < 16; k++) {
      const a = (k * Math.PI) / 8;
      const rr = k % 2 ? r : R;
      ctx[k ? "lineTo" : "moveTo"](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }
  function brush(ctx, x, y, em, color) { // a paint brush: handle, ferrule, bristles
    ctx.fillStyle = color;
    ctx.fillRect(x - 0.07 * em, y - 0.5 * em, 0.14 * em, 0.42 * em);
    ctx.fillRect(x - 0.18 * em, y - 0.1 * em, 0.36 * em, 0.18 * em);
    ctx.fillRect(x - 0.24 * em, y + 0.1 * em, 0.48 * em, 0.38 * em);
  }
})();
