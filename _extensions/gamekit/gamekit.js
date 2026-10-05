// gamekit.js — browser runtime. Mounts every .gamekit div, runs play mode and
// the shared reveal: Lock → Think → Morph → Toggle → Why?
(function () {
  "use strict";
  const C = globalThis.GamekitCore;
  const BASE = document.currentScript ? document.currentScript.src : location.href;
  const TOKENS = ["accent", "neutral", "text", "muted", "bg", "good", "bad"];
  const THINK_MS = 1000;
  const MORPH_MS = 2000;
  const TOGGLE_MS = 400;
  const COMPACT_W = 600; // screens narrower than this (phones) use the compact layout
  const defs = {};
  const views = [];

  window.Gamekit = { game(name, def) { defs[name] = def; } };

  // ---------- solver (HiGHS in a module worker) ----------
  let worker = null;
  let nextId = 1;
  const pending = new Map();
  function getWorker() {
    if (worker) return worker;
    worker = new Worker(new URL("highs-worker.js", BASE), { type: "module" });
    worker.onmessage = (e) => {
      const job = pending.get(e.data.id);
      if (!job) return;
      pending.delete(e.data.id);
      if (e.data.error) job.reject(new Error(e.data.error));
      else job.resolve(e.data.result);
    };
    worker.onerror = (e) => {
      // Drop the dead worker so the next solve starts a fresh one.
      worker.terminate();
      worker = null;
      for (const job of pending.values()) job.reject(new Error(e.message || "The solver failed to load."));
      pending.clear();
    };
    return worker;
  }
  function solveLP(lp) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      getWorker().postMessage({ id, lp });
    });
  }
  const WARMUP = "Minimize\n obj: x\nSubject To\n c: x >= 0\nEnd\n";

  // ---------- telemetry (same rules as quizkit) ----------
  function track(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
    const cfg = window.gamekitConfig || {};
    if (window.umami && cfg.telemetry !== false) {
      try { window.umami.track(event, data); } catch (e) { /* never break a game */ }
    }
  }

  // ---------- helpers ----------
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function el(tag, attrs, text) {
    const n = document.createElement(tag);
    for (const k in attrs || {}) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function readColors(root) {
    const cs = getComputedStyle(root);
    const probe = document.createElement("canvas").getContext("2d");
    const rgb = {};
    for (const t of TOKENS) {
      probe.fillStyle = "#000";
      probe.fillStyle = cs.getPropertyValue("--gk-" + t).trim() || "#000";
      rgb[t] = C.parseColor(probe.fillStyle) || [0, 0, 0, 1];
    }
    return rgb;
  }
  // A score line: small label, large value (e.g. "Optimal" / "225,460 €").
  function setScore(node, label, value) {
    node.replaceChildren(el("span", { class: "gk-label" }, label), el("span", { class: "gk-value" }, value));
  }
  const cssOf = (rgb) => {
    const out = {};
    for (const t in rgb) out[t] = C.css(rgb[t]);
    return out;
  };

  // ---------- one game on the page ----------
  function mount(root) {
    const def = defs[root.dataset.game];
    if (!def) {
      root.textContent = `Gamekit: game "${root.dataset.game}" was not found.`;
      return;
    }
    const g = { def, root, ui: {}, phase: "play", started: false, revealed: false, skip: false, raf: 0, run: 0 };
    views.push(g);

    // DOM: task line, then the board (stage) and a side block with scores,
    // buttons and status. On pages the side block is a bar under the board;
    // on slides it is a column right of the board, with the QR code on top.
    root.innerHTML = "";
    const slide = root.classList.contains("gamekit-slide");
    g.slide = slide;
    // the game's own phone page (games/<name>.html), as opposed to a lecture page
    g.solo = new URL(root.dataset.page, location.href).pathname === location.pathname;
    root.classList.toggle("gamekit-solo", g.solo);
    // the task is the same text everywhere; the slide or page heading carries the title
    const task = el("p", { class: "gamekit-task" }, def.task);
    const main = el("div", { class: "gamekit-main" });
    const stage = el("div", { class: "gamekit-stage" });
    g.canvas = el("canvas", { role: "img", "aria-label": `${def.title}: ${def.task}` });
    g.card = el("div", { class: "gamekit-card", hidden: "" });
    stage.append(g.canvas, g.card);
    const side = el("div", { class: "gamekit-side" });
    if (slide && window.qrcode) side.append(qrBlock(root));
    const scores = el("div", { class: "gamekit-scores" });
    g.you = el("div", { class: "gamekit-score gk-you" });
    g.opt = el("div", { class: "gamekit-score gk-opt", hidden: "" });
    scores.append(g.you, g.opt);
    const buttons = el("div", { class: "gamekit-buttons" });
    g.btn = {
      optimize: el("button", { type: "button", class: "gk-primary" }, "Optimize"),
      toggle: el("button", { type: "button", hidden: "" }, "Show yours"),
      why: el("button", { type: "button", hidden: "" }, "Why?"),
      reset: el("button", { type: "button" }, "Reset"),
      fresh: el("button", { type: "button" }, "New puzzle"),
    };
    buttons.append(g.btn.optimize, g.btn.toggle, g.btn.why, g.btn.reset, g.btn.fresh);
    g.status = el("p", { class: "gamekit-status" });
    g.sr = el("p", { class: "gamekit-sr", "aria-live": "polite" });
    // everything that reports state first, the buttons always last (bottom right)
    const info = el("div", { class: "gamekit-info" });
    info.append(scores, g.status);
    side.append(info, buttons, g.sr);
    g.side = side;
    // left: task text and board; right (slides) or below (pages): the side block
    const play = el("div", { class: "gamekit-play" });
    play.append(task, stage);
    main.append(play, side);
    root.append(main);

    layout(g);
    g.ctx = g.canvas.getContext("2d");
    g.colors = readColors(root);
    g.css = cssOf(g.colors);
    g.font = getComputedStyle(root).fontFamily || "sans-serif";

    // events
    g.btn.optimize.addEventListener("click", () => optimize(g));
    g.btn.toggle.addEventListener("click", () => toggle(g));
    g.btn.why.addEventListener("click", () => why(g));
    g.btn.reset.addEventListener("click", () => setPuzzle(g, g.puzzle, g.kind, false));
    g.btn.fresh.addEventListener("click", () => {
      const seed = (Math.random() * 4294967296) >>> 0;
      setPuzzle(g, def.puzzle(C.rng(seed)), "random", true);
    });
    g.card.addEventListener("click", () => { if (g.revealed) g.card.hidden = true; });
    stage.addEventListener("pointerdown", () => { if (g.phase === "think" || g.phase === "morph") g.skip = true; });
    g.canvas.addEventListener("pointerdown", (e) => onPointer(g, e, "down"));
    g.canvas.addEventListener("pointermove", (e) => { if (e.buttons) onPointer(g, e, "move"); });
    g.canvas.addEventListener("pointerup", (e) => onPointer(g, e, "up"));

    // repaint when the canvas changes size, e.g. a hidden tab or callout opens
    if ("ResizeObserver" in window) new ResizeObserver(() => redraw(g)).observe(g.canvas);

    // warm the solver when the game first scrolls into view
    if (def.model && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          io.disconnect();
          solveLP(WARMUP).catch(() => {});
        }
      });
      io.observe(root);
    }

    setPuzzle(g, def.class, "class", true);
  }

  // QR code as one SVG path in the text color, without its own quiet zone (the
  // column's whitespace provides it), so its edges line up with the scores and
  // buttons below it.
  function qrBlock(root) {
    const url = root.dataset.qr || new URL(root.dataset.page, location.href).href;
    const qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();
    const n = qr.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    // not <aside>: Quarto styles slide asides as margin notes
    const box = el("div", { class: "gamekit-qr", role: "img", "aria-label": "QR code: " + url });
    box.innerHTML = `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`;
    return box;
  }

  function setPuzzle(g, puzzle, kind, isNew) {
    cancelAnimationFrame(g.raf);
    g.run++; // invalidates a solve that is still in flight
    g.puzzle = puzzle;
    g.kind = kind;
    g.plan = g.def.start(puzzle);
    g.ui = {};
    g.phase = "play";
    g.revealed = false;
    g.yours = g.optimal = null;
    if (isNew) g.started = false;
    g.card.hidden = true;
    g.btn.toggle.hidden = g.btn.why.hidden = true;
    g.btn.optimize.hidden = false;
    g.opt.hidden = true;
    update(g);
  }

  // ---------- drawing ----------
  // Compact (phone) layout on screens narrower than COMPACT_W (the screen, not
  // the column: desktop article columns can be narrow too); a game may then use
  // its taller compactBoard. Pages size the canvas by the board's
  // shape; slides let it fill the stage (drawing is letterboxed).
  function layout(g) {
    const compact = !g.slide && window.innerWidth < COMPACT_W;
    if (compact === g.compact && g.board) return;
    g.compact = compact;
    g.root.classList.toggle("gamekit-compact", compact);
    g.board = (compact && g.def.compactBoard) || g.def.board;
    g.canvas.dataset.board = `${g.board.w}x${g.board.h}`; // for tests
    if (!g.slide) g.canvas.style.aspectRatio = `${g.board.w} / ${g.board.h}`;
    if (g.side) reserveBottom(g);
  }
  function fit(g) {
    const r = g.canvas.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    const size = C.pixelSize(r.width, r.height, window.devicePixelRatio || 1);
    if (g.canvas.width !== size.w || g.canvas.height !== size.h) {
      g.canvas.width = size.w;
      g.canvas.height = size.h;
    }
    // A stretching board grows wider to fill a wider slide stage, so it lines
    // up with the task text; the game lays out with view.w. Not mid-morph: the
    // frames were built for the old width (animate repaints at the end).
    if (g.slide && g.def.board.stretch && g.phase !== "morph") {
      const base = g.def.board;
      g.board = { w: Math.max(base.w, (base.h * size.w) / size.h), h: base.h };
      g.canvas.dataset.board = `${+g.board.w.toFixed(2)}x${g.board.h}`; // for tests
    }
    // Uniform scale, centred: the board never distorts, whatever box CSS gives the canvas.
    g.px = Math.min(size.w / g.board.w, size.h / g.board.h);
    g.ox = (size.w - g.board.w * g.px) / 2;
    g.oy = (size.h - g.board.h * g.px) / 2;
    // the game's text size in board units, so canvas text matches the HTML text
    // exactly; the rect is in screen pixels (reveal scales slides), the font size is not
    const dpr = window.devicePixelRatio || 1;
    const slideScale = g.canvas.offsetWidth ? r.width / g.canvas.offsetWidth : 1;
    g.em = (parseFloat(getComputedStyle(g.root).fontSize) * slideScale) / (g.px / dpr);
    g.canvas.dataset.em = g.em.toFixed(4); // for tests: canvas text size in board units
    return true;
  }
  // em: the game's text size in board units; compact: phone layout
  function view(g) {
    return { w: g.board.w, h: g.board.h, px: g.px, css: g.css, font: g.font, em: g.em || 3, compact: !!g.compact,
      locked: g.phase !== "play" };
  }
  function paint(g, pieces) { // callers fit() first
    const ctx = g.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
    ctx.setTransform(g.px, 0, 0, g.px, g.ox, g.oy);
    const v = view(g);
    ctx.globalAlpha = 1;
    g.def.drawBoard(ctx, g.puzzle, v);
    for (const p of pieces) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      g.def.drawPiece(ctx, p, v);
      ctx.restore();
    }
  }
  function colorsFor(g, role) {
    return Object.assign({}, g.colors, { plan: role === "optimal" ? g.colors.accent : g.colors.neutral });
  }
  function still(g, plan, role) {
    const colors = colorsFor(g, role);
    if (!fit(g)) return;
    paint(g, g.def.pieces(g.puzzle, plan, role === "play" ? g.ui : {}, view(g)).map((p) => C.resolve(p, colors)));
  }
  function redraw(g) {
    layout(g);
    if (g.phase === "play") still(g, g.plan, "play");
    else if (g.phase === "done") still(g, g.showing === "yours" ? g.yours : g.optimal, g.showing);
    else if (g.phase === "think") still(g, g.yours, "yours");
  }
  function redrawAll() { views.forEach(redraw); }

  // ---------- play ----------
  function onPointer(g, e, type) {
    if (g.phase !== "play" || !fit(g)) return;
    const r = g.canvas.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width) * g.canvas.width;
    const dy = ((e.clientY - r.top) / r.height) * g.canvas.height;
    const pt = { type, x: (dx - g.ox) / g.px, y: (dy - g.oy) / g.px };
    const uiBefore = JSON.stringify(g.ui);
    const next = g.def.pointer(g.puzzle, g.plan, g.ui, pt, view(g));
    if (next === undefined && JSON.stringify(g.ui) === uiBefore) return; // nothing changed
    if (next !== undefined) {
      g.plan = next;
      if (!g.started) {
        g.started = true;
        track("game-start", meta(g));
      }
    }
    update(g);
    if (type === "down") keepInView(g);
  }
  // Phone page: scores, status and buttons form a panel fixed to the bottom of
  // the screen. The page reserves its height, and taps keep the whole board
  // above it.
  function reserveBottom(g) {
    g.root.style.paddingBottom = g.solo && g.compact ? `${g.side.offsetHeight + 16}px` : "";
  }
  function keepInView(g) {
    if (!g.compact) return;
    const overlap = g.canvas.getBoundingClientRect().bottom - g.side.getBoundingClientRect().top;
    if (overlap > 0) window.scrollBy({ top: overlap + 8, behavior: reducedMotion() ? "auto" : "smooth" });
  }
  function meta(g) {
    return { page: document.title, game: g.root.dataset.game, puzzle: g.kind };
  }
  function update(g) {
    const ok = g.def.feasible(g.puzzle, g.plan);
    setScore(g.you, "You", C.formatScore(g.def.score(g.puzzle, g.plan), g.def.unit));
    g.btn.optimize.disabled = ok !== true;
    g.status.textContent = ok === true ? "Ready: press Optimize to compare with the best plan." : ok;
    const said = g.def.describe(g.puzzle, g.plan);
    if (g.sr.textContent !== said) g.sr.textContent = said; // identical rewrites can be re-announced
    reserveBottom(g);
    redraw(g);
  }

  // ---------- reveal ----------
  function showCard(g, nodes, think) {
    g.card.replaceChildren(...nodes);
    g.card.classList.toggle("gk-think", !!think);
    g.card.hidden = false;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function optimize(g) {
    if (g.phase !== "play" || g.def.feasible(g.puzzle, g.plan) !== true) return;
    const run = ++g.run;
    g.phase = "think";
    g.skip = false;
    g.ui = {};
    g.yours = g.plan;
    const yourScore = g.def.score(g.puzzle, g.yours);
    g.btn.optimize.disabled = true;
    showCard(g, [el("p", null, "Thinking…")], true);
    redraw(g);
    const t0 = performance.now();
    let line, optScore, pairs;
    try {
      if (g.def.optimal) {
        const s0 = performance.now();
        g.optimal = await g.def.optimal(g.puzzle, g.yours);
        line = g.def.think ? g.def.think(g.puzzle, { plan: g.optimal, ms: performance.now() - s0 }) : "";
      } else {
        // the player's plan is passed on: a game may let the player size the problem
        const r = await solveLP(g.def.model(g.puzzle, g.yours));
        if (r.status !== "Optimal") throw new Error("Solver: " + r.status);
        g.optimal = g.def.decode(g.puzzle, r.values, g.yours);
        line = C.thinkLine(r.counts, r.ms);
      }
      optScore = g.def.score(g.puzzle, g.optimal);
      fit(g); // phase is "think": view(g).locked is already true
      pairs = C.pair(g.def.pieces(g.puzzle, g.yours, {}, view(g)), g.def.pieces(g.puzzle, g.optimal, {}, view(g))); // throws on duplicate keys
    } catch (err) {
      if (run !== g.run) return;
      g.phase = "play";
      g.card.hidden = true;
      update(g);
      g.status.textContent = err.message;
      return;
    }
    if (run !== g.run) return;
    track("game-optimize", Object.assign(meta(g), {
      score: yourScore, optimum: optScore, gap: C.gap(yourScore, optScore),
    }));
    if (line) showCard(g, [el("p", null, line)], true);
    const fast = g.skip || reducedMotion();
    if (!fast) await wait(Math.max(0, THINK_MS - (performance.now() - t0)));
    if (run !== g.run) return;
    g.card.hidden = true;
    g.status.textContent = "";
    g.opt.hidden = false;
    animate(g, g.yours, "yours", g.optimal, "optimal", g.skip || reducedMotion() ? 0 : MORPH_MS, (q) => {
      setScore(g.opt, "Optimal", C.formatScore(yourScore + (optScore - yourScore) * C.ease(q), g.def.unit));
    }, pairs, () => {
      g.showing = "optimal";
      g.revealed = true;
      g.btn.toggle.textContent = "Show yours";
      g.btn.toggle.hidden = g.btn.why.hidden = false;
      if (document.activeElement === g.btn.optimize) g.btn.toggle.focus(); // keep keyboard focus in the game
      g.btn.optimize.hidden = true; // the board is locked until Reset or New puzzle
    });
  }

  // startQ > 0 starts part-way, e.g. when a toggle reverses a running toggle;
  // pairs may be passed in when the caller already built them.
  function animate(g, fromPlan, fromRole, toPlan, toRole, ms, onFrame, pairs, done, startQ) {
    cancelAnimationFrame(g.raf);
    g.phase = "morph";
    if (!pairs) {
      fit(g);
      pairs = C.pair(g.def.pieces(g.puzzle, fromPlan, {}, view(g)), g.def.pieces(g.puzzle, toPlan, {}, view(g)));
    }
    const fromColors = colorsFor(g, fromRole);
    const toColors = colorsFor(g, toRole);
    const t0 = performance.now() - (startQ || 0) * ms;
    const step = (now) => {
      const q = g.skip || !ms ? 1 : Math.min(1, (now - t0) / ms);
      g.q = q;
      if (fit(g)) paint(g, C.frame(pairs, q, fromColors, toColors));
      if (onFrame) onFrame(q);
      if (q < 1) {
        g.raf = requestAnimationFrame(step);
      } else {
        g.phase = "done";
        done();
        if (g.def.board.stretch) redraw(g); // picks up a width change during the morph
      }
    };
    g.raf = requestAnimationFrame(step);
  }

  // Toggle and Why? work any time after the first reveal, also mid-toggle.
  function toggle(g) {
    if (!g.revealed) return;
    const toYours = g.showing === "optimal";
    const from = toYours ? [g.optimal, "optimal"] : [g.yours, "yours"];
    const to = toYours ? [g.yours, "yours"] : [g.optimal, "optimal"];
    const midway = g.phase === "morph" ? 1 - g.q : 0; // reverse from the frame on screen
    g.showing = to[1];
    g.skip = false;
    g.card.hidden = true;
    g.btn.toggle.textContent = toYours ? "Show optimal" : "Show yours";
    animate(g, from[0], from[1], to[0], to[1], reducedMotion() ? 0 : TOGGLE_MS, null, null, () => {}, midway);
  }

  function why(g) {
    if (!g.revealed) return;
    const ins = g.def.insight(g.puzzle, g.yours, g.optimal);
    const para = (str, strong) => {
      const p = el("p");
      for (const s of C.codeSpans(str)) p.append(s.code ? el("code", null, s.text) : document.createTextNode(s.text));
      if (strong) p.style.fontWeight = "600";
      return p;
    };
    showCard(g, [para(ins.diff, true), para(ins.mechanism), para(ins.model)], false);
    track("game-why", meta(g));
  }

  // ---------- startup ----------
  function start() {
    document.querySelectorAll(".gamekit[data-game]").forEach(mount);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  // canvas text uses the page font: repaint once web fonts have loaded
  if (document.fonts) document.fonts.ready.then(redrawAll);
  window.addEventListener("resize", redrawAll);
  // reveal.js loads after this script; attach its hooks once the page is loaded.
  window.addEventListener("load", () => {
    const R = window.Reveal;
    if (R && typeof R.on === "function") {
      for (const ev of ["ready", "slidechanged", "resize"]) {
        try { R.on(ev, redrawAll); } catch (e) { /* older reveal: ignore */ }
      }
    }
    redrawAll();
  });
})();
