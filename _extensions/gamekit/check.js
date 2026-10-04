// check.js — verifies a course's games in Node. Run from the project root:
//   node _extensions/gamekit/check.js games/*.js
// For each game: the class puzzle and five seeded random puzzles are solved;
// the class optimum must equal check.optimum, score(decode(solution)) must
// equal the solver objective, the optimal plan must be feasible, and piece
// keys must be unique.
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
      let plan, objective;
      if (def.optimal) {
        plan = await def.optimal(puzzle);
        objective = def.score(puzzle, plan);
      } else {
        const r = await solve(def.model(puzzle));
        if (r.status !== "Optimal") { fail(`${where}: solver status ${r.status}`); continue; }
        objective = r.objective;
        plan = def.decode(puzzle, r.values);
        const s = def.score(puzzle, plan);
        if (!close(s, objective)) fail(`${where}: score(decode(solution)) = ${s}, solver objective = ${objective}`);
      }
      const ok = def.feasible(puzzle, plan);
      if (ok !== true) fail(`${where}: optimal plan is not feasible: ${ok}`);
      if (label === "class" && !close(objective, def.check.optimum)) {
        fail(`${where}: optimum ${objective}, expected check.optimum ${def.check.optimum}`);
      }
      C.assertUniqueKeys(def.pieces(puzzle, def.start(puzzle), {}));
      C.assertUniqueKeys(def.pieces(puzzle, plan, {}));
      const ins = def.insight(puzzle, plan, plan);
      for (const k of ["diff", "mechanism", "model"]) {
        if (typeof ins[k] !== "string") fail(`${where}: insight().${k} is not a string`);
      }
      if (label === "class") console.log(`ok ${name}: class optimum ${objective}`);
    } catch (err) {
      fail(`${where}: ${err.message}`);
    }
  }
}
process.exitCode = failed ? 1 : 0;
