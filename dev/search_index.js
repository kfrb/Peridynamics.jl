var documenterSearchIndex = {"docs":
[{"location":"crackedplateundertension/#cracked-plate-under-tension","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"","category":"section"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"The complete script for this tutorial can be found here: CrackedPlateUnderTension.jl.","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"First, we have to load the Peridynamics.jl package.","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"using Peridynamics","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"Now whe have the exported types and methods available in the namespace. This allows us to construct a PointCloud by specifying the dimensions and the point spacing Delta x.","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"length_x = 0.05 # [m]\nlength_y = 0.05 # [m]\nlength_z = 0.005 # [m]\nΔx = length_y / 60 # point spacing: 60 points along y-describe_interactions\npc = PointCloud(length_x, length_y, length_z, Δx)","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"As next step, we define the material with the parameters horizon (horizon delta in peridynamics theory), density rho, youngs modulus E and critical energy release rate Gc.","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"mat = BondBasedMaterial(;\n    horizon = 3.015Δx, # [m]\n    rho = 7850.0, # [kg/m^3]\n    E = 210e9, # [N/m^2]\n    Gc = 1000.0, # [N/m]\n)","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"Now we want the plate to have a crack from the left side to the middle. Therefore we need to specify a PreCrack object. A PreCrack is simply two Vector{Int}'s containing point indices. Points in point_id_set_a don't interact with points in  point_id_set_b. So we need to specify all points above and below the crack, seen in the following image:","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"<img src=\"https://github.com/kfrb/Peridynamics.jl/blob/main/docs/src/assets/CrackedPlateUnderTension0.png?raw=true\" width=\"600\" />","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"(Visualization made with ParaView)","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"cracklength = 0.5 * length_x\nprecrack_set_a = findall(\n    (pc.position[2, :] .>= 0) .&\n    (pc.position[2, :] .< 12 * Δx) .&\n    (pc.position[1, :] .<= -length_x / 2 + cracklength),\n)\nprecrack_set_b = findall(\n    (pc.position[2, :] .<= 0) .&\n    (pc.position[2, :] .> -12 * Δx) .&\n    (pc.position[1, :] .<= -length_x / 2 + cracklength),\n)\nprecracks = [PreCrack(precrack_set_a, precrack_set_b)]","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"The PreCrack is then wrapped inside a Vector because PDSingleBodyAnalysis needs a Vector{PreCrack} in case you have multiple predefined cracks in your model.","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"Now we specify boundary conditions so the crack has to grow under the load that is applied to the plate. Therefore, we want the five rows of points in the upper and lower part of the plate to have a constant velocity of 01fracmathrmmmathrms in positive and negative y-direction to pull the plate apart.","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"bc_set_top = findall(pc.position[2,:] .> length_y / 2 - 5.1 * Δx)\nbc_set_bottom = findall(pc.position[2,:] .< -length_y / 2 + 5.1 * Δx)\nbc_top = VelocityBC(t -> 0.1, bc_set_top, 2)\nbc_bottom = VelocityBC(t -> -0.1, bc_set_bottom, 2)\nboundary_conditions = [bc_top, bc_bottom]","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"Now we specify the temporal discretization. Our simulation should run for 2000 time steps and the stable time step should be calculated.","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"td = TimeDiscretization(2000)","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"In order to save the results, we specify with ExportSettings, that every 10 timesteps, the results should be saved to a folder named results/CrackedPlateUnderTension.","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"simulation_name = \"CrackedPlateUnderTension\"\nresfolder = joinpath(@__DIR__, \"results\", simulation_name)\nmkpath(resfolder)\nes = ExportSettings(resfolder, 10)","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"Now everything needed for the PDSingleBodyAnalysis is defined.","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"job = PDSingleBodyAnalysis(\n    name = simulation_name,\n    pc = pc,\n    mat = mat,\n    precracks = precracks,\n    bcs = boundary_conditions,\n    td = td,\n    es = es,\n)","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"results = submit(job);","category":"page"},{"location":"crackedplateundertension/#Results-after-2000-timesteps:","page":"CrackedPlateUnderTension.jl","title":"Results after 2000 timesteps:","text":"","category":"section"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"<img src=\"https://github.com/kfrb/Peridynamics.jl/blob/main/docs/src/assets/CrackedPlateUnderTension2000.png?raw=true\" width=\"600\"/>","category":"page"},{"location":"crackedplateundertension/","page":"CrackedPlateUnderTension.jl","title":"CrackedPlateUnderTension.jl","text":"(Visualization made with ParaView)","category":"page"},{"location":"tensiletest/#TensileTest.jl","page":"TensileTest.jl","title":"TensileTest.jl","text":"","category":"section"},{"location":"tensiletest/#Quickstart","page":"TensileTest.jl","title":"Quickstart","text":"","category":"section"},{"location":"tensiletest/#Code:","page":"TensileTest.jl","title":"Code:","text":"","category":"section"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"using Peridynamics\npointcloud = read_inp(\"TensileTestMesh.inp\")\nmaterial = BondBasedMaterial(; horizon=0.008, rho=2700, E=70e9, Gc=100)\nboundary_conditions = [\n    VelocityBC(t -> -0.8, pointcloud.point_sets[\"bottom\"], 1),\n    VelocityBC(t -> 0.8, pointcloud.point_sets[\"top\"], 1),\n]\njob = PDSingleBodyAnalysis(;\n    name=\"TensileTest\",\n    pc=pointcloud,\n    mat=material,\n    bcs=boundary_conditions,\n    td=TimeDiscretization(500),\n    es=ExportSettings(\"results/TensileTest\", 10),\n)\nsubmit(job)","category":"page"},{"location":"tensiletest/#Results:","page":"TensileTest.jl","title":"Results:","text":"","category":"section"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"<img src=\"https://github.com/kfrb/Peridynamics.jl/blob/main/docs/src/assets/TensileTest.png?raw=true\" width=\"600\" />","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"(Visualization made with ParaView)","category":"page"},{"location":"tensiletest/#Step-by-step","page":"TensileTest.jl","title":"Step-by-step","text":"","category":"section"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"The script for this tutorial can be found here: TensileTest.jl.","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"First, we have to load the Peridynamics.jl package.","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"using Peridynamics","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"Now we create a PointCloud by converting the mesh from Abaqus. (Download the mesh)","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"pointcloud = read_inp(\"TensileTestMesh.inp\")","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"<img src=\"https://github.com/kfrb/Peridynamics.jl/blob/main/docs/src/assets/TensileTestMesh.png?raw=true\" width=\"600\" />","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"Next, we need to specify material parameters. We define:","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"Horizon delta = 0008mathrmm\nDensity rho = 2700mathrmkgmathrmm^-3\nYoungs modulus E = 70 times 10^9  mathrmPa\nGriffith's parameter G_c = 100  mathrmN  mathrmm^-1","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"material = BondBasedMaterial(; horizon=0.008, rho=2700, E=70e9, Gc=100)","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"As loading condition for the specimen, a constant velocity of 08  mathrmmmathrms^-1 in x-direction is set for the bottom and top. Note, that element sets defined in Abaqus are converted to point_sets of the PointCloud.","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"boundary_conditions = [\n    VelocityBC(t -> -0.8, pointcloud.point_sets[\"bottom\"], 1),\n    VelocityBC(t -> 0.8, pointcloud.point_sets[\"top\"], 1),\n]","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"With these at hand, a PDSingleBodyAnalysis can be constructed and submitted for calculation. We set the number of time steps for the explicit time integration to 500 with TimeDiscretization(500) and define, that the results of our calculation should be saved in the directory \"results/TensileTest\" every 10'th time step.","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"job = PDSingleBodyAnalysis(;\n    name=\"TensileTest\",\n    pc=pointcloud,\n    mat=material,\n    bcs=boundary_conditions,\n    td=TimeDiscretization(500),\n    es=ExportSettings(\"results/TensileTest\", 10),\n)\nsubmit(job)","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"The output of submit(job) looks as follows:","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"======================================================================\nPERIDYNAMIC SIMULATION ON 8 THREADS\n======================================================================\nPeridynamic single body analysis: TensileTest\nMaterial parameters:\n  - Number of material points [-]:                               16900\n  - Material model:                                  BondBasedMaterial\n  - Horizon δ [m]:                                               0.008\n  - Density ρ [kg/m³]:                                            2700\n  - Young's modulus E [N/m²]:                                    7e+10\n  - Poisson ratio ν [-]:                                          0.25\n  - Critical bond stretch εc[-]:                           0.000385758\nInteractions:\n  - Number of bonds [-]:                                       6667240\nTotal memory used by body [MB]:                                273.856\nExport setup:\n  - Export frequency:                                               10\n  - Export file name:         examples/results/TensileTest/TensileTest\nTime discretization:\n  - Time step Δt [s]:                                      5.13584e-07\n  - Number of time steps [-]:                                      500\n  - Simulation time horizon [s]:                           0.000256792\nTime integration... 100%|██████████████████████████████| Time: 0:00:13\n✓ Simulation completed after 16.7321 seconds\nResults:\n  - Max. abs. x-displacement [m]:                          0.000434543\n  - Max. abs. y-displacement [m]:                          0.000326501\n  - Max. abs. z-displacement [m]:                          0.000230936\n  - Max. damage [-]:                                                 1","category":"page"},{"location":"tensiletest/#No-fail-zone","page":"TensileTest.jl","title":"No-fail-zone","text":"","category":"section"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"As an improvement to the previous results, we can additionally set a no-fail-zone. It is a common problem for bond-based peridynamics, that to much damage occurs next to the points where boundary conditions apply. To disable failure of the points in the bottom and the top of the specimen, add these two lines after the definition of the pointcloud:","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"pointcloud.failure_flag[pointcloud.point_sets[\"bottom\"]] .= false\npointcloud.failure_flag[pointcloud.point_sets[\"top\"]] .= false","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"As a result, we have reduced the damage in the bottom and top of the specimen:","category":"page"},{"location":"tensiletest/","page":"TensileTest.jl","title":"TensileTest.jl","text":"<img src=\"https://github.com/kfrb/Peridynamics.jl/blob/main/docs/src/assets/TensileTestNoFailZone.png?raw=true\" width=\"600\" />","category":"page"},{"location":"library/#Libary","page":"Libary","title":"Libary","text":"","category":"section"},{"location":"library/","page":"Libary","title":"Libary","text":"CurrentModule = Peridynamics","category":"page"},{"location":"library/","page":"Libary","title":"Libary","text":"","category":"page"},{"location":"library/#Types","page":"Libary","title":"Types","text":"","category":"section"},{"location":"library/","page":"Libary","title":"Libary","text":"PointCloud\nBondBasedMaterial\nPreCrack\nTimeDiscretization\nExportSettings\nBodySetup\nContact\nPDSingleBodyAnalysis\nPDContactAnalysis\nVelocityBC\nVelocityIC\nPosDepVelBC\nForceDensityBC","category":"page"},{"location":"library/#Peridynamics.PointCloud","page":"Libary","title":"Peridynamics.PointCloud","text":"PointCloud\n\nPeridynamic spatial discretization with material points defining a point cloud.\n\nFields\n\nn_points::Int: number of material points\nposition::Matrix{Float64}: coordinates of points in reference configuration\nvolume::Vector{Float64}: material point volumes\nfailure_flag::BitVector: if failure of point is possible: element=true\nradius::Vector{Float64}: radius of the material point sphere\n\n\n\nPointCloud(position, volume[, point_sets])\n\nCreate a PointCloud by specifying position and volume of all material points. The radius of the point sphere is derived from the volume with the function sphere_radius and the failure_flag set to true for all points.\n\nArguments\n\nposition::Matrix{Float64}: the position of the material points (3 times N-matrix for N material points)\nvolume::Vector{Float64}: the volume of the material points\npoint_sets::Dict{String,Vector{Int}}=Dict{String,Vector{Int}}(): optional point sets\n\nReturns\n\nPointCloud: point cloud with specified material point position and volume\n\nExamples\n\nCreating a PointCloud with 4 manually defined points:\n\njulia> position = [\n           0.0 1.0 0.0 0.0\n           0.0 0.0 1.0 0.0\n           0.0 0.0 0.0 1.0\n       ]\n3×4 Matrix{Float64}:\n 0.0  1.0  0.0  0.0\n 0.0  0.0  1.0  0.0\n 0.0  0.0  0.0  1.0\n\njulia> volume = [1.0, 1.0, 1.0, 1.0]\n4-element Vector{Float64}:\n 1.0\n 1.0\n 1.0\n 1.0\n\njulia> pc = PointCloud(position, volume)\n4-points PointCloud\n\njulia> pc.failure_flag\n4-element BitVector:\n 1\n 1\n 1\n 1\n\njulia> pc.radius\n4-element Vector{Float64}:\n 0.6203504908994001\n 0.6203504908994001\n 0.6203504908994001\n 0.6203504908994001\n\n\n\nPointCloud(W, L, H, Δx; center_x=0, center_y=0, center_z=0)\n\nGenerate a uniformly distributed PointCloud with width W, length L, height H and point spacing Δx. Optional keyword arguments provide the possibility to set the center.\n\nArguments\n\nW::Real: width of the PointCloud-block in x-direction\nL::Real: length of the PointCloud-block in y-direction\nH::Real: height of the PointCloud-block in z-direction\nΔx::Real: point spacing in x-, y- and z- direction\ncenter_x::Real=0: x-coordinate of the PointCloud-block center\ncenter_y::Real=0: y-coordinate of the PointCloud-block center\ncenter_z::Real=0: z-coordinate of the PointCloud-block center\n\nReturns\n\nPointCloud: point cloud with with W, length L, height H and point spacing Δx\n\nExamples\n\nCube with side length 1 and point spacing Δx = 01:\n\njulia> PointCloud(1, 1, 1, 0.1)\n1000-points PointCloud\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.BondBasedMaterial","page":"Libary","title":"Peridynamics.BondBasedMaterial","text":"BondBasedMaterial <: AbstractPDMaterial\n\nBond based peridynamic material model.\n\nFields\n\nδ::Float64: horizon\nrho::Float64: density\nE::Float64: young's modulus\nnu::Float64: poisson ratio\nG::Float64: shear modulus\nK::Float64: bulk modulus\nbc::Float64: bond constant\nGc::Float64: critical energy release rate\nεc::Float64: critical bond strain\n\n\n\nBondBasedMaterial(; horizon::Real, rho::Real, E::Real, Gc::Real)\n\nSpecify a material only with horizon, density rho, Young's modulus E and critical energy release rate Gc.\n\nKeywords\n\nhorizon::Real: horizon\nrho::Real:density\nE::Real: young's modulus\nGc::Real: critical energy release rate\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.PreCrack","page":"Libary","title":"Peridynamics.PreCrack","text":"PreCrack(point_id_set_a::Vector{Int}, point_id_set_b::Vector{Int})\n\nDefinition of an preexisting crack in the model. Points in point_id_set_a cannot have interactions with points in point_id_set_b.\n\nFields\n\npoint_id_set_a::Vector{Int}: first point-id set\npoint_id_set_b::Vector{Int}: second point-id set\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.TimeDiscretization","page":"Libary","title":"Peridynamics.TimeDiscretization","text":"TimeDiscretization\n\nTime discretization type for setting the number of timesteps and the timestep Δt.\n\nFields\n\nn_timesteps::Int: number of time steps\nΔt::Float64: constant time step\nalg::Symbol: algorithm used for time integration. Possible values:\n:verlet: Velocity verlet algorithm for explicit time integration\n:dynrelax: Adaptive dynamic relaxation for quasistatic time integration\n\n\n\nTimeDiscretization(nt::Int[, Δt::Real]; alg::Symbol=:verlet)\n\nArguments\n\nnt::Int: number of time steps\nΔt::Real: optional specified time step\n\nKeywords\n\nalg::Symbol: optional specification of algorithm used for time integration. Possible values:\n:verlet (default): Velocity verlet algorithm for explicit time integration\n:dynrelax: Adaptive dynamic relaxation for quasistatic time integration\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.ExportSettings","page":"Libary","title":"Peridynamics.ExportSettings","text":"ExportSettings\n\nExport settings.\n\nFields\n\npath::String: path where results will be saved\nexportfreq::Int: export frequency, will export every exportfreq-th timestep\nresultfile_prefix::String: prefix of the result-filename\nlogfile::String: name of logfile\nexportflag::Bool: disable export for a simulation where saved results are not needed\n\n\n\nExportSettings([path::String, freq::Int])\n\nCreate ExportSettings only by path and freq. If no arguments are specified, the exportflag will be set to false and export disabled.\n\nArguments\n\npath::String: path where results will be saved\nfreq::Int: export frequency\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.BodySetup","page":"Libary","title":"Peridynamics.BodySetup","text":"BodySetup\n\nSetup of multiple bodies for PDContactAnalysis.\n\nFields:\n\npc::PointCloud: point cloud\nmat::AbstractPDMaterial: material model\nprecracks::Vector{PreCrack}: predefined cracks\nbcs::Vector{<:AbstractBC}: boundary conditions\nics::Vector{<:AbstractIC}: initial conditions\ncalc_timestep::Bool: use body for time step calculation\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.Contact","page":"Libary","title":"Peridynamics.Contact","text":"Contact\n\nContact definition.\n\nFields\n\nbody_id_set::Tuple{Int,Int}: bodies for which contact is defined\nsearch_radius::Float64: search radius for contact definition to activate\nspring_constant::Float64: spring constant used for contact force calculation, default value: spring_constant = 1.0e12\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.PDSingleBodyAnalysis","page":"Libary","title":"Peridynamics.PDSingleBodyAnalysis","text":"PDSingleBodyAnalysis{T<:AbstractPDMaterial} <: AbstractPDAnalysis\n\nPeridynamic single body analysis.\n\nFields\n\nname::String: simulation name\npc::PointCloud: point cloud\nmat::T: material model for the body\nprecracks::Vector{PreCrack}: predefined cracks\nbcs::Vector{<:AbstractBC}: boundary conditions\nics::Vector{<:AbstractIC}: initial conditions\ntd::TimeDiscretization: time discretization\nes::ExportSettings: export settings\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.PDContactAnalysis","page":"Libary","title":"Peridynamics.PDContactAnalysis","text":"PDContactAnalysis <: AbstractPDAnalysis\n\nPeridynamic contact analysis.\n\nFields\n\nname::String: simulation name\nbody_setup::Vector{BodySetup}: bodies used in this simulation\nn_bodies::Int: number of bodies\ncontact::Vector{Contact}: contact definitions\ntd::TimeDiscretization: time discretization\nes::ExportSettings: export settings\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.VelocityBC","page":"Libary","title":"Peridynamics.VelocityBC","text":"VelocityBC <: AbstractBC\n\nVelocity boundary condition. The value of the velocity is calculated every time step with the function fun and applied to the dimension dim of the points specified by point_id_set.\n\nFields\n\nfun::Function: function f(t) with current time t as argument, that calculates the value of the velocity for each timestep\npoint_id_set::Vector{Int}: point-id set with all points for which the boundary condition gets applied every timestep\ndim::Int: dimension on which the boundary condition gets applied to. Possible values:\nx-direction: dim=1\ny-direction: dim=2\nz-direction: dim=3\n\nExamples\n\nThe constant velocity v = 01 in y-direction gets applied to the first 10 points:\n\njulia> VelocityBC(t -> 0.1, 1:10, 2)\nVelocityBC(var\"#7#8\"(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2)\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.VelocityIC","page":"Libary","title":"Peridynamics.VelocityIC","text":"VelocityIC <: AbstractIC\n\nVelocity initial condition. The value val of the velocity is applied as initial condition to the dimension dim of the points specified by point_id_set.\n\nFields\n\nval::Float64: value of the velocity\npoint_id_set::Vector{Int}: point-id set with all points for which the initial condition gets applied to\ndim::Int: dimension on which the initial condition gets applied to. Possible values:\nx-direction: dim=1\ny-direction: dim=2\nz-direction: dim=3\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.PosDepVelBC","page":"Libary","title":"Peridynamics.PosDepVelBC","text":"PosDepVelBC <: AbstractBC\n\nPosition dependent velocity boundary condition. The value of the force density is calculated every time step with the function fun and applied to the dimension dim of the points specified by point_id_set.\n\nFields\n\nfun::Function: function f(x, y, z, t) with x-, y-, z-position of the point and current time t as arguments, calculates the value of the force density for each timestep dependent of the point position\npoint_id_set::Vector{Int}: point-id set with all points for which the boundary condition gets applied to\ndim::Int: dimension on which the initial condition gets applied to. Possible values:\nx-direction: dim=1\ny-direction: dim=2\nz-direction: dim=3\n\n\n\n\n\n","category":"type"},{"location":"library/#Peridynamics.ForceDensityBC","page":"Libary","title":"Peridynamics.ForceDensityBC","text":"ForceDensityBC <: AbstractBC\n\nForce density boundary condition. The value of the force density is calculated every time step with the function fun and applied to the dimension dim of the points specified by point_id_set.\n\nFields\n\nfun::Function: function f(t) with current time t as argument, that calculates the value of the force density for each timestep\npoint_id_set::Vector{Int}: point-id set with all points for which the boundary condition gets applied every timestep\ndim::Int: dimension on which the boundary condition gets applied to. Possible values:\nx-direction: dim=1\ny-direction: dim=2\nz-direction: dim=3\n\n\n\n\n\n","category":"type"},{"location":"library/#Functions","page":"Libary","title":"Functions","text":"","category":"section"},{"location":"library/","page":"Libary","title":"Libary","text":"calc_stable_user_timestep\nread_inp\nsphere_radius\nsubmit","category":"page"},{"location":"library/#Peridynamics.calc_stable_user_timestep","page":"Libary","title":"Peridynamics.calc_stable_user_timestep","text":"calc_stable_user_timestep(pc::PointCloud, mat::AbstractPDMaterial, Sf::Float64=0.7)\n\nFunction to determine the stable timestep for the specified point cloud.\n\nArguments\n\npc::PointCloud: point cloud\nmat::AbstractPDMaterial: material model\nSf::Float64: safety factor for time step, default value Sf = 0.7\n\nReturns\n\nFloat64: stable user timestep Δt\n\n\n\n\n\n","category":"function"},{"location":"library/#Peridynamics.read_inp","page":"Libary","title":"Peridynamics.read_inp","text":"read_inp(file::String)\n\nRead Abaqus .inp-file and convert meshes to PointCloud objects. Currently supported mesh elements: [:Tet4, :Hex8]\n\nArguments\n\nfile::String: path to Abaqus .inp-file\n\nReturns\n\nPointCloud: generated point cloud with element volume as point volume\n\n\n\n\n\n","category":"function"},{"location":"library/#Peridynamics.sphere_radius","page":"Libary","title":"Peridynamics.sphere_radius","text":"sphere_radius(vol::T) where {T<:Real}\n\nCalculate the radius r of the sphere by equation\n\nr = sqrt3frac3  V4  pi\n\nwith specified sphere volume V.\n\nArguments\n\nvol::T where {T<:Real}: volume V of the sphere\n\nReturns\n\nFloat64: radius r of sphere with volume vol\n\n\n\n\n\n","category":"function"},{"location":"library/#Peridynamics.submit","page":"Libary","title":"Peridynamics.submit","text":"submit(sim::T) where {T<:AbstractPDAnalysis}\n\nSubmit a simulation job to determine the results of the specified analysis.\n\nArguments\n\nsim::T where {T<:AbstractPDAnalysis}: simulation job\n\n\n\n\n\n","category":"function"},{"location":"manual/#manual","page":"Manual","title":"Manual","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"tip: Typical workflow\nPeridynamics.jl simulations follow this short workflow:Create a job\nSubmit the job","category":"page"},{"location":"manual/#How-to-create-a-job","page":"Manual","title":"How to create a job","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"Currently two different simulation job types are available:","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"PDSingleBodyAnalysis\nDefine the spatial discretization - create a PointCloud\nDefine the material, see BondBasedMaterial\nDefine the temporal discretization with TimeDiscretization\nDefine export settings with ExportSettings\nAdd predefined cracks with PreCrack\nAdd boundary conditions, e.g. VelocityBC, ForceDensityBC, PosDepVelBC\nAdd initial conditions, e.g. VelocityIC\nPDContactAnalysis\nCreate a BodySetup for every body (similar to PDSingleBodyAnalysis)\nDefine the Contact between the different bodies\nDefine the temporal discretization with TimeDiscretization\nDefine export settings with ExportSettings","category":"page"},{"location":"manual/#How-to-submit-a-job","page":"Manual","title":"How to submit a job","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"submit(job)","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"<img src=\"https://github.com/kfrb/Peridynamics.jl/blob/main/docs/src/assets/logo.png?raw=true\" width=\"450\" />","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"Download video","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"(Visualization made with ParaView)","category":"page"},{"location":"logo/#Logo.jl","page":"Logo.jl","title":"Logo.jl","text":"","category":"section"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"The complete script for this tutorial can be found here: Logo.jl.","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"First, we have to load the Peridynamics.jl package.","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"using Peridynamics","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"# PLATE - INDEX: p\ndimXYₚ = 0.1 # [m]\ndimZₚ = 0.01 # [m]\nΔxₚ = dimXYₚ/50 # [m]\npcₚ = PointCloud(dimXYₚ, dimXYₚ, dimZₚ, Δxₚ)","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"# SPHERES OF LOGO - INDEX: s\nØₛ = 0.03 # [m]\nVₛ = 4 / 3 * π * (Øₛ / 2)^3 # [m³]\nΔxₛ = Øₛ / 20 # [m]\npcₛ₀ = PointCloud(Øₛ, Øₛ, Øₛ, Δxₛ)\nsphere_point_set = @views findall(\n    sqrt.(\n        pcₛ₀.position[1, :] .^ 2 + pcₛ₀.position[2, :] .^ 2 + pcₛ₀.position[3, :] .^ 2\n    ) .<= Øₛ / 2,\n)\npcₛ₀.position[3, sphere_point_set] .+= Øₛ / 2 + dimZₚ / 2 + 1.1Δxₚ\npcₛ₁ = PointCloud(\n    pcₛ₀.position[:, sphere_point_set],\n    pcₛ₀.volume[sphere_point_set],\n    zeros(Bool, length(sphere_point_set)),\n    pcₛ₀.radius[sphere_point_set],\n    length(sphere_point_set),\n)\npcₛ₂ = deepcopy(pcₛ₁)\npcₛ₃ = deepcopy(pcₛ₁)\nrₗ = Øₛ / 2 + 0.2 * Øₛ\npcₛ₁.position[2, :] .+= rₗ\npcₛ₂.position[1, :] .+= rₗ * cos(30π / 180)\npcₛ₂.position[2, :] .-= rₗ * sin(30π / 180)\npcₛ₃.position[1, :] .-= rₗ * cos(30π / 180)\npcₛ₃.position[2, :] .-= rₗ * sin(30π / 180)","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"matₚ = BondBasedMaterial(;\n    point_spacing=Δxₚ,\n    horizon=3.015Δxₚ,\n    density=2000.0,\n    young_modulus=30e9,\n    critical_energy_release_rate=10.0,\n)\nmatₛ = BondBasedMaterial(;\n    point_spacing=Δxₛ,\n    horizon=3.015Δxₛ,\n    density=7850.0,\n    young_modulus=210e9,\n    critical_energy_release_rate=1000.0,\n)","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"icₛ = [VelocityIC(-20.0, 1:(pcₛ₁.n_points), 3)]","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"plate = BodySetup(pcₚ, matₚ)\nsphere1 = BodySetup(pcₛ₁, matₛ; ics=icₛ)\nsphere2 = BodySetup(pcₛ₂, matₛ; ics=icₛ, calc_timestep=false)\nsphere3 = BodySetup(pcₛ₃, matₛ; ics=icₛ, calc_timestep=false)\nbody_setup = [plate, sphere1, sphere2, sphere3]","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"contact = [Contact((1, 2), Δxₚ), Contact((1, 3), Δxₚ), Contact((1, 4), Δxₚ)]","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"td = TimeDiscretization(3000)","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"simulation_name = \"Logo\"\nresfolder = joinpath(@__DIR__, \"results\", simulation_name)\nmkpath(resfolder)\nes = ExportSettings(resfolder, 10)","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"JOB = PDContactAnalysis(;\n    name=simulation_name, body_setup=body_setup, contact=contact, td=td, es=es\n)","category":"page"},{"location":"logo/","page":"Logo.jl","title":"Logo.jl","text":"results = submit(JOB);","category":"page"},{"location":"","page":"Home","title":"Home","text":"<img src=\"https://github.com/kfrb/Peridynamics.jl/blob/main/docs/src/assets/logo.png?raw=true\" width=\"450\" />","category":"page"},{"location":"#Peridynamics","page":"Home","title":"Peridynamics","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for the Peridynamics julia package.","category":"page"},{"location":"#Overview","page":"Home","title":"Overview","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Peridynamics is a non-local formulation of continuum mechanics. Material points map the continuum, and the relative displacements and forces are described by an integral equation that is also fulfilled for discontinuities. Therefore, peridynamics is ideally suited for dynamic fracture simulations with many cracks!","category":"page"},{"location":"","page":"Home","title":"Home","text":"This package aims at making it easy for everyone to perform peridynamics simulations with a high-level API and the speed of Julia. Currently, only a limited feature set is supported, but many more are in the pipeline, so stay tuned for upcoming versions!","category":"page"},{"location":"#Features","page":"Home","title":"Features","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Bond-based peridynamics, see Silling (2000)\nImport and convert meshes from Abaqus (Supported element types: Tet4, Hex8)\nExplicit time integration with Velocity Verlet algorithm\nAdaptive dynamic relaxation for quasistatic analysis, see Kilic and Madenci (2010)\nMulti-body contact analysis with short-range forces, see Silling and Askari (2005)","category":"page"},{"location":"#Incomplete-list-of-upcoming-features","page":"Home","title":"Incomplete list of upcoming features","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Volume and surface correction\nOrdinary and non-ordinary state-based peridynamics, see Silling et al. (2007)\nContinuum-kinematics-based peridynamics, see Javili, McBride and Steinmann (2019)","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"To install, use Julia's built-in package manager. Open the Julia REPL and type ] to enter the package mode and install Peridynamics as follows:","category":"page"},{"location":"","page":"Home","title":"Home","text":"pkg> add Peridynamics","category":"page"},{"location":"#Getting-Started","page":"Home","title":"Getting Started","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"We recommend looking at the manual and the tutorials section to start working with this package!","category":"page"},{"location":"","page":"Home","title":"Home","text":"Have fun! 😃","category":"page"}]
}
