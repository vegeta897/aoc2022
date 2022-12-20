import run from 'aocrunner'
import * as util from '../utils/index.js'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((v) => {
			const [dir, steps] = v.split(' ')
			return [dir, +steps] as ['L' | 'R' | 'U' | 'D', number]
		})

const simulateRope = (
	input: ReturnType<typeof parseInput>,
	tailKnots: number
) => {
	const head: [number, number] = [0, 0]
	const tails: [number, number][] = []
	for (let t = 0; t < tailKnots; t++) {
		tails.push([0, 0])
	}
	const tailGrids = new Set(['0:0'])
	for (const [dir, steps] of input) {
		for (let s = 0; s < steps; s++) {
			const index = dir === 'L' || dir === 'R' ? 0 : 1
			const delta = dir === 'L' || dir === 'U' ? -1 : 1
			head[index] += delta
			for (let t = 0; t < tails.length; t++) {
				const follow = t === 0 ? head : tails[t - 1]
				const hDist = follow[0] - tails[t][0]
				const vDist = follow[1] - tails[t][1]
				if (Math.abs(hDist) > 1 || Math.abs(vDist) > 1) {
					tails[t][0] += util.clamp(hDist, -1, 1)
					tails[t][1] += util.clamp(vDist, -1, 1)
					if (t === tails.length - 1) tailGrids.add(tails[t].join(':'))
				}
			}
		}
	}
	return tailGrids
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const tailGrids = simulateRope(input, 1)
	return tailGrids.size.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const tailGrids = simulateRope(input, 9)
	return tailGrids.size.toString()
}

run({
	part1: {
		tests: [
			{
				input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
				expected: '13',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
				expected: '36',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
