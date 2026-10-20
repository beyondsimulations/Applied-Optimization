// solve.js — solves LP-format text with HiGHS (WebAssembly). Shared by the
// browser worker (highs-worker.js) and the Node checker (check.js).
import loadHighs from "./highs.module.js";

let highsPromise = null;

export async function solve(lpText) {
  if (!highsPromise) {
    // A failed load (e.g. the wasm download broke) is not cached: the next
    // solve retries instead of failing until the page reloads.
    highsPromise = loadHighs().catch((err) => {
      highsPromise = null;
      throw err;
    });
  }
  const highs = await highsPromise;
  const t0 = performance.now();
  const r = highs.solve(lpText);
  const ms = performance.now() - t0;
  // HiGHS answers unparseable LP text with an empty model instead of an error.
  if (r.Status === "Empty") throw new Error("HiGHS read no model: check the game's LP text.");
  const values = {};
  const counts = { binary: 0, integer: 0, continuous: 0, log10Combos: 0 };
  for (const [name, col] of Object.entries(r.Columns || {})) {
    values[name] = col.Primal;
    if (col.Type === "Integer") {
      if (col.Lower === 0 && col.Upper === 1) counts.binary++;
      else counts.integer++;
      counts.log10Combos += Math.log10(Math.floor(col.Upper) - Math.ceil(col.Lower) + 1);
    } else {
      counts.continuous++;
    }
  }
  return { status: r.Status, objective: r.ObjectiveValue, values, ms, counts };
}
