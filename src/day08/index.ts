import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((v) => v.split('').map((h) => +h))

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const visible: Set<string> = new Set()
	const testVisibility = (
		startX: number,
		startY: number,
		directionX: -1 | 0 | 1,
		directionY: -1 | 0 | 1
	) => {
		let x = startX
		let y = startY
		let lastHeight = -1
		while (y >= 0 && y < input.length && x >= 0 && x < input[y].length) {
			const height = input[y][x]
			if (height > lastHeight) {
				visible.add(`${x}:${y}`)
				lastHeight = height
			}
			x += directionX
			y += directionY
		}
	}
	for (let y = 0; y < input.length; y++) {
		testVisibility(0, y, 1, 0)
		testVisibility(input[y].length - 1, y, -1, 0)
	}
	for (let x = 0; x < input[0].length; x++) {
		testVisibility(x, 0, 0, 1)
		testVisibility(x, input.length - 1, 0, -1)
	}
	return visible.size.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const getVisibility = (
		startX: number,
		startY: number,
		directionX: -1 | 0 | 1,
		directionY: -1 | 0 | 1
	) => {
		const startHeight = input[startY][startX]
		let x = startX + directionX
		let y = startY + directionY
		let score = 0
		while (y >= 0 && y < input.length && x >= 0 && x < input[y].length) {
			score++
			if (input[y][x] >= startHeight) break
			x += directionX
			y += directionY
		}
		return score
	}
	let bestVisibilityScore = 0
	for (let y = 0; y < input.length; y++) {
		const row = input[y]
		for (let x = 0; x < row.length; x++) {
			const leftScore = getVisibility(x, y, -1, 0)
			const rightScore = getVisibility(x, y, 1, 0)
			const upScore = getVisibility(x, y, 0, -1)
			const downScore = getVisibility(x, y, 0, 1)
			const totalScore = leftScore * rightScore * upScore * downScore
			if (totalScore > bestVisibilityScore) bestVisibilityScore = totalScore
		}
	}
	return bestVisibilityScore.toString()
}

run({
	part1: {
		tests: [
			{
				input: `30373
25512
65332
33549
35390`,
				expected: '21',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `30373
25512
65332
33549
35390`,
				expected: '8',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
