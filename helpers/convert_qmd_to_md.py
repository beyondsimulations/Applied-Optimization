import os
import subprocess
import shutil
import argparse
import sys

# python ./helpers/convert_qmd_to_md.py . ./repo_md --keep-site

def run_command(command, cwd=None):
    """Runs a shell command and returns its output."""
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            check=True,          # Raise exception on non-zero exit code
            capture_output=True, # Capture stdout and stderr
            text=True            # Decode stdout/stderr as text
        )
        print(result.stdout) # Print Quarto's output
        return result.stdout.strip()
    except FileNotFoundError:
        print(f"Error: Command not found: '{command[0]}'. Is it installed and in your PATH?", file=sys.stderr)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {' '.join(command)}", file=sys.stderr)
        print(f"Return code: {e.returncode}", file=sys.stderr)
        print(f"Output:\n{e.stdout}", file=sys.stderr)
        print(f"Error Output:\n{e.stderr}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        sys.exit(1)

def convert_qmd_to_md(repo_path, output_dir, keep_site=False):
    """
    Finds all .qmd files in a git repository (respecting .gitignore),
    renders the entire project using Quarto (to _site), finds the resulting .md files,
    and moves them to a flat output directory with flattened names.
    """
    repo_path = os.path.abspath(repo_path)
    output_dir = os.path.abspath(output_dir)
    site_dir = os.path.join(repo_path, '_site') # Default Quarto output dir

    print(f"Repository Path: {repo_path}")
    print(f"Output Directory: {output_dir}")
    print(f"Expected Quarto output (_site): {site_dir}")

    if not os.path.isdir(repo_path):
        print(f"Error: Repository path '{repo_path}' does not exist or is not a directory.", file=sys.stderr)
        sys.exit(1)

    # 1. Create the final output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    print(f"Ensured output directory exists: {output_dir}")

    # 2. Use 'git ls-files' to get all tracked files (respects .gitignore)
    # We still do this to know *which* qmd files we expect to find corresponding md files for.
    print("Finding tracked files using 'git ls-files'...")
    try:
        all_files_raw = run_command(['git', 'ls-files'], cwd=repo_path)
    except SystemExit:
        print("\nAttempting fallback using os.walk (will NOT respect .gitignore)...", file=sys.stderr)
        all_files_relative = []
        for root, _, files in os.walk(repo_path):
            if '.git' in root.split(os.sep) or '_site' in root.split(os.sep): # Skip .git and potential old _site
                continue
            for file in files:
                full_path = os.path.join(root, file)
                relative_path = os.path.relpath(full_path, repo_path)
                all_files_relative.append(relative_path.replace(os.sep, '/'))
    else:
         all_files_relative = all_files_raw.splitlines()

    # 3. Filter for .qmd files
    qmd_files = [f for f in all_files_relative if f.lower().endswith('.qmd')]

    if not qmd_files:
        print("No .qmd files found in the repository to process.")
        return

    print(f"Found {len(qmd_files)} '.qmd' files tracked by git.")

    # 4. Clean up any previous _site directory
    if os.path.exists(site_dir):
        print(f"Removing existing directory: {site_dir}")
        shutil.rmtree(site_dir)

    # 5. Run Quarto render for the whole project
    render_command = [
        'quarto',
        'render',
        '.',         # Render the current directory (project)
        '--to', 'gfm' # Use GitHub Flavored Markdown
        # No --output needed, will default to _site
    ]
    print(f"\nRunning Quarto project render: {' '.join(render_command)}")
    try:
        run_command(render_command, cwd=repo_path)
        print("Quarto render completed.")
    except SystemExit:
        print("Quarto render failed. Cannot proceed.", file=sys.stderr)
        return # Or sys.exit(1) if preferred

    # 6. Check if _site directory was created
    if not os.path.isdir(site_dir):
        print(f"Error: Quarto ran but the output directory '{site_dir}' was not found.", file=sys.stderr)
        return

    print(f"\nSearching for '.md' files in {site_dir}...")

    # 7. Find, flatten, and move .md files from _site
    success_count = 0
    fail_count = 0
    moved_files = []

    # Create a mapping from potential original qmd path -> actual original qmd path
    # This handles case differences between filesystem and git ls-files
    qmd_map = {f.lower(): f for f in qmd_files}

    for root, _, files in os.walk(site_dir):
        for file in files:
            if file.lower().endswith('.md'):
                md_full_path = os.path.join(root, file)
                # Path relative to _site dir (e.g., 'assignments/assignment-1.md')
                md_relative_to_site = os.path.relpath(md_full_path, site_dir)

                # Reconstruct the potential original qmd path relative to repo root
                # Replace os.sep just in case, and change extension
                potential_original_qmd = os.path.splitext(md_relative_to_site.replace(os.sep, '/'))[0] + '.qmd'

                # Check if this corresponds to a known qmd file (case-insensitive check)
                original_qmd_path = qmd_map.get(potential_original_qmd.lower())

                if original_qmd_path:
                    print(f"  Found: {md_relative_to_site} -> Original: {original_qmd_path}")

                    # Construct the flat output filename
                    flat_name_base = original_qmd_path.replace(os.sep, '_')
                    flat_md_filename = os.path.splitext(flat_name_base)[0] + '.md'
                    target_md_path = os.path.join(output_dir, flat_md_filename)

                    try:
                        print(f"    Moving to: {target_md_path}")
                        shutil.move(md_full_path, target_md_path)
                        success_count += 1
                        moved_files.append(target_md_path)
                    except Exception as e:
                        print(f"    Error moving file {md_full_path}: {e}", file=sys.stderr)
                        fail_count += 1
                else:
                     # This could be an index.html that quarto also generates, or other non-qmd source files
                     print(f"  Skipping: {md_relative_to_site} (No corresponding .qmd found in git ls-files)")


    # 8. Optional: Clean up _site directory
    if not keep_site and os.path.exists(site_dir):
        print(f"\nCleaning up {site_dir}...")
        try:
            shutil.rmtree(site_dir)
            print("Cleanup successful.")
        except Exception as e:
            print(f"Warning: Failed to remove {site_dir}: {e}", file=sys.stderr)

    print(f"\nProcessing Summary:")
    print(f"  Successfully moved: {success_count}")
    print(f"  Failed moves:       {fail_count}")
    # Check if all original qmd files resulted in a moved md file
    expected_moved_count = len(qmd_files)
    if success_count < expected_moved_count:
         print(f"  Warning: Expected {expected_moved_count} files based on .qmd input, but only moved {success_count}.")

    print(f"Output files are in: {output_dir}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Render a Quarto project, then find, flatten, and move resulting .md files from _site to a specified output directory.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument(
        "repo_path",
        help="Path to the root of the Git repository (or Quarto project)."
    )
    parser.add_argument(
        "output_dir",
        help="Path to the directory where the flattened .md files will be saved."
    )
    parser.add_argument(
        "--keep-site",
        action="store_true",
        help="Do not delete the _site directory after processing."
    )

    args = parser.parse_args()

    convert_qmd_to_md(args.repo_path, args.output_dir, args.keep_site)