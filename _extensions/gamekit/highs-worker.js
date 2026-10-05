// highs-worker.js — module Web Worker: { id, lp } in, { id, result | error } out.
import { solve } from "./solve.js";

self.onmessage = async (e) => {
  const { id, lp } = e.data;
  try {
    self.postMessage({ id, result: await solve(lp) });
  } catch (err) {
    self.postMessage({ id, error: String((err && err.message) || err) });
  }
};
