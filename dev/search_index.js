var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = Peridynamics","category":"page"},{"location":"#Peridynamics","page":"Home","title":"Peridynamics","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for Peridynamics.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [Peridynamics]","category":"page"},{"location":"#Peridynamics.AbstractBC","page":"Home","title":"Peridynamics.AbstractBC","text":"AbstractBC\n\nAbstract type for boundary conditions.\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.AbstractIC","page":"Home","title":"Peridynamics.AbstractIC","text":"AbstractIC\n\nAbstract type for initial conditions.\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.AbstractPDAnalysis","page":"Home","title":"Peridynamics.AbstractPDAnalysis","text":"AbstractPDAnalysis\n\nAbstract type for a peridynamic analysis.\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.AbstractPDMaterial","page":"Home","title":"Peridynamics.AbstractPDMaterial","text":"AbstractPDMaterial\n\nAbstract type for a peridynamic material.\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.BodySetup","page":"Home","title":"Peridynamics.BodySetup","text":"BodySetup\n\nSetup of multiple bodies for PDContactAnalysis.\n\nFields:\n\npc::PointCloud: point cloud\nmat::AbstractPDMaterial: material model\nprecracks::Vector{PreCrack}: predefined cracks\nbcs::Vector{<:AbstractBC}: boundary conditions\nics::Vector{<:AbstractIC}: initial conditions\ncalc_timestep::Bool: use body for time step calculation\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.BondBasedMaterial","page":"Home","title":"Peridynamics.BondBasedMaterial","text":"BondBasedMaterial <: AbstractPDMaterial\n\nBond based peridynamic material model.\n\nFields\n\nδ::Float64: horizon\nrho::Float64: density\nE::Float64: young's modulus\nnu::Float64: poisson ratio\nG::Float64: shear modulus\nK::Float64: bulk modulus\nbc::Float64: bond constant\nGc::Float64: critical energy release rate\nεc::Float64: critical bond strain\n\n\n\nBondBasedMaterial(; horizon::Real, rho::Real, E::Real, Gc::Real)\n\nSpecify a material only with horizon, density rho, Young's modulus E and critical energy release rate Gc.\n\nKeywords\n\nhorizon::Real: horizon\nrho::Real:density\nE::Real: young's modulus\nGc::Real: critical energy release rate\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.Contact","page":"Home","title":"Peridynamics.Contact","text":"Contact\n\nContact definition.\n\nFields\n\nbody_id_set::Tuple{Int,Int}: bodies for which contact is defined\nsearch_radius::Float64: search radius for contact definition to activate\nspring_constant::Float64: spring constant used for contact force calculation, default value: spring_constant = 1.0e12\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.ExportSettings","page":"Home","title":"Peridynamics.ExportSettings","text":"ExportSettings\n\nExport settings.\n\nFields\n\npath::String: path where results will be saved\nexportfreq::Int: export frequency, will export every exportfreq-th timestep\nresultfile_prefix::String: prefix of the result-filename\nlogfile::String: name of logfile\nexportflag::Bool: disable export for a simulation where saved results are not needed\n\n\n\nExportSettings([path::String, freq::Int])\n\nCreate ExportSettings only by path and freq. If no arguments are specified, the exportflag will be set to false and export disabled.\n\nArguments\n\npath::String: path where results will be saved\nfreq::Int: export frequency\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.ForceDensityBC","page":"Home","title":"Peridynamics.ForceDensityBC","text":"ForceDensityBC <: AbstractBC\n\nForce density boundary condition. The value of the force density is calculated every time step with the function fun and applied to the dimension dim of the points specified by point_id_set.\n\nFields\n\nfun::Function: function f(t) with current time t as argument, that calculates the value of the force density for each timestep\npoint_id_set::Vector{Int}: point-id set with all points for which the boundary condition gets applied every timestep\ndim::Int: dimension on which the boundary condition gets applied to. Possible values:\nx-direction: dim=1\ny-direction: dim=2\nz-direction: dim=3\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.PDContactAnalysis","page":"Home","title":"Peridynamics.PDContactAnalysis","text":"PDContactAnalysis <: AbstractPDAnalysis\n\nPeridynamic contact analysis.\n\nFields\n\nname::String: simulation name\nbody_setup::Vector{BodySetup}: bodies used in this simulation\nn_bodies::Int: number of bodies\ncontact::Vector{Contact}: contact definitions\ntd::TimeDiscretization: time discretization\nes::ExportSettings: export settings\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.PointCloud","page":"Home","title":"Peridynamics.PointCloud","text":"PointCloud\n\nPeridynamic spatial discretization with material points defining a point cloud.\n\nFields\n\nn_points::Int: number of material points\nposition::Matrix{Float64}: coordinates of points in reference configuration\nvolume::Vector{Float64}: material point volumes\nfailure_flag::BitVector: if failure of point is possible: element=true\nradius::Vector{Float64}: radius of the material point sphere\n\n\n\nPointCloud(position, volume[, point_sets])\n\nCreate a PointCloud by specifying position and volume of all material points. The radius of the point sphere is derived from the volume with the function sphere_radius and the failure_flag set to true for all points.\n\nArguments\n\nposition::Matrix{Float64}: the position of the material points (3 times N-matrix for N material points)\nvolume::Vector{Float64}: the volume of the material points\npoint_sets::Dict{String,Vector{Int}}=Dict{String,Vector{Int}}(): optional point sets\n\nReturns\n\nPointCloud: point cloud with specified material point position and volume\n\nExamples\n\nCreating a PointCloud with 4 manually defined points:\n\njulia> position = [\n           0.0 1.0 0.0 0.0\n           0.0 0.0 1.0 0.0\n           0.0 0.0 0.0 1.0\n       ]\n3×4 Matrix{Float64}:\n 0.0  1.0  0.0  0.0\n 0.0  0.0  1.0  0.0\n 0.0  0.0  0.0  1.0\n\njulia> volume = [1.0, 1.0, 1.0, 1.0]\n4-element Vector{Float64}:\n 1.0\n 1.0\n 1.0\n 1.0\n\njulia> pc = PointCloud(position, volume)\n4-points PointCloud\n\njulia> pc.failure_flag\n4-element BitVector:\n 1\n 1\n 1\n 1\n\njulia> pc.radius\n4-element Vector{Float64}:\n 0.6203504908994001\n 0.6203504908994001\n 0.6203504908994001\n 0.6203504908994001\n\n\n\nPointCloud(W, L, H, Δx; center_x=0, center_y=0, center_z=0)\n\nGenerate a uniformly distributed PointCloud with width W, length L, height H and point spacing Δx. Optional keyword arguments provide the possibility to set the center.\n\nArguments\n\nW::Real: width of the PointCloud-block in x-direction\nL::Real: length of the PointCloud-block in y-direction\nH::Real: height of the PointCloud-block in z-direction\nΔx::Real: point spacing in x-, y- and z- direction\ncenter_x::Real=0: x-coordinate of the PointCloud-block center\ncenter_y::Real=0: y-coordinate of the PointCloud-block center\ncenter_z::Real=0: z-coordinate of the PointCloud-block center\n\nReturns\n\nPointCloud: point cloud with with W, length L, height H and point spacing Δx\n\nExamples\n\nCube with side length 1 and point spacing Δx = 01:\n\njulia> PointCloud(1, 1, 1, 0.1)\n1000-points PointCloud\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.PosDepVelBC","page":"Home","title":"Peridynamics.PosDepVelBC","text":"PosDepVelBC <: AbstractBC\n\nPosition dependent velocity boundary condition. The value of the force density is calculated every time step with the function fun and applied to the dimension dim of the points specified by point_id_set.\n\nFields\n\nval::Float64: value of the velocity\npoint_id_set::Vector{Int}: point-id set with all points for which the boundary condition gets applied to\ndim::Int: dimension on which the initial condition gets applied to. Possible values:\nx\n-direction: dim=1\ny\n-direction: dim=2\nz\n-direction: dim=3\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.PreCrack","page":"Home","title":"Peridynamics.PreCrack","text":"PreCrack(point_id_set_a::Vector{Int}, point_id_set_b::Vector{Int})\n\nDefinition of an preexisting crack in the model. Points in point_id_set_a cannot have interactions with points in point_id_set_b.\n\nFields\n\npoint_id_set_a::Vector{Int}: first point-id set\npoint_id_set_b::Vector{Int}: second point-id set\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.TimeDiscretization","page":"Home","title":"Peridynamics.TimeDiscretization","text":"TimeDiscretization\n\nTime discretization type for setting the number of timesteps and the timestep Δt.\n\nFields\n\nn_timesteps::Int: number of time steps\nΔt::Float64: constant time step\nalg::Symbol: algorithm used for time integration. Possible values:\n:verlet: Velocity verlet algorithm for explicit time integration\n:dynrelax: Adaptive dynamic relaxation for quasistatic time integration\n\n\n\nTimeDiscretization(nt::Int[, Δt::Real]; alg::Symbol=:verlet)\n\nArguments\n\nnt::Int: number of time steps\nΔt::Real: optional specified time step\n\nKeywords\n\nalg::Symbol: optional specification of algorithm used for time integration. Possible values:\n:verlet (default): Velocity verlet algorithm for explicit time integration\n:dynrelax: Adaptive dynamic relaxation for quasistatic time integration\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.VelocityBC","page":"Home","title":"Peridynamics.VelocityBC","text":"VelocityBC <: AbstractBC\n\nVelocity boundary condition. The value of the velocity is calculated every time step with the function fun and applied to the dimension dim of the points specified by point_id_set.\n\nFields\n\nfun::Function: function f(t) with current time t as argument, that calculates the value of the velocity for each timestep\npoint_id_set::Vector{Int}: point-id set with all points for which the boundary condition gets applied every timestep\ndim::Int: dimension on which the boundary condition gets applied to. Possible values:\nx-direction: dim=1\ny-direction: dim=2\nz-direction: dim=3\n\nExamples\n\nThe constant velocity v = 01 in y-direction gets applied to the first 10 points:\n\njulia> VelocityBC(t -> 0.1, 1:10, 2)\nVelocityBC(var\"#7#8\"(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2)\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.VelocityIC","page":"Home","title":"Peridynamics.VelocityIC","text":"VelocityIC <: AbstractIC\n\nVelocity initial condition. The value val of the velocity is applied as initial condition to the dimension dim of the points specified by point_id_set.\n\nFields\n\nval::Float64: value of the velocity\npoint_id_set::Vector{Int}: point-id set with all points for which the initial condition gets applied to\ndim::Int: dimension on which the initial condition gets applied to. Possible values:\nx-direction: dim=1\ny-direction: dim=2\nz-direction: dim=3\n\n\n\n\n\n","category":"type"},{"location":"#Peridynamics.calc_stable_user_timestep","page":"Home","title":"Peridynamics.calc_stable_user_timestep","text":"calc_stable_user_timestep(pc::PointCloud, mat::AbstractPDMaterial, Sf::Float64=0.7)\n\nFunction to determine the stable timestep for the specified point cloud.\n\nArguments\n\npc::PointCloud: point cloud\nmat::AbstractPDMaterial: material model\nSf::Float64: safety factor for time step, default value Sf = 0.7\n\nReturns\n\nFloat64: stable user timestep Δt\n\n\n\n\n\n","category":"function"},{"location":"#Peridynamics.read_inp-Tuple{String}","page":"Home","title":"Peridynamics.read_inp","text":"read_inp(file::String)\n\nRead Abaqus .inp-file and convert meshes to PointCloud objects. Currently supported mesh elements: [:Tet4, :Hex8]\n\nArguments\n\nfile::String: path to Abaqus .inp-file\n\nReturns\n\nPointCloud: generated point cloud with element volume as point volume\n\n\n\n\n\n","category":"method"},{"location":"#Peridynamics.sphere_radius-Tuple{T} where T<:Real","page":"Home","title":"Peridynamics.sphere_radius","text":"sphere_radius(vol::T) where {T<:Real}\n\nCalculate the radius r of the sphere by equation\n\nr = sqrt3frac3  V4  pi\n\nwith specified sphere volume V.\n\nArguments\n\nvol::T where {T<:Real}: volume V of the sphere\n\nReturns\n\nFloat64: radius r of sphere with volume vol\n\n\n\n\n\n","category":"method"},{"location":"#Peridynamics.submit","page":"Home","title":"Peridynamics.submit","text":"submit(sim::T) where {T<:AbstractPDAnalysis}\n\nSubmit a simulation job to determine the results of the specified analysis.\n\nArguments\n\nsim::T where {T<:AbstractPDAnalysis}: simulation job\n\n\n\n\n\n","category":"function"}]
}
