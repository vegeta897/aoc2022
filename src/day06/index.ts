import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.trim().split('')

const findUniqueCharsPosition = (chars: string[], setSize: number) => {
	const lastChars: string[] = []
	for (let i = 0; i < chars.length; i++) {
		lastChars.push(chars[i])
		if (lastChars.length > setSize) lastChars.shift()
		if (new Set(lastChars).size === setSize) {
			return i + 1
		}
	}
	throw 'failed'
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	return findUniqueCharsPosition(input, 4).toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	return findUniqueCharsPosition(input, 14).toString()
}

run({
	part1: {
		tests: [
			{
				input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
				expected: '7',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
				expected: '19',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
