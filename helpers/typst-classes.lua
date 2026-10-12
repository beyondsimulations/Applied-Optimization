-- Copied into every lecture by scripts/sync-typst.py. Edit it here.
--
-- The site marks text with classes (`[…]{.highlight}`, `.task`, `.question`,
-- `.errors`, and `.invert-font` for a plate). Pandoc drops them on the way to
-- Typst, so in the PDF that emphasis is plain text. This filter writes them
-- out as Typst, in the colours of `lecture-colour`, which typst-show.typ
-- defines, so it needs that partial loaded with it. The site keeps the
-- classes.
if not quarto.doc.is_format("typst") then
  return {}
end

-- class -> key in `lecture-colour`
local COLOUR = { highlight = "highlight", errors = "highlight", task = "task", question = "question" }

local function wrap(raw, open, content, close)
  local out = pandoc.List({ raw("typst", open) })
  out:extend(content)
  out:insert(raw("typst", close))
  return out
end

function Span(el)
  if el.classes:includes("invert-font") then
    return wrap(pandoc.RawInline,
      '#box(fill: lecture-colour.plate, inset: (x: 0.35em), outset: (y: 0.3em))[#text(fill: lecture-colour.paper)[',
      el.content, ']]')
  end
  for class, key in pairs(COLOUR) do
    if el.classes:includes(class) then
      return wrap(pandoc.RawInline,
        '#text(fill: lecture-colour.' .. key .. ', weight: "bold")[', el.content, ']')
    end
  end
end

function Div(el)
  if el.classes:includes("invert-font") then
    return wrap(pandoc.RawBlock,
      '#block(fill: lecture-colour.plate, inset: 0.6em)[#set text(fill: lecture-colour.paper)',
      el.content, ']')
  end
end
