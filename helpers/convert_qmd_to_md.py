#!/usr/bin/env python3
import shutil
from pathlib import Path

def move_md_files():
    """Find all .md files in _site and move them to _repo-md maintaining structure."""

    site_dir = Path("_site")
    output_dir = Path("_repo-md")

    if not site_dir.exists():
        print(f"Site directory {site_dir} does not exist")
        return

    # Remove existing output directory if it exists
    if output_dir.exists():
        print(f"Removing existing {output_dir}")
        shutil.rmtree(output_dir)

    # Create output directory
    output_dir.mkdir(exist_ok=True)

    # Find and move all .md files
    md_files = list(site_dir.rglob("*.md"))

    if not md_files:
        print("No .md files found")
        return

    print(f"Moving {len(md_files)} .md files...")

    for md_file in md_files:
        # Get relative path from _site
        relative_path = md_file.relative_to(site_dir)

        # Create target path in _repo-md
        target_path = output_dir / relative_path

        # Create parent directories if needed
        target_path.parent.mkdir(parents=True, exist_ok=True)

        # Move the file
        shutil.move(str(md_file), str(target_path))
        print(f"Moved: {relative_path}")

    print(f"Done! Files moved to {output_dir}")

if __name__ == "__main__":
    move_md_files()
