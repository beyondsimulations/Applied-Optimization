// orders.js — lecture 03: a brewery's order file was imported with errors, and
// the brewing plan made from it looks absurd. Students clean the weeks they
// distrust (a cleaned week gets the median order); the plan updates live and
// is measured against the true orders: how many crates go wrong, short or left
// over (costs only come in lecture 5).
(function () {
  const { fillCentred, formatScore: fmt } = GamekitCore;
  // Orders and batches in crates of 20 bottles. The planner weighs a brew's
  // setup against storage (lecture 5's 0.1 € per bottle is 2 € per crate).
  const SETUP = 400;  // € per brew
  const STORE = 2;    // € per crate and week in stock
  const TOP = 150;    // crates at the top of the chart; larger orders stop there, labelled with ↑
  const BOX = 20;     // crates per drawn box in the order stacks

  // Two layouts in board units, flush with the task text; on slides the board
  // stretches to the stage's width (view.w) and the 8 weeks share it.
  function lay(view) {
    const w = (view && view.w) || 100;
    if (view && view.compact) {
      return { w, h: 94, head1: 3, top: 17, base: 50, week: 54.5, head2: 61.5, kettle: 72, head3: 83.5, short: 90 };
    }
    return { w, h: 70, head1: 2.5, top: 13, base: 35, week: 39, head2: 45, kettle: 53, head3: 61.5, short: 66.5 };
  }
  const col = (L, t, T) => (L.w * (t + 0.5)) / T; // centre of week t
  const yOf = (L, crates) => L.base - (Math.min(crates, TOP) / TOP) * (L.base - L.top);

  const list = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  const weeks = (ts) => `week${ts.length === 1 ? "" : "s"} ${list(ts.map((t) => t + 1))}`;
  const cleaned = (p, plan) => p.raw.map((v, t) => (plan[t] ? p.median : v));
  const errors = (p) => p.kind.map((k) => k === "comma" || k === "blank" || k === "double"); // clean exactly these

  // Wagner–Whitin: the cheapest batches (setups plus storage) that meet the
  // orders d exactly. The planner trusts every number it gets.
  function brewing(d) {
    const T = d.length;
    const F = [0];
    const from = [];
    for (let k = 1; k <= T; k++) {
      F[k] = Infinity;
      for (let j = 0; j < k; j++) {
        let hold = 0;
        let sum = 0;
        for (let t = j; t < k; t++) { hold += STORE * (t - j) * d[t]; sum += d[t]; }
        const c = F[j] + (sum > 0 ? SETUP : 0) + hold;
        if (c < F[k]) { F[k] = c; from[k] = j; }
      }
    }
    const brew = d.map(() => 0);
    for (let k = T; k > 0; k = from[k]) brew[from[k]] = d.slice(from[k], k).reduce((a, b) => a + b, 0);
    return brew;
  }
  // What a plan does against the true orders: crates short each week, crates left over.
  function outcome(p, plan) {
    const brew = brewing(cleaned(p, plan));
    let stock = 0;
    const short = [];
    for (let t = 0; t < p.truth.length; t++) {
      stock += brew[t];
      const sold = Math.min(stock, p.truth[t]);
      short[t] = p.truth[t] - sold;
      stock -= sold;
    }
    return { brew, short, left: stock, wrong: short.reduce((a, b) => a + b, 0) + stock };
  }

  // The best of all 2^8 ways to clean the file: fewest crates short or left
  // over (ties: the first found).
  function bestCleaning(p, first) {
    let best = { plan: first, wrong: outcome(p, first).wrong };
    for (let m = 0; m < 1 << p.raw.length; m++) {
      const plan = p.raw.map((_, t) => !!((m >> t) & 1));
      const wrong = outcome(p, plan).wrong;
      if (wrong < best.wrong) best = { plan, wrong };
    }
    return best;
  }

  // A file with three import errors and one real peak, at random weeks. The
  // median of all weeks is the average of the two largest normal weeks (one
  // order is 0, three are above every normal week), and the true orders of the
  // broken weeks equal it, so cleaning exactly the errors gives the best plan.
  // Callers keep the two largest normal weeks' sum even: the median is whole.
  function file(normal, at, festival) {
    const s = normal.slice().sort((a, b) => a - b);
    const median = (s[2] + s[3]) / 2;
    const truth = [];
    const raw = [];
    const kind = [];
    let n = 0;
    for (let t = 0; t < 8; t++) {
      const k = Object.keys(at).find((key) => at[key] === t) || "";
      kind.push(k);
      if (k === "festival") { truth.push(festival); raw.push(festival); }
      else if (k === "") { truth.push(normal[n]); raw.push(normal[n]); n++; }
      else {
        truth.push(median);
        raw.push(k === "comma" ? median * 10 : k === "blank" ? 0 : 2 * median); // "60,0" read as 600; empty cell; row counted twice
      }
    }
    return { raw, truth, kind, median };
  }

  Gamekit.game("orders", {
    title: "Clean the Order File",
    task: "The brewing plan comes straight from the sales team's order file, in crates of 20 bottles, and the " +
      "file was imported with errors. Tap a week you don't trust to replace its order with the median, so that " +
      "no crate is short or left over. A flag marks the harbour festival.",
    goal: "min",
    unit: "crates wrong",
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: 94 },
    // weeks 1–8: "60,0" read as 600 in week 2, an empty cell in week 4, the
    // festival in week 6, a duplicated row in week 7
    class: file([53, 61, 56, 59], { comma: 1, blank: 3, festival: 5, double: 6 }, 126),
    check: { optimum: 0 }, // the clean file meets every true order exactly

    // Resampled until each error, left in, makes crates go wrong and cleaning
    // the festival does too, so the mechanism text holds for every puzzle.
    // Cleaning exactly the errors always leaves no crate wrong: the planner
    // then plans with the true orders.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      for (;;) {
        const t = [0, 1, 2, 3, 4, 5, 6, 7];
        for (let i = 7; i > 0; i--) { const j = int(0, i); [t[i], t[j]] = [t[j], t[i]]; }
        const normal = [int(45, 65), int(45, 65), int(45, 65), int(45, 65)];
        const s = normal.slice().sort((a, b) => a - b);
        if ((s[2] + s[3]) % 2) continue; // a whole median, as the board shows it
        const festival = Math.round(((s[2] + s[3]) / 2) * (1.9 + rng() * 0.3));
        if (festival === s[2] + s[3]) continue; // never exactly the duplicated row's 2 × median
        const p = file(normal, { comma: t[0], blank: t[1], festival: t[2], double: t[3] }, festival);
        const worse = (flags) => outcome(p, flags).wrong > 0;
        const errorsMatter = ["comma", "blank", "double"].every((k) => worse(p.kind.map((x) => x !== "" && x !== "festival" && x !== k)));
        const festivalMatters = worse(p.kind.map((x) => x !== ""));
        if (errorsMatter && festivalMatters) return p;
      }
    },
    start(p) { return p.raw.map(() => false); },

    pointer(p, plan, ui, e, view) {
      if (e.type !== "down") return undefined;
      const L = lay(view);
      if (e.y > L.week + 2) return undefined; // only the order chart and its week numbers
      const t = Math.floor((e.x / L.w) * p.raw.length);
      if (t < 0 || t >= p.raw.length) return undefined;
      const next = plan.slice();
      next[t] = !next[t];
      return next;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const T = p.raw.length;
      const bw = Math.min(L.w / T - 3, 9); // bar width
      const o = outcome(p, plan);
      const out = [];
      for (let t = 0; t < T; t++) {
        const x = col(L, t, T);
        const value = plan[t] ? p.median : p.raw[t];
        // the order as read (grey crates; ghosted once cleaned) and the order the planner uses
        out.push({ key: `raw-${t}`, kind: "stack", x, w: bw, y: yOf(L, p.raw[t]), base: L.base,
          crate: (BOX / TOP) * (L.base - L.top), color: "muted", alpha: plan[t] ? 0.25 : 1 });
        out.push({ key: `clean-${t}`, kind: "stack", x, w: bw, y: plan[t] ? yOf(L, p.median) : L.base, base: L.base,
          crate: (BOX / TOP) * (L.base - L.top), color: "plan" });
        out.push({ key: `order-${t}`, kind: "label", x, y: yOf(L, value) - 0.85 * view.em,
          text: fmt(value) + (value > TOP ? " ↑" : ""), // the order goes on beyond the chart
          patch: 1, color: plan[t] ? "plan" : "text" });
        // the festival flag stays above the order as read, also once that week is cleaned
        if (p.kind[t] === "festival") out.push({ key: "festival", kind: "flag", x, y: yOf(L, p.raw[t]) - 2.2 * view.em, color: "text" });
        out.push({ key: `kettle-${t}`, kind: "kettle", x, y: L.kettle, size: o.brew[t], alpha: o.brew[t] > 0 ? 1 : 0, color: "plan" });
        out.push({ key: `short-${t}`, kind: "label", x, y: L.short, text: `−${fmt(o.short[t])}`, alpha: o.short[t] > 0 ? 1 : 0, color: "bad" });
      }
      // beer left over after the last week sits under that week (it can't be short then)
      out.push({ key: "left", kind: "label", x: col(L, T - 1, T), y: L.short, text: `+${fmt(o.left)}`, alpha: o.left > 0 ? 1 : 0, color: "bad" });
      return out;
    },

    drawBoard(ctx, p, view) {
      const L = lay(view);
      const T = p.raw.length;
      ctx.font = `${view.em}px ${view.font}`; // the same size as the HTML text around the board
      ctx.fillStyle = view.css.muted;
      fillCentred(ctx, `Orders in crates, dashed: median ${fmt(p.median)}`, 0, L.head1, "start");
      fillCentred(ctx, "Brewing plan in crates", 0, L.head2, "start");
      fillCentred(ctx, "Short (−) or left over (+)", 0, L.head3, "start");
      for (let t = 0; t < T; t++) fillCentred(ctx, String(t + 1), col(L, t, T), L.week);
      ctx.strokeStyle = view.css.muted;
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      ctx.moveTo(0, L.base);
      ctx.lineTo(L.w, L.base);
      ctx.stroke();
      ctx.setLineDash([1.2, 1]);
      ctx.beginPath();
      ctx.moveTo(0, yOf(L, p.median));
      ctx.lineTo(L.w, yOf(L, p.median));
      ctx.stroke();
      ctx.setLineDash([]);
    },

    drawPiece(ctx, piece, view) {
      ctx.font = `${view.em}px ${view.font}`;
      if (piece.kind === "stack") {
        // crates: one square-cornered box per BOX crates, the top one cut to size
        const x = piece.x - piece.w / 2;
        ctx.fillStyle = piece.paint;
        for (let y = piece.base; y > piece.y + 0.05; y -= piece.crate) {
          const h = Math.min(piece.crate, y - piece.y);
          ctx.fillRect(x, y - h + 0.3, piece.w, h - 0.3);
        }
      } else if (piece.kind === "label") {
        if (piece.patch) { // a background patch, so a label never sits on crates
          const w = ctx.measureText(piece.text).width + 0.4 * view.em;
          ctx.fillStyle = view.css.bg;
          ctx.fillRect(piece.x - w / 2, piece.y - 0.6 * view.em, w, 1.2 * view.em);
        }
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, piece.text, piece.x, piece.y);
      } else if (piece.kind === "flag") { // the festival: a pennant on a pole
        const em = view.em;
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x - 0.08 * em, piece.y - 0.6 * em, 0.16 * em, 1.2 * em);
        ctx.beginPath();
        ctx.moveTo(piece.x + 0.08 * em, piece.y - 0.6 * em);
        ctx.lineTo(piece.x + 1 * em, piece.y - 0.3 * em);
        ctx.lineTo(piece.x + 0.08 * em, piece.y);
        ctx.closePath();
        ctx.fill();
      } else if (piece.kind === "kettle") {
        kettle(ctx, piece, view);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible() { return true; },
    score(p, plan) { return outcome(p, plan).wrong; },

    // tries every way to clean the file and keeps the best one: cleaning exactly
    // the three import errors, which leaves no crate wrong (ties keep it)
    optimal(p) { return bestCleaning(p, errors(p)).plan; },
    think(p, result) {
      const best = p.raw.map((_, t) => t).filter((t) => result.plan[t]);
      return `Tried all ${fmt(Math.pow(2, p.raw.length))} ways to clean the file: cleaning ${weeks(best)} ` +
        `leaves no crate short or left over · ${result.ms < 1 ? "under 1" : fmt(result.ms)} ms`;
    },

    insight(p, yours, optimal) {
      const T = p.raw.length;
      const all = [...Array(T).keys()];
      const mine = all.filter((t) => yours[t]);
      const was = { comma: (t) => `week ${t + 1}'s “${p.median},0” was read as ${fmt(p.raw[t])}`,
        blank: (t) => `week ${t + 1}'s empty cell was read as 0`,
        double: (t) => `week ${t + 1}'s row was counted twice (${fmt(p.raw[t])} instead of ${fmt(p.truth[t])})` };
      const notes = [];
      for (const t of all) {
        if (!yours[t] && was[p.kind[t]]) notes.push(was[p.kind[t]](t));
        if (yours[t] && p.kind[t] === "festival") notes.push(`the festival orders in week ${t + 1} were real (${fmt(p.raw[t])} crates)`);
        if (yours[t] && p.kind[t] === "") notes.push(`week ${t + 1} was fine (${fmt(p.raw[t])} crates)`);
      }
      const y = outcome(p, yours);
      let diff = mine.length ? `You cleaned ${weeks(mine)}.` : "You cleaned nothing.";
      if (!notes.length) {
        diff += " That's exactly the three import errors, and the festival stayed in: the best plan.";
      } else {
        diff += " But " + list(notes) + ".";
        if (y.wrong > 0) {
          const what = [];
          if (y.short.some((s) => s > 0)) what.push(`${fmt(y.short.reduce((a, b) => a + b, 0))} crates of orders go unserved`);
          if (y.left > 0) what.push(`${fmt(y.left)} crates are left over`);
          diff += ` With your plan ${list(what)}; with the best plan, none.`;
        } else {
          diff += " Here that changes nothing.";
        }
      }
      return {
        diff,
        mechanism: "The planner trusts every number in the file. An import error moves whole batches or leaves " +
          "orders unserved, and cleaning a real peak away, like the festival, costs sales too: an outlier is not " +
          "always an error.",
        model: "That's why we look at the data before it becomes the demand `d[i][t]` of the brewery model in " +
          `lecture 5 (in bottles there, 20 per crate): plot it, count missing values, and check how numbers like ` +
          `“${p.median},0” were read.`,
      };
    },

    describe(p, plan) {
      const o = outcome(p, plan);
      const mine = p.raw.map((_, t) => t).filter((t) => plan[t]);
      const batches = o.brew.map((b, t) => [b, t]).filter(([b]) => b > 0).map(([b, t]) => `${fmt(b)} crates in week ${t + 1}`);
      return `${mine.length ? "Cleaned " + weeks(mine) : "Nothing cleaned"}. The plan brews ${batches.join(", ") || "nothing"}. ` +
        `${fmt(o.wrong)} crates short or left over.`;
    },
  });

  // A brew kettle that carries its batch size: a vessel on two legs with a
  // sloped top and a vent pipe, sized from the text size so the number fits.
  function kettle(ctx, piece, view) {
    const em = view.em;
    const w = 2.1 * em;
    const h = 1.45 * em;
    const x = piece.x - w / 2;
    const y = piece.y - h / 2 + 0.3 * em;
    ctx.fillStyle = piece.paint;
    ctx.beginPath();
    ctx.rect(x, y, w, h); // vessel
    ctx.moveTo(x, y); // sloped top
    ctx.lineTo(x + 0.3 * w, y - 0.45 * em);
    ctx.lineTo(x + 0.7 * w, y - 0.45 * em);
    ctx.lineTo(x + w, y);
    ctx.closePath();
    ctx.rect(piece.x - 0.09 * em, y - 0.85 * em, 0.18 * em, 0.42 * em); // vent pipe
    ctx.rect(x + 0.15 * w, y + h, 0.16 * em, 0.3 * em); // legs
    ctx.rect(x + 0.85 * w - 0.16 * em, y + h, 0.16 * em, 0.3 * em);
    ctx.fill();
    ctx.fillStyle = view.css.bg;
    fillCentred(ctx, fmt(piece.size), piece.x, y + h / 2);
  }
})();
