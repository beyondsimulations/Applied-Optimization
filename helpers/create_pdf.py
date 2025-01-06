import os
import argparse
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description = "Generate PDF slides from Reveal.js HTML")
parser.add_argument("input", help = "HTML filename", type = os.path.abspath)
parser.add_argument("output", help = "PDF filename", type = os.path.abspath)
args = parser.parse_args()

with sync_playwright() as p:
  browser = p.chromium.launch()
  page = browser.new_page()

  url = "file://" + args.input
  page.goto(url + "?print-pdf", wait_until = "networkidle")
  page.locator(".reveal.ready").wait_for()
  page.pdf(path=args.output, scale=1.5, prefer_css_page_size=True)

'''
decktape reveal _site/part-01/lecture-presentation.html pdf-slides/ao_lecture_01.pdf
decktape reveal _site/part-02/lecture-presentation.html pdf-slides/ao_lecture_02.pdf
decktape reveal _site/part-03/lecture-presentation.html pdf-slides/ao_lecture_03.pdf
decktape reveal _site/part-04/lecture-presentation.html pdf-slides/ao_lecture_04.pdf
decktape reveal _site/part-05/lecture-presentation.html pdf-slides/ao_lecture_05.pdf
decktape reveal _site/part-06/lecture-presentation.html pdf-slides/ao_lecture_06.pdf
decktape reveal _site/part-07/lecture-presentation.html pdf-slides/ao_lecture_07.pdf
decktape reveal _site/part-08/lecture-presentation.html pdf-slides/ao_lecture_08.pdf
decktape reveal _site/part-09/lecture-presentation.html pdf-slides/ao_lecture_09.pdf
decktape reveal _site/part-10/lecture-presentation.html pdf-slides/ao_lecture_10.pdf
decktape reveal _site/part-11/lecture-presentation.html pdf-slides/ao_lecture_11.pdf
decktape reveal _site/part-12/lecture-presentation.html pdf-slides/ao_lecture_12.pdf
decktape reveal _site/part-13/lecture-presentation.html pdf-slides/ao_lecture_13.pdf
'''
