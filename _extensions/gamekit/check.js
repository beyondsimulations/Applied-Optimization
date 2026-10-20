// check.js — verifies a course's games in Node. Run from the project root:
//   node _extensions/gamekit/check.js games/*.js
// For each game: the class puzzle and five seeded random puzzles are solved
// (from the start plan and any check.plans, for games whose problem depends on
// the player's plan);
// the class optimum must equal check.optimum, score(decode(solution)) must
// equal the solver objective, the optimal plan must be feasible, piece keys
// must be unique, a game's think() must return a line, a compactBoard.h
// function must return a positive height for each of these puzzles, and the
// goal must match the model's direction (or, for optimal(), the optimal plan
// must score at least as well as a feasible start plan).
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import "./core.js";
import { solve } from "./solve.js";

const C = globalThis.GamekitCore;
const REQUIRED = ["title", "task", "goal", "board", "class", "check", "puzzle", "start", "pointer",
  "pieces", "drawBoard", "drawPiece", "feasible", "score", "insight", "describe"];
const games = [];
globalThis.Gamekit = { game(name, def) { games.push({ name, def }); } };

const close = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b));
let failed = 0;
const fail = (msg) => { failed++; console.error(`FAIL ${msg}`); };
// a check that fails the same way for every puzzle reports only its first case
const reported = new Set();
const failOnce = (key, msg) => { if (!reported.has(key)) { reported.add(key); fail(msg); } };
const SENSE = { max: /^\s*max/i, min: /^\s*min/i }; // LP files open with Maximize or Minimize

const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: node _extensions/gamekit/check.js games/*.js");
  process.exit(2);
}
for (const f of files) await import(pathToFileURL(resolve(f)).href);
if (!games.length) fail("no games registered (does each file call Gamekit.game?)");

for (const { name, def } of games) {
  const missing = REQUIRED.filter((k) => def[k] == null);
  if (!def.optimal && (!def.model || !def.decode)) missing.push("model+decode (or optimal)");
  if (missing.length) { fail(`${name}: missing ${missing.join(", ")}`); continue; }
  const cases = [["class", def.class]];
  for (let seed = 1; seed <= 5; seed++) cases.push([`seed ${seed}`, def.puzzle(C.rng(seed))]);
  for (const [label, puzzle] of cases) {
    const where = `${name} (${label})`;
    try {
      const ch = def.compactBoard && def.compactBoard.h;
      if (typeof ch === "function" && ![3, 4.5, 6.5].every((em) => { const h = ch(em, puzzle); return Number.isFinite(h) && h > 0; })) {
        failOnce(`${name}/h`, `${where}: compactBoard.h(em, puzzle) must return a positive number`);
      }
      const goal = C.goalOf(def, puzzle);
      if (goal !== "max" && goal !== "min") failOnce(`${name}/goal`, `${where}: goal must be "max" or "min", not ${JSON.stringify(goal)}`);
      const start = def.start(puzzle);
      // also solve from the game's extra plans (check.plans), e.g. a size the player can choose
      const froms = [start].concat(def.check.plans ? def.check.plans(puzzle) : []);
      let first;
      for (const [k, from] of froms.entries()) {
        const at = k === 0 ? where : `${where}, check.plans[${k - 1}]`;
        let plan, objective, counts;
        if (def.optimal) {
          plan = await def.optimal(puzzle, from);
          objective = def.score(puzzle, plan);
          const s0 = def.score(puzzle, from);
          if (SENSE[goal] && def.feasible(puzzle, from) === true && (goal === "max" ? objective < s0 : objective > s0) && !close(objective, s0)) {
            fail(`${at}: goal is "${goal}", but the optimal plan scores ${objective} against the start plan's ${s0}`);
          }
        } else {
          const lp = def.model(puzzle, from);
          if (SENSE[goal] && !SENSE[goal].test(lp)) fail(`${at}: goal is "${goal}", but the model does not open with ${goal === "max" ? "Maximize" : "Minimize"}`);
          const r = await solve(lp);
          if (r.status !== "Optimal") { fail(`${at}: solver status ${r.status}`); continue; }
          objective = r.objective;
          counts = r.counts;
          plan = def.decode(puzzle, r.values, from);
          const s = def.score(puzzle, plan);
          if (!close(s, objective)) fail(`${at}: score(decode(solution)) = ${s}, solver objective = ${objective}`);
        }
        if (k === 0) first = objective;
        const ok = def.feasible(puzzle, plan);
        if (ok !== true) fail(`${at}: optimal plan is not feasible: ${ok}`);
        if (def.think && typeof def.think(puzzle, { plan, ms: 0, counts }) !== "string") {
          fail(`${at}: think() does not return a string`);
        }
        for (const view of [{ compact: false, em: 3 }, { compact: true, em: 4.5 }]) {
          C.assertUniqueKeys(def.pieces(puzzle, from, {}, view));
          C.assertUniqueKeys(def.pieces(puzzle, plan, {}, view));
        }
        const ins = def.insight(puzzle, plan, plan);
        for (const key of ["diff", "mechanism", "model"]) {
          if (typeof ins[key] !== "string") fail(`${at}: insight().${key} is not a string`);
        }
      }
      if (label === "class" && first !== undefined && !close(first, def.check.optimum)) {
        fail(`${where}: optimum ${first}, expected check.optimum ${def.check.optimum}`);
      }
      if (label === "class") console.log(`ok ${name}: class optimum ${first}`);
    } catch (err) {
      fail(`${where}: ${err.message}`);
    }
  }
}
process.exitCode = failed ? 1 : 0;
