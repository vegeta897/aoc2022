import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((line) => line.split(''))

const TILES = 'abcdefghijklmnopqrstuvwxyz'.split('')

type PathGrid = {
	x: number
	y: number
	grid: string
	h: number
	parent: null | string
	tile: string
}

const gridKey = (x: number, y: number) => `${x}:${y}`

function findPath(
	map: string[][],
	startX: number,
	startY: number,
	endX: number,
	endY: number
) {
	let current: PathGrid = {
		x: startX,
		y: startY,
		grid: gridKey(startX, startY),
		h: 0,
		parent: null,
		tile: 'a',
	}
	const openGrids: Map<string, PathGrid> = new Map([[current.grid, current]])
	const closedGrids: Map<string, PathGrid> = new Map()
	while (openGrids.size > 0) {
		closedGrids.set(current.grid, current)
		openGrids.delete(current.grid)
		if (current.x === endX && current.y === endY) {
			return constructPath(startX, startY, current, closedGrids)
		}
		for (const [nx, ny] of [
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1],
		]) {
			const neighbor: PathGrid = {
				parent: current.grid,
				x: current.x + nx,
				y: current.y + ny,
				grid: gridKey(current.x + nx, current.y + ny),
				h: 0,
				tile: '',
			}
			if (closedGrids.has(neighbor.grid)) {
				continue
			}
			if (!map[neighbor.y] || !map[neighbor.y][neighbor.x]) {
				continue
			}
			neighbor.tile = map[neighbor.y][neighbor.x]
			if (neighbor.tile === 'E') neighbor.tile = 'z'
			if (neighbor.tile === 'S') neighbor.tile = 'a'
			if (TILES.indexOf(neighbor.tile) - TILES.indexOf(current.tile) > 1) {
				continue
			}
			neighbor.h += 1
			const existing = openGrids.get(neighbor.grid)
			if (existing) {
				if (existing.h > neighbor.h) {
					existing.h = neighbor.h
					existing.parent = current.grid
				}
			} else {
				openGrids.set(neighbor.grid, neighbor)
			}
		}
		current = getLowestHGrid(openGrids)!
	}
	throw 'no path found'
}

function getLowestHGrid(list: Map<string, PathGrid>) {
	let best
	for (const [, value] of list) {
		if (!best || value.h < best.h) {
			best = value
		}
	}
	return best
}

function constructPath(
	startX: number,
	startY: number,
	from: PathGrid,
	grids: Map<string, PathGrid>
) {
	const path = []
	let current = from
	let panic = 100000
	while (panic > 0) {
		panic--
		if (current.x === startX && current.y == startY) {
			break
		}
		path.push(current.grid)
		current = grids.get(current.parent!)!
	}
	return path
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let start: [number, number] | null = null
	let end: [number, number] | null = null
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === 'S') {
				start = [x, y]
			}
			if (input[y][x] === 'E') {
				end = [x, y]
			}
			if (start && end) {
				return findPath(input, ...start, ...end).length.toString()
			}
		}
	}
	throw 'start and end points not found!'
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let end: [number, number] | null = null
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === 'E') {
				end = [x, y]
				break
			}
		}
	}
	console.assert(end)
	let start: [number, number] | null = null
	let shortestPath = Infinity
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === 'S' || input[y][x] === 'a') {
				start = [x, y]
				try {
					const pathLength = findPath(input, ...start, ...end!).length
					if (pathLength > 0 && pathLength < shortestPath)
						shortestPath = pathLength
				} catch (_error) {
					// Okay, keep trying paths
				}
			}
		}
	}
	return shortestPath.toString()
}

run({
	part1: {
		tests: [
			{
				input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
				expected: '31',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
				expected: '29',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
