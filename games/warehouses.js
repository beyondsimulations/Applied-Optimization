// warehouses.js — lecture 06: an online shop stores 8 products in Hamburg and
// Berlin, 4 places each. Every past order is a pair of products; a pair whose
// products sit in different warehouses ships as two parcels. Students swap
// products between the warehouses to split as few parcels as possible.
(function () {
  const { fillCentred, formatScore: fmt, seconds } = GamekitCore;
  const NAMES = ["tent", "camping mat", "lantern", "camera", "tripod", "phone", "charger", "headset"];
  const LABELS = ["Tent", "Mat", "Lantern", "Camera", "Tripod", "Phone", "Charger", "Headset"]; // one word under each icon
  const HOUSES = ["Hamburg", "Berlin"];

  // Layout in board units. Each warehouse is a frame with its 4 places in a
  // row, under its name with a warehouse icon; Hamburg stands above Berlin. Wide (slides, pages): the buildings fill the board's height left
  // of the past orders, which run in one column on the right (the board
  // stretches on slides, view.w). Compact (phones): the orders below, in two
  // columns; everything is spaced by the text size, and so is the board's
  // height (compactBoard.h). A place holds an icon with its name under it.
  function lay(view, n = 10) { // n: the number of past orders
    const em = (view && view.em) || 3;
    const compact = !!(view && view.compact);
    const w = compact ? 100 : (view && view.w) || 100;
    const ox = w - 8.2 * em; // the orders column: two icons, a count and the parcels
    const bw = compact ? (w - 2) / 4 : Math.min(24, (ox - 2 - 2.5 * em) / 4); // place width; 2.5 em to the orders
    const sh = compact ? 3.6 * em + 1 : (((view && view.h) || 70) - 4.5 - 3.8 * em) / 2; // place height
    const houses = [];
    let y0 = 0;
    for (let k = 0; k < 2; k++) {
      const y = y0 + 1.6 * em; // the frame's top, under the name
      houses.push({ x: 0, y, name: y0 + 0.7 * em, w: 4 * bw + 2, h: sh + 2 });
      y0 = y + sh + 2 + 0.6 * em;
    }
    const bottom = houses[1].y + houses[1].h; // Berlin's lower edge
    if (compact) {
      const y = bottom + 2.8 * em; // the first order, a row under the heading
      return { houses, bw, sh, icon: 2 * em, head: bottom + 1.3 * em, rows: { x: [0, 50], y, h: 1.5 * em, per: 5 },
        h: y + 6.75 * em + 0.5 };
    }
    const first = houses[0].name + 1.45 * em; // the orders span the warehouses
    const last = bottom - 0.65 * em;
    return { houses, bw, sh, icon: Math.min(0.6 * bw, sh - 1.4 * em - 3), head: houses[0].name,
      rows: { x: [ox], y: first, h: (last - first) / (n - 1), per: 10 } };
  }
  // where place `n` (0-based) of warehouse `k` sits
  function slot(L, k, n) {
    const H = L.houses[k];
    return { x: H.x + 1 + (n + 0.5) * L.bw, y: H.y + 1 + L.sh / 2 };
  }
  // A plan gives each product its place: 0–3 in Hamburg, 4–7 in Berlin, so a
  // swap moves only the two products.
  const home = (p, plan, i) => Math.floor(plan[i] / p.cap);
  const homes = (p, plan) => plan.map((_, i) => home(p, plan, i));
  const inHouse = (p, plan, k) => [...plan.keys()].filter((i) => home(p, plan, i) === k).sort((a, b) => plan[a] - plan[b]);
  const cut = (p, h) => p.pairs.filter(([i, j]) => h[i] !== h[j]); // the pairs split by warehouses h
  const sum = (pairs) => pairs.reduce((s, q) => s + q[2], 0);
  const splits = (p, plan) => cut(p, homes(p, plan));
  const parcels = (p, plan) => sum(splits(p, plan));
  const list = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  const pairText = ([i, j, q]) => `${NAMES[i]} with ${NAMES[j]} (${q})`;
  // warehouses that keep the camping gear and the phone things together
  const themes = [[0, 0, 0, 0, 1, 1, 1, 1], [0, 0, 0, 1, 0, 1, 1, 1]];

  Gamekit.game("warehouses", {
    title: "Store the Products Together",
    task: "An online shop stores 8 products in Hamburg and Berlin, 4 places each; an order with products from both " +
      "ships as two parcels. Drag a product onto one in the other warehouse to swap them, and split as few parcels " +
      "as possible.",
    goal: "min",
    unit: ["split parcel", "split parcels"],
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: (em) => lay({ compact: true, em }).h },
    // pairs bought together last month: [product, product, orders]
    class: {
      cap: 4,
      pairs: [[0, 1, 10], [3, 4, 9], [5, 6, 8], [0, 2, 7], [5, 7, 7], [2, 6, 6], [1, 2, 4], [6, 7, 3], [3, 5, 2], [0, 4, 1]],
    },
    check: { optimum: 12 },

    // Random months keep the products and their themes: camping, photo and
    // phone pairs are bought often, a few cross-theme pairs less. Resampled
    // until keeping the themes together is worse than the best layout, so the
    // mechanism text holds for every puzzle (some parcel always splits: the
    // pairs link all 8 products).
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      for (;;) {
        const pairs = [[0, 1, int(7, 12)], [3, 4, int(6, 12)], [5, 6, int(5, 10)], [0, 2, int(4, 9)], [5, 7, int(4, 9)],
          [2, 6, int(3, 8)], [1, 2, int(2, 6)], [6, 7, int(1, 5)], [3, 5, int(1, 4)], [0, 4, int(0, 3)]]
          .filter((q) => q[2] > 0).sort((a, b) => b[2] - a[2]);
        const p = { cap: 4, pairs };
        let best = Infinity;
        for (let m = 0; m < 256; m++) {
          const h = NAMES.map((_, i) => (m >> i) & 1);
          if (h.filter((k) => k === 0).length === 4) best = Math.min(best, sum(cut(p, h)));
        }
        if (themes.every((t) => sum(cut(p, t)) > best)) return p;
      }
    },
    start() { return NAMES.map((_, i) => i); }, // the themes kept together, the camera with the camping gear

    // A product can be dragged onto a product in the other warehouse to swap
    // the two; the orders follow while it hovers there. A first tap picks a
    // product, a second one in the other warehouse swaps them (a tap in the
    // same warehouse picks that product instead).
    pointer(p, plan, ui, e, view) {
      const L = lay(view);
      const productAt = (x, y) => plan.findIndex((place, i) => {
        const s = slot(L, home(p, plan, i), place % p.cap);
        return Math.abs(x - s.x) <= L.bw / 2 && Math.abs(y - s.y) <= L.sh / 2;
      });
      if (e.type === "down") {
        const i = productAt(e.x, e.y);
        ui.drag = { x: e.x, y: e.y, i: i >= 0 ? i : null };
        return undefined;
      }
      const d = ui.drag;
      if (!d) return undefined;
      d.moved = d.moved || Math.hypot(e.x - d.x, e.y - d.y) > 0.4 * L.bw;
      const j = productAt(e.x, e.y);
      const other = d.i != null && j >= 0 && home(p, plan, j) !== home(p, plan, d.i) ? j : null;
      if (e.type === "move") {
        if (d.i != null && d.moved) Object.assign(d, { to: other, px: e.x, py: e.y });
        return undefined;
      }
      ui.drag = null; // released
      const swap = (a, b) => {
        const next = plan.slice();
        next[a] = plan[b];
        next[b] = plan[a];
        ui.sel = null;
        return next;
      };
      if (d.moved) return other != null ? swap(d.i, other) : undefined;
      if (d.i == null) { ui.sel = null; return undefined; } // a tap
      if (ui.sel == null || ui.sel === d.i || home(p, plan, ui.sel) === home(p, plan, d.i)) {
        ui.sel = ui.sel === d.i ? null : d.i;
        return undefined;
      }
      return swap(d.i, ui.sel);
    },

    pieces(p, real, ui, view) {
      const L = lay(view, p.pairs.length);
      const out = [];
      const d = ui.drag && ui.drag.moved && ui.drag.i != null ? ui.drag : null; // a product being dragged
      // over a product in the other warehouse the two show swapped, so the orders show the result
      const plan = d && d.to != null ? real.map((place, i) => (i === d.i ? real[d.to] : i === d.to ? real[d.i] : place)) : real;
      L.houses.forEach((H, k) => out.push({ key: `house-${k}`, kind: "house", k, ...H, color: "text" }));
      plan.forEach((place, i) => {
        const s = slot(L, home(p, plan, i), place % p.cap);
        const loose = d && d.i === i && d.to == null; // carried, not over a product it could swap with
        out.push({ key: `product-${i}`, kind: "product", i, x: loose ? d.px : s.x, y: loose ? d.py : s.y, size: L.icon,
          w: L.bw, h: L.sh, sel: ui.sel === i || (d && d.i === i) ? 1 : 0, color: "plan" });
      });
      if (d) { // on the name line of the warehouse to drop into
        const H = L.houses[1 - home(p, real, d.i)];
        out.push({ key: "hint", kind: "hint", k: 1 - home(p, real, d.i), x: H.x + H.w, x0: H.x, y: H.name,
          color: "accent", text: d.to != null ? "Let go to swap" : "Drop it on a product here",
          short: d.to != null ? "Let go" : "Drop it here" });
      } else if (ui.sel != null) { // on the name line of the warehouse to tap next
        const H = L.houses[1 - home(p, plan, ui.sel)];
        out.push({ key: "hint", kind: "hint", k: 1 - home(p, plan, ui.sel), x: H.x + H.w, x0: H.x, y: H.name,
          color: "accent", text: "Now tap a product here", short: "Tap one here" });
      }
      p.pairs.forEach(([i, j, q], r) => {
        const R = L.rows;
        const c = Math.floor(r / R.per);
        const split = home(p, plan, i) !== home(p, plan, j);
        out.push({ key: `order-${r}`, kind: "order", i, j, q, x: R.x[c], y: R.y + (r % R.per) * R.h,
          split: split ? 1 : 0, color: split ? "bad" : "muted" });
      });
      return out;
    },

    drawBoard(ctx, p, view) {
      const L = lay(view);
      ctx.font = `${view.em}px ${view.font}`; // the same size as the HTML text around the board
      ctx.fillStyle = view.css.muted;
      fillCentred(ctx, "Bought together", L.rows.x[0], L.head, "start");
    },

    drawPiece(ctx, piece, view) {
      const em = view.em;
      ctx.font = `${em}px ${view.font}`;
      if (piece.kind === "house") { // a warehouse: its icon and name, and a frame around its places
        warehouse(ctx, piece.x + 0.65 * em, piece.name, 1.3 * em, piece.paint, view.css.bg);
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, HOUSES[piece.k], piece.x + 1.7 * em, piece.name, "start");
        ctx.strokeStyle = view.css.muted;
        ctx.lineWidth = 0.35;
        ctx.strokeRect(piece.x, piece.y, piece.w, piece.h);
      } else if (piece.kind === "product") { // its icon with its name under it
        const top = piece.y - piece.h / 2;
        if (piece.sel > 0.5) { // the picked product
          ctx.strokeStyle = view.css.accent;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(piece.x - piece.w / 2 + 0.5, top + 0.5, piece.w - 1, piece.h - 1);
        }
        const gy = piece.y - (piece.size + 1.4 * em) / 2; // icon and name centred together in the place
        icon(ctx, piece.i, piece.x, gy + piece.size / 2, piece.size, piece.paint, view.css.bg);
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, LABELS[piece.i], piece.x, gy + piece.size + 0.9 * em);
      } else if (piece.kind === "hint") { // shorter where it would reach the warehouse's name
        const free = piece.x - (piece.x0 + 1.7 * em + ctx.measureText(HOUSES[piece.k]).width + em);
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, ctx.measureText(piece.text).width <= free ? piece.text : piece.short, piece.x, piece.y, "end");
      } else if (piece.kind === "order") { // a pair bought together: icons, how often, and its parcels
        const s = 1.3 * em;
        const x = piece.x;
        icon(ctx, piece.i, x + 0.5 * s, piece.y, s, view.css.text, view.css.bg);
        icon(ctx, piece.j, x + 1.6 * s, piece.y, s, view.css.text, view.css.bg);
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, `×${piece.q}`, x + 2.5 * s, piece.y, "start");
        const px = x + 2.5 * s + 2.2 * em;
        const one = piece.split < 0.5;
        parcel(ctx, px, piece.y, 0.85 * em, piece.paint, view.css.bg);
        if (!one) parcel(ctx, px + 1.1 * em, piece.y, 0.85 * em, piece.paint, view.css.bg);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible(p, plan) { // swaps keep one product in each place; this guards the solver's plan
      if (!plan.every((s) => Number.isInteger(s) && s >= 0 && s < 2 * p.cap)) return "A product has no place";
      return new Set(plan).size === plan.length || "Two products share a place";
    },
    score(p, plan) { return parcels(p, plan); },

    // x_i = 1 stores product i in Hamburg; s_k = 1 when pair k is split
    model(p) {
      const N = NAMES.length;
      const ids = [...Array(N).keys()];
      return [
        "Minimize",
        " parcels: " + p.pairs.map(([, , q], k) => `${q} s_${k}`).join(" + "),
        "Subject To",
        ...p.pairs.flatMap(([i, j], k) => [` a_${k}: s_${k} - x_${i} + x_${j} >= 0`, ` b_${k}: s_${k} + x_${i} - x_${j} >= 0`]),
        ` hamburg: ${ids.map((i) => `x_${i}`).join(" + ")} <= ${p.cap}`,
        ` berlin: ${ids.map((i) => `x_${i}`).join(" + ")} >= ${N - p.cap}`,
        "Binary",
        " " + ids.map((i) => `x_${i}`).join(" "),
        "End",
        "",
      ].join("\n");
    },
    // the products that stay keep the player's places; the movers take the places freed
    decode(p, values, yours) {
      const x = NAMES.map((_, i) => (Math.round(values[`x_${i}`] || 0) === 1 ? 0 : 1));
      // with equal space, the mirror image splits the same parcels: take the one with fewer moves
      const moved = (h) => [...yours.keys()].filter((i) => home(p, yours, i) !== h[i]);
      const h = [x, x.map((k) => 1 - k)].reduce((a, b) => (moved(b).length < moved(a).length ? b : a));
      const moves = moved(h);
      const freed = [[], []];
      for (const i of moves) freed[home(p, yours, i)].push(yours[i]);
      const plan = yours.slice();
      for (const i of moves) plan[i] = freed[h[i]].shift();
      return plan;
    },
    // the helper variables s_k would make the generic line say "infinitely many plans"
    think(p, r) {
      let layouts = 1; // ways to pick Hamburg's products: N choose cap
      for (let k = 0; k < p.cap; k++) layouts = (layouts * (NAMES.length - k)) / (k + 1);
      return `${NAMES.length} products, ${p.cap} places in each warehouse → ${fmt(layouts)} layouts · HiGHS: ${seconds(r.ms)}`;
    },

    insight(p, yours, optimal) {
      const y = splits(p, yours);
      const b = splits(p, optimal);
      const say = (s) => {
        const n = sum(s);
        return `${fmt(n)} parcel${n === 1 ? "" : "s"}: ${list(s.map(pairText))}`;
      };
      const diff = sum(y) === sum(b)
        ? `Your layout is as good as the best one. It splits ${say(y)}.`
        : `Your layout splits ${say(y)}. The best layout HiGHS found, with ` +
          `${list(inHouse(p, optimal, 0).map((i) => NAMES[i]))} in Hamburg, splits ${say(b)}.`;
      return {
        diff,
        mechanism: `With ${p.cap} places per warehouse, some products bought together must end up apart. Sorting ` +
          "by theme (camping, photo, phone) splits more parcels than the best layout, because which pairs to split " +
          "depends on all the past orders at once.",
        model: "Lecture 6's co-appearance `Q[i,j]` counts exactly these pairs, and the model keeps the pairs with a " +
          "large `Q[i,j]` in the same warehouse, `X[i,k]`, within each warehouse's places.",
      };
    },

    describe(p, plan) {
      return `Hamburg: ${list(inHouse(p, plan, 0).map((i) => NAMES[i]))}. Berlin: ${list(inHouse(p, plan, 1).map((i) => NAMES[i]))}. ` +
        `${fmt(parcels(p, plan))} split parcels.`;
    },
  });

  // A warehouse, about `s` wide and centred on (x, y): a hall with a sawtooth
  // roof and a door.
  function warehouse(ctx, x, y, s, paint, bg) {
    const u = s / 10;
    ctx.fillStyle = paint;
    ctx.fillRect(x - 5 * u, y - 1 * u, 10 * u, 5.5 * u);
    ctx.beginPath();
    for (let n = 0; n < 3; n++) { // three teeth
      const a = x + (n * 10 / 3 - 5) * u;
      ctx.moveTo(a, y - 1 * u);
      ctx.lineTo(a, y - 4.5 * u);
      ctx.lineTo(a + (10 / 3) * u, y - 1 * u);
    }
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.fillRect(x - 1.5 * u, y + 1.2 * u, 3 * u, 3.3 * u);
  }

  // A parcel: a box with its lid line and a thin strip of tape.
  function parcel(ctx, x, y, s, paint, bg) {
    ctx.fillStyle = paint;
    ctx.fillRect(x, y - s / 2, s, s);
    ctx.fillStyle = bg;
    ctx.fillRect(x, y - s / 2 + s * 0.28, s, s * 0.08);
    ctx.fillRect(x + s * 0.46, y - s / 2, s * 0.08, s * 0.28);
  }

  // The products, as small silhouettes about `s` wide, centred on (x, y).
  function icon(ctx, i, x, y, s, paint, bg) {
    const u = s / 10; // drawing unit
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = paint;
    ctx.strokeStyle = paint;
    ctx.lineWidth = 0.9 * u;
    ctx.lineJoin = "miter";
    const rect = (a, b, w, h, c) => { ctx.fillStyle = c || paint; ctx.fillRect(a * u, b * u, w * u, h * u); };
    const poly = (pts, c) => {
      ctx.fillStyle = c || paint;
      ctx.beginPath();
      pts.forEach(([a, b], k) => (k ? ctx.lineTo(a * u, b * u) : ctx.moveTo(a * u, b * u)));
      ctx.closePath();
      ctx.fill();
    };
    if (i === 0) { // tent: a triangle with an open door
      poly([[-5, 4], [0, -4.5], [5, 4]]);
      poly([[-1.4, 4], [0, 0.5], [1.4, 4]], bg);
    } else if (i === 1) { // camping mat: a roll, its spiral end and two straps
      rect(-2.5, -3, 7.5, 6);
      ctx.beginPath();
      ctx.arc(-2.5 * u, 0, 3 * u, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(-2.5 * u, 0, 1.6 * u, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = paint;
      ctx.beginPath();
      ctx.arc(-2.5 * u, 0, 0.7 * u, 0, 2 * Math.PI);
      ctx.fill();
      rect(0.6, -3, 0.7, 6, bg);
      rect(3, -3, 0.7, 6, bg);
    } else if (i === 2) { // lantern: handle, cap, glass, base
      ctx.beginPath();
      ctx.arc(0, -3.3 * u, 1.8 * u, Math.PI, 2 * Math.PI);
      ctx.stroke();
      rect(-2.6, -3.3, 5.2, 1.3);
      rect(-2, -2, 4, 5);
      rect(-1.1, -1.2, 2.2, 3.4, bg);
      rect(-2.8, 3, 5.6, 1.4);
    } else if (i === 3) { // camera: body, viewfinder, lens
      rect(-5, -2.5, 10, 6.5);
      rect(-3.2, -4, 3, 1.6);
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(0.6 * u, 0.8 * u, 2.2 * u, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = paint;
      ctx.beginPath();
      ctx.arc(0.6 * u, 0.8 * u, 1.2 * u, 0, 2 * Math.PI);
      ctx.fill();
    } else if (i === 4) { // tripod: a head on three legs
      rect(-2, -4.5, 4, 1.8);
      ctx.beginPath();
      ctx.moveTo(0, -2.7 * u);
      ctx.lineTo(-4 * u, 4.5 * u);
      ctx.moveTo(0, -2.7 * u);
      ctx.lineTo(0, 4.5 * u);
      ctx.moveTo(0, -2.7 * u);
      ctx.lineTo(4 * u, 4.5 * u);
      ctx.stroke();
    } else if (i === 5) { // phone: a slab with a screen
      rect(-2.8, -4.8, 5.6, 9.6);
      rect(-2, -3.8, 4, 6.8, bg);
    } else if (i === 6) { // charger: a plug with two prongs and its cable
      rect(-2.5, -1.5, 5, 4);
      rect(-1.7, -4.2, 0.9, 2.7);
      rect(0.8, -4.2, 0.9, 2.7);
      ctx.beginPath();
      ctx.moveTo(0, 2.5 * u);
      ctx.lineTo(0, 4 * u);
      ctx.lineTo(3.5 * u, 4 * u);
      ctx.stroke();
    } else if (i === 7) { // headset: a band and two ear cups
      ctx.lineWidth = 1.1 * u;
      ctx.beginPath();
      ctx.arc(0, 0.5 * u, 3.6 * u, Math.PI, 2 * Math.PI);
      ctx.stroke();
      rect(-4.8, 0, 2.4, 4.2);
      rect(2.4, 0, 2.4, 4.2);
    }
    ctx.restore();
  }
})();
