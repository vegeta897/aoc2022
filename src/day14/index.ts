import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((line) =>
			line
				.split(' -> ')
				.map((coord) => coord.split(',').map((v) => +v) as [number, number])
		)

const buildMap = (lines: [number, number][][]) => {
	const map: ('X' | 'S')[][] = []
	for (const line of lines) {
		let prevX: number, prevY: number
		let firstPoint = true
		for (const [toX, toY] of line) {
			if (firstPoint) {
				firstPoint = false
			} else {
				let xA = prevX! < toX ? prevX! : toX
				let xB = prevX! < toX ? toX : prevX!
				let yA = prevY! < toY ? prevY! : toY
				let yB = prevY! < toY ? toY : prevY!
				for (let x = xA; x <= xB; x++) {
					for (let y = yA; y <= yB; y++) {
						if (!map[y]) map[y] = []
						map[y][x] = 'X'
					}
				}
			}
			prevX = toX
			prevY = toY
		}
	}
	return map
}

const simulateSand = (map: ('X' | 'S')[][], ground?: number) => {
	let restingSand = 0
	while (true) {
		const sand = [500, 0]
		while (true) {
			if (ground && sand[1] === ground - 1) {
				restingSand++
				if (!map[sand[1]]) map[sand[1]] = []
				map[sand[1]][sand[0]] = 'S'
				break
			}
			const nextY = map[sand[1] + 1]
			const down = nextY && nextY[sand[0]]
			if (!down) {
				sand[1]++
				// Check for void fall
				if (sand[1] > map.length) return restingSand.toString()
				continue
			}
			const downLeft = nextY[sand[0] - 1]
			if (!downLeft) {
				sand[1]++
				sand[0]--
				continue
			}
			const downRight = nextY[sand[0] + 1]
			if (!downRight) {
				sand[1]++
				sand[0]++
				continue
			}
			restingSand++
			if (sand[0] === 500 && sand[1] === 0) {
				// No more sand can fall
				return restingSand.toString()
			}
			if (!map[sand[1]]) map[sand[1]] = []
			map[sand[1]][sand[0]] = 'S'
			break
		}
	}
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const map = buildMap(input)
	return simulateSand(map)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const map = buildMap(input)
	const groundY = map.length + 1
	return simulateSand(map, groundY)
}

run({
	part1: {
		tests: [
			{
				input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
				expected: '24',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
				expected: '93',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
