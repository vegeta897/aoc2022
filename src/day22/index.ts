import run from 'aocrunner'

type Tile = '#' | '.'

const parseInput = (rawInput: string) => {
	const map: Map<string, { tile: Tile; side: number }> = new Map()
	const rowBounds: [number, number][] = []
	const colBounds: [number, number][] = []
	const [mapLines, instructions] = rawInput.split('\n\n')
	let startX: number
	let startY: number
	mapLines.split('\n').forEach((line, y) => {
		for (let x = 0; x < line.length; x++) {
			if (line[x].trim()) {
				if (!rowBounds[y]) {
					rowBounds[y] = [x, line.length - 1]
				}
				if (!colBounds[x]) {
					colBounds[x] = [y, y]
				} else {
					colBounds[x][1] = y
				}
				let side: number
				for (let s = 0; s < SIDES.length; s++) {
					const { min, max } = SIDES[s]!
					if (x >= min[0] && x <= max[0] && y >= min[1] && y <= max[1]) {
						side = s
						break
					}
				}
				map.set(grid(x, y), { tile: line[x] as Tile, side: side! })
				if (!startX) {
					startX = x
					startY = y
				}
			}
		}
	})
	return {
		map,
		instructions,
		rowBounds,
		colBounds,
		start: [startX!, startY!],
	}
}

const grid = (x: number, y: number) => x + ':' + y

const DIRS = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1],
]

const password = (x: number, y: number, dir: number) =>
	1000 * (y + 1) + 4 * (x + 1) + dir

const part1 = (rawInput: string) => {
	const { map, instructions, rowBounds, colBounds, start } =
		parseInput(rawInput)
	instructions.match(/([LR])/)
	let [atX, atY] = start
	let dir = 0
	for (let i = 0; i < instructions.length; i++) {
		let instruction = instructions[i]
		if (instruction === 'R') {
			dir = (dir + 1) % 4
		} else if (instruction === 'L') {
			dir = (dir + 3) % 4
		} else {
			while (true) {
				if ((instructions[++i] as unknown as number) >= 0) {
					instruction += instructions[i]
				} else {
					i--
					break
				}
			}
			const move = +instruction
			if (move === 0) continue
			for (let m = 0; m < move; m++) {
				let moveToX = atX + DIRS[dir][0]
				let moveToY = atY + DIRS[dir][1]
				let moveToTile = map.get(grid(moveToX, moveToY))
				if (moveToTile?.tile === '.') {
					atX = moveToX
					atY = moveToY
				} else if (moveToTile?.tile === '#') {
					break
				} else {
					if (dir % 2 === 0) {
						moveToX = rowBounds[moveToY][moveToX < atX ? 1 : 0]
					} else {
						moveToY = colBounds[moveToX][moveToY < atY ? 1 : 0]
					}
					moveToTile = map.get(grid(moveToX, moveToY))
					if (moveToTile?.tile === '.') {
						atX = moveToX
						atY = moveToY
					} else {
						break
					}
				}
			}
		}
	}
	return password(atX, atY, dir).toString()
}

type GridFn = (x: number, y: number) => number

type Side = {
	min: [number, number]
	max: [number, number]
	underX?: [GridFn, GridFn, number]
	overX?: [GridFn, GridFn, number]
	underY?: [GridFn, GridFn, number]
	overY?: [GridFn, GridFn, number]
}

const SIDES: Side[] = [
	{
		min: [50, 0],
		max: [99, 49],
		underX: [() => 0, (x, y) => 49 - y + 100, 0],
		underY: [() => 0, (x) => 150 + (x - 50), 0],
	}, // 1
	{
		min: [100, 0],
		max: [149, 49],
		overX: [() => 99, (x, y) => 49 - y + 100, 2],
		underY: [(x) => x - 100, () => 199, 3],
		overY: [() => 99, (x) => x - 100 + 50, 2],
	}, // 2
	{
		min: [50, 50],
		max: [99, 99],
		underX: [(x, y) => y - 50, () => 100, 1],
		overX: [(x, y) => y - 50 + 100, () => 49, 3],
	}, // 3
	{
		min: [0, 100],
		max: [49, 149],
		underX: [() => 50, (x, y) => 49 - (y - 100), 0],
		underY: [() => 50, (x) => x + 50, 0],
	}, // 4
	{
		min: [50, 100],
		max: [99, 149],
		overX: [() => 149, (x, y) => 49 - (y - 100), 2],
		overY: [() => 49, (x) => 150 + (x - 50), 2],
	}, // 5
	{
		min: [0, 150],
		max: [49, 199],
		underX: [(x, y) => y - 150 + 50, () => 0, 1],
		overX: [(x, y) => y - 150 + 50, () => 149, 3],
		overY: [(x) => x + 100, () => 0, 1],
	}, // 6
]

const part2 = (rawInput: string) => {
	const { map, instructions, start } = parseInput(rawInput)
	let [atX, atY] = start
	let dir = 0
	for (let i = 0; i < instructions.length; i++) {
		let instruction = instructions[i]
		if (instruction === 'R') {
			dir = (dir + 1) % 4
		} else if (instruction === 'L') {
			dir = (dir + 3) % 4
		} else {
			while (true) {
				if ((instructions[++i] as unknown as number) >= 0) {
					instruction += instructions[i]
				} else {
					i--
					break
				}
			}
			const move = +instruction
			if (move === 0) continue
			for (let m = 0; m < move; m++) {
				let moveToX = atX + DIRS[dir][0]
				let moveToY = atY + DIRS[dir][1]
				let moveToTile = map.get(grid(moveToX, moveToY))
				if (moveToTile) {
					if (moveToTile.tile === '.') {
						atX = moveToX
						atY = moveToY
					} else {
						break
					}
				} else {
					const atTile = map.get(grid(atX, atY))!
					const side = SIDES[atTile.side]
					let sideChange: [GridFn, GridFn, number]
					if (dir % 2 === 0) {
						sideChange = moveToX < atX ? side.underX! : side.overX!
					} else {
						sideChange = moveToY < atY ? side.underY! : side.overY!
					}
					const oldMoveToX = moveToX
					const oldMoveToY = moveToY
					moveToX = sideChange[0](oldMoveToX, oldMoveToY)
					moveToY = sideChange[1](oldMoveToX, oldMoveToY)
					moveToTile = map.get(grid(moveToX, moveToY))!
					if (moveToTile.tile === '.') {
						atX = moveToX
						atY = moveToY
						dir = sideChange[2]
					} else {
						break
					}
				}
			}
		}
	}
	return password(atX, atY, dir).toString()
}

run({
	part1: {
		tests: [
			{
				input: `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`,
				expected: '6032',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			// 			{
			// 				input: `        ...#
			//         .#..
			//         #...
			//         ....
			// ...#.......#
			// ........#...
			// ..#....#....
			// ..........#.
			//         ...#....
			//         .....#..
			//         .#......
			//         ......#.
			//
			// 10R5L5R10L4R5L5`,
			// 				expected: '5031',
			// 			},
		],
		solution: part2,
	},
	trimTestInputs: false,
	// onlyTests: true,
})
