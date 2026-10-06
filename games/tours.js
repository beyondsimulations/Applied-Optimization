// tours.js — lecture 07: the central library in Rendsburg delivers book crates
// to 8 local libraries with two vans. Students build each van's tour by
// tapping the libraries in the order it visits them; the shortest tours win.
(function () {
  const { fillCentred, formatScore: fmt, seconds } = GamekitCore;
  // Node 0 is the central library. `side` places a town's name next to it
  // so that no two names collide: a(bove), b(elow), l(eft) or r(ight).
  const TOWNS = [
    { name: "Rendsburg", lat: 54.30, lon: 9.66, side: "b" },
    { name: "Kiel", lat: 54.32, lon: 10.13, side: "a" },
    { name: "Neumünster", lat: 54.07, lon: 9.98, side: "b" },
    { name: "Eckernförde", lat: 54.47, lon: 9.84, side: "r" },
    { name: "Schleswig", lat: 54.52, lon: 9.56, side: "a" },
    { name: "Husum", lat: 54.48, lon: 9.05, side: "r" },
    { name: "Heide", lat: 54.19, lon: 9.10, side: "r" },
    { name: "Itzehoe", lat: 53.92, lon: 9.52, side: "r" },
    { name: "Plön", lat: 54.16, lon: 10.42, side: "l" },
  ];
  const N = TOWNS.length - 1; // local libraries
  const VANS = 2;
  // map position in km from the westernmost and northernmost town
  const west = Math.min(...TOWNS.map((t) => t.lon));
  const north = Math.max(...TOWNS.map((t) => t.lat));
  const XY = TOWNS.map((t) => [(t.lon - west) * 111.32 * Math.cos((54.2 * Math.PI) / 180), (north - t.lat) * 110.57]);
  const W_KM = Math.max(...XY.map((q) => q[0]));
  const H_KM = Math.max(...XY.map((q) => q[1]));
  // road km: the straight line plus a quarter for the roads' detours
  const KM = XY.map((a) => XY.map((b) => Math.round(1.25 * Math.hypot(a[0] - b[0], a[1] - b[1]))));

  const tourKm = (t) => (t.length ? KM[0][t[0]] + t.slice(1).reduce((s, j, k) => s + KM[t[k]][j], 0) + KM[t[t.length - 1]][0] : 0);
  const load = (p, t) => t.reduce((s, j) => s + p.crates[j - 1], 0);
  const total = (plan) => plan.reduce((s, t) => s + tourKm(t), 0);
  const list = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  const names = (t) => list(t.map((j) => TOWNS[j].name));

  // The shortest tour through each set of libraries (Held–Karp over 8 nodes),
  // then the best split into two vans: the puzzle generator's yardstick.
  function bestKm(p) {
    const FULL = 1 << N;
    const dp = Array.from({ length: FULL }, () => new Array(N).fill(Infinity));
    for (let j = 0; j < N; j++) dp[1 << j][j] = KM[0][j + 1];
    for (let m = 1; m < FULL; m++) {
      for (let j = 0; j < N; j++) {
        if (!(m >> j & 1) || dp[m][j] === Infinity) continue;
        for (let k = 0; k < N; k++) {
          if (m >> k & 1) continue;
          const v = dp[m][j] + KM[j + 1][k + 1];
          if (v < dp[m | (1 << k)][k]) dp[m | (1 << k)][k] = v;
        }
      }
    }
    const tour = (m) => Math.min(...dp[m].map((v, j) => v + KM[j + 1][0]));
    const crates = (m) => p.crates.reduce((s, q, j) => s + (m >> j & 1 ? q : 0), 0);
    let best = Infinity;
    for (let m = 1; m < FULL - 1; m++) {
      if (crates(m) <= p.cap && crates(FULL - 1 - m) <= p.cap) best = Math.min(best, tour(m) + tour(FULL - 1 - m));
    }
    return best;
  }
  // The rule of thumb: from wherever the van is, drive to the nearest library
  // that still fits; when none fits, drive back and load the next van.
  function nearest(p) {
    const left = new Set(Array.from({ length: N }, (_, j) => j + 1));
    const plan = [];
    while (left.size && plan.length < VANS) {
      const t = [];
      let at = 0;
      for (;;) {
        const fits = [...left].filter((j) => load(p, t) + p.crates[j - 1] <= p.cap);
        if (!fits.length) break;
        at = fits.reduce((a, b) => (KM[at][b] < KM[at][a] ? b : a));
        t.push(at);
        left.delete(at);
      }
      plan.push(t);
    }
    return left.size ? null : plan; // null: it needs a third van
  }

  // Layout in board units. Wide (slides, pages): the map on the left, the
  // vans on the right, one block each, with the hint below them. Compact
  // (phones): the map on top, the vans side by side under it; the board's
  // height follows the text size (compactBoard.h).
  function lay(view) {
    const em = (view && view.em) || 3;
    const pad = 0.9 * em; // half a crate
    if (view && view.compact) {
      const s = (100 - 2 * pad) / W_KM; // board units per km
      const y0 = 2.3 * em;
      const vy = y0 + H_KM * s + pad + 1.2 * em;
      const vans = [0, 1].map((k) => ({ x: k * 52, y: vy, w: 48, h: 3.4 * em }));
      const hint = { x: 0, y: vy + 3.4 * em + 0.6 * em, w: 100 };
      return { s, x0: pad, y0, vans, hint, h: hint.y + 2.6 * em + 0.5 };
    }
    const w = (view && view.w) || 100;
    const h = (view && view.h) || 70;
    const pw = 9.5 * em; // the vans' column
    const s = Math.min((w - pw - 2 * em - 2 * pad) / W_KM, (h - 2.3 * em - pad) / H_KM);
    const y0 = 2.3 * em + (h - 2.3 * em - pad - H_KM * s) / 2;
    const vans = [0, 1].map((k) => ({ x: w - pw, y: 0.5 + k * 4.2 * em, w: pw, h: 3.4 * em }));
    return { s, x0: pad, y0, vans, hint: { x: w - pw, y: 0.5 + 8.6 * em, w: pw } };
  }
  const at = (L, i) => [L.x0 + XY[i][0] * L.s, L.y0 + XY[i][1] * L.s];
  const inside = (e, b) => e.x >= b.x && e.x <= b.x + b.w && e.y >= b.y && e.y <= b.y + b.h;

  Gamekit.game("tours", {
    title: "Plan the Book Tours",
    task: "The central library in Rendsburg delivers book crates to 8 libraries with two vans of 13 crates each. " +
      "Tap the libraries in the order a van visits them, tap Rendsburg to switch vans, and tap a library again to " +
      "take it out. Drive as few km as possible.",
    goal: "min",
    unit: "km",
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: (em) => lay({ compact: true, em }).h },
    // crates per library, in the order of TOWNS (without Rendsburg)
    class: { cap: 13, crates: [5, 4, 2, 3, 2, 3, 4, 3] },
    check: { optimum: 414 },

    // Random puzzles keep the towns and draw new crate counts. They are
    // resampled until two vans are needed and enough, and the nearest-library
    // rule fits into two vans but drives further than the best tours, so the
    // mechanism text holds for every puzzle.
    puzzle(rng) {
      for (;;) {
        const p = { cap: 13, crates: Array.from({ length: N }, () => 2 + Math.floor(rng() * 4)) };
        const sum = p.crates.reduce((a, b) => a + b, 0);
        if (sum <= p.cap || sum > VANS * p.cap) continue;
        const nn = nearest(p);
        const best = bestKm(p);
        if (nn && best < Infinity && total(nn) > best) return p;
      }
    },
    start() { return [[], []]; },

    // a tap on a library adds it to the open van's tour, or takes it out of
    // its tour; a tap on Rendsburg or on a van's block switches the open van
    pointer(p, plan, ui, e, view) {
      if (e.type !== "down") return undefined;
      const L = lay(view);
      const em = (view && view.em) || 3;
      const k = ui.van || 0;
      ui.msg = null;
      const hitVan = L.vans.findIndex((b) => inside(e, b));
      if (hitVan >= 0) { ui.van = hitVan; return undefined; }
      const r = Math.max(1.2 * em, 3.5); // a finger's reach
      let hit = -1;
      let d = Infinity;
      TOWNS.forEach((_, i) => {
        const [x, y] = at(L, i);
        const di = Math.hypot(e.x - x, e.y - y);
        if (di <= r && di < d) { hit = i; d = di; }
      });
      if (hit === 0) { ui.van = (k + 1) % VANS; return undefined; }
      if (hit < 0) return undefined;
      const owner = plan.findIndex((t) => t.includes(hit));
      const next = plan.map((t) => t.slice());
      if (owner >= 0) { // take it out; its neighbours now drive straight to each other
        next[owner] = next[owner].filter((j) => j !== hit);
        return next;
      }
      const room = p.cap - load(p, plan[k]);
      if (p.crates[hit - 1] > room) {
        ui.msg = `${TOWNS[hit].name} needs ${p.crates[hit - 1]} crates, van ${k + 1} has room for ${room}.`;
        return undefined;
      }
      next[k].push(hit);
      return next;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const out = [];
      // the legs, keyed by their two towns (a van drives a leg in either direction)
      plan.forEach((t, k) => {
        if (!t.length) return;
        const stops = [0, ...t, 0];
        const seen = new Set();
        for (let n = 0; n + 1 < stops.length; n++) {
          const [a, b] = [stops[n], stops[n + 1]].sort((u, v) => u - v);
          if (seen.has(`${a}-${b}`)) continue; // a one-stop tour drives its leg twice
          seen.add(`${a}-${b}`);
          const [x1, y1] = at(L, a);
          const [x2, y2] = at(L, b);
          out.push({ key: `leg-${a}-${b}`, kind: "leg", x1, y1, x2, y2, dash: k, color: "plan" });
        }
      });
      TOWNS.forEach((town, i) => {
        const [x, y] = at(L, i);
        if (i === 0) {
          out.push({ key: "town-0", kind: "depot", x, y, name: town.name, side: town.side, color: "text" });
          return;
        }
        const served = plan.some((t) => t.includes(i));
        out.push({ key: `town-${i}`, kind: "library", x, y, name: town.name, side: town.side, crates: p.crates[i - 1],
          color: served ? "plan" : "muted" });
      });
      plan.forEach((t, k) => { // each van on its first leg
        if (!t.length) return;
        const [x1, y1] = at(L, 0);
        const [x2, y2] = at(L, t[0]);
        out.push({ key: `van-${k}`, kind: "van", n: k + 1, x: x1 + 0.5 * (x2 - x1), y: y1 + 0.5 * (y2 - y1), color: "plan" });
      });
      const open = view && view.locked ? -1 : ui.van || 0;
      L.vans.forEach((b, k) => {
        out.push({ key: `block-${k}`, kind: "block", n: k + 1, ...b, km: tourKm(plan[k]), load: load(p, plan[k]),
          cap: p.cap, open: k === open ? 1 : 0, dash: k, color: "plan" });
      });
      if (!(view && view.locked)) {
        out.push({ key: "hint", kind: "hint", ...L.hint, color: ui.msg ? "bad" : "muted",
          text: ui.msg || `Van ${open + 1}: tap its next library. Tap Rendsburg for van ${((open + 1) % VANS) + 1}.` });
      }
      return out;
    },

    drawBoard() {},

    drawPiece(ctx, piece, view) {
      const em = view.em;
      ctx.font = `${em}px ${view.font}`; // the same size as the HTML text around the board
      if (piece.kind === "leg") { // van 1 solid, van 2 dashed
        ctx.strokeStyle = piece.paint;
        ctx.lineWidth = 0.5;
        if (piece.dash > 0.5) ctx.setLineDash([1.1 * em, 0.6 * em]);
        ctx.beginPath();
        ctx.moveTo(piece.x1, piece.y1);
        ctx.lineTo(piece.x2, piece.y2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (piece.kind === "depot") {
        library(ctx, piece.x, piece.y, 2.2 * em, piece.paint, view.css.bg);
        label(ctx, piece, 1.3 * em, em, view);
      } else if (piece.kind === "library") { // a crate with the library's count
        const s = 1.8 * em;
        ctx.strokeStyle = view.css.bg; // a halo where legs meet it
        ctx.lineWidth = 0.3 * em;
        ctx.strokeRect(piece.x - s / 2, piece.y - s / 2, s, s);
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x - s / 2, piece.y - s / 2, s, s);
        ctx.fillStyle = view.css.bg;
        ctx.fillRect(piece.x - s / 2, piece.y - s / 2 + 0.22 * s, s, 0.06 * s); // the lid
        fillCentred(ctx, String(piece.crates), piece.x, piece.y + 0.1 * s);
        label(ctx, piece, 0.9 * em, em, view);
      } else if (piece.kind === "van") {
        van(ctx, piece.x, piece.y, em, piece.n, piece.paint, view.css.bg);
      } else if (piece.kind === "block") { // a van: its line, km and a crate per place
        if (piece.open > 0.5) {
          ctx.strokeStyle = view.css.accent;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(piece.x + 0.25, piece.y + 0.25, piece.w - 0.5, piece.h - 0.5);
        }
        const x = piece.x + 0.6 * em;
        const y1 = piece.y + 1.1 * em;
        ctx.strokeStyle = piece.paint;
        ctx.lineWidth = 0.5;
        if (piece.dash > 0.5) ctx.setLineDash([1.1 * em, 0.6 * em]);
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x + 4.4 * em, y1); // a dash shows on either side of the van
        ctx.stroke();
        ctx.setLineDash([]);
        van(ctx, x + 2.2 * em, y1, em, piece.n, piece.paint, view.css.bg);
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, `${fmt(piece.km)} km`, piece.x + piece.w - 0.6 * em, y1, "end");
        const used = Math.round(piece.load);
        const count = `${used}/${piece.cap}`;
        const cw = (piece.w - 1.2 * em - ctx.measureText(`${piece.cap}/${piece.cap}`).width - 0.5 * em) / piece.cap;
        const y2 = piece.y + 2.5 * em;
        for (let c = 0; c < piece.cap; c++) {
          ctx.fillStyle = c < used ? piece.paint : view.css.muted;
          ctx.globalAlpha = c < used ? 1 : 0.35;
          ctx.fillRect(x + c * cw, y2 - 0.4 * em, cw - Math.min(0.4, cw * 0.2), 0.8 * em);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, count, piece.x + piece.w - 0.6 * em, y2, "end");
      } else if (piece.kind === "hint") {
        ctx.fillStyle = piece.paint;
        wrap(ctx, piece.text, piece.w).forEach((line, n) => fillCentred(ctx, line, piece.x, piece.y + (n + 0.5) * 1.3 * em, "start"));
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible(p, plan) {
      for (let k = 0; k < plan.length; k++) {
        const over = load(p, plan[k]) - p.cap;
        if (over > 0) return `Van ${k + 1} carries ${over} crates more than fit`;
      }
      const waiting = TOWNS.map((_, i) => i).filter((i) => i > 0 && !plan.some((t) => t.includes(i)));
      if (waiting.length > 2) return `${waiting.length} libraries still wait for books`; // names fit for a few only
      if (waiting.length) return `${names(waiting)} still wait${waiting.length === 1 ? "s" : ""} for books`;
      return true;
    },
    score(p, plan) { return total(plan); },

    // Lecture 7's CVRP: x_i_j = 1 when a van drives from i to j; u_i, the
    // crates delivered up to library i (MTZ, Kara et al.), caps every van and
    // rules out loops that never visit Rendsburg.
    model(p) {
      const V = TOWNS.map((_, i) => i);
      const L = V.slice(1);
      const arcs = V.flatMap((i) => V.filter((j) => j !== i).map((j) => [i, j]));
      const x = (i, j) => `x_${i}_${j}`;
      return [
        "Minimize",
        " km: " + arcs.map(([i, j]) => `${KM[i][j]} ${x(i, j)}`).join(" + "),
        "Subject To",
        ...L.map((j) => ` in_${j}: ${V.filter((i) => i !== j).map((i) => x(i, j)).join(" + ")} = 1`),
        ...L.map((i) => ` out_${i}: ${V.filter((j) => j !== i).map((j) => x(i, j)).join(" + ")} = 1`),
        ` leave: ${L.map((j) => x(0, j)).join(" + ")} = ${VANS}`,
        ` return: ${L.map((i) => x(i, 0)).join(" + ")} = ${VANS}`,
        ...L.flatMap((i) => L.filter((j) => j !== i).map((j) =>
          ` mtz_${i}_${j}: u_${i} - u_${j} + ${p.cap} ${x(i, j)} <= ${p.cap - p.crates[j - 1]}`)),
        "Bounds",
        ...L.map((i) => ` ${p.crates[i - 1]} <= u_${i} <= ${p.cap}`),
        "Binary",
        " " + arcs.map(([i, j]) => x(i, j)).join(" "),
        "End",
        "",
      ].join("\n");
    },
    // follow each van from Rendsburg; then number and turn the tours to match
    // the player's, so the reveal moves as little as possible
    decode(p, values, yours) {
      const next = (i) => TOWNS.findIndex((_, j) => j !== i && Math.round(values[`x_${i}_${j}`] || 0) === 1);
      const tours = [];
      for (let j = 1; j <= N; j++) {
        if (Math.round(values[`x_0_${j}`] || 0) !== 1) continue;
        const t = [];
        for (let i = j; i > 0 && t.length <= N; i = next(i)) t.push(i);
        tours.push(t);
      }
      const same = (a, b) => a.filter((j) => b.includes(j)).length;
      if (yours && same(tours[0], yours[1]) + same(tours[1], yours[0]) > same(tours[0], yours[0]) + same(tours[1], yours[1])) {
        tours.reverse();
      }
      return tours.map((t, k) => {
        const y = (yours && yours[k]) || [];
        const r = t.slice().reverse();
        const hits = (u) => u.filter((j, n) => y[n] === j).length;
        return hits(r) > hits(t) ? r : t;
      });
    },
    // the u_i would make the generic line say "infinitely many plans"
    think(p, r) {
      let ways = N - 1; // where the first van's tour ends
      for (let k = 2; k <= N; k++) ways *= k; // the libraries' order
      return `${N} libraries, ${VANS} vans → ${fmt(ways)} ways to order and split them · HiGHS: ${seconds(r.ms)}`;
    },

    insight(p, yours, optimal) {
      const say = (plan) => plan.map((t, k) => (t.length
        ? `van ${k + 1} drives ${fmt(tourKm(t))} km to ${names(t)}` : `van ${k + 1} stays in Rendsburg`)).join("; ");
      const diff = total(yours) === total(optimal)
        ? `Your tours drive ${fmt(total(yours))} km, as few as the best ones: ${say(yours)}.`
        : `Your tours drive ${fmt(total(yours))} km: ${say(yours)}. The best tours HiGHS found drive ` +
          `${fmt(total(optimal))} km: ${say(optimal)}.`;
      const nn = total(nearest(p));
      return {
        diff,
        mechanism: `Driving to the nearest library that still fits takes ${fmt(nn)} km here, ${fmt(nn - total(optimal))} ` +
          "km more than the best tours. It picks each stop by the next drive alone, so it never weighs the drive back " +
          "to Rendsburg or which libraries should share a van.",
        model: "Lecture 7's model sets `X[i,j] = 1` for every leg a van drives and minimizes the sum of `c[i,j]` over " +
          `them. The crates delivered so far, \`U[i]\`, cap each van at ${p.cap} crates and rule out loops that ` +
          "never visit the central library.",
      };
    },

    describe(p, plan) {
      return plan.map((t, k) => `Van ${k + 1}: ${t.length ? names(t) : "no stops"}, ${fmt(tourKm(t))} km, ` +
        `${load(p, t)} of ${p.cap} crates.`).join(" ") + ` ${fmt(total(plan))} km in total.`;
    },
  });

  // A town's name on its side, with a halo where legs pass behind it.
  function label(ctx, piece, gap, em, view) {
    const [dx, dy, align] = { a: [0, -gap - 0.55 * em, "center"], b: [0, gap + 0.6 * em, "center"],
      l: [-gap - 0.3 * em, 0, "end"], r: [gap + 0.3 * em, 0, "start"] }[piece.side];
    ctx.strokeStyle = view.css.bg;
    ctx.lineWidth = 0.3 * em;
    ctx.lineJoin = "round";
    ctx.textAlign = align;
    ctx.textBaseline = "alphabetic";
    const y = piece.y + dy + ctx.measureText("0").actualBoundingBoxAscent / 2;
    ctx.strokeText(piece.name, piece.x + dx, y);
    ctx.fillStyle = view.css.text;
    ctx.fillText(piece.name, piece.x + dx, y);
  }

  // The central library, about `s` wide and centred on (x, y): a pediment,
  // four columns and steps.
  function library(ctx, x, y, s, paint, bg) {
    const u = s / 10;
    ctx.fillStyle = bg; // a halo where legs meet it
    ctx.fillRect(x - 6 * u, y - 5.5 * u, 12 * u, 11 * u);
    ctx.fillStyle = paint;
    ctx.beginPath();
    ctx.moveTo(x - 5 * u, y - 2 * u);
    ctx.lineTo(x, y - 5 * u);
    ctx.lineTo(x + 5 * u, y - 2 * u);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - 5 * u, y - 1.5 * u, 10 * u, 0.9 * u);
    for (let c = 0; c < 4; c++) ctx.fillRect(x + (-4.2 + c * 2.6) * u, y - 0.2 * u, 1.2 * u, 3.4 * u);
    ctx.fillRect(x - 5 * u, y + 3.6 * u, 10 * u, 1.2 * u);
  }

  // A van with its number on the cargo box, centred on (x, y); a halo in the
  // background colour keeps it apart from the lines.
  function van(ctx, x, y, em, n, paint, bg) {
    const bw = 1.5 * em, bh = 1.15 * em, cw = 0.75 * em, ch = 0.85 * em, wheel = 0.22 * em;
    const x0 = x - (bw + cw) / 2;
    const y0 = y - (bh + wheel) / 2;
    const body = () => {
      ctx.beginPath();
      ctx.rect(x0, y0, bw, bh);
      ctx.moveTo(x0 + bw, y0 + bh - ch);
      ctx.lineTo(x0 + bw + 0.45 * cw, y0 + bh - ch);
      ctx.lineTo(x0 + bw + cw, y0 + bh - ch / 2);
      ctx.lineTo(x0 + bw + cw, y0 + bh);
      ctx.lineTo(x0 + bw, y0 + bh);
      ctx.closePath();
    };
    body();
    ctx.strokeStyle = bg;
    ctx.lineWidth = 0.3 * em;
    ctx.lineJoin = "miter";
    ctx.stroke();
    ctx.fillStyle = paint;
    ctx.fill();
    for (const wx of [x0 + 0.4 * em, x0 + bw + 0.5 * cw]) {
      ctx.beginPath();
      ctx.arc(wx, y0 + bh + 0.05 * em, wheel, 0, 2 * Math.PI);
      ctx.fillStyle = paint;
      ctx.fill();
      ctx.lineWidth = 0.12 * em;
      ctx.stroke();
    }
    ctx.fillStyle = bg;
    fillCentred(ctx, String(n), x0 + bw / 2, y0 + bh / 2);
  }

  // Words into lines no wider than `w`.
  function wrap(ctx, text, w) {
    const lines = [];
    let line = "";
    for (const word of text.split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > w) { lines.push(line); line = word; } else line = next;
    }
    return line ? [...lines, line] : lines;
  }
})();
