// transport.js — lecture 01: ship solar panels from two plants to three farms.
(function () {
  // Layout in board units (board 100 × 75). Plants left, farms right; the
  // stepper row sits below the network.
  const PLANT_XY = [[15, 12], [15, 48]];          // Dresden, Laupheim
  const FARM_XY = [[85, 6], [85, 52], [85, 29]];  // Hamburg, Munich, Berlin
  const BADGE_T = 0.3;                            // badge position along a route
  const BADGE_R = 3.4;
  const STEPS = [-5, -1, 1, 5];

  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const used = (plan, i) => plan[i].reduce((s, x) => s + x, 0);
  const got = (plan, j) => plan.reduce((s, row) => s + row[j], 0);
  const cost = (p, plan) => plan.reduce((s, row, i) => s + row.reduce((t, x, j) => t + x * p.cost[i][j], 0), 0);
  const route = (p, i, j) => `${p.plants[i].name}→${p.farms[j].name}`;

  function badge(i, j) {
    const [x1, y1] = PLANT_XY[i];
    const [x2, y2] = FARM_XY[j];
    return [x1 + (x2 - x1) * BADGE_T, y1 + (y2 - y1) * BADGE_T];
  }
  function stepper() {
    return STEPS.map((d, k) => ({ d, x: 27 + k * 12, y: 66, w: 10, h: 7 }));
  }
  const inside = (e, b) => e.x >= b.x && e.x <= b.x + b.w && e.y >= b.y && e.y <= b.y + b.h;

  Gamekit.game("transport", {
    title: "Ship the Solar Panels",
    task: "Meet every farm's demand at the lowest cost. Tap a route's number, then use the buttons.",
    goal: "min",
    unit: "€",
    board: { w: 100, h: 75 },
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

    pointer(p, plan, ui, e) {
      if (e.type !== "down") return undefined;
      if (ui.sel) {
        const hit = stepper().find((b) => inside(e, b));
        if (hit) {
          const [i, j] = ui.sel;
          const next = plan.map((row) => row.slice());
          next[i][j] = Math.max(0, next[i][j] + hit.d);
          return next;
        }
      }
      // nearest badge within reach: neighbouring hit zones overlap slightly
      let best = null;
      let bestDist = BADGE_R + 1;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
          const [bx, by] = badge(i, j);
          const d = Math.hypot(e.x - bx, e.y - by);
          if (d <= bestDist) { best = [i, j]; bestDist = d; }
        }
      }
      ui.sel = best;
      return undefined;
    },

    pieces(p, plan, ui) {
      const out = [];
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
          const [bx, by] = badge(i, j);
          const sel = ui.sel && ui.sel[0] === i && ui.sel[1] === j;
          out.push({
            key: `route-${i}-${j}`, kind: "route",
            x1: PLANT_XY[i][0], y1: PLANT_XY[i][1], x2: FARM_XY[j][0], y2: FARM_XY[j][1],
            bx, by, trucks: plan[i][j], sel: sel ? 1 : 0, color: "plan",
          });
        }
      }
      p.plants.forEach((pl, i) => {
        const u = used(plan, i);
        out.push({ key: `plant-${i}`, kind: "node", x: PLANT_XY[i][0], y: PLANT_XY[i][1], name: pl.name,
          value: u, limit: pl.supply, color: u > pl.supply ? "bad" : "text" });
      });
      p.farms.forEach((f, j) => {
        const g = got(plan, j);
        out.push({ key: `farm-${j}`, kind: "node", x: FARM_XY[j][0], y: FARM_XY[j][1], name: f.name,
          value: g, limit: f.demand, color: g !== f.demand ? "bad" : "text" });
      });
      if (ui.sel) {
        const [i, j] = ui.sel;
        out.push({ key: "info", kind: "info", text: `${route(p, i, j)} · ${fmt(p.cost[i][j])} € per truckload`, color: "text" });
        for (const b of stepper()) {
          out.push(Object.assign({ key: `step${b.d}`, kind: "button", label: b.d > 0 ? `+${b.d}` : `−${-b.d}`, color: "neutral" }, b));
        }
      }
      return out;
    },

    drawBoard() {},

    drawPiece(ctx, piece, view) {
      ctx.font = `3px ${view.font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (piece.kind === "route") {
        const n = piece.trucks;
        ctx.beginPath();
        ctx.moveTo(piece.x1, piece.y1);
        ctx.lineTo(piece.x2, piece.y2);
        if (n < 0.5) {
          ctx.setLineDash([1, 1]);
          ctx.strokeStyle = view.css.muted;
          ctx.lineWidth = 0.3;
        } else {
          ctx.strokeStyle = piece.paint;
          ctx.lineWidth = 0.4 + n * 0.12;
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(piece.bx, piece.by, BADGE_R, 0, 2 * Math.PI);
        ctx.fillStyle = view.css.bg;
        ctx.fill();
        ctx.lineWidth = piece.sel > 0.5 ? 0.9 : 0.35;
        ctx.strokeStyle = piece.sel > 0.5 ? view.css.accent : piece.paint;
        ctx.stroke();
        ctx.fillStyle = view.css.text;
        ctx.fillText(String(Math.round(n)), piece.bx, piece.by + 0.2);
      } else if (piece.kind === "node") {
        ctx.beginPath();
        ctx.arc(piece.x, piece.y, 1.6, 0, 2 * Math.PI);
        ctx.fillStyle = piece.paint;
        ctx.fill();
        // a background-coloured halo keeps labels readable where routes cross them
        ctx.strokeStyle = view.css.bg;
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";
        for (const [text, dy] of [[piece.name, -3.6], [`${Math.round(piece.value)} / ${piece.limit}`, 3.8]]) {
          ctx.strokeText(text, piece.x, piece.y + dy);
          ctx.fillText(text, piece.x, piece.y + dy);
        }
      } else if (piece.kind === "info") {
        ctx.fillStyle = piece.paint;
        ctx.fillText(piece.text, 50, 61);
      } else if (piece.kind === "button") {
        ctx.fillStyle = piece.paint;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(piece.x, piece.y, piece.w, piece.h, 1.2);
        else ctx.rect(piece.x, piece.y, piece.w, piece.h);
        ctx.fill();
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
