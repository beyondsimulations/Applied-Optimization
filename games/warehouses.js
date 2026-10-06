// warehouses.js — lecture 06: an online shop stores 8 products in Hamburg and
// Berlin, 4 places each. Every past order is a pair of products; a pair whose
// products sit in different warehouses ships as two parcels. Students swap
// products between the warehouses to split as few parcels as possible.
(function () {
  const { fillCentred, formatScore: fmt } = GamekitCore;
  const NAMES = ["tent", "sleeping bag", "lantern", "camera", "tripod", "phone", "charger", "headphones"];
  const HOUSES = ["Hamburg", "Berlin"];

  // Two layouts in board units. Wide: the warehouses on the left, the past
  // orders in one column on the right (the board stretches on slides, view.w).
  // Compact (phones): the orders below the warehouses, in two columns.
  function lay(view) {
    const em = (view && view.em) || 3;
    if (view && view.compact) {
      return { w: 100, h: 99, title: 3, box: [{ x: 0, y: 7 }, { x: 55, y: 7 }], slot: { w: 21, h: 17 }, icon: 2 * em,
        hint: 50, head: 57.5, rows: { x: [0, 52], y: 64, h: 7.2, per: 5, w: 48 } };
    }
    const w = (view && view.w) || 100;
    const ox = Math.max(68, w - 13 * em);
    return { w, h: 70, title: 3, box: [{ x: 0, y: 7 }, { x: 33, y: 7 }], slot: { w: 13, h: 12 }, icon: 2 * em,
      hint: 40, head: 3, rows: { x: [ox], y: 9, h: 5.8, per: 10, w: w - ox } };
  }
  // where product number `n` (0-based) of a warehouse sits: a 2 × 2 grid
  function slot(L, k, n) {
    const b = L.box[k];
    return { x: b.x + 1.5 + (n % 2) * L.slot.w + L.slot.w / 2, y: b.y + 1.5 + Math.floor(n / 2) * L.slot.h + L.slot.h / 2 };
  }
  const inHouse = (plan, k) => plan.map((h, i) => (h === k ? i : -1)).filter((i) => i >= 0);
  const splits = (p, plan) => p.pairs.filter(([i, j]) => plan[i] !== plan[j]);
  const parcels = (p, plan) => splits(p, plan).reduce((s, q) => s + q[2], 0);
  const list = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  const pairText = ([i, j, q]) => `${NAMES[i]} and ${NAMES[j]} (${q})`;
  // the layouts that keep the camping gear and the phone things together
  const themes = [[0, 0, 0, 0, 1, 1, 1, 1], [0, 0, 0, 1, 0, 1, 1, 1]];

  Gamekit.game("warehouses", {
    title: "Store the Products Together",
    task: "An online shop stores 8 products in Hamburg and Berlin, 4 places each. An order with products from " +
      "both warehouses ships as two parcels. Tap two products in different warehouses to swap them, and split as " +
      "few parcels as possible.",
    goal: "min",
    unit: ["split parcel", "split parcels"],
    board: { w: 100, h: 70, stretch: true },
    compactBoard: { w: 100, h: 99 },
    // pairs bought together last month: [product, product, orders]
    class: {
      cap: 4,
      pairs: [[0, 1, 10], [3, 4, 9], [5, 6, 8], [0, 2, 7], [5, 7, 7], [2, 6, 6], [1, 2, 4], [6, 7, 3], [3, 5, 2], [0, 4, 1]],
    },
    check: { optimum: 12 },

    // Random months keep the products and their themes: camping, photo and
    // phone pairs are bought often, a few cross-theme pairs less. Resampled
    // until some parcel must split and keeping the themes together is worse
    // than the best layout, so the mechanism text holds for every puzzle.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      for (;;) {
        const pairs = [[0, 1, int(7, 12)], [3, 4, int(6, 12)], [5, 6, int(5, 10)], [0, 2, int(4, 9)], [5, 7, int(4, 9)],
          [2, 6, int(3, 8)], [1, 2, int(2, 6)], [6, 7, int(1, 5)], [3, 5, int(1, 4)], [0, 4, int(0, 3)]]
          .filter((q) => q[2] > 0).sort((a, b) => b[2] - a[2]);
        const p = { cap: 4, pairs };
        let best = Infinity;
        for (let m = 0; m < 256; m++) {
          const plan = NAMES.map((_, i) => (m >> i) & 1);
          if (plan.filter((h) => h === 0).length === 4) best = Math.min(best, parcels(p, plan));
        }
        if (best > 0 && themes.every((t) => parcels(p, t) > best)) return p;
      }
    },
    start() { return themes[0].slice(); }, // the themes kept together, the camera with the camping gear

    // a first tap picks a product, a second one in the other warehouse swaps
    // the two (a tap in the same warehouse picks that product instead)
    pointer(p, plan, ui, e, view) {
      if (e.type !== "down") return undefined;
      const L = lay(view);
      for (let k = 0; k < 2; k++) {
        const here = inHouse(plan, k);
        for (let n = 0; n < here.length; n++) {
          const s = slot(L, k, n);
          if (Math.abs(e.x - s.x) > L.slot.w / 2 || Math.abs(e.y - s.y) > L.slot.h / 2) continue;
          const i = here[n];
          if (ui.sel == null || ui.sel === i || plan[ui.sel] === k) {
            ui.sel = ui.sel === i ? null : i;
            return undefined;
          }
          const next = plan.slice();
          next[i] = plan[ui.sel];
          next[ui.sel] = k;
          ui.sel = null;
          return next;
        }
      }
      ui.sel = null;
      return undefined;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const out = [];
      for (let k = 0; k < 2; k++) {
        const here = inHouse(plan, k);
        out.push({ key: `house-${k}`, kind: "house", k, x: L.box[k].x, y: L.box[k].y, ty: L.title, n: here.length,
          w: 2 * L.slot.w + 3, h: 2 * L.slot.h + 3, cap: p.cap, color: "text" });
        here.forEach((i, n) => {
          const s = slot(L, k, n);
          out.push({ key: `product-${i}`, kind: "product", i, x: s.x, y: s.y, size: L.icon, w: L.slot.w, h: L.slot.h,
            sel: ui.sel === i ? 1 : 0, color: "plan" });
        });
      }
      if (ui.sel != null && !(view && view.locked)) {
        out.push({ key: "hint", kind: "hint", x: 0, y: L.hint, color: "muted",
          text: `Now tap a product in ${HOUSES[1 - plan[ui.sel]]}` });
      }
      p.pairs.forEach(([i, j, q], r) => {
        const R = L.rows;
        const c = Math.floor(r / R.per);
        out.push({ key: `order-${r}`, kind: "order", i, j, q, x: R.x[c], y: R.y + (r % R.per) * R.h,
          split: plan[i] !== plan[j] ? 1 : 0, color: plan[i] !== plan[j] ? "bad" : "muted" });
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
      if (piece.kind === "house") { // a warehouse: its name and a box with four places
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, `${HOUSES[piece.k]}, ${piece.cap} places`, piece.x, piece.ty, "start");
        ctx.strokeStyle = view.css.muted;
        ctx.lineWidth = 0.35;
        ctx.strokeRect(piece.x, piece.y, piece.w, piece.h);
      } else if (piece.kind === "product") {
        if (piece.sel > 0.5) { // the picked product
          ctx.strokeStyle = view.css.accent;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(piece.x - piece.w / 2 + 1, piece.y - piece.h / 2 + 1, piece.w - 2, piece.h - 2);
        }
        icon(ctx, piece.i, piece.x, piece.y, piece.size, piece.paint, view.css.bg);
      } else if (piece.kind === "hint") {
        ctx.fillStyle = piece.paint;
        fillCentred(ctx, piece.text, piece.x, piece.y, "start");
      } else if (piece.kind === "order") { // a pair bought together: icons, how often, and its parcels
        const s = 1.3 * em;
        const x = piece.x;
        icon(ctx, piece.i, x + 0.5 * s, piece.y, s, view.css.text, view.css.bg);
        icon(ctx, piece.j, x + 1.6 * s, piece.y, s, view.css.text, view.css.bg);
        ctx.fillStyle = view.css.text;
        fillCentred(ctx, `×${piece.q}`, x + 2.35 * s, piece.y, "start");
        const px = x + 2.35 * s + 2.2 * em;
        const one = piece.split < 0.5;
        parcel(ctx, px, piece.y, 0.85 * em, piece.paint, view.css.bg);
        if (!one) parcel(ctx, px + 1.1 * em, piece.y, 0.85 * em, piece.paint, view.css.bg);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible(p, plan) { // swaps keep both warehouses full; this guards the solver's plan
      for (let k = 0; k < 2; k++) {
        const n = inHouse(plan, k).length;
        if (n > p.cap) return `${HOUSES[k]} holds ${n} products, but only ${p.cap} fit`;
      }
      return true;
    },
    score(p, plan) { return parcels(p, plan); },

    // x_i = 1 stores product i in Hamburg; s_k = 1 when pair k is split. The
    // tent stays in Hamburg: with equal space, the mirror image is the same layout.
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
        "Bounds",
        " x_0 = 1",
        "Binary",
        " " + ids.map((i) => `x_${i}`).join(" "),
        "End",
        "",
      ].join("\n");
    },
    decode(p, values) { return NAMES.map((_, i) => (Math.round(values[`x_${i}`] || 0) === 1 ? 0 : 1)); },
    // the helper variables s_k would make the generic line say "infinitely many plans"
    think(p, r) {
      const sec = r.ms < 10 ? (r.ms / 1000).toPrecision(1) : (r.ms / 1000).toFixed(2);
      let layouts = 1; // ways to pick Hamburg's products: N choose cap
      for (let k = 0; k < p.cap; k++) layouts = (layouts * (NAMES.length - k)) / (k + 1);
      return `${NAMES.length} products, ${p.cap} places in each warehouse → ${fmt(layouts)} layouts · HiGHS: ${sec} s`;
    },

    insight(p, yours, optimal) {
      const y = splits(p, yours);
      const b = splits(p, optimal);
      const say = (s) => {
        const n = s.reduce((a, q) => a + q[2], 0);
        return `${fmt(n)} parcel${n === 1 ? "" : "s"}: ${list(s.map(pairText))}`;
      };
      const diff = parcels(p, yours) === parcels(p, optimal)
        ? `Your layout is as good as the best one. It splits ${say(y)}.`
        : `Your layout splits ${say(y)}. The best layout, with ${list(inHouse(optimal, 0).map((i) => NAMES[i]))} ` +
          `in Hamburg, splits ${say(b)}.`;
      return {
        diff,
        mechanism: `With ${p.cap} places per warehouse, some products bought together must end up apart. The best ` +
          "layout splits the pairs bought together least often, and the past orders show which those are, not the " +
          "product themes.",
        model: "Lecture 6's co-appearance `Q[i,j]` counts exactly these pairs, and the model keeps the pairs with a " +
          "large `Q[i,j]` in the same warehouse, `X[i,k]`, within each warehouse's places.",
      };
    },

    describe(p, plan) {
      return `Hamburg: ${list(inHouse(plan, 0).map((i) => NAMES[i]))}. Berlin: ${list(inHouse(plan, 1).map((i) => NAMES[i]))}. ` +
        `${fmt(parcels(p, plan))} split parcels.`;
    },
  });

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
    } else if (i === 1) { // sleeping bag: a rolled bag, its spiral end and two straps
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
    } else if (i === 7) { // headphones: a band and two ear cups
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
