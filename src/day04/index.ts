import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((v) => v.split(',').map((r) => r.split('-').map((s) => +s))) as [
		[number, number],
		[number, number]
	][]

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	return input
		.filter(([[aStart, aEnd], [bStart, bEnd]]) => {
			return (
				(aStart <= bStart && aEnd >= bEnd) || (bStart <= aStart && bEnd >= aEnd)
			)
		})
		.length.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	return input
		.filter(([[aStart, aEnd], [bStart, bEnd]]) => {
			const sectors = new Set()
			for (let ai = aStart; ai <= aEnd; ai++) {
				sectors.add(ai)
			}
			for (let bi = bStart; bi <= bEnd; bi++) {
				if (sectors.has(bi)) return true
			}
			return false
		})
		.length.toString()
}

run({
	part1: {
		tests: [
			{
				input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
				expected: '2',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
				expected: '4',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
