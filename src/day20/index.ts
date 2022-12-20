import run from 'aocrunner'

type NumberContainer = { n: number }

const parseInput = (rawInput: string): NumberContainer[] =>
	rawInput
		.trim()
		.split('\n')
		.map((line) => ({ n: +line }))

const mix = (input: NumberContainer[], times = 1) => {
	const mixed = [...input]
	for (let i = 0; i < times; i++) {
		for (const number of input) {
			const mixedIndex = mixed.indexOf(number)
			mixed.splice(mixedIndex, 1)
			const newIndex = (mixedIndex + number.n) % mixed.length
			if (newIndex === 0) {
				mixed.push(number)
			} else {
				mixed.splice(newIndex, 0, number)
			}
		}
	}
	return mixed
}

const getCoordinates = (mixed: NumberContainer[]) => {
	const theZeroIndex = mixed.findIndex(({ n }) => n === 0)
	return (
		mixed[(theZeroIndex + 1000) % mixed.length].n +
		mixed[(theZeroIndex + 2000) % mixed.length].n +
		mixed[(theZeroIndex + 3000) % mixed.length].n
	).toString()
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const mixed = mix(input)
	return getCoordinates(mixed)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const decryptKey = 811589153
	const realInput = input.map(({ n }) => ({ n: n * decryptKey }))
	const mixed = mix(realInput, 10)
	return getCoordinates(mixed)
}

run({
	part1: {
		tests: [
			{
				input: `1
2
-3
3
-2
0
4`,
				expected: '3',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `1
2
-3
3
-2
0
4`,
				expected: '1623178306',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
