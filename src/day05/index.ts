import run from 'aocrunner'

const parseInput = (rawInput: string) => {
	const [stacks, instructions] = rawInput.split('\n\n')
	const rows = stacks.split('\n')
	rows.pop()
	const colCount = Math.ceil((rows[0].length + 1) / 4)
	const stackArr: string[][] = []
	for (let col = 1; col <= colCount; col++) {
		stackArr[col] = []
		for (const row of rows) {
			const crate = row.split('')[1 + (col - 1) * 4]
			if (crate.trim()) stackArr[col].unshift(crate)
		}
	}
	return {
		stacks: stackArr,
		instructions: instructions.split('\n').map((inst) => {
			const [first, last] = inst.split(' from ')
			const [_, count] = first.split('move ')
			const [from, __, to] = last.split(' ')
			return { count: +count, from: +from, to: +to }
		}),
	}
}

const part1 = (rawInput: string) => {
	const { stacks, instructions } = parseInput(rawInput)
	for (const { count, from, to } of instructions) {
		for (let c = 0; c < count; c++) {
			stacks[to].push(stacks[from].pop()!)
		}
	}
	return stacks.map((stack) => stack.at(-1)).join('')
}

const part2 = (rawInput: string) => {
	const { stacks, instructions } = parseInput(rawInput)
	for (const { count, from, to } of instructions) {
		stacks[to].push(...stacks[from].splice(stacks[from].length - count, count))
	}
	return stacks.map((stack) => stack.at(-1)).join('')
}

run({
	part1: {
		tests: [
			{
				input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
				expected: 'CMZ',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
				expected: 'MCD',
			},
		],
		solution: part2,
	},
	trimTestInputs: false,
	// onlyTests: true,
})
