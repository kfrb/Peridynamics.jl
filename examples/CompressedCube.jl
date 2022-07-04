using Peridynamics
# read abaqus mesh and convert to point cloud
pointcloud = read_inp("test/models/CubeC3D8.inp")
material = BondBasedMaterial(; horizon=15, rho=7850, E=210e9, Gc=1000.0)
# abaqus element-sets --> point-sets
boundary_conditions = [
    ForceDensityBC(x -> -1e5, pointcloud.point_sets["l"], 1),
    ForceDensityBC(x -> 1e5, pointcloud.point_sets["r"], 1),
]
job = PDSingleBodyAnalysis(; name="CompressedCube",
    pc=pointcloud, mat=material, bcs=boundary_conditions,
    td=TimeDiscretization(500, alg = :dynrelax),
    es=ExportSettings("examples/results/CompressedCube", 10),
)
submit(job)