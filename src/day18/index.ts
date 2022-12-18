import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((line) => line.split(',').map((v) => +v))

const grid = (x: number, y: number, z: number) => [x, y, z].join(',')
const xyz = (grid: string) => grid.split(',').map((v) => +v)
const NEIGHBORS = [
	[1, 0, 0],
	[-1, 0, 0],
	[0, 1, 0],
	[0, -1, 0],
	[0, 0, 1],
	[0, 0, -1],
]
const neighbors = function* (x: number, y: number, z: number) {
	for (const [nx, ny, nz] of NEIGHBORS) {
		yield [x + nx, y + ny, z + nz]
	}
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const gridMap: Set<string> = new Set()
	let surfaceArea = 0
	for (const [x, y, z] of input) {
		gridMap.add(grid(x, y, z))
		surfaceArea += 6
		for (const [nx, ny, nz] of neighbors(x, y, z)) {
			const nGrid = grid(nx, ny, nz)
			if (gridMap.has(nGrid)) surfaceArea -= 2
		}
	}
	return surfaceArea.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const cubeMap: Set<string> = new Set()
	const spaceMap: Set<string> = new Set()
	let surfaceArea = 0
	const bounds = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity]
	for (const [x, y, z] of input) {
		if (x < bounds[0]) bounds[0] = x
		if (x > bounds[1]) bounds[1] = x
		if (y < bounds[2]) bounds[2] = y
		if (y > bounds[3]) bounds[3] = y
		if (z < bounds[4]) bounds[4] = z
		if (z > bounds[5]) bounds[5] = z
		const thisGrid = grid(x, y, z)
		cubeMap.add(thisGrid)
		spaceMap.delete(thisGrid)
		surfaceArea += 6
		for (const [nx, ny, nz] of neighbors(x, y, z)) {
			const nGrid = grid(nx, ny, nz)
			if (cubeMap.has(nGrid)) {
				surfaceArea -= 2
			} else {
				spaceMap.add(nGrid)
			}
		}
	}
	const allPocketCubes: Set<string> = new Set()
	for (const space of [...spaceMap]) {
		if (allPocketCubes.has(space)) continue
		const toCheck: Set<string> = new Set([space])
		const airCluster: Set<string> = new Set()
		let clusterSurfaceArea = 0
		let enclosed = true
		while (enclosed && toCheck.size > 0) {
			const [checking] = toCheck
			const [x, y, z] = xyz(checking)
			airCluster.add(checking)
			toCheck.delete(checking)
			clusterSurfaceArea += 6
			for (const [nx, ny, nz] of neighbors(x, y, z)) {
				if (
					nx < bounds[0] ||
					nx > bounds[1] ||
					ny < bounds[2] ||
					ny > bounds[3] ||
					nz < bounds[4] ||
					nz > bounds[5]
				) {
					// Out of bounds
					enclosed = false
					break
				}
				const nGrid = grid(nx, ny, nz)
				const cubeInCluster = airCluster.has(nGrid)
				if (cubeInCluster) clusterSurfaceArea -= 2
				if (
					!cubeMap.has(nGrid) &&
					!cubeInCluster &&
					!allPocketCubes.has(nGrid)
				) {
					toCheck.add(nGrid)
				}
			}
		}
		if (enclosed) {
			surfaceArea -= clusterSurfaceArea
			for (const space of [...airCluster]) {
				allPocketCubes.add(space)
			}
		}
	}
	return surfaceArea.toString()
}

run({
	part1: {
		tests: [
			{
				input: `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`,
				expected: '64',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`,
				expected: '58',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
