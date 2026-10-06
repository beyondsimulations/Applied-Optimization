// bottling.js — lecture 05: the brewery's planner retires and students take
// over. They switch bottling runs on and off over 8 weeks of orders (game 03's
// clean order file); a run bottles everything until the next run. Every run
// costs a setup, every crate waiting in the warehouse costs storage.
(function () {
  const { fillCentred, formatScore: fmt } = GamekitCore;
  const SETUP = 400; // € per bottling run (setup and cleaning)
  const STORE = 2;   // € per crate and week in the warehouse (lecture 5's 0.1 € per bottle)
  const TOP = 150;   // crates at the top of the order chart
  const BOX = 20;    // crates per drawn box in the order stacks

  // Two layouts in board units; on slides the board stretches to the stage's
  // width (view.w) and the weeks share it. Rows: orders, week numbers, runs,
  // warehouse stock, and the cost split.
  function lay(view) {
    const w = (view && view.w) || 100;
    if (view && view.compact) {
      return { w, h: 98, head1: 3, top: 20, base: 42, week: 46.5, head2: 52.5, run: 63, head3: 73, stock: 79,
        costText: 86.5, bar: { y: 90, h: 4 } };
    }
    return { w, h: 71, head1: 2.2, top: 12, base: 30, week: 33.5, head2: 39, run: 46, head3: 53.5, stock: 58,
      costText: 63.5, bar: { y: 66, h: 3 } };
  }
  const col = (L, t, T) => (L.w * (t + 0.5)) / T; // centre of week t
  const yOf = (L, crates) => L.base - (Math.min(crates, TOP) / TOP) * (L.base - L.top);

  const list = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  const weeks = (ts) => (ts.length ? `week${ts.length === 1 ? "" : "s"} ${list(ts.map((t) => t + 1))}` : "no week");
  const runsOf = (plan) => plan.map((on, t) => (on ? t : -1)).filter((t) => t >= 0);

  // What a plan does: each run bottles the orders up to the next run; the stock
  // at the end of each week waits in the warehouse. Weeks before the first run
  // go unserved (the warehouse starts empty).
  function outcome(p, plan) {
    const T = p.orders.length;
    const batch = p.orders.map(() => 0);
    for (const t of runsOf(plan)) {
      let k = t + 1;
      while (k < T && !plan[k]) k++;
      batch[t] = p.orders.slice(t, k).reduce((a, b) => a + b, 0);
    }
    const stock = [];
    let s = 0;
    for (let t = 0; t < T; t++) {
      s = Math.max(0, s + batch[t] - p.orders[t]);
      stock.push(s);
    }
    const runs = runsOf(plan).length;
    const stored = stock.reduce((a, b) => a + b, 0); // crates times weeks in the warehouse
    return { batch, stock, runs, stored, setup: SETUP * runs, storage: STORE * stored, cost: SETUP * runs + STORE * stored };
  }
  // the cheapest of all plans with a run in week 1 (2^7 of them)
  function best(p) {
    const T = p.orders.length;
    let top = null;
    for (let m = 0; m < 1 << (T - 1); m++) {
      const plan = p.orders.map((_, t) => t === 0 || !!((m >> (t - 1)) & 1));
      const c = outcome(p, plan).cost;
      if (!top || c < top.cost) top = { plan, cost: c };
    }
    return top;
  }
  // a fixed rhythm: a run every k-th week, starting in week 1
  const rhythm = (p, k) => p.orders.map((_, t) => t % k === 0);

  Gamekit.game("bottling", {
    title: "Take Over the Bottling Plan",
    task: "The planner retires, and you take over. Tap a week to switch its bottling run on or off: a run " +
      "bottles every crate until the next run. Each run costs 400 € for the setup, each crate costs 2 € per " +
      "week in the warehouse. A flag marks the harbour festival.",
    goal: "min",
    unit: "€",
    board: { w: 100, h: 71, stretch: true },
    compactBoard: { w: 100, h: 98 },
    // game 03's order file, cleaned: crates per week, the harbour festival in week 6
    class: { orders: [53, 60, 61, 60, 56, 126, 60, 59], festival: 5 },
    check: { optimum: 2020 },

    // Random weeks keep the shape: orders of 45–65 crates and a festival week
    // with about twice as much, at most 136, so it stays below the chart's top
    // and its flag clear of the heading. Resampled until every fixed rhythm (a run every
    // week, every 2nd, 3rd or 4th week, or just one) costs more than the best
    // plan, so the rule of thumb fails in every puzzle.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      for (;;) {
        const orders = Array.from({ length: 8 }, () => int(45, 65));
        const festival = int(1, 7);
        orders[festival] = Math.round(orders[festival] * (1.8 + rng() * 0.3));
        const p = { orders, festival };
        const b = best(p).cost;
        if ([1, 2, 3, 4, 8].every((k) => outcome(p, rhythm(p, k)).cost > b)) return p;
      }
    },
    start(p) { return rhythm(p, 1); }, // the retiring planner's habit: a run every week

    pointer(p, plan, ui, e, view) {
      if (e.type !== "down") return undefined;
      const L = lay(view);
      if (e.y > L.head3 - 2) return undefined; // the orders, week numbers and runs are tap targets
      const t = Math.floor((e.x / L.w) * p.orders.length);
      if (t < 0 || t >= p.orders.length) return undefined;
      ui.empty = t === 0; // week 1 always bottles: the warehouse starts empty
      if (t === 0) return undefined;
      const next = plan.slice();
      next[t] = !next[t];
      return next;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const T = p.orders.length;
      const o = outcome(p, plan);
      const out = [];
      if (ui.empty && !(view && view.locked)) {
        out.push({ key: "empty", kind: "hint", x: 0, y: L.head2, text: "Week 1 needs a run: no stock yet", color: "bad" });
      }
      for (let t = 0; t < T; t++) {
        const x = col(L, t, T);
        out.push({ key: `run-${t}`, kind: "run", x, y: L.run, on: plan[t] ? 1 : 0, size: o.batch[t], color: "plan" });
        out.push({ key: `stock-${t}`, kind: "label", x, y: L.stock, text: fmt(o.stock[t]), alpha: o.stock[t] > 0 ? 1 : 0.4,
          color: "muted" });
      }
      // the cost split: setups and storage on one bar, scaled to the dearer of
      // the two extremes (a run every week, or one run for everything)
      const scale = Math.max(outcome(p, rhythm(p, 1)).cost, outcome(p, rhythm(p, T)).cost);
      out.push({ key: "cost", kind: "cost", y: L.bar.y, h: L.bar.h, ty: L.costText, w: L.w,
        setup: (L.w * o.setup) / scale, storage: (L.w * o.storage) / scale,
        runs: `Runs: ${o.runs} × ${SETUP} €`, stored: `Stock: ${fmt(o.stored)} × ${STORE} €`, color: "plan" });
      return out;
    },

    drawBoard(ctx, p, view) {
      const L = lay(view);
      const em = view.em;
      const T = p.orders.length;
      ctx.font = `${em}px ${view.font}`; // the same size as the HTML text around the board
      ctx.fillStyle = view.css.muted;
      fillCentred(ctx, "Orders in crates", 0, L.head1, "start");
      fillCentred(ctx, view.locked ? "Bottling runs" : "Bottling runs, tap a week", 0, L.head2, "start");
      fillCentred(ctx, "In the warehouse", 0, L.head3, "start");
      ctx.strokeStyle = view.css.muted;
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      ctx.moveTo(0, L.base);
      ctx.lineTo(L.w, L.base);
      ctx.stroke();
      const bw = Math.min(L.w / T - 3, 9);
      for (let t = 0; t < T; t++) {
        const x = col(L, t, T);
        ctx.fillStyle = view.css.muted;
        fillCentred(ctx, String(t + 1), x, L.week);
        // the orders: crates, one box per BOX crates, the top one cut to size
        const crate = (BOX / TOP) * (L.base - L.top);
        const top = yOf(L, p.orders[t]);
        for (let y = L.base; y > top + 0.05; y -= crate) {
          const h = Math.max(Math.min(crate, y - top), 0.6); // a few crates over a box still show
          ctx.fillRect(x - bw / 2, y - h + 0.3, bw, h - 0.3);
        }
        const label = fmt(p.orders[t]);
        const lw = ctx.measureText(label).width + 0.4 * em;
        ctx.fillStyle = view.css.bg;
        ctx.fillRect(x - lw / 2, top - 1.45 * em, lw, 1.2 * em);
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, label, x, top - 0.85 * em);
        if (t === p.festival) { // the harbour festival: a pennant on a pole
          const fy = top - 2.2 * em;
          ctx.fillRect(x - 0.08 * em, fy - 0.6 * em, 0.16 * em, 1.2 * em);
          ctx.beginPath();
          ctx.moveTo(x + 0.08 * em, fy - 0.6 * em);
          ctx.lineTo(x + em, fy - 0.3 * em);
          ctx.lineTo(x + 0.08 * em, fy);
          ctx.closePath();
          ctx.fill();
        }
      }
    },

    drawPiece(ctx, piece, view) {
      const em = view.em;
      ctx.font = `${em}px ${view.font}`;
      if (piece.kind === "run") {
        run(ctx, piece, view);
      } else if (piece.kind === "label") {
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, piece.text, piece.x, piece.y);
      } else if (piece.kind === "hint") { // over the runs heading
        ctx.fillStyle = view.css.bg;
        const w = Math.max(ctx.measureText(piece.text).width, ctx.measureText("Bottling runs, tap a week").width) + 0.5 * em;
        ctx.fillRect(piece.x, piece.y - 0.7 * em, w, 1.4 * em);
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, piece.text, piece.x, piece.y, "start");
      } else if (piece.kind === "cost") { // setups solid, storage lighter, side by side
        ctx.fillStyle = piece.paint;
        ctx.fillRect(0, piece.y, piece.setup, piece.h);
        const alpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha * 0.4;
        ctx.fillRect(piece.setup, piece.y, piece.storage, piece.h);
        ctx.globalAlpha = alpha;
        // the runs over the bar's start, the storage over its end (never into the runs label)
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, piece.runs, 0, piece.ty, "start");
        const gap = ctx.measureText(piece.runs).width + em + ctx.measureText(piece.stored).width;
        const end = Math.min(piece.w, Math.max(piece.setup + piece.storage, gap));
        fillCentred(ctx, piece.stored, end, piece.ty, "end");
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    // week 1 can't be switched off (pointer), so only the solver's plan is checked here
    feasible(p, plan) {
      return plan[0] ? true : "Week 1's orders can't be served: the warehouse starts empty";
    },
    score(p, plan) { return outcome(p, plan).cost; },

    // The CLSP for one beer: X = batch, Y = run or not, W = stock at the end of
    // the week, M = all orders (the Big-M of lecture 5).
    model(p) {
      const T = p.orders.length;
      const M = p.orders.reduce((a, b) => a + b, 0);
      const t8 = [...Array(T).keys()];
      return [
        "Minimize",
        " cost: " + t8.map((t) => `${SETUP} y_${t} + ${STORE} w_${t}`).join(" + "),
        "Subject To",
        ...t8.map((t) => ` stock_${t}: ${t ? `w_${t - 1} + ` : ""}x_${t} - w_${t} = ${p.orders[t]}`),
        ...t8.map((t) => ` setup_${t}: x_${t} - ${M} y_${t} <= 0`),
        "Binary",
        " " + t8.map((t) => `y_${t}`).join(" "),
        "End",
        "",
      ].join("\n");
    },
    decode(p, values) { return p.orders.map((_, t) => Math.round(values[`y_${t}`] || 0) === 1); },

    insight(p, yours, optimal) {
      const say = (plan) => {
        const o = outcome(p, plan);
        return `runs in ${weeks(runsOf(plan))}: ${o.runs} × ${SETUP} € for the setups and ${fmt(o.stored)} × ` +
          `${STORE} € for storage, ${fmt(o.cost)} €`;
      };
      const y = outcome(p, yours).cost;
      const b = outcome(p, optimal).cost;
      const diff = y === b
        ? `Your plan is as cheap as the best one: ${say(yours)}.`
        : `Your plan: ${say(yours)}. The best plan: ${say(optimal)}.`;
      return {
        diff,
        mechanism: "Every run after the first costs a setup but saves storage: without it, its crates would wait " +
          "in the warehouse since the run before. A run pays off exactly where that waiting would cost more than a setup.",
        model: "In lecture 5's model, `Y[i,t]` decides whether to bottle, `W[i,t]` counts the stock, and the Big-M " +
          "constraint `X[i,t] <= M * Y[i,t]` makes sure nothing is bottled without a setup.",
      };
    },

    describe(p, plan) {
      const o = outcome(p, plan);
      return `Runs in ${weeks(runsOf(plan))}: ${o.runs} setups and ${fmt(o.stored)} crates stored ` +
        `over the weeks, ${fmt(o.cost)} €.`;
    },
  });

  // A bottling run: a crate full of bottles that carries its batch; an empty,
  // dashed crate where a week has no run. Sized from the text size.
  function run(ctx, piece, view) {
    const em = view.em;
    const w = 2.1 * em;
    const h = 1.35 * em;
    const x = piece.x - w / 2;
    const y = piece.y - h / 2 + 0.25 * em;
    const on = Math.max(0, Math.min(1, piece.on));
    const alpha = ctx.globalAlpha;
    if (on < 1) { // the empty slot: a dashed crate
      ctx.globalAlpha = alpha * (1 - on);
      ctx.setLineDash([0.8, 0.6]);
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = view.css.muted;
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
    }
    if (on > 0) {
      ctx.globalAlpha = alpha * on;
      ctx.fillStyle = piece.paint;
      ctx.fillRect(x, y, w, h); // the crate
      for (let k = 0; k < 4; k++) { // bottle necks over its rim
        const bx = x + (k + 0.5) * (w / 4);
        ctx.fillRect(bx - 0.09 * em, y - 0.5 * em, 0.18 * em, 0.42 * em);
        ctx.fillRect(bx - 0.13 * em, y - 0.62 * em, 0.26 * em, 0.14 * em); // caps
      }
      ctx.fillStyle = view.css.bg;
      fillCentred(ctx, fmt(piece.size), piece.x, y + h / 2);
    }
    ctx.globalAlpha = alpha;
  }
})();
