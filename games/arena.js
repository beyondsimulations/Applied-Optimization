// arena.js — lecture 11: seat groups of visitors in a stand of 10 × 10 seats
// with distancing rules (an empty seat beside, in front and diagonally, at
// most 2 groups per row). Students place groups to collect as many points as
// possible: a two-dimensional knapsack.
(function () {
  const { fillCentred, formatScore: fmt, wrapText } = GamekitCore;
  const ROWS = 10;
  const COLS = 10;
  const H = 1; // empty seats between groups in a row
  const B = 1; // empty rows between groups, also diagonally
  const PER_ROW = 2;
  // the lecture's group types: seats, points and how many want tickets
  const TYPES = [["a", 1, 1, 3], ["b", 2, 2, 2], ["c", 2, 4, 3], ["d", 4, 4, 5], ["e", 4, 5, 2], ["f", 6, 6, 1], ["g", 6, 12, 1]]
    .map(([id, d, v, n]) => ({ id, d, v, n }));

  // A plan holds one slot per group that wants tickets: [row, seat] of its
  // left end, or null while it has no seats. Rows and seats count from 1.
  const groups = (plan) => plan.flatMap((slots, t) => slots.map((s, i) => (s ? { t, i, r: s[0], c: s[1] } : null)).filter(Boolean));
  const points = (plan) => groups(plan).reduce((sum, g) => sum + TYPES[g.t].v, 0);
  const sets = new WeakMap(); // each puzzle's blocked seats as "row,seat"
  const blockedSet = (p) => {
    if (!sets.has(p)) sets.set(p, new Set(p.blocked.map(([r, c]) => `${r},${c}`)));
    return sets.get(p);
  };
  const fits = (p, t, r, c) => c >= 1 && c + TYPES[t].d - 1 <= COLS && r >= 1 && r <= ROWS &&
    Array.from({ length: TYPES[t].d }, (_, k) => c + k).every((s) => !blockedSet(p).has(`${r},${s}`));
  // two groups clash when they sit within B rows of each other and less than H seats apart
  const clash = (a, b) => Math.abs(a.r - b.r) <= B &&
    a.c <= b.c + TYPES[b.t].d - 1 + H && b.c <= a.c + TYPES[a.t].d - 1 + H;
  // why group type t can't take seat (r, c) next to the seated groups, or null
  function refusal(p, seated, t, r, c) {
    if (!fits(p, t, r, c)) return c + TYPES[t].d - 1 > COLS ? `Group ${TYPES[t].id} needs ${TYPES[t].d} seats from there; the row ends.` : "A blocked seat is in the way.";
    if (seated.filter((g) => g.r === r).length >= PER_ROW) return `Row ${r} already has ${PER_ROW} groups.`;
    const near = seated.find((g) => clash(g, { t, r, c }));
    return near ? `Too close to group ${TYPES[near.t].id} in row ${near.r}.` : null;
  }

  // The rule of thumb: the densest groups first (points per seat, bigger
  // first on a tie), each on the first free seat from the front row.
  function greedy(p, order, scan) {
    const seated = [];
    for (const t of order) {
      for (let k = 0; k < TYPES[t].n; k++) {
        const at = scan.find(([r, c]) => !refusal(p, seated, t, r, c));
        if (at) seated.push({ t, r: at[0], c: at[1] });
      }
    }
    return seated;
  }
  const FRONT = Array.from({ length: ROWS * COLS }, (_, k) => [1 + Math.floor(k / COLS), 1 + (k % COLS)]);
  const DENSEST = TYPES.map((_, t) => t).sort((a, b) => TYPES[b].v / TYPES[b].d - TYPES[a].v / TYPES[a].d || TYPES[b].d - TYPES[a].d);
  const densest = (p) => greedy(p, DENSEST, FRONT);
  const sum = (seated) => seated.reduce((s, g) => s + TYPES[g.t].v, 0);

  // Layout in board units. Wide (slides, pages): the stand on the left with
  // the pitch above it, the groups in a column on the right, the hint below
  // them. Compact (phones): the groups below the stand in two columns (one
  // when narrow); the board's height follows the text size.
  function lay(view) {
    const em = (view && view.em) || 3;
    const tile = (cols, x0, y0, w) => TYPES.map((_, t) => ({ x: x0 + (t % cols) * w, y: y0 + Math.floor(t / cols) * 1.8 * em, w: w - 0.6 * em, h: 1.5 * em }));
    if (view && view.compact) {
      const s = 99.5 / COLS;
      const y0 = 1.6 * em; // the pitch above the first row
      const cols = 2 * 9.6 * em <= 100 ? 2 : 1;
      const py = y0 + ROWS * s + 1.0 * em;
      const tiles = tile(cols, 0, py, 100 / cols);
      const hint = { x: 0, y: py + Math.ceil(TYPES.length / cols) * 1.8 * em + 0.2 * em, w: 100 };
      return { s, x0: 0.25, y0, tiles, hint, w: 100, h: hint.y + 2.6 * em + 0.5 };
    }
    const w = (view && view.w) || 100;
    const h = (view && view.h) || 70;
    const pw = 10.5 * em;
    const s = Math.min((h - 1.6 * em - 0.5) / ROWS, (w - pw - 2 * em) / COLS);
    const y0 = 1.6 * em;
    return { s, x0: 0, y0, tiles: tile(1, w - pw, 0.5, pw), hint: { x: w - pw, y: 0.5 + TYPES.length * 1.8 * em + 0.3 * em, w: pw }, w };
  }
  const seatAt = (L, r, c) => ({ x: L.x0 + (c - 1) * L.s, y: L.y0 + (r - 1) * L.s });
  const inside = (e, b) => e.x >= b.x && e.x <= b.x + b.w && e.y >= b.y && e.y <= b.y + b.h;

  Gamekit.game("arena", {
    title: "Seat the Arena",
    task: "Seat groups in the stand for as many points as possible. Keep an empty seat beside, in front of and " +
      "diagonally to every group, and at most 2 groups per row. Tap a group, then the seat for its left end; " +
      "tap a seated group to take it out.",
    goal: "max",
    unit: ["point", "points"],
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: (em) => lay({ compact: true, em }).h },
    // the venue of the lecture and tutorial: blocked seats as [row, seat]
    class: { blocked: [[1, 1], [1, 2], [1, 9], [1, 10], [2, 1], [2, 10], [6, 5], [6, 6], [7, 5], [7, 6]] },
    check: { optimum: 52 },

    // Random stands keep the groups and draw new blocked seats: cut corners
    // at the front and one or two pillars of 2 × 2 seats. Resampled until
    // another quick plan beats densest first, so the mechanism text holds
    // for every puzzle.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      const orders = [DENSEST, TYPES.map((_, t) => t).reverse(), TYPES.map((_, t) => t).sort((a, b) => TYPES[b].v - TYPES[a].v),
        TYPES.map((_, t) => t).sort((a, b) => TYPES[b].d - TYPES[a].d || TYPES[b].v - TYPES[a].v)];
      const scans = [FRONT, FRONT.slice().reverse(), FRONT.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0])];
      for (;;) {
        const blocked = [];
        const corner = int(0, 2);
        for (let k = 0; k < corner; k++) blocked.push([1, 1 + k], [1, COLS - k]);
        if (corner) blocked.push([2, 1], [2, COLS]);
        for (let k = int(1, 2); k > 0; k--) {
          const r = int(3, ROWS - 2);
          const c = int(2, COLS - 2);
          blocked.push([r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]);
        }
        const p = { blocked: [...new Map(blocked.map((b) => [b.join(","), b])).values()] };
        const rule = sum(densest(p));
        if (orders.some((o) => scans.some((sc) => sum(greedy(p, o, sc)) > rule))) return p;
      }
    },
    start() { return TYPES.map((t) => Array(t.n).fill(null)); },

    // a tap on a group in the column picks its type; a tap on a seat seats a
    // group of the picked type there, or takes out the group sitting there
    pointer(p, plan, ui, e, view) {
      if (e.type !== "down") return undefined;
      const L = lay(view);
      const tile = L.tiles.findIndex((b) => inside(e, b));
      ui.msg = null;
      if (tile >= 0) { ui.sel = ui.sel === tile ? null : tile; return undefined; }
      const r = 1 + Math.floor((e.y - L.y0) / L.s);
      const c = 1 + Math.floor((e.x - L.x0) / L.s);
      if (r < 1 || r > ROWS || c < 1 || c > COLS) return undefined;
      const seated = groups(plan);
      const here = seated.find((g) => g.r === r && c >= g.c && c < g.c + TYPES[g.t].d);
      const next = plan.map((slots) => slots.slice());
      if (here) { next[here.t][here.i] = null; return next; }
      if (ui.sel == null) { ui.msg = "Pick a group first."; return undefined; }
      const t = ui.sel;
      const free = plan[t].indexOf(null);
      if (free < 0) { ui.msg = `All ${TYPES[t].n} groups ${TYPES[t].id} are seated.`; return undefined; }
      const why = refusal(p, seated, t, r, c);
      if (why) { ui.msg = why; return undefined; }
      next[t][free] = [r, c];
      if (next[t].indexOf(null) < 0) ui.sel = null; // that type is all seated
      return next;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const out = [];
      const seated = groups(plan);
      const blocked = blockedSet(p);
      for (let r = 1; r <= ROWS; r++) {
        for (let c = 1; c <= COLS; c++) {
          const { x, y } = seatAt(L, r, c);
          const kept = seated.some((g) => Math.abs(g.r - r) <= B && c >= g.c - H && c <= g.c + TYPES[g.t].d - 1 + H);
          out.push({ key: `seat-${r}-${c}`, kind: "seat", x, y, s: L.s, blocked: blocked.has(`${r},${c}`) ? 1 : 0,
            kept: kept ? 1 : 0, color: "muted" });
        }
      }
      seated.forEach((g) => {
        const { x, y } = seatAt(L, g.r, g.c);
        out.push({ key: `group-${g.t}-${g.i}`, kind: "group", t: g.t, x, y, w: TYPES[g.t].d * L.s, s: L.s, color: "plan" });
      });
      L.tiles.forEach((b, t) => {
        out.push({ key: `type-${t}`, kind: "type", t, ...b, left: plan[t].filter((s) => !s).length,
          sel: ui.sel === t ? 1 : 0, color: "plan" });
      });
      if (!(view && view.locked)) {
        out.push({ key: "hint", kind: "hint", ...L.hint, color: ui.msg ? "bad" : "muted",
          text: ui.msg || (ui.sel == null ? "Pick a group, then tap the seat for its left end." :
            `Tap the seat for group ${TYPES[ui.sel].id}'s left end.`) });
      }
      return out;
    },

    drawBoard(ctx, p, view) {
      const L = lay(view);
      ctx.font = `${view.em}px ${view.font}`; // the same size as the HTML text around the board
      ctx.fillStyle = view.css.muted;
      const alpha = ctx.globalAlpha;
      ctx.globalAlpha = alpha * 0.25;
      ctx.fillRect(L.x0, L.y0 - 1.3 * view.em, COLS * L.s, 0.9 * view.em); // the pitch, in front of row 1
      ctx.globalAlpha = alpha;
      fillCentred(ctx, "Pitch", L.x0 + (COLS * L.s) / 2, L.y0 - 0.85 * view.em);
    },

    drawPiece(ctx, piece, view) {
      const em = view.em;
      ctx.font = `${em}px ${view.font}`;
      if (piece.kind === "seat") { // free, kept free for distance, or blocked
        const g = 0.12 * piece.s;
        const alpha = ctx.globalAlpha;
        if (piece.blocked > 0.5) { // a dark seat with a cross
          ctx.fillStyle = view.css.text;
          ctx.globalAlpha = alpha * 0.55;
          ctx.fillRect(piece.x + g, piece.y + g, piece.s - 2 * g, piece.s - 2 * g);
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = view.css.bg;
          ctx.lineWidth = 0.08 * piece.s;
          ctx.beginPath();
          ctx.moveTo(piece.x + 2.2 * g, piece.y + 2.2 * g);
          ctx.lineTo(piece.x + piece.s - 2.2 * g, piece.y + piece.s - 2.2 * g);
          ctx.moveTo(piece.x + piece.s - 2.2 * g, piece.y + 2.2 * g);
          ctx.lineTo(piece.x + 2.2 * g, piece.y + piece.s - 2.2 * g);
          ctx.stroke();
        } else {
          if (piece.kept > 0) {
            ctx.fillStyle = piece.paint;
            ctx.globalAlpha = alpha * 0.22 * piece.kept;
            ctx.fillRect(piece.x + g, piece.y + g, piece.s - 2 * g, piece.s - 2 * g);
            ctx.globalAlpha = alpha;
          }
          ctx.strokeStyle = view.css.muted;
          ctx.lineWidth = 0.25;
          ctx.strokeRect(piece.x + g, piece.y + g, piece.s - 2 * g, piece.s - 2 * g);
        }
        ctx.globalAlpha = alpha;
      } else if (piece.kind === "group") { // a bar across its seats with its points
        const g = 0.12 * piece.s;
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x + g, piece.y + g, piece.w - 2 * g, piece.s - 2 * g);
        ctx.fillStyle = view.css.bg;
        fillCentred(ctx, String(TYPES[piece.t].v), piece.x + piece.w / 2, piece.y + piece.s / 2);
      } else if (piece.kind === "type") { // a group type: its letter, its seats with its points, how many are left
        const T = TYPES[piece.t];
        if (piece.sel > 0.5) {
          ctx.strokeStyle = view.css.accent;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(piece.x - 0.25 * em, piece.y - 0.15 * em, piece.w + 0.5 * em, piece.h + 0.3 * em);
        }
        const cy = piece.y + piece.h / 2;
        const done = piece.left < 0.5; // all of this type seated
        const alpha = ctx.globalAlpha;
        ctx.fillStyle = done ? view.css.muted : view.css.text;
        fillCentred(ctx, T.id, piece.x, cy, "start");
        const bx = piece.x + 1.1 * em;
        const q = 1.05 * em; // a seat in the bar
        ctx.fillStyle = done ? view.css.muted : piece.paint;
        ctx.globalAlpha = alpha * (done ? 0.5 : 1);
        ctx.fillRect(bx + 0.06 * em, cy - 0.45 * em, T.d * q - 0.12 * em, 0.9 * em); // one bar, a seat long per seat
        ctx.fillStyle = view.css.bg;
        fillCentred(ctx, String(T.v), bx + (T.d * q) / 2, cy);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = done ? view.css.muted : view.css.text;
        fillCentred(ctx, `×${Math.round(piece.left)}`, piece.x + piece.w, cy, "end");
      } else if (piece.kind === "hint") {
        ctx.fillStyle = piece.paint;
        wrapText(ctx, piece.text, piece.w).forEach((line, n) => fillCentred(ctx, line, piece.x, piece.y + (n + 0.5) * 1.3 * em, "start"));
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible(p, plan) { // placing refuses rule breaks; this guards the solver's plan
      const seated = [];
      for (const g of groups(plan)) {
        const why = refusal(p, seated, g.t, g.r, g.c);
        if (why) return why;
        seated.push(g);
      }
      return true;
    },
    score(p, plan) { return points(plan); },

    // Lecture 11's model: x_g_r_c = 1 when a group of type g has its left
    // end on seat c of row r. For every seat, at most one group may start in
    // the window that would bring it too close: the seats C̃[g,c] to its left
    // (the group's own seats plus H) in this row and the B rows in front.
    model(p) {
      const vars = [];
      TYPES.forEach((T, g) => { for (const [r, c] of FRONT) if (fits(p, g, r, c)) vars.push([g, r, c]); });
      const x = ([g, r, c]) => `x_${g}_${r}_${c}`;
      const rows = [];
      FRONT.forEach(([r, c]) => {
        const t = vars.filter(([g, rr, cc]) => rr >= r - B && rr <= r && cc >= c - TYPES[g].d + 1 - H && cc <= c);
        if (t.length > 1) rows.push(` distance_${r}_${c}: ${t.map(x).join(" + ")} <= 1`);
      });
      return [
        "Maximize",
        " points: " + vars.map((v) => `${TYPES[v[0]].v} ${x(v)}`).join(" + "),
        "Subject To",
        ...TYPES.map((T, g) => ` available_${g}: ${vars.filter((v) => v[0] === g).map(x).join(" + ")} <= ${T.n}`),
        ...Array.from({ length: ROWS }, (_, k) => ` row_${k + 1}: ${vars.filter((v) => v[1] === k + 1).map(x).join(" + ")} <= ${PER_ROW}`),
        ...rows,
        "Binary",
        " " + vars.map(x).join(" "),
        "End",
        "",
      ].join("\n");
    },
    // the seated groups, kept in the player's slots where they sit alike, so the reveal moves least
    decode(p, values, yours) {
      const plan = TYPES.map((T) => Array(T.n).fill(null));
      TYPES.forEach((T, g) => {
        const at = FRONT.filter(([r, c]) => Math.round(values[`x_${g}_${r}_${c}`] || 0) === 1);
        const mine = (yours && yours[g]) || [];
        const rest = [];
        for (const s of at) {
          const i = mine.findIndex((m, k) => m && m[0] === s[0] && m[1] === s[1] && !plan[g][k]);
          if (i >= 0) plan[g][i] = s; else rest.push(s);
        }
        for (const s of rest) plan[g][plan[g].indexOf(null)] = s;
      });
      return plan;
    },

    insight(p, yours, optimal) {
      const n = (plan) => groups(plan).length;
      const seats = (plan) => groups(plan).reduce((s, g) => s + TYPES[g.t].d, 0);
      const diff = points(yours) === points(optimal)
        ? `Your plan scores ${fmt(points(yours), ["point", "points"])}, as many as the best one, with ` +
          `${fmt(n(yours), ["group", "groups"])} on ${fmt(seats(yours), ["seat", "seats"])}.`
        : `Your plan scores ${fmt(points(yours), ["point", "points"])} with ${fmt(n(yours), ["group", "groups"])} on ` +
          `${fmt(seats(yours), ["seat", "seats"])}, while the best plan HiGHS found scores ${fmt(points(optimal))} with ` +
          `${fmt(n(optimal), ["group", "groups"])} on ${fmt(seats(optimal), ["seat", "seats"])}.`;
      const rule = sum(densest(p));
      return {
        diff,
        mechanism: `Seating the densest groups first (points per seat), each on the first free seat from the front, ` +
          `reaches ${fmt(rule)} points here, ${fmt(points(optimal) - rule)} short of the best plan. Points per seat say ` +
          "which groups pay most; the distance rules and the 2 groups per row decide which groups fit together.",
        model: "Lecture 11's model places each group by its left seat, `X[g,r,c]`. For every seat, at most one group may " +
          "start in the window of the seats `C̃[g,c]` beside it and the rows `R̃[r]` in front, which keeps the empty " +
          "seats beside, in front and diagonally, and each row holds at most 2 groups.",
      };
    },

    describe(p, plan) {
      const list = groups(plan).map((g) => `${TYPES[g.t].id} in row ${g.r} from seat ${g.c}`);
      return `${list.length ? list.join(", ") : "No groups seated"}. ${fmt(points(plan), ["point", "points"])}.`;
    },
  });
})();
