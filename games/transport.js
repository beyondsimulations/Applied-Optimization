// transport.js — lecture 01: ship solar panels from two plants to three farms.
(function () {
  // Two layouts in board units. Wide (slides, desktop pages): board 100 × 66,
  // the stepper pops up next to the tapped badge. Compact (phones): board
  // 100 × 124 with more room between routes for finger-sized badges, and the
  // stepper as a strip at the bottom that never covers the farm numbers.
  const WIDE = { h: 66, r: 3.4, plants: [[12, 14], [12, 52]], farms: [[88, 8], [88, 58], [88, 33]] };
  const COMPACT = { h: 124, r: 5, plants: [[12, 22], [12, 82]], farms: [[88, 10], [88, 90], [88, 50]] };
  //                                      Dresden, Laupheim         Hamburg, Munich, Berlin
  const lay = (view) => (view && view.compact ? COMPACT : WIDE);
  const BADGE_T = 0.3; // badge position along a route
  const STEPS = [-5, -1, 1, 5];

  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const used = (plan, i) => plan[i].reduce((s, x) => s + x, 0);
  const got = (plan, j) => plan.reduce((s, row) => s + row[j], 0);
  const cost = (p, plan) => plan.reduce((s, row, i) => s + row.reduce((t, x, j) => t + x * p.cost[i][j], 0), 0);
  const route = (p, i, j) => `${p.plants[i].name}→${p.farms[j].name}`;

  function badge(L, i, j) {
    const [x1, y1] = L.plants[i];
    const [x2, y2] = L.farms[j];
    return [x1 + (x2 - x1) * BADGE_T, y1 + (y2 - y1) * BADGE_T];
  }
  // The stepper for the selected route: a card next to its badge (wide), or a
  // strip across the bottom of the board (compact). `text` is where the price goes.
  function stepper(L, sel) {
    if (L === COMPACT) {
      const buttons = STEPS.map((d, k) => ({ d, x: 4 + k * 24, y: 109, w: 20, h: 13 }));
      return { card: null, text: [50, 104], buttons };
    }
    const [bx, by] = badge(L, sel[0], sel[1]);
    const w = 40, h = 15;
    const x = bx + L.r + 2;
    const y = Math.max(1, Math.min(L.h - h - 1, by - h / 2));
    const buttons = STEPS.map((d, k) => ({ d, x: x + 2 + k * 9.25, y: y + 6.5, w: 8, h: 7 }));
    return { card: { x, y, w, h }, text: [x + w / 2, y + 3.6], buttons };
  }
  const inside = (e, b) => e.x >= b.x && e.x <= b.x + b.w && e.y >= b.y && e.y <= b.y + b.h;

  Gamekit.game("transport", {
    title: "Ship the Solar Panels",
    task: "Meet every farm's demand at the lowest cost. Tap a route's number, then use the buttons.",
    goal: "min",
    unit: "€",
    board: { w: 100, h: WIDE.h },
    compactBoard: { w: 100, h: COMPACT.h },
    class: {
      plants: [{ name: "Dresden", supply: 34 }, { name: "Laupheim", supply: 41 }],
      farms: [{ name: "Hamburg", demand: 21 }, { name: "Munich", demand: 17 }, { name: "Berlin", demand: 29 }],
      cost: [[5010, 4640, 1980], [7120, 1710, 6430]],
    },
    check: { optimum: 225460 },

    // Random puzzles keep the places but draw new numbers. They are resampled
    // until the cheapest-route plan is infeasible, so the mechanism text
    // ("taking the cheapest route for every farm fails") holds for every puzzle.
    puzzle(rng) {
      const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
      for (;;) {
        const supply = [int(20, 45), int(20, 45)];
        const demand = [int(10, 30), int(10, 30), int(10, 30)];
        const c = [0, 1].map(() => [0, 1, 2].map(() => int(10, 75) * 100));
        if (supply[0] + supply[1] < demand[0] + demand[1] + demand[2]) continue;
        if (c[0].some((x, j) => x === c[1][j])) continue;
        const need = [0, 0];
        demand.forEach((d, j) => { need[c[0][j] < c[1][j] ? 0 : 1] += d; });
        if (need[0] <= supply[0] && need[1] <= supply[1]) continue;
        return {
          plants: [{ name: "Dresden", supply: supply[0] }, { name: "Laupheim", supply: supply[1] }],
          farms: [{ name: "Hamburg", demand: demand[0] }, { name: "Munich", demand: demand[1] }, { name: "Berlin", demand: demand[2] }],
          cost: c,
        };
      }
    },
    start() { return [[0, 0, 0], [0, 0, 0]]; },

    pointer(p, plan, ui, e, view) {
      if (e.type !== "down") return undefined;
      const L = lay(view);
      if (ui.sel) {
        const st = stepper(L, ui.sel);
        const hit = st.buttons.find((b) => inside(e, b));
        if (!hit && st.card && inside(e, st.card)) return undefined; // a near miss on the card keeps it open
        if (!hit && L === COMPACT && e.y > 100) return undefined;   // ... and on the strip
        if (hit) {
          const [i, j] = ui.sel;
          const next = plan.map((row) => row.slice());
          next[i][j] = Math.max(0, next[i][j] + hit.d);
          return next;
        }
      }
      // nearest badge within reach: neighbouring hit zones overlap slightly
      let best = null;
      let bestDist = L.r + (L === COMPACT ? 1.5 : 1);
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
          const [bx, by] = badge(L, i, j);
          const d = Math.hypot(e.x - bx, e.y - by);
          if (d <= bestDist) { best = [i, j]; bestDist = d; }
        }
      }
      ui.sel = best;
      return undefined;
    },

    pieces(p, plan, ui, view) {
      const L = lay(view);
      const scale = L.r / WIDE.r; // line widths and dots grow with the badges
      const out = [];
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
          const [bx, by] = badge(L, i, j);
          const sel = ui.sel && ui.sel[0] === i && ui.sel[1] === j;
          out.push({
            key: `route-${i}-${j}`, kind: "route",
            x1: L.plants[i][0], y1: L.plants[i][1], x2: L.farms[j][0], y2: L.farms[j][1],
            bx, by, r: L.r, scale, trucks: plan[i][j], sel: sel ? 1 : 0, color: "plan",
          });
        }
      }
      p.plants.forEach((pl, i) => {
        const u = used(plan, i);
        out.push({ key: `plant-${i}`, kind: "node", x: L.plants[i][0], y: L.plants[i][1], scale, name: pl.name,
          value: u, limit: pl.supply, color: u > pl.supply ? "bad" : "text" });
      });
      p.farms.forEach((f, j) => {
        const g = got(plan, j);
        out.push({ key: `farm-${j}`, kind: "node", x: L.farms[j][0], y: L.farms[j][1], scale, name: f.name,
          value: g, limit: f.demand, color: g !== f.demand ? "bad" : "text" });
      });
      if (ui.sel) {
        const [i, j] = ui.sel;
        const st = stepper(L, ui.sel);
        if (st.card) out.push(Object.assign({ key: "popup", kind: "popup", color: "muted" }, st.card));
        out.push({ key: "info", kind: "info", x: st.text[0], y: st.text[1],
          text: `${fmt(p.cost[i][j])} € per truckload`, color: "text" });
        for (const b of st.buttons) {
          out.push(Object.assign({ key: `step${b.d}`, kind: "button", label: b.d > 0 ? `+${b.d}` : `−${-b.d}`, color: "neutral" }, b));
        }
      } else if (L === COMPACT) {
        out.push({ key: "info", kind: "info", x: 50, y: 104, text: "Tap a route's number to change it", color: "muted" });
      }
      return out;
    },

    drawBoard() {},

    drawPiece(ctx, piece, view) {
      ctx.font = `${view.em}px ${view.font}`; // the same size as the HTML text around the board
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (piece.kind === "route") {
        const n = piece.trucks;
        ctx.beginPath();
        ctx.moveTo(piece.x1, piece.y1);
        ctx.lineTo(piece.x2, piece.y2);
        if (n < 0.5) {
          ctx.setLineDash([piece.scale, piece.scale]);
          ctx.strokeStyle = view.css.muted;
          ctx.lineWidth = 0.3 * piece.scale;
        } else {
          ctx.strokeStyle = piece.paint;
          ctx.lineWidth = (0.4 + n * 0.12) * piece.scale;
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(piece.bx, piece.by, piece.r, 0, 2 * Math.PI);
        ctx.fillStyle = view.css.bg;
        ctx.fill();
        ctx.lineWidth = (piece.sel > 0.5 ? 0.9 : 0.35) * piece.scale;
        ctx.strokeStyle = piece.sel > 0.5 ? view.css.accent : piece.paint;
        ctx.stroke();
        ctx.fillStyle = view.css.text;
        ctx.fillText(String(Math.round(n)), piece.bx, piece.by + 0.2);
      } else if (piece.kind === "node") {
        const dot = 1.6 * piece.scale;
        ctx.beginPath();
        ctx.arc(piece.x, piece.y, dot, 0, 2 * Math.PI);
        ctx.fillStyle = piece.paint;
        ctx.fill();
        // a background-coloured halo keeps labels readable where routes cross them
        ctx.strokeStyle = view.css.bg;
        ctx.lineWidth = view.em * 0.3;
        ctx.lineJoin = "round";
        const gap = dot + view.em * 0.75;
        for (const [text, dy] of [[piece.name, -gap], [`${Math.round(piece.value)} / ${piece.limit}`, gap]]) {
          ctx.strokeText(text, piece.x, piece.y + dy);
          ctx.fillText(text, piece.x, piece.y + dy);
        }
      } else if (piece.kind === "popup") {
        ctx.beginPath();
        ctx.rect(piece.x, piece.y, piece.w, piece.h);
        ctx.fillStyle = view.css.bg;
        ctx.fill();
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = piece.paint;
        ctx.stroke();
      } else if (piece.kind === "info") {
        ctx.fillStyle = piece.paint;
        ctx.fillText(piece.text, piece.x, piece.y);
      } else if (piece.kind === "button") {
        ctx.fillStyle = piece.paint;
        ctx.fillRect(piece.x, piece.y, piece.w, piece.h);
        ctx.fillStyle = view.css.bg;
        ctx.fillText(piece.label, piece.x + piece.w / 2, piece.y + piece.h / 2 + 0.2);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },

    feasible(p, plan) {
      for (let i = 0; i < 2; i++) {
        const over = used(plan, i) - p.plants[i].supply;
        if (over > 0) return `${p.plants[i].name} ships ${over} more than it has`;
      }
      for (let j = 0; j < 3; j++) {
        const diff = got(plan, j) - p.farms[j].demand;
        if (diff < 0) return `${p.farms[j].name} is ${plural(-diff, "truckload")} short`;
        if (diff > 0) return `${p.farms[j].name} gets ${plural(diff, "truckload")} too many`;
      }
      return true;
    },
    score(p, plan) { return cost(p, plan); },

    model(p) {
      const x = (i, j) => `x_${i}_${j}`;
      const lines = ["Minimize", " cost: " + [0, 1].flatMap((i) => [0, 1, 2].map((j) => `${p.cost[i][j]} ${x(i, j)}`)).join(" + "), "Subject To"];
      p.plants.forEach((pl, i) => lines.push(` supply_${i}: ${[0, 1, 2].map((j) => x(i, j)).join(" + ")} <= ${pl.supply}`));
      p.farms.forEach((f, j) => lines.push(` demand_${j}: ${[0, 1].map((i) => x(i, j)).join(" + ")} = ${f.demand}`));
      lines.push("End", "");
      return lines.join("\n");
    },
    decode(p, values) {
      return [0, 1].map((i) => [0, 1, 2].map((j) => Math.round(values[`x_${i}_${j}`] || 0)));
    },

    insight(p, yours, optimal) {
      const diffs = [];
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
          const d = Math.abs(yours[i][j] - optimal[i][j]);
          if (d > 0) diffs.push({ d, text: `${route(p, i, j)} (you ${yours[i][j]}, optimal ${optimal[i][j]})` });
        }
      }
      diffs.sort((a, b) => b.d - a.d);
      const extra = cost(p, yours) - cost(p, optimal);
      let diff;
      if (extra > 0) diff = `You pay ${fmt(extra)} € more. Biggest differences: ${diffs.slice(0, 2).map((x) => x.text).join(", ")}.`;
      else if (diffs.length) diff = "Your plan is optimal too: same cost as the solver's plan, with different routes.";
      else diff = "Your plan is optimal!";
      let top = [0, 0];
      for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) if (p.cost[i][j] > p.cost[top[0]][top[1]]) top = [i, j];
      const n = optimal[top[0]][top[1]];
      if (n > 0) {
        diff += ` The optimal plan sends ${plural(n, "truckload")} on the most expensive route, ${route(p, top[0], top[1])} (${fmt(p.cost[top[0]][top[1]])} €).`;
      }
      return {
        diff,
        mechanism: "Taking the cheapest route for every farm fails, because the plants can't supply everyone that way. What counts is how much a truck saves compared with sending it from the other plant, not how cheap its route is.",
        model: "That's why the model decides all routes together, `x[i,j]`, with one supply constraint per plant.",
      };
    },

    describe(p, plan) {
      const plants = p.plants.map((pl, i) => `${pl.name} ships ${used(plan, i)} of ${pl.supply}`).join(", ");
      const farms = p.farms.map((f, j) => `${f.name} gets ${got(plan, j)} of ${f.demand}`).join(", ");
      return `Total cost ${fmt(cost(p, plan))} €. ${plants}. ${farms}.`;
    },
  });
})();
