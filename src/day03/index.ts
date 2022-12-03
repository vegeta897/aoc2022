import run from 'aocrunner'

const parseInput = (rawInput: string): string[] => rawInput.trim().split('\n')

const items = [...' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput).map((v) => [
		v.substring(0, v.length / 2),
		v.substring(v.length / 2, v.length),
	])
	let prioritySum = 0
	for (const sack of input) {
		const commonItem = [...sack[0]].find((c) => sack[1].includes(c))
		prioritySum += items.indexOf(commonItem!)
	}
	return prioritySum.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let prioritySum = 0
	for (let i = 0; i < input.length; i += 3) {
		const badgeItem = [...input[i]].find(
			(item) => input[i + 1].includes(item) && input[i + 2].includes(item)
		)
		prioritySum += items.indexOf(badgeItem!)
	}
	return prioritySum.toString()
}

run({
	part1: {
		tests: [
			{
				input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
				expected: '157',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
				expected: '70',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
