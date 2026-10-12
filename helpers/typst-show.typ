// Copied into every lecture's helpers/ and wired into its _quarto.yml by
// scripts/sync-typst.py. Edit it here, not in a lecture.
//
// Reading PDFs that follow the website: this partial replaces Quarto's
// typst-show.typ, the piece that calls the page template. It is the first
// place after the brand block, so `brand-color` exists here and nowhere
// earlier. Quarto's own template (`article()`) stays as it is and is still
// used for hand-fitted sheets, see below. Fonts, link colour and page fill
// come from _brand.yml as before. typst-classes.lua carries the site's text
// classes over and uses `lecture-colour` from here. Needs a _brand.yml.
//
// This file is a Pandoc template: a dollar sign starts a variable, so the
// Typst code in it must not use one. Written against Quarto 1.10.18.

#let lecture-palette(brand) = {
  let c(name, fallback) = brand.at(name, default: fallback)
  let ink = c("foreground", rgb("#363d45"))
  let paper = c("background", white)
  (
    ink: ink,
    paper: paper,
    muted: color.mix((ink, 72%), (paper, 28%)),   // header, footer, subtitle
    rule: color.mix((ink, 16%), (paper, 84%)),    // hairlines
    highlight: c("linkColor", rgb("#9e2b2b")),    // .highlight, .errors
    task: rgb("#b25f00"),                         // .task      = lec-task in _core.scss
    question: c("greyer", rgb("#3d5369")),        // .question
    plate: c("darker", ink),                      // .invert-font
    code-ground: c("codeline", luma(245)),
    code-edge: c("threeLight", c("tertiary", ink)),  // = lec-code-border
    code-inline: rgb("#4b7282"),                  // = lec-code-inline (AA on codeline)
  )
}

#let lecture-colour = lecture-palette(brand-color)

// Everything Quarto's own typst-show.typ passes to article(), collected once
// so that both layouts below get the same values. The lines between the
// parentheses are Quarto 1.10.18's, unchanged; keep them in step with it.
#let quarto-args = (
$if(title)$
  title: [$title$],
$endif$
$if(subtitle)$
  subtitle: [$subtitle$],
$endif$
$if(by-author)$
  authors: (
$for(by-author)$
$if(it.name.literal)$
    ( name: [$it.name.literal$],
      affiliation: [$for(it.affiliations)$$it.name$$sep$, $endfor$],
      email: [$it.email$] ),
$endif$
$endfor$
    ),
$endif$
$if(date)$
  date: [$date$],
$endif$
$if(lang)$
  lang: "$lang$",
$endif$
$if(region)$
  region: "$region$",
$endif$
$if(abstract)$
  abstract: [$abstract$],
  abstract-title: "$labels.abstract$",
$endif$
$if(mainfont)$
  font: ("$mainfont$",),
$elseif(brand.typography.base.family)$
  font: $brand.typography.base.family$,
$endif$
$if(fontsize)$
  fontsize: $fontsize$,
$elseif(brand.typography.base.size)$
  fontsize: $brand.typography.base.size$,
$endif$
$if(title)$
$if(brand.typography.headings.family)$
  heading-family: $brand.typography.headings.family$,
$elseif(mainfont)$
  heading-family: ("$mainfont$",),
$endif$
$if(brand.typography.headings.weight)$
  heading-weight: $brand.typography.headings.weight$,
$endif$
$if(brand.typography.headings.style)$
  heading-style: "$brand.typography.headings.style$",
$endif$
$if(brand.typography.headings.color)$
  heading-color: $brand.typography.headings.color$,
$endif$
$if(brand.typography.headings.line-height)$
  heading-line-height: $brand.typography.headings.line-height$,
$endif$
$endif$
$if(section-numbering)$
  sectionnumbering: "$section-numbering$",
$endif$
$if(mathfont)$
  mathfont: ($for(mathfont)$"$mathfont$",$endfor$),
$endif$
$if(codefont)$
  codefont: ($for(codefont)$"$codefont$",$endfor$),
$elseif(brand.typography.monospace.family)$
  codefont: $brand.typography.monospace.family$,
$endif$
$if(linestretch)$
  linestretch: $linestretch$,
$endif$
$if(thanks)$
  thanks: [$thanks$],
$endif$
$if(linkcolor)$
  linkcolor: [$linkcolor$],
$endif$
$if(citecolor)$
  citecolor: [$citecolor$],
$endif$
$if(filecolor)$
  filecolor: [$filecolor$],
$endif$
$if(keywords)$
  keywords: ($for(keywords)$"$keywords$",$endfor$),
$endif$
$if(toc)$
  toc: $toc$,
$endif$
$if(toc-title)$
  toc_title: [$toc-title$],
$endif$
$if(toc-indent)$
  toc_indent: $toc-indent$,
$endif$
  toc_depth: $toc-depth$,
)

// Which layout a page gets. An exam or a printed form is fitted to its pages
// by hand, and such a page sets its own margins: it keeps Quarto's layout
// exactly, so it still fits. Everything else gets the lecture layout. A page
// with its own margins that should get the lecture layout anyway (a
// cheatsheet may run to a second page) says `pdf-template: true`.
#let lecture-plain = $if(pdf-template)$false$else$$if(margin)$true$else$false$endif$$endif$

// Quarto would put the logo behind every page; the lecture layout shows it
// in the title block, a hand-fitted sheet not at all.
#set page(background: none)
// Callouts as on the site (`callout-appearance: simple`): a bar in the callout
// colour, a bold title, no box. Quarto passes the brand's colour as icon_color.
// A hand-fitted sheet keeps Quarto's boxed callout.
#let quarto-callout = callout
#let lecture-callout(body: [], title: "Callout", background_color: none, icon: none, icon_color: black, body_background_color: none) = block(
  width: 100%,
  breakable: false,
  above: 1.3em,
  below: 1.3em,
  stroke: (left: 3pt + icon_color),
  inset: (left: 10pt, right: 4pt, y: 4pt),
  {
    block(below: 0.6em, text(weight: "semibold")[#if icon != none [#text(fill: icon_color)[#icon]#h(0.45em)]#title])
    if body != [] { body }
  },
)
#let callout = if lecture-plain { quarto-callout } else { lecture-callout }

// Takes what Quarto's article() takes, plus `colour` and `logo`; parameters
// this layout does not use fall into `rest`.
#let lecture-article(
  doc,
  title: none,
  subtitle: none,
  authors: none,
  date: none,
  lang: "en",
  region: "US",
  font: none,
  fontsize: 10.5pt,
  heading-family: none,
  heading-weight: "semibold",
  heading-color: black,
  codefont: none,
  mathfont: none,
  sectionnumbering: none,
  toc: false,
  toc_title: none,
  toc_depth: none,
  toc_indent: 1.5em,
  colour: lecture-palette((:)),
  logo: none,
  ..rest,
) = {
  let names = if authors != none and authors != () { authors.map(a => a.name).join(", ") }

  set document(title: title)
  set document(author: authors.map(a => content-to-string(a.name)).join(", ")) if names != none

  // Running header from page 2 on (page 1 has the title block): course left,
  // lecture right. Footer: authors left, page of pages right. Quarto would put
  // the logo behind every page, where it collides with the header; it goes
  // into the title block instead. All sizes follow the page's font size.
  set page(
    header: context {
      if counter(page).get().first() > 1 {
        set text(size: fontsize * 0.81, fill: colour.muted)
        grid(columns: (1fr, auto), column-gutter: 1em, subtitle, title)
        v(-0.55em)
        line(length: 100%, stroke: 0.4pt + colour.rule)
      }
    },
    footer: context {
      set text(size: fontsize * 0.81, fill: colour.muted)
      grid(
        columns: (1fr, auto),
        column-gutter: 1em,
        names,
        [#counter(page).display("1") / #counter(page).final().first()],
      )
    },
  )

  set text(lang: lang, region: region, size: fontsize)
  set text(font: font) if font != none
  // Ragged right like the site; justified lines hyphenate hard in a narrow column.
  set par(justify: false, leading: 0.7em, spacing: 1.1em)
  set list(indent: 0.5em, body-indent: 0.6em)
  set enum(indent: 0.5em, body-indent: 0.6em)
  show math.equation: set text(font: mathfont) if mathfont != none

  // Headings: a section opens with air above it, a slide title sits on a
  // hairline as the site's h2 does.
  set heading(numbering: sectionnumbering)
  show heading: set text(weight: heading-weight)
  show heading: set text(font: heading-family) if heading-family != none
  show heading: set text(fill: heading-color) if heading-color != black
  show heading.where(level: 1): set text(size: fontsize * 1.52)
  show heading.where(level: 1): set block(above: 2.1em, below: 1em)
  show heading.where(level: 2): set text(size: fontsize * 1.19)
  show heading.where(level: 2): it => block(
    width: 100%,
    above: 1.8em,
    below: 0.9em,
    sticky: true,
    stroke: (bottom: 0.4pt + colour.rule),
    inset: (bottom: 0.5em),
    it,
  )
  show heading.where(level: 3): set text(size: fontsize * 1.05)
  show heading.where(level: 3): set block(above: 1.5em, below: 0.7em)

  // Code. Quarto draws highlighted code as a block on the codeline ground with
  // a 2pt radius; that is the handle for the left edge the site puts on it.
  // Inline code takes the shade that passes AA on that ground.
  show raw: set text(font: codefont) if codefont != none
  show raw.where(block: false): set text(fill: colour.code-inline)
  show block.where(fill: colour.code-ground, radius: 2pt): set block(
    stroke: (left: 2.5pt + colour.code-edge),
  )

  // Tables: the header rule comes from Quarto; hairlines between body rows.
  set table(stroke: (x, y) => if y > 1 { (top: 0.3pt + colour.rule) })
  show figure.caption: set text(size: 0.9em, fill: colour.muted)

  // Title block: left-aligned as on the page, the logo beside it, closed by a
  // rule. Placed as Quarto places its own, so it spans both columns of a
  // two-column page.
  if title != none {
    place(top, float: true, scope: "parent", clearance: 1.6em, block(width: 100%, {
      set par(leading: 0.5em, spacing: 0.7em)
      grid(
        columns: (1fr, auto),
        column-gutter: 1.5em,
        align: (left + bottom, right + bottom),
        {
          {
            set text(font: heading-family) if heading-family != none
            set text(fill: heading-color) if heading-color != black
            text(size: fontsize * 2, weight: heading-weight, title)
          }
          if subtitle != none {
            parbreak()
            text(size: fontsize * 1.19, fill: colour.muted, subtitle)
          }
          if names != none or date != none {
            parbreak()
            text(size: fontsize * 0.9, fill: colour.muted, [#names#if names != none and date != none [ · ]#date])
          }
        },
        logo,
      )
      v(0.3em)
      line(length: 100%, stroke: 0.6pt + colour.rule)
    }))
  }

  if toc {
    block(below: 2em, outline(title: toc_title, depth: toc_depth, indent: toc_indent))
  }

  doc
}

#show: doc => if lecture-plain { article(..quarto-args, doc) } else {
  lecture-article(
    ..quarto-args,
    colour: lecture-colour,
$if(logo.path)$
    logo: image("$logo.path$", height: 1.5cm$if(logo.alt)$, alt: "$logo.alt$"$endif$),
$endif$
    doc,
  )
}
