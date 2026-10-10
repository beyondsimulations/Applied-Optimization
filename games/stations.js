// stations.js — lecture 08: a city's police opens 3 departments on a map of
// 37 hexagonal areas. Every area is served by its nearest department; the
// students move the departments to drive as few minutes as possible.
(function () {
  const { fillCentred, formatScore: fmt, seconds, wrapText } = GamekitCore;
  // the city: a hexagon of radius 3 in axial coordinates (q, r), row by row
  const R = 3;
  const CELLS = [];
  for (let r = -R; r <= R; r++) for (let q = -R; q <= R; q++) if (Math.abs(q + r) <= R) CELLS.push([q, r]);
  const DIRS = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]]; // E, SE, SW, W, NW, NE on screen
  const index = new Map(CELLS.map(([q, r], j) => [`${q},${r}`, j]));
  const steps = (a, b) => {
    const [q1, r1] = CELLS[a], [q2, r2] = CELLS[b];
    return (Math.abs(q1 - q2) + Math.abs(r1 - r2) + Math.abs(q1 + r1 - q2 - r2)) / 2;
  };
  const minutes = (a, b) => 2 + 3 * steps(a, b); // 2 min inside an area, 3 min per area crossed
  const inside = (e, b) => e.x >= b.x && e.x <= b.x + b.w && e.y >= b.y && e.y <= b.y + b.h;

  // each area's department: the nearest one, the lower number on a tie
  // (checked: on this map every placement then keeps each district in one piece)
  const home = (plan, j) => plan.reduce((best, s, k) => (minutes(s, j) < minutes(plan[best], j) ? k : best), 0);
  const total = (p, plan) => p.w.reduce((t, w, j) => t + w * minutes(plan[home(plan, j)], j), 0);
  const busiest = (p, n) => p.w.map((w, j) => j).sort((a, b) => p.w[b] - p.w[a] || a - b).slice(0, n);
  function bestTotal(p) { // all ways to place the departments
    let best = Infinity;
    const pick = (from, plan) => {
      if (plan.length === p.n) { best = Math.min(best, total(p, plan)); return; }
      for (let j = from; j < CELLS.length; j++) pick(j + 1, [...plan, j]);
    };
    pick(0, []);
    return best;
  }

  // Layout in board units, pointy-top hexagons of radius s (centre to corner).
  // Wide (slides, pages): the map on the left, the districts on the right with
  // the hint below them. Compact (phones): the map on top, one row per
  // district under it; the board's height follows the text size.
  function lay(view) {
    const em = (view && view.em) || 3;
    if (view && view.compact) {
      const s = 99 / (7 * Math.sqrt(3));
      const top = 0.5;
      const y = top + 11 * s + 1.2 * em;
      const rows = [0, 1, 2].map((k) => ({ x: 0, y: y + k * 2.4 * em, w: 100, h: 2.1 * em }));
      const hint = { x: 0, y: y + 7.3 * em, w: 100 };
      return { s, cx: 50, cy: top + 5.5 * s, rows, hint, h: hint.y + 2.6 * em + 0.5 };
    }
    const w = (view && view.w) || 100;
    const h = (view && view.h) || 70;
    const pw = 10.5 * em; // the districts' column
    const s = Math.min((h - 1) / 11, (w - pw - 2 * em) / (7 * Math.sqrt(3)));
    const rows = [0, 1, 2].map((k) => ({ x: w - pw, y: 0.5 + k * 3.3 * em, w: pw, h: 2.9 * em }));
    return { s, cx: 3.5 * Math.sqrt(3) * s, cy: h / 2, rows, hint: { x: w - pw, y: 0.5 + 9.9 * em, w: pw } };
  }
  const at = (L, j) => {
    const [q, r] = CELLS[j];
    return [L.cx + Math.sqrt(3) * L.s * (q + r / 2), L.cy + 1.5 * L.s * r];
  };
  // corner k of a hexagon: k = 0 is the upper right, then clockwise
  const corner = (x, y, s, k) => [x + s * Math.cos((Math.PI / 3) * k - Math.PI / 6), y + s * Math.sin((Math.PI / 3) * k - Math.PI / 6)];

  Gamekit.game("stations", {
    title: "Place the Police Stations",
    task: "Each area shows its incidents per week and is served by its nearest police department: 2 min inside an " +
      "area, 3 min for each area crossed. Drag the 3 departments to drive as few minutes as possible.",
    goal: "min",
    unit: "min",
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: (em) => lay({ compact: true, em }).h },
    // incidents per week, row by row from the north: the old town in the
    // centre, the stadium quarter in the east, a suburb in the south-west
    class: {
      n: 3,
      w: [0, 0, 0, 0,
        0, 1, 1, 1, 0,
        0, 1, 7, 7, 3, 6,
        0, 1, 6, 9, 5, 3, 4,
        2, 1, 3, 4, 1, 0,
        3, 2, 1, 1, 0,
        2, 3, 0, 0],
    },
    check: { optimum: 366 },

    // Random cities: an old town around the centre, a second hot spot and a
    // busy suburb on the rim, quiet areas elsewhere. Resampled until the three
    // busiest areas are clear and placing the departments there drives at
    // least 5 % longer than the best placement, so the mechanism text holds
    // for every puzzle and the gap shows.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      const near = (j) => DIRS.map(([dq, dr]) => index.get(`${CELLS[j][0] + dq},${CELLS[j][1] + dr}`)).filter((n) => n != null);
      const rim = CELLS.map((_, j) => j).filter((j) => steps(j, 18) >= 2);
      for (;;) {
        const w = CELLS.map((_, j) => (steps(j, 18) === 3 ? int(0, 1) : int(0, 2)));
        const town = near(18).concat(18);
        for (const j of town) w[j] = Math.max(w[j], int(3, 9));
        const spot = rim[int(0, rim.length - 1)];
        w[spot] = Math.max(w[spot], int(4, 7));
        for (const j of near(spot)) w[j] = Math.max(w[j], int(1, 4));
        const suburb = rim[int(0, rim.length - 1)];
        for (const j of near(suburb).concat(suburb)) w[j] = Math.max(w[j], int(1, 3));
        const p = { n: 3, w };
        const top = busiest(p, p.n + 1);
        if (w[top[p.n - 1]] === w[top[p.n]]) continue; // the rule of thumb must be clear
        if (total(p, busiest(p, p.n)) >= 1.05 * bestTotal(p)) return p;
      }
    },
    start(p) { return busiest(p, p.n); }, // the rule of thumb: the busiest areas

    // A department can be dragged to another area; the districts follow while
    // it moves, and letting go off the map leaves it where it was. A tap picks
    // a department (on the map or in its block), and a tap on an area moves the
    // picked one there.
    pointer(p, plan, ui, e, view) {
      const L = lay(view);
      const areaAt = (x, y) => {
        let hit = -1;
        let d = L.s;
        CELLS.forEach((_, j) => {
          const [ax, ay] = at(L, j);
          const dj = Math.hypot(x - ax, y - ay);
          if (dj < d) { hit = j; d = dj; }
        });
        return hit;
      };
      if (e.type === "down") {
        const block = L.rows.findIndex((b) => inside(e, b));
        const hit = areaAt(e.x, e.y);
        const k = block >= 0 ? block : plan.indexOf(hit);
        ui.drag = { k: k >= 0 ? k : null, block: block >= 0 ? block : null, hit };
        return undefined;
      }
      const d = ui.drag;
      if (!d || e.type === "cancel") { ui.drag = null; return undefined; }
      d.moved = e.moved; // Gamekit: the press has travelled far enough to be a drag
      if (e.type === "move") {
        if (d.k != null && d.moved) d.to = areaAt(e.x, e.y);
        return undefined;
      }
      ui.drag = null; // released
      if (d.moved) {
        const to = areaAt(e.x, e.y);
        if (d.k == null || to < 0 || plan.includes(to)) return undefined; // off the map or onto another department
        const next = plan.slice();
        next[d.k] = to;
        ui.sel = null;
        return next;
      }
      if (d.block != null) { ui.sel = ui.sel === d.block ? null : d.block; return undefined; } // a tap
      if (d.hit < 0) { ui.sel = null; return undefined; }
      const k = plan.indexOf(d.hit);
      if (k >= 0) { ui.sel = ui.sel === k ? null : k; return undefined; }
      if (ui.sel == null) return undefined;
      const next = plan.slice();
      next[ui.sel] = d.hit;
      ui.sel = null;
      return next;
    },

    pieces(p, real, ui, view) {
      const L = lay(view);
      const d = ui.drag && ui.drag.moved && ui.drag.k != null ? ui.drag : null; // a department being dragged
      const plan = d && d.to >= 0 && !real.includes(d.to) ? real.map((j, k) => (k === d.k ? d.to : j)) : real;
      const out = [];
      CELLS.forEach((_, j) => {
        const [x, y] = at(L, j);
        out.push({ key: `area-${j}`, kind: "area", x, y, s: L.s, w: p.w[j], st: plan.includes(j) ? 1 : 0, color: "muted" });
      });
      // district borders: the edges between neighbours served by different departments
      CELLS.forEach(([q, r], j) => {
        DIRS.forEach(([dq, dr], k) => {
          const n = index.get(`${q + dq},${r + dr}`);
          if (n == null || n < j || home(plan, n) === home(plan, j)) return;
          const [x, y] = at(L, j);
          const [x1, y1] = corner(x, y, L.s, k);
          const [x2, y2] = corner(x, y, L.s, k + 1);
          out.push({ key: `edge-${j}-${n}`, kind: "edge", x1, y1, x2, y2, color: "plan" });
        });
      });
      plan.forEach((j, k) => {
        const [x, y] = at(L, j);
        out.push({ key: `station-${k}`, kind: "station", n: k + 1, x, y, s: L.s, sel: ui.sel === k ? 1 : 0, color: "plan" });
      });
      L.rows.forEach((b, k) => {
        const mine = CELLS.map((_, j) => j).filter((j) => home(plan, j) === k);
        out.push({ key: `district-${k}`, kind: "district", n: k + 1, ...b, sel: ui.sel === k ? 1 : 0, color: "plan",
          incidents: mine.reduce((t, j) => t + p.w[j], 0),
          min: mine.reduce((t, j) => t + p.w[j] * minutes(plan[k], j), 0) });
      });
      if (!(view && view.locked)) {
        const stuck = d && plan === real; // over another department or off the map: letting go changes nothing
        out.push({ key: "hint", kind: "hint", ...L.hint, color: stuck ? "bad" : ui.sel == null && !d ? "muted" : "accent",
          text: stuck ? "Drop it on a free area." : d ? `Let go to move department ${d.k + 1} there.` :
            ui.sel == null ? "Drag a department, or tap it and then an area." : `Tap an area to move department ${ui.sel + 1} there.` });
      }
      return out;
    },

    drawBoard() {},

    drawPiece(ctx, piece, view) {
      const em = view.em;
      ctx.font = `${em}px ${view.font}`; // the same size as the HTML text around the board
      if (piece.kind === "area") { // shaded by its incidents, with their number
        hexagon(ctx, piece.x, piece.y, piece.s);
        const alpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha * (0.04 + 0.06 * piece.w);
        ctx.fillStyle = piece.paint;
        ctx.fill();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = view.css.bg;
        ctx.lineWidth = 0.4;
        ctx.stroke();
        if (piece.w > 0) {
          ctx.fillStyle = view.css.text;
          fillCentred(ctx, String(Math.round(piece.w)), piece.x + piece.st * 0.62 * em, piece.y); // beside a department
        }
      } else if (piece.kind === "edge") {
        ctx.strokeStyle = piece.paint;
        ctx.lineWidth = 0.8;
        ctx.lineCap = "square"; // closes the corners where two edges meet
        ctx.beginPath();
        ctx.moveTo(piece.x1, piece.y1);
        ctx.lineTo(piece.x2, piece.y2);
        ctx.stroke();
        ctx.lineCap = "butt";
      } else if (piece.kind === "station") {
        if (piece.sel > 0.5) { // the picked department
          hexagon(ctx, piece.x, piece.y, piece.s - 0.5);
          ctx.strokeStyle = view.css.accent;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
        station(ctx, piece.x - 0.45 * em, piece.y, em, piece.n, piece.paint, view.css.bg); // its count to the right
      } else if (piece.kind === "district") { // a department: its icon, incidents and minutes
        if (piece.sel > 0.5) {
          ctx.strokeStyle = view.css.accent;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(piece.x + 0.25, piece.y + 0.25, piece.w - 0.5, piece.h - 0.5);
        }
        station(ctx, piece.x + 1.3 * em, piece.y + piece.h / 2, em, piece.n, piece.paint, view.css.bg);
        const right = piece.x + piece.w - 0.6 * em;
        const lines = [`${fmt(piece.min)} min`, fmt(piece.incidents, ["incident", "incidents"])];
        if (view.compact) { // one line: incidents, then the minutes at the right edge
          ctx.fillStyle = view.css.muted;
          fillCentred(ctx, lines[1], piece.x + 3 * em, piece.y + piece.h / 2, "start");
          ctx.fillStyle = view.css.text;
          fillCentred(ctx, lines[0], right, piece.y + piece.h / 2, "end");
        } else {
          ctx.fillStyle = view.css.text;
          fillCentred(ctx, lines[0], right, piece.y + piece.h / 2 - 0.65 * em, "end");
          ctx.fillStyle = view.css.muted;
          fillCentred(ctx, lines[1], right, piece.y + piece.h / 2 + 0.65 * em, "end");
        }
      } else if (piece.kind === "hint") {
        ctx.fillStyle = piece.paint;
        wrapText(ctx, piece.text, piece.w).forEach((line, n) => fillCentred(ctx, line, piece.x, piece.y + (n + 0.5) * 1.3 * em, "start"));
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible(p, plan) { // moves keep three departments in three areas; this guards the solver's plan
      if (plan.length !== p.n || !plan.every((j) => Number.isInteger(j) && j >= 0 && j < CELLS.length)) {
        return `Open exactly ${p.n} departments`;
      }
      return new Set(plan).size === plan.length || "Two departments share an area";
    },
    score(p, plan) { return total(p, plan); },

    // Lecture 8's p-median: x_i_j = 1 when department i serves area j, and
    // x_i_i = 1 when a department opens in area i (the self-assignment trick).
    model(p) {
      const J = CELLS.map((_, j) => j);
      const x = (i, j) => `x_${i}_${j}`;
      return [
        "Minimize",
        " minutes: " + J.flatMap((i) => J.filter((j) => p.w[j] > 0).map((j) => `${p.w[j] * minutes(i, j)} ${x(i, j)}`)).join(" + "),
        "Subject To",
        ...J.map((j) => ` serve_${j}: ${J.map((i) => x(i, j)).join(" + ")} = 1`),
        ` open: ${J.map((i) => x(i, i)).join(" + ")} = ${p.n}`,
        ...J.flatMap((i) => J.filter((j) => j !== i).map((j) => ` active_${i}_${j}: ${x(i, j)} - ${x(i, i)} <= 0`)),
        "Binary",
        " " + J.flatMap((i) => J.map((j) => x(i, j))).join(" "),
        "End",
        "",
      ].join("\n");
    },
    // the open departments, numbered like the player's so the reveal moves least
    decode(p, values, yours) {
      const open = CELLS.map((_, i) => i).filter((i) => Math.round(values[`x_${i}_${i}`] || 0) === 1);
      let best = open;
      let cost = Infinity;
      const permute = (rest, done) => {
        if (!rest.length) {
          const c = done.reduce((t, j, k) => t + (yours && yours[k] != null ? steps(j, yours[k]) : 0), 0);
          if (c < cost) { cost = c; best = done; }
          return;
        }
        rest.forEach((j, n) => permute(rest.filter((_, m) => m !== n), [...done, j]));
      };
      permute(open, []);
      return best;
    },
    // the generic line would count every x_i_j as a separate yes/no decision
    think(p, r) {
      let ways = 1; // areas choose departments
      for (let k = 0; k < p.n; k++) ways = (ways * (CELLS.length - k)) / (k + 1);
      return `${CELLS.length} areas, ${p.n} departments → ${fmt(ways)} ways to place them · HiGHS: ${seconds(r.ms)}`;
    },

    insight(p, yours, optimal) {
      const t = (plan, j) => minutes(plan[home(plan, j)], j);
      const same = total(p, yours) === total(p, optimal);
      let diff = same
        ? `Your departments drive ${fmt(total(p, yours))} min per week, as few as the best placement.`
        : `Your departments drive ${fmt(total(p, yours))} min per week, while the best placement HiGHS found ` +
          `drives ${fmt(total(p, optimal))} min.`;
      const gains = CELLS.map((_, j) => ({ j, d: p.w[j] * (t(yours, j) - t(optimal, j)) })).sort((a, b) => b.d - a.d);
      if (!same && gains[0].d > 0) {
        const j = gains[0].j;
        diff += ` The biggest gain: an area with ${fmt(p.w[j], ["incident", "incidents"])} is ${t(yours, j)} min from your nearest ` +
          `department and ${t(optimal, j)} min from the best placement's.`;
      }
      const busy = total(p, busiest(p, p.n));
      return {
        diff,
        mechanism: `Putting the departments in the ${p.n} busiest areas drives ${fmt(busy)} min here, ` +
          `${fmt(busy - total(p, optimal))} min more than the best placement. A department serves its whole ` +
          "district, so what counts is incidents times driving time over all its areas, not the busiest area alone.",
        model: "Lecture 8's p-median opens exactly `p` departments, `Σ X[i,i] = p`, sends every area to one open " +
          "department, `X[i,j] ≤ X[i,i]`, and minimizes the sum of `w[j]·t[i,j]·X[i,j]`. Without capacities each " +
          "area goes to its nearest open department, just as here.",
      };
    },

    describe(p, plan) {
      const parts = plan.map((j, k) => {
        const mine = CELLS.map((_, a) => a).filter((a) => home(plan, a) === k);
        return `Department ${k + 1} serves ${fmt(mine.length, ["area", "areas"])} with ` +
          `${fmt(mine.reduce((s, a) => s + p.w[a], 0), ["incident", "incidents"])}`;
      });
      return `${parts.join(". ")}. ${fmt(total(p, plan))} min of driving per week.`;
    },
  });

  function hexagon(ctx, x, y, s) {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const [a, b] = corner(x, y, s, k);
      if (k) ctx.lineTo(a, b); else ctx.moveTo(a, b);
    }
    ctx.closePath();
  }

  // A police badge with the department's number, 1.3 em wide and 1.5 em tall,
  // centred on (x, y): a shield.
  function station(ctx, x, y, em, n, paint, bg) {
    ctx.beginPath();
    ctx.moveTo(x - 0.65 * em, y - 0.75 * em);
    ctx.lineTo(x + 0.65 * em, y - 0.75 * em);
    ctx.lineTo(x + 0.65 * em, y + 0.22 * em);
    ctx.lineTo(x, y + 0.75 * em);
    ctx.lineTo(x - 0.65 * em, y + 0.22 * em);
    ctx.closePath();
    ctx.strokeStyle = bg; // a halo where borders pass
    ctx.lineWidth = 0.3 * em;
    ctx.lineJoin = "miter";
    ctx.stroke();
    ctx.fillStyle = paint;
    ctx.fill();
    ctx.fillStyle = bg;
    fillCentred(ctx, String(n), x, y - 0.1 * em);
  }
})();
