import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((v) => {
			const [instr, val] = v.split(' ')
			return [instr, +val] as ['addx', number] | ['noop']
		})

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let cycle = 1
	let x = 1
	let signalSum = 0
	const checkStrength = () => {
		if ((cycle - 20) % 40 === 0) {
			signalSum += cycle * x
		}
	}
	for (const [instr, val] of input) {
		cycle++
		if (instr === 'noop') {
			// noop
		} else {
			checkStrength()
			cycle++
			x += val
		}
		checkStrength()
	}
	return signalSum.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let cycle = 1
	let x = 1
	const screen: string[][] = [[], [], [], [], [], []]
	const draw = () => {
		const pos = cycle - 1
		const row = Math.floor(pos / 40)
		const drawn = Math.abs((pos % 40) - x) <= 1
		screen[row].push(drawn ? '#' : '.')
	}
	for (const [instr, val] of input) {
		draw()
		cycle += 1
		if (instr === 'noop') {
			// noop
		} else {
			draw()
			cycle += 1
			x += val
		}
	}
	screen.forEach((row) => console.log(row.join('')))
	return 'ZFBFHGUP'
}

run({
	part1: {
		tests: [
			{
				input: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
				expected: '13140',
			},
		],
		solution: part1,
	},
	part2: {
		// tests: [
		// 	{
		// 		input: ``,
		// 		expected: '',
		// 	},
		// ],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
