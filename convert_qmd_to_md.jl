#!/usr/bin/env julia
#=
Convert .qmd files in a Git repository (respecting .gitignore) to .md files
in a flat output directory using Quarto.
=#

# To run this script, you need to have Quarto and Git installed.
# To execute the script, run the following command in the terminal:
# julia ./convert_qmd_to_md.jl . ../repo-conversion

using ArgParse
using Printf

# Helper to run external command, throws error on failure
function run_cmd_check(cmd::Cmd; cwd::String="", capture_stdout::Bool=false)
    full_cmd = isempty(cwd) ? cmd : `sh -c "cd $(shell_escape(cwd)) && $(cmd)"` # More robust cd
    errmsg = "ERROR: Failed to run command: $cmd" * (isempty(cwd) ? "" : " in directory $cwd")

    try
        if capture_stdout
            # Capture stdout, still throw error on failure
            process = pipeline(full_cmd, stdout=Pipe())
            output = read(process, String)
            if !success(process)
                 @error errmsg
                 # Attempt to read stderr if available (might deadlock on some systems/commands)
                 # stderr_output = try read(stderr(process), String) catch; "" end
                 # @error "Stderr: $stderr_output"
                 error("Command failed with non-zero exit code.") # Trigger catch block
            end
            return strip(output)
        else
            # Just run, check success
            run(full_cmd) # Throws ProcessFailedException on non-zero exit
            return "" # Return empty string for consistency if not capturing
        end
    catch e
        if e isa ProcessFailedException
             @error errmsg * "\nProcess exited with an error."
             # ProcessFailedException doesn't easily expose stderr, depends on how `run` was called
        elseif e isa UVError # Often related to file not found (like `git` or `quarto` command)
            @error errmsg * "\nCommand probably not found: $(cmd.exec[1]). Is it installed and in PATH?"
        else
            @error errmsg * "\nUnexpected error: $e"
        end
        rethrow() # Propagate the error to stop the script
    end
end

# Helper function to safely escape paths for shell commands if needed
# Basic version for common cases, might need refinement for edge cases
function shell_escape(s::AbstractString)
    # Replace single quotes with '\'' (end quote, escaped quote, start quote)
    # Then wrap the whole thing in single quotes.
    escaped = replace(s, '\'' => "'\\''")
    return "'$escaped'"
end


function find_qmd_files(repo_path::String)
    qmd_files = String[]
    @info "Attempting to find tracked files using 'git ls-files'..."
    try
        cd(repo_path) do # Temporarily change directory
            # Run the command and capture stdout
            cmd = `git ls-files`
            output = "" # Initialize output variable
            try
                output = run_cmd_check(cmd, capture_stdout=true)
            catch e
                 @error "Failed to execute git ls-files command inside cd block: $e"
                 # Rethrow or handle appropriately if needed, otherwise continue to see if output was partially captured
                 # For now, just print the error and proceed, output might be empty
            end

            # --- START DEBUG PRINTS ---
            println("\n" * "-"^10 * " DEBUGGING GIT OUTPUT " * "-"^10)
            println("Raw output received from 'git ls-files':")
            println("<<<<")
            println(output)
            println(">>>>")
            # --- END DEBUG PRINTS ---

            all_files_relative = String[] # Initialize
            if !isempty(output)
                all_files_relative = filter!(!isempty, split(output, '\n'))
            end

            # --- START DEBUG PRINTS ---
            println("\nFiles after splitting by newline and removing empty:")
            println(all_files_relative)
            println("-"^40 * "\n")
            # --- END DEBUG PRINTS ---


            qmd_files = filter(f -> endswith(lowercase(f), ".qmd"), all_files_relative)
        end
        @info "Found $(length(qmd_files)) '.qmd' files via git (after filtering)." # Added clarification
    catch e
        # Keep fallback logic just in case cd fails etc.
        @warn "An error occurred during the git ls-files process or fallback scan: $e"
        @warn "Falling back to scanning directory (will NOT respect .gitignore)..."

    end
    return qmd_files
end


function convert_qmd_to_md(repo_path::String, output_dir::String)
    repo_path = abspath(repo_path)
    output_dir = abspath(output_dir)

    @info "Repository Path: $repo_path"
    @info "Output Directory: $output_dir"

    if !isdir(repo_path)
        @error "Repository path '$repo_path' does not exist or is not a directory."
        exit(1)
    end

    # 1. Create the output directory if it doesn't exist
    mkpath(output_dir)
    @info "Ensured output directory exists: $output_dir"

    # 2. Find .qmd files (respecting .gitignore if possible)
    qmd_files = find_qmd_files(repo_path)

    if isempty(qmd_files)
        @info "No .qmd files found."
        return
    end

    # 3. Convert each .qmd file
    success_count = 0
    fail_count = 0

    for qmd_relative_path in qmd_files
        qmd_full_path = joinpath(repo_path, qmd_relative_path)
        @info "\nProcessing: $qmd_relative_path"

        # Construct a unique flat output filename
        flat_name_base = replace(qmd_relative_path, r"[/\\]" => "_") # Replace / or \ with _
        target_md_filename = splitext(flat_name_base)[1] * ".md"
        target_md_path = joinpath(output_dir, target_md_filename)

        # Quarto usually creates the output file in the same directory as the input
        # Default output is often named like the input but with .md extension
        temp_md_path = splitext(qmd_full_path)[1] * ".md"
        # Handle index.qmd -> index.md special case (Quarto might name output index.md)
        temp_md_path_alt = ""
        if lowercase(basename(qmd_full_path)) == "index.qmd"
             temp_md_path_alt = joinpath(dirname(qmd_full_path), "index.md")
        end


        render_command = `quarto render $(qmd_full_path) --to gfm`
        @info "  Running: $render_command"

        try
            # Run Quarto - use full path, default cwd should be fine
            run_cmd_check(render_command)

            # Check if the expected output file was created and find correct name
            actual_temp_md_path = ""
            if isfile(temp_md_path)
                actual_temp_md_path = temp_md_path
            elseif !isempty(temp_md_path_alt) && isfile(temp_md_path_alt)
                 actual_temp_md_path = temp_md_path_alt
            else
                 @warn "  Quarto ran but expected output not found at '$temp_md_path'" *
                       (isempty(temp_md_path_alt) ? "" : " or '$temp_md_path_alt'")
                 fail_count += 1
                 continue # Skip moving
            end

            # Move the generated .md file
            @info "  Moving '$(basename(actual_temp_md_path))' to '$target_md_path'"
            mv(actual_temp_md_path, target_md_path, force=true) # force=true overwrites if target exists
            success_count += 1

        catch e
            @error "  Failed to convert '$qmd_relative_path'."
            # Error details printed by run_cmd_check or caught here
            fail_count += 1
             # Clean up temp file if it exists and wasn't moved
             if isfile(temp_md_path) && temp_md_path != target_md_path
                 try
                     rm(temp_md_path)
                     @info "  Cleaned up potential temporary file: $temp_md_path"
                 catch rm_err
                     @warn "  Failed to clean up temporary file $temp_md_path: $rm_err"
                 end
             end
             if !isempty(temp_md_path_alt) && isfile(temp_md_path_alt) && temp_md_path_alt != target_md_path
                 try
                     rm(temp_md_path_alt)
                     @info "  Cleaned up potential temporary file: $temp_md_path_alt"
                 catch rm_err
                     @warn "  Failed to clean up temporary file $temp_md_path_alt: $rm_err"
                 end
             end
        end
    end

    println("\n" * "="^20 * " Conversion Summary " * "="^20)
    @printf("Successfully converted: %d\n", success_count)
    @printf("Failed conversions:   %d\n", fail_count)
    @info "Output files are in: $output_dir"
    println("="^60)

    if fail_count > 0
        exit(1) # Exit with error code if failures occurred
    end
end


function parse_commandline()
    s = ArgParseSettings(description = "Convert .qmd files in a Git repository (respecting .gitignore) to .md files in a flat output directory using Quarto.")

    @add_arg_table! s begin
        "repo_path"
            help = "Path to the root of the Git repository."
            required = true
        "output_dir"
            help = "Path to the directory where the flattened .md files will be saved."
            required = true
    end

    return parse_args(s)
end

function main()
    parsed_args = parse_commandline()
    repo_path = parsed_args["repo_path"]
    output_dir = parsed_args["output_dir"]
    convert_qmd_to_md(repo_path, output_dir)
end

# Run the main function only when the script is executed directly
if abspath(PROGRAM_FILE) == @__FILE__
    main()
end