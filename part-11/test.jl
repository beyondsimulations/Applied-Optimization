using JuMP
using HiGHS

# Model
arena_model = Model(HiGHS.Optimizer)

# Sets
row_set = 1:10
col_set = 1:10

# Group data
groups = ["a", "b", "c", "d", "e", "f", "g"]
req_seats = Dict("a" => 1, "b" => 2, "c" => 2, "d" => 4, "e" => 4, "f" => 6, "g" => 6)
scores = Dict("a" => 1, "b" => 2, "c" => 4, "d" => 4, "e" => 5, "f" => 6, "g" => 12)
availability = Dict("a" => 3, "b" => 2, "c" => 3, "d" => 5, "e" => 2, "f" => 1, "g" => 1)

# Variables
@variable(arena_model, x[groups, row_set, col_set], Bin)

# Parameters
h = 1  # horizontal safety distance
b = 1  # vertical safety distance
p = 2  # max groups per row

# Objective
@objective(arena_model, Max, sum(scores[g] * x[g,r,c] for g in groups, r in row_set, c in col_set if c<=maximum(col_set)-req_seats[g]+1))

# Constraints
# Each group can only be assigned once
@constraint(arena_model, [g in groups], 
    sum(x[g,r,c] for r in row_set, c in col_set) <= availability[g])

# Maximum groups per row
@constraint(arena_model, [r in row_set],
    sum(x[g,r,c] for g in groups, c in col_set) <= p)

# Horizontal and vertical social distancing
@constraint(arena_model, [r in row_set, c in col_set],
    sum(x[g,rr,cc] for g in groups, 
        rr in max(1,r-b):r, 
        cc in max(1,c-req_seats[g]+1-h):c) <= 1)

# Define blocked seats (coordinates [row, column])
blocked_seats = [
    (1, 1),(1, 2),(1,9),(1,10), 
    (6, 5),(6,6), 
    (7, 5),(7,6), 
]

# Constraints to prevent assignments to blocked seats
@constraint(arena_model, [g in groups, (r,c) in blocked_seats], 
    x[g,r,c] == 0)

# Solve the model
optimize!(arena_model)

using Plots

# Create visualization of the solution
function visualize_seating(model)
    # Get solution values
    solution_matrix = fill("", 10, 10)
    
    # Fill matrix with group assignments
    for r in 1:10, c in 1:10
        for g in groups
            if value(model[:x][g,r,c]) > 0.5  # Using 0.5 to handle floating point
                solution_matrix[r,c] = g
            end
        end
    end
    
    # Create color mapping for groups
    color_map = Dict(
        "" => :white,  # Empty seats
        "a" => :blue,
        "b" => :green,
        "c" => :red,
        "d" => :purple,
        "e" => :orange,
        "f" => :yellow,
        "g" => :pink
    )
    
    # Mark blocked seats
    for (r,c) in blocked_seats
        solution_matrix[r,c] = ""  # Empty string for blocked seats
    end
    
    # Create plot
    p = plot(
        aspect_ratio=:equal,
        xlims=(0.5,10.5),
        ylims=(0.5,10.5),
        yflip=true,  # Flip y-axis to match traditional seating layout
        legend=:outerright
    )
    
    # Plot seats
    for r in 1:10, c in 1:10
        group = solution_matrix[r,c]
        if group != ""
            group_length = req_seats[group]
            for i in 1:group_length
                if c+i-1 <= 10
                    println("Group $group in $r,$(c+i-1)")
                    scatter!([c+i-1], [r], 
                            color=color_map[group],
                            label=nothing,
                            markersize=10,
                            markershape=:square)
                end
            end
        else
            # Plot empty or blocked seats
            is_blocked = (r,c) in blocked_seats
            if is_blocked
                println("Blocked seat in $r,$c")
                scatter!([c], [r], 
                        color=is_blocked ? :gray : :white,
                        markersize=10,
                        markershape=:square,
                        label= nothing)
            end
        end
    end
    
    title!("Arena Seating Layout")
    xlabel!("Column")
    ylabel!("Row")
    
    return p
end

# Display the visualization
p = visualize_seating(arena_model)
display(p)