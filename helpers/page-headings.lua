-- On pages (HTML, PDF), a section's first slide titles are dropped when they
-- only repeat the section title: "Literature" or "Literature II" under the
-- section "Literature". On a page they read as the same heading twice. The
-- slides keep them.
--
-- In the PDF, the reference list then sits under that "Literature" section
-- instead of Typst's own "Bibliography" title, if it is the last section.
if quarto.doc.is_format("revealjs") then
  return {}
end

local function repeats(title, section)
  return title == section or title:match("^(.*) [IVX]+$") == section
end

function Pandoc(doc)
  local section, last_section, blocks = nil, nil, {}
  for _, block in ipairs(doc.blocks) do
    local drop = false
    if block.t == "Header" and block.level == 1 then
      section = pandoc.utils.stringify(block)
      last_section = section
    elseif block.t == "Header" and block.level == 2 then
      drop = section ~= nil and repeats(pandoc.utils.stringify(block), section)
      if not drop then
        section = nil -- a slide with its own title ends the section's opening
      end
    end
    if not drop then
      blocks[#blocks + 1] = block
    end
  end
  if quarto.doc.is_format("typst") and last_section == "Literature" then
    blocks[#blocks + 1] = pandoc.RawBlock("typst", "#set bibliography(title: none)")
  end
  doc.blocks = blocks
  return doc
end
