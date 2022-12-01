import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((v) => +v)

const getCaloriesPerElf = (input: number[]) => {
	const calories = []
	let current = 0
	for (const line of input) {
		// Gaps will be 0
		if (line) {
			current += line
		} else {
			calories.push(current)
			current = 0
		}
	}
	if (current) calories.push(current)
	return calories
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const calories = getCaloriesPerElf(input)
	return calories.sort((a, b) => b - a)[0].toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const calories = getCaloriesPerElf(input)
	return calories
		.sort((a, b) => b - a)
		.slice(0, 3)
		.reduce((a, b) => a + b, 0)
		.toString()
}

run({
	part1: {
		tests: [
			{
				input: `
				1000
				2000
				3000
				
				4000
				
				5000
				6000
				
				7000
				8000
				9000
				
				10000`,
				expected: '24000',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
				1000
				2000
				3000
				
				4000
				
				5000
				6000
				
				7000
				8000
				9000
				
				10000`,
				expected: '45000',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
