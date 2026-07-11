#!/usr/bin/env python3
import shutil
from pathlib import Path

def copy_md_files():
    """Copy all .md files from _site to _repo-md, maintaining structure.

    The files are copied (not moved): `quarto preview` stats the rendered
    outputs in _site after post-render, so removing them breaks the preview
    server. Copying also keeps _repo-md complete across partial renders.
    """

    site_dir = Path("_site")
    output_dir = Path("_repo-md")

    if not site_dir.exists():
        print(f"Site directory {site_dir} does not exist")
        return

    md_files = list(site_dir.rglob("*.md"))

    if not md_files:
        print("No .md files found")
        return

    print(f"Copying {len(md_files)} .md files...")

    for md_file in md_files:
        relative_path = md_file.relative_to(site_dir)
        target_path = output_dir / relative_path
        target_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(str(md_file), str(target_path))
        print(f"Copied: {relative_path}")

    print(f"Done! Files copied to {output_dir}")

if __name__ == "__main__":
    copy_md_files()
