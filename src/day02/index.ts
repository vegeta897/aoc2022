import run from 'aocrunner'

const parseInput = (rawInput: string): Round[] =>
	rawInput
		.trim()
		.split('\n')
		.map((v) => v.split(' ') as Round)

type Round = ['A' | 'B' | 'C', 'X' | 'Y' | 'Z']

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	const myMoves = {
		X: { value: 1, A: 3, B: 0, C: 6 },
		Y: { value: 2, A: 6, B: 3, C: 0 },
		Z: { value: 3, A: 0, B: 6, C: 3 },
	}

	let score = 0
	for (const round of input) {
		score += myMoves[round[1]].value + myMoves[round[1]][round[0]]
	}
	return score.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	const theirMoves = {
		A: { X: 3, Y: 1, Z: 2 },
		B: { X: 1, Y: 2, Z: 3 },
		C: { X: 2, Y: 3, Z: 1 },
	}

	const myMoveScores = {
		X: 0,
		Y: 3,
		Z: 6,
	}

	let score = 0
	for (const round of input) {
		score += theirMoves[round[0]][round[1]] + myMoveScores[round[1]]
	}

	return score.toString()
}

run({
	part1: {
		tests: [
			{
				input: `
				A Y
				B X
				C Z`,
				expected: '15',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
				A Y
				B X
				C Z`,
				expected: '12',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
