import run from 'aocrunner'

const parseInput = (rawInput: string) => {
	return rawInput
		.trim()
		.split('\n\n')
		.filter((l) => l)
		.map((line) => {
			const [_number, startItems, operationLine, test, testTrue, testFalse] =
				line.split('\n')
			const operation = operationLine.substring(19)
			let opFn: (old: number) => number
			if (operation === 'old * old') {
				opFn = (old: number) => old * old
			} else if (operation.substring(0, 5) === 'old *') {
				opFn = (old: number) => old * +operation.substring(6)
			} else if (operation.substring(0, 5) === 'old +') {
				opFn = (old: number) => old + +operation.substring(6)
			}
			return {
				items: startItems
					.substring(18)
					.split(', ')
					.map((i) => +i),
				opFn: opFn!,
				divisor: +test.substring('  Test: divisible by'.length),
				trueMonkey: +testTrue.substring('    If true: throw to monkey'.length),
				falseMonkey: +testFalse.substring(
					'    If false: throw to monkey'.length
				),
				inspectCount: 0,
			}
		})
}

const simulateMonkeys = (
	monkeys: ReturnType<typeof parseInput>,
	rounds: number,
	reliefFactor = 1
) => {
	const divisorProduct = monkeys
		.map((m) => m.divisor)
		.reduce((prev, curr) => prev * curr, 1)
	for (let r = 0; r < rounds; r++) {
		for (const monkey of monkeys) {
			for (const item of monkey.items) {
				monkey.inspectCount++
				const result =
					Math.floor(monkey.opFn(item) / reliefFactor) % divisorProduct
				const pushTo =
					result % monkey.divisor === 0 ? monkey.trueMonkey : monkey.falseMonkey
				monkeys[pushTo].items.push(result)
			}
			monkey.items.length = 0
		}
	}
	const monkeyInspections = monkeys.map((m) => m.inspectCount)
	monkeyInspections.sort((a, b) => b - a)
	return (monkeyInspections[0] * monkeyInspections[1]).toString()
}

const part1 = (rawInput: string) => {
	const monkeys = parseInput(rawInput)
	return simulateMonkeys(monkeys, 20, 3)
}

const part2 = (rawInput: string) => {
	const monkeys = parseInput(rawInput)
	return simulateMonkeys(monkeys, 10000)
}

run({
	part1: {
		tests: [
			{
				input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
				expected: '10605',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
				expected: '2713310158',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
