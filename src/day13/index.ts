import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n\n')
		.map((pair) => {
			const [packet1, packet2] = pair.split('\n').map((p) => JSON.parse(p))
			return [packet1, packet2] as [NumberOrArray, NumberOrArray]
		})

type NumberOrArray = number | NumberOrArray[]

const compareValues = (a: NumberOrArray, b: NumberOrArray): -1 | 0 | 1 => {
	if (!Array.isArray(a) && !Array.isArray(b)) {
		// Both are integers
		if (a < b) return -1
		if (b < a) return 1
		return 0
	}
	if (!Array.isArray(b)) b = [b]
	if (!Array.isArray(a)) a = [a]
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		if (i + 1 > a.length) return -1
		else if (i + 1 > b.length) return 1
		const result = compareValues(a[i], b[i])
		if (result !== 0) return result
	}
	return 0
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let indexSum = 0
	for (let p = 0; p < input.length; p++) {
		if (compareValues(...input[p]) === -1) {
			indexSum += p + 1
		}
	}
	return indexSum.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const flatPackets = []
	for (const pair of input) {
		flatPackets.push(...pair)
	}
	const divider1 = [[2]]
	const divider2 = [[6]]
	flatPackets.push(divider1, divider2)
	flatPackets.sort(compareValues)
	return (
		(flatPackets.indexOf(divider1) + 1) *
		(flatPackets.indexOf(divider2) + 1)
	).toString()
}

run({
	part1: {
		tests: [
			{
				input: `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
				expected: '13',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
				expected: '140',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
