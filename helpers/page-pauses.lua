-- Copied into every lecture by scripts/sync-filters.py. Edit it here.
--
-- A slide pause (`. . .` on a line of its own) means something on a deck only.
-- Everywhere else (HTML page, PDF, Markdown) it prints as three dots between
-- two paragraphs: drop the paragraph. The slides keep it.
if quarto.doc.is_format("revealjs") then
  return {}
end

function Para(el)
  if pandoc.utils.stringify(el) == ". . ." then
    return {}
  end
end
