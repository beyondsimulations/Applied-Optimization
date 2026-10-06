-- game.lua — turns ::: {.game name="x"} into a playable canvas game (html,
-- revealjs) or a one-line link (every other format). Reads a `gamekit:`
-- metadata block (url, telemetry) and injects window.gamekitConfig.

local VERSION = "0.4.6"
local CONFIG = { url = nil, telemetry = nil }

local function attr_escape(s)
  return (tostring(s):gsub("&", "&amp;"):gsub('"', "&quot;"):gsub("<", "&lt;"):gsub(">", "&gt;"))
end

local function Meta(m)
  local g = m.gamekit
  if not g then return nil end
  if g.url then CONFIG.url = pandoc.utils.stringify(g.url) end
  local tel = g.telemetry
  if tel ~= nil then
    if type(tel) == "boolean" then
      CONFIG.telemetry = tel
    elseif type(tel) == "table" and (tel["umami-src"] or tel["umami-website-id"]) then
      CONFIG.telemetry = {
        src = tel["umami-src"] and pandoc.utils.stringify(tel["umami-src"]),
        website = tel["umami-website-id"] and pandoc.utils.stringify(tel["umami-website-id"]),
      }
    else
      -- quoted "false"/"true" arrives as inlines
      CONFIG.telemetry = pandoc.utils.stringify(tel) ~= "false"
    end
  end
  return nil
end

local deps_added = false
local function ensure_deps()
  if deps_added then return end
  deps_added = true
  quarto.doc.add_html_dependency({
    name = "gamekit",
    version = VERSION,
    scripts = { "qr.js", "core.js", "gamekit.js" },
    stylesheets = { "gamekit.css" },
    resources = {
      { name = "solve.js", path = "solve.js" },
      { name = "highs-worker.js", path = "highs-worker.js" },
      { name = "highs.module.js", path = "highs.module.js" },
      { name = "highs.wasm", path = "highs.wasm" },
    },
  })
  local t = CONFIG.telemetry
  local parts = {}
  if t == false then
    parts[#parts + 1] = '"telemetry":false'
  end
  quarto.doc.include_text("in-header",
    "<script>window.gamekitConfig={" .. table.concat(parts, ",") .. "};</script>")
  if type(t) == "table" and t.src and t.website then
    quarto.doc.include_text("in-header", string.format(
      '<script defer src="%s" data-website-id="%s"></script>',
      attr_escape(t.src), attr_escape(t.website)))
  end
end

local function Div(el)
  if not el.classes:includes("game") then return nil end
  local name = el.attributes["name"]
  if not name or not name:match("^[%w_-]+$") then
    error('gamekit: ::: {.game} needs name="..." (letters, digits, - or _)')
  end
  local offset = quarto.project.offset or "."
  -- revealjs first: is_format("html") is also true for revealjs.
  local slide = quarto.doc.is_format("revealjs")
  local web = quarto.doc.is_format("html") and not quarto.doc.is_format("epub")
  if slide or web then
    ensure_deps()
    -- the slide QR code links to the public page when gamekit.url is set, so
    -- slides exported or presented from a local server still work for phones
    local qr = ""
    if slide and CONFIG.url then
      qr = string.format(' data-qr="%s/games/%s.html"', attr_escape((CONFIG.url:gsub("/+$", ""))), name)
    end
    return pandoc.RawBlock("html", string.format(
      '<div class="gamekit%s" data-game="%s" data-page="%s/games/%s.html"%s%s></div>\n' ..
      '<script src="%s/games/%s.js"></script>',
      slide and " gamekit-slide" or "", name, offset, name,
      slide and " data-prevent-swipe" or "", qr, offset, name))
  end
  local base = CONFIG.url and CONFIG.url:gsub("/+$", "") or nil
  if not base then
    quarto.log.warning("gamekit: set `gamekit: url:` in _quarto.yml for absolute game links in " .. FORMAT)
    base = offset
  end
  local target = base .. "/games/" .. name .. ".html"
  return pandoc.Para({ pandoc.Str("Play:"), pandoc.Space(), pandoc.Link(target, target) })
end

-- Meta first (fills CONFIG), then Div.
return { { Meta = Meta }, { Div = Div } }
