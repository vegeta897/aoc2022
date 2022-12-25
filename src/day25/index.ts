import run from 'aocrunner'

type SnafuDigit = '2' | '1' | '0' | '-' | '='
const SNAFU_DIGIT_ORDER: Readonly<SnafuDigit[]> = [
	'1',
	'2',
	'=',
	'-',
	'0',
] as const

const DIGIT_VALUES: Map<SnafuDigit, number> = new Map([
	['2', 2],
	['1', 1],
	['0', 0],
	['-', -1],
	['=', -2],
])

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((line) => {
			return line
		})

const toDecimal = (snafu: string) => {
	const reverseSnafuDigits = snafu.split('').reverse() as SnafuDigit[]
	let sum = 0
	for (let d = 0; d < reverseSnafuDigits.length; d++) {
		sum += DIGIT_VALUES.get(reverseSnafuDigits[d])! * 5 ** d
	}
	return sum
}

const toSnafu = (decimal: number) => {
	const snafuDigits: SnafuDigit[] = ['0']
	const incrementDigit = (d = 0) => {
		const oldDigit = snafuDigits[d]
		if (oldDigit === undefined) {
			snafuDigits[d] = '1'
			return
		}
		const newDigitIndex = (SNAFU_DIGIT_ORDER.indexOf(oldDigit) + 1) % 5
		const newDigit = SNAFU_DIGIT_ORDER[newDigitIndex]
		if (newDigit === '=') incrementDigit(d + 1)
		snafuDigits[d] = newDigit
	}
	let power5 = 1
	let start = 0
	while (true) {
		if (5 ** power5 > decimal) {
			power5--
			for (let d = power5; d >= 0; d--) {
				const amount = 5 ** d
				const nextUpAmount = 5 ** (d + 1)
				if (decimal >= start + nextUpAmount - amount) {
					snafuDigits[d] = '-'
					incrementDigit(d + 1)
					start += nextUpAmount - amount
				} else if (decimal >= start + nextUpAmount - amount * 2) {
					snafuDigits[d] = '='
					incrementDigit(d + 1)
					start += nextUpAmount - amount * 2
				} else if (decimal >= start + amount * 2) {
					snafuDigits[d] = '2'
					start += amount * 2
				} else if (decimal >= start + amount) {
					snafuDigits[d] = '1'
					start += amount
				} else {
					snafuDigits[d] = '0'
				}
			}
			break
		}
		power5++
	}
	return snafuDigits.reverse().join('')
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const sum = input.reduce((sum, value) => sum + toDecimal(value), 0)
	return toSnafu(sum)
}

run({
	part1: {
		tests: [
			{
				input: `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`,
				expected: '2=-1=0',
			},
		],
		solution: part1,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
