// buses.js — lecture 13: the dispatcher game from the beyondsimulations
// website (busservice-simulation.js), on Gamekit. Bus lines run through the
// region over the day (faint); only some stretches of their trips are booked
// (bold). Students tap the booked stretches to send buses: the current bus
// takes a booking it can still reach, any other booking starts a new bus.
(function () {
  const { fillCentred, formatScore: fmt, wrapText } = GamekitCore;
  const T0 = 6 * 60, T1 = 22 * 60; // the day on the board, in minutes
  const SPEED = 240; // minutes to cross the whole region once (top to bottom)
  const UNIT = ["bus", "buses"];
  // one colour per bus, muted earth tones next to the course's teal and red (as on the website)
  const BUS = [[180, 142, 65], [148, 78, 90], [118, 138, 86], [194, 106, 106], [98, 118, 78], [158, 112, 72],
    [142, 95, 128], [178, 125, 118]];
  const busColor = (k) => BUS[k % BUS.length];

  // a puzzle: lines (stop positions across the region, 0 top to 1 bottom),
  // trips (a line, a start and a duration in minutes), bookings (a trip and
  // its first and last booked stop) and the depot's position
  const stops = (p, k) => { const tr = p.trips[k]; const sp = p.lines[tr.line];
    return sp.map((s, j) => ({ t: tr.start + (j / (sp.length - 1)) * tr.dur, s })); };
  function bookings(p) {
    return p.books.map(([k, a, b]) => { const st = stops(p, k);
      return { trip: k, a, b, dep: st[a].t, arr: st[b].t, from: st[a].s, to: st[b].s }; });
  }
  const drive = (a, b) => SPEED * Math.abs(a - b);
  const reach = (B, a, b) => B[a].arr + drive(B[a].to, B[b].from) <= B[b].dep; // the lecture's connection condition
  const clock = (m) => `${Math.floor(m / 60)}:${String(Math.round(m % 60)).padStart(2, "0")}`;
  // a trip's name, as on the website: its line's letter and its number on that line
  const label = (p, k) => "ABCDEF"[p.trips[k].line] + (p.trips.filter((t, j) => j <= k && t.line === p.trips[k].line).length);
  const trip = (p, b) => `the booking on ${label(p, b.trip)} at ${clock(b.dep)}`;
  // a plan: the bus serving each booking (0, 1, …), or -1 while it has none
  const buses = (plan) => new Set(plan.filter((k) => k >= 0)).size;
  const open = (plan) => plan.filter((k) => k < 0).length;
  const ids = (plan) => [...new Set(plan.filter((k) => k >= 0))].sort((a, b) => a - b);
  const route = (B, plan, k) => B.map((_, i) => i).filter((i) => plan[i] === k).sort((a, b) => B[a].dep - B[b].dep);

  // The rule of thumb: in the order of departure, each booking goes to the
  // first bus that can still reach it, otherwise to a new bus.
  function firstFit(p) {
    const B = bookings(p);
    const last = [];
    const plan = B.map(() => -1);
    B.map((_, i) => i).sort((a, b) => B[a].dep - B[b].dep).forEach((i) => {
      const k = last.findIndex((j) => reach(B, j, i));
      if (k < 0) { plan[i] = last.length; last.push(i); return; }
      plan[i] = k;
      last[k] = i;
    });
    return plan;
  }
  // The fewest buses: bookings minus the most links, a bipartite matching
  // (the puzzle generator's yardstick).
  function fewest(p) {
    const B = bookings(p);
    const prev = B.map(() => -1);
    const augment = (a, seen) => B.some((_, b) => {
      if (seen[b] || !reach(B, a, b)) return false;
      seen[b] = true;
      if (prev[b] < 0 || augment(prev[b], seen)) { prev[b] = a; return true; }
      return false;
    });
    return B.length - B.filter((_, a) => augment(a, [])).length;
  }

  // Layout in board units. Wide (slides, pages): time from left to right,
  // the region from top to bottom, the depot on the left, the hint below.
  // Compact (phones): the region across, time running down the long side of
  // the screen, the hint above; the board's height follows the text size.
  // pos(t, s): where position s of the region is at minute t.
  function lay(view) {
    const em = (view && view.em) || 3;
    if (view && view.compact) {
      const hint = 0.3 * em;
      const x0 = 3.0 * em, x1 = 100 - 1.2 * em; // the hours on the left
      const y0 = hint + 3 * 1.3 * em + 3.4 * em; // three lines of hint, then the depot
      const ph = 120;
      const pos = (t, s) => [x0 + s * (x1 - x0), y0 + ((t - T0) / (T1 - T0)) * ph];
      return { em, w: 100, compact: true, pos, hint, depot: (s) => [x0 + s * (x1 - x0), y0 - 1.9 * em], h: y0 + ph + 1.4 * em };
    }
    const w = (view && view.w) || 100;
    const h = (view && view.h) || 70;
    const x0 = 6.0 * em, x1 = w - 1.6 * em;
    const y0 = 1.2 * em, y1 = h - 1.6 * em - 3.4 * em; // below: the hours, then up to two lines of hint
    const pos = (t, s) => [x0 + ((t - T0) / (T1 - T0)) * (x1 - x0), y0 + s * (y1 - y0)];
    return { em, w, pos, axis: y1 + 1.4 * em, hint: y1 + 2.2 * em, depot: (s) => [2.4 * em, y0 + s * (y1 - y0)], h };
  }
  const path = (L, p, bk) => stops(p, bk.trip).slice(bk.a, bk.b + 1).map(({ t, s }) => L.pos(t, s));
  function nearest(L, p, B, x, y) { // the booking whose stretch passes closest to (x, y), within a finger's reach
    let hit = -1;
    let best = 1.3 * L.em;
    B.forEach((bk, i) => {
      const pts = path(L, p, bk);
      for (let n = 1; n < pts.length; n++) {
        const [[x1, y1], [x2, y2]] = [pts[n - 1], pts[n]];
        const f = Math.max(0, Math.min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / ((x2 - x1) ** 2 + (y2 - y1) ** 2 || 1)));
        const d = Math.hypot(x - x1 - f * (x2 - x1), y - y1 - f * (y2 - y1));
        if (d < best) { best = d; hit = i; }
      }
    });
    return hit;
  }

  Gamekit.game("buses", {
    title: "Dispatch the On-Demand Buses",
    task: "The faint lines are today's bus trips; only the bold stretches are booked. Tap a booking to send a bus " +
      "from the depot. The bookings this bus can still reach in time light up: tap one to add it, or any other " +
      "booking to start a new bus. Serve all bookings with as few buses as possible.",
    goal: "min",
    unit: UNIT,
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: (em) => lay({ compact: true, em }).h },
    // the class day: six lines, twelve trips ([line, start, minutes]), nine bookings ([trip, first stop, last stop])
    class: {
      lines: [[0.8, 0.75, 0.7, 0.66],
        [0.05, 0.08, 0.16, 0.23],
        [0.38, 0.33, 0.27, 0.22, 0.16],
        [0.36, 0.39, 0.42, 0.46, 0.49],
        [0.66, 0.63, 0.59, 0.56, 0.53, 0.49],
        [0.81, 0.84, 0.88, 0.92, 0.95]],
      trips: [[1, 415, 90], [4, 480, 175], [1, 545, 75], [4, 625, 125], [5, 695, 160], [5, 770, 140],
        [3, 830, 100], [4, 905, 150], [1, 965, 60], [5, 1035, 100], [0, 1125, 60], [2, 1180, 100]]
        .map(([line, start, dur]) => ({ line, start, dur })),
      books: [[1, 0, 1], [2, 2, 3], [3, 4, 5], [4, 1, 2], [5, 2, 4], [7, 1, 3], [8, 0, 2], [9, 2, 4], [10, 0, 2]],
      depot: 0.83,
    },
    check: { optimum: 3 },

    // The website's day: 4 to 6 lines in their own parts of the region, 10
    // to 12 trips spread over the day, 3 or 4 of them without bookings and
    // one booked stretch of 2 or 3 stops on each other one. Resampled until
    // the rule of thumb needs more buses than the best plan, so the mechanism
    // text holds for every puzzle.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
      const r2 = (v) => Math.round(v * 100) / 100;
      for (;;) {
        const n = int(4, 6);
        const base = shuffle(Array.from({ length: n }, (_, i) => 0.12 + (i / (n - 1)) * 0.76));
        const lines = base.map((b) => {
          const m = int(4, 6), spread = 0.1 + rng() * 0.12, down = rng() > 0.5;
          return Array.from({ length: m }, (_, j) => r2(Math.max(0.05, Math.min(0.95, b + (down ? 1 : -1) * spread * (j / (m - 1) - 0.5)))));
        });
        const per = lines.map(() => int(1, 3));
        let total = per.reduce((a, b) => a + b, 0);
        while (total < 10) { const l = int(0, n - 1); if (per[l] < 3) { per[l]++; total++; } }
        while (total > 12) { const l = int(0, n - 1); if (per[l] > 1) { per[l]--; total--; } }
        const defs = shuffle(per.flatMap((c, l) => Array.from({ length: c }, () => l)));
        const slot = (T1 - T0) * 0.88 / defs.length;
        const starts = defs.map((_, i) => T0 + (T1 - T0) * 0.04 + i * slot + rng() * slot * 0.5).sort((a, b) => a - b);
        const trips = defs.map((line, i) => {
          const dur = Math.min((T1 - T0) * (0.02 + rng() * 0.02) * (lines[line].length - 1), T1 - (T1 - T0) * 0.04 - starts[i]);
          return { line, start: Math.round(starts[i] / 5) * 5, dur: Math.round(dur / 5) * 5 };
        });
        const empty = new Set(shuffle(trips.map((_, k) => k)).slice(0, int(3, 4)));
        const books = trips.flatMap((tr, k) => {
          if (empty.has(k)) return [];
          const m = lines[tr.line].length;
          const a = int(0, m - 2);
          return [[k, a, a + int(1, Math.min(2, m - 1 - a))]];
        });
        const p = { lines, trips, books, depot: r2(0.15 + rng() * 0.7) };
        if (books.length >= 6 && buses(firstFit(p)) > fewest(p)) return p;
      }
    },
    start(p) { return p.books.map(() => -1); }, // no bus yet

    // As on the website: a tap on a booking without a bus adds it to the
    // current bus if that bus can still reach it, otherwise a new bus takes
    // it. A tap on another bus's booking makes that bus the current one; a
    // tap on the current bus's last booking takes it off again.
    pointer(p, plan, ui, e, view) {
      const L = lay(view);
      const B = bookings(p);
      if (e.type === "down") { ui.press = nearest(L, p, B, e.x, e.y); ui.note = null; return undefined; }
      if (e.type !== "up" || e.moved) { if (e.type !== "move") ui.press = null; return undefined; }
      const i = ui.press;
      ui.press = null;
      if (i == null || i < 0) return undefined;
      const next = plan.slice();
      if (plan[i] >= 0) {
        if (plan[i] !== ui.bus) { ui.bus = plan[i]; return undefined; } // continue that bus
        const rt = route(B, plan, plan[i]);
        if (rt[rt.length - 1] !== i) { ui.note = "Only a bus's last booking can be taken off."; return undefined; }
        next[i] = -1;
        return next;
      }
      const rt = ui.bus == null ? [] : route(B, plan, ui.bus);
      if (rt.length && reach(B, rt[rt.length - 1], i)) next[i] = ui.bus;
      else if (ui.bus != null && !rt.length) next[i] = ui.bus; // the current bus has no booking yet
      else { ui.bus = plan.reduce((m, k) => Math.max(m, k), -1) + 1; next[i] = ui.bus; }
      return next;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const B = bookings(p);
      const locked = !!(view && view.locked);
      const cur = !locked && ui.bus != null ? route(B, plan, ui.bus) : [];
      const last = cur.length ? cur[cur.length - 1] : -1;
      const out = [];
      const bold = B.map((bk) => path(L, p, bk));
      const clear = ([x, y]) => bold.every((q) => q.every(([bx, by]) => Math.hypot(x - bx, y - by) > 1.4 * L.em));
      p.trips.forEach((_, k) => { // today's trips, faint, named next to their first stop where no booking is in the way
        const pts = stops(p, k).map(({ t, s }) => L.pos(t, s));
        const [x, y] = pts[0];
        const at = [[x, y - 1.0 * L.em], [x, y + 1.0 * L.em], [x - 1.6 * L.em, y], [x, y - 1.6 * L.em], [x - 2.2 * L.em, y]].find(clear) || [x, y - 1.0 * L.em];
        out.push({ key: `trip-${k}`, kind: "trip", pts: pts.flat(), name: label(p, k), nx: at[0], ny: at[1], color: "muted" });
      });
      const depot = L.depot(p.depot);
      ids(plan).forEach((k) => { // each bus's empty drives: from the depot, between its bookings, back to the depot
        const rt = route(B, plan, k);
        const pts = [depot];
        rt.forEach((i) => { const q = path(L, p, B[i]); pts.push(q[0], q[q.length - 1]); });
        pts.push(depot);
        for (let n = 0; n < pts.length; n += 2) {
          out.push({ key: `drive-${k}-${n}`, kind: "drive", x1: pts[n][0], y1: pts[n][1], x2: pts[n + 1][0], y2: pts[n + 1][1], color: busColor(k) });
        }
      });
      B.forEach((bk, i) => {
        const k = plan[i];
        const lit = k < 0 && last >= 0 && reach(B, last, i); // the current bus can still reach it
        out.push({ key: `book-${i}`, kind: "book", pts: path(L, p, bk).flat(), lit, cur: k >= 0 && k === ui.bus && !locked,
          color: k >= 0 ? busColor(k) : lit ? "accent" : "neutral", bus: k >= 0 });
      });
      out.push({ key: "depot", kind: "depot", x: depot[0], y: depot[1], compact: !!L.compact, color: "text" });
      if (!locked) {
        let text;
        if (ui.note) text = ui.note;
        else if (open(plan) === B.length) text = "Tap a booking to send a bus. Use as few buses as possible.";
        else if (!open(plan)) text = "Every booking has a bus. Tap a bus, then its last booking, to take that booking off.";
        else if (B.some((_, i) => plan[i] < 0 && last >= 0 && reach(B, last, i))) {
          text = "Tap a red booking to add it to this bus, another open booking to start a new bus, or a coloured booking to continue its bus.";
        } else text = "This bus can't reach any open booking. Tap one to start a new bus, or a coloured booking to continue its bus.";
        out.push({ key: "hint", kind: "hint", x: 0, y: L.hint, w: L.w, color: "muted", text });
      }
      return out;
    },

    drawBoard(ctx, p, view) {
      const L = lay(view);
      const em = view.em;
      ctx.font = `${em}px ${view.font}`; // the same size as the HTML text around the board
      ctx.fillStyle = view.css.muted;
      for (let t = T0; t <= T1; t += 4 * 60) { // the hours
        const [x, y] = L.pos(t, 0);
        if (L.compact) fillCentred(ctx, String(t / 60), 0.2 * em, y, "start");
        else fillCentred(ctx, clock(t), x, L.axis);
      }
    },

    drawPiece(ctx, piece, view) {
      const em = view.em;
      ctx.font = `${em}px ${view.font}`;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const line = (pts, width) => {
        ctx.lineWidth = width;
        ctx.beginPath();
        for (let n = 0; n < pts.length; n += 2) ctx[n ? "lineTo" : "moveTo"](pts[n], pts[n + 1]);
        ctx.stroke();
      };
      const alpha = ctx.globalAlpha;
      if (piece.kind === "trip") { // a trip of a line: faint and dashed
        ctx.globalAlpha = alpha * 0.35;
        ctx.strokeStyle = piece.paint;
        ctx.setLineDash([0.3 * em, 0.3 * em]);
        line(piece.pts, 0.1 * em);
        ctx.setLineDash([]);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, piece.name, piece.nx, piece.ny);
      } else if (piece.kind === "drive") { // a bus drives empty
        ctx.globalAlpha = alpha * 0.55;
        ctx.strokeStyle = piece.paint;
        ctx.setLineDash([0.3 * em, 0.3 * em]);
        line([piece.x1, piece.y1, piece.x2, piece.y2], 0.12 * em);
        ctx.setLineDash([]);
      } else if (piece.kind === "book") { // a booked stretch, with a dot at each of its stops
        if (piece.lit) { // a glow behind what the current bus can still reach
          ctx.globalAlpha = alpha * 0.22;
          ctx.strokeStyle = piece.paint;
          line(piece.pts, 1.2 * em);
          ctx.globalAlpha = alpha;
        }
        ctx.strokeStyle = piece.paint;
        line(piece.pts, (piece.cur ? 0.55 : piece.bus ? 0.4 : 0.3) * em); // the current bus a little bolder
        ctx.fillStyle = piece.paint;
        for (let n = 0; n < piece.pts.length; n += 2) {
          ctx.beginPath();
          ctx.arc(piece.pts[n], piece.pts[n + 1], 0.38 * em, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else if (piece.kind === "depot") { // the depot: a square, named
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x - 0.6 * em, piece.y - 0.6 * em, 1.2 * em, 1.2 * em);
        if (piece.compact) fillCentred(ctx, "Depot", piece.x + 1.0 * em, piece.y, "start");
        else fillCentred(ctx, "Depot", piece.x, piece.y + 1.5 * em);
      } else if (piece.kind === "hint") {
        ctx.fillStyle = piece.paint;
        wrapText(ctx, piece.text, piece.w).forEach((l, n) => fillCentred(ctx, l, piece.x, piece.y + (n + 0.5) * 1.3 * em, "start"));
      }
      ctx.globalAlpha = alpha;
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.lineCap = "butt";
    },

    feasible(p, plan) {
      const n = open(plan);
      return n === 0 || `${plan.length - n} of ${plan.length} bookings have a bus.`;
    },
    score(p, plan) { return buses(plan); },

    // Lecture 13's network flow under S3, each booking a mini line trip:
    // d_i from the depot to its first stop, t_i along it, h_i from its last
    // stop back to the depot, c_i_j on to booking j where the bus is in time.
    model(p) {
      const B = bookings(p);
      const arcs = [];
      B.forEach((_, a) => B.forEach((_, b) => { if (a !== b && reach(B, a, b)) arcs.push([a, b]); }));
      const c = ([a, b]) => `c_${a}_${b}`;
      return [
        "Minimize",
        " buses: " + B.map((_, i) => `d_${i}`).join(" + "),
        "Subject To",
        ...B.map((_, i) => ` serve_${i}: t_${i} = 1`),
        ...B.map((_, i) => ` stop_${i}: ` + [`d_${i}`, ...arcs.filter((q) => q[1] === i).map(c)].join(" + ") + ` - t_${i} = 0`),
        ...B.map((_, i) => ` dest_${i}: t_${i} - h_${i}` + arcs.filter((q) => q[0] === i).map((q) => ` - ${c(q)}`).join("") + " = 0"),
        " depot: " + B.map((_, i) => `h_${i}`).join(" + ") + " - " + B.map((_, i) => `d_${i}`).join(" - ") + " = 0",
        "End",
        "",
      ].join("\n");
    },
    // the flow's tours become buses in the order of their first booking
    decode(p, values) {
      const B = bookings(p);
      const next = B.map((_, a) => B.findIndex((_, j) => (values[`c_${a}_${j}`] || 0) > 0.5));
      const plan = B.map(() => -1);
      B.map((_, i) => i).filter((i) => !next.includes(i)).sort((a, b) => B[a].dep - B[b].dep)
        .forEach((i, k) => { for (let j = i; j >= 0; j = next[j]) plan[j] = k; });
      return plan;
    },

    insight(p, yours, optimal) {
      const B = bookings(p);
      const same = buses(yours) === buses(optimal);
      let diff = same
        ? `Your plan needs ${fmt(buses(yours), UNIT)}, as few as the best one.`
        : `Your plan needs ${fmt(buses(yours), UNIT)}, while the best one HiGHS found needs ${fmt(buses(optimal))}.`;
      const links = (plan) => ids(plan).flatMap((k) => { const rt = route(B, plan, k); return rt.slice(1).map((b, n) => [rt[n], b]); });
      const mine = new Set(links(yours).map(([a, b]) => `${a}-${b}`));
      const missing = links(optimal).filter(([a, b]) => !mine.has(`${a}-${b}`)).sort((x, y) => B[x[0]].dep - B[y[0]].dep);
      if (!same && missing.length) {
        const [a, b] = missing[0];
        diff += ` One pair of the best plan that yours lacks: after ${trip(p, B[a])}, the same bus serves ${trip(p, B[b])}.`;
      }
      const rule = buses(firstFit(p));
      return {
        diff,
        mechanism: `Giving each booking, in the order of departure, to the first bus that can still reach it needs ` +
          `${fmt(rule, UNIT)} here, ${fmt(rule - buses(optimal))} more than the best plan. Which bus takes a booking ` +
          "matters: the first bus in time may be the only one that could still reach a later booking.",
        model: "Each dashed empty drive between two bookings is a connection arc of the lecture's graph, which exists " +
          "only if the bus gets there in time, and each bus is one departure `x[D,j]` from the depot. The network flow, " +
          "coming up next, minimizes `Σ x[D,j]` with flow conservation at every stop and `x[s1,sm] = 1` for every " +
          "booking. It is an LP, yet it returns whole buses.",
      };
    },

    describe(p, plan) {
      const B = bookings(p);
      const rows = ids(plan).map((k, n) => `bus ${n + 1}: ${route(B, plan, k).map((i) => trip(p, B[i])).join(", then ")}`);
      const n = open(plan);
      if (n) rows.push(`${n} without a bus`);
      return `${rows.join("; ")}. ${fmt(buses(plan), UNIT)}.`;
    },
  });
})();
