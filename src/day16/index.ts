import run from 'aocrunner'

const parseInput = (rawInput: string) => {
	const valves: Map<
		string,
		{ rate: number; tunnels: Set<string>; open: boolean }
	> = new Map()
	rawInput
		.trim()
		.split('\n')
		.forEach((line) => {
			valves.set(line.substring(6, 8), {
				rate: +line.match(/rate=(\d+)/)![1],
				tunnels: new Set(line.match(/to valves? (.*)$/)![1].split(', ')),
				open: false,
			})
		})
	return valves
}

type ValveNode = {
	valve: string
	h: number
	parent: null | string
}

const pathCache: Map<string, number> = new Map()

function findPath(
	start: string,
	end: string,
	valves: ReturnType<typeof parseInput>
) {
	const cached = pathCache.get(start + ':' + end)
	if (cached) return cached
	let current: ValveNode = {
		valve: start,
		h: 0,
		parent: null,
	}
	const openNodes: Map<string, ValveNode> = new Map([[start, current]])
	const closedNodes: Map<string, ValveNode> = new Map()
	while (openNodes.size > 0) {
		closedNodes.set(current.valve, current)
		openNodes.delete(current.valve)
		if (current.valve === end) {
			const pathLength = getPathLength(start, current, closedNodes)
			pathCache.set(start + ':' + end, pathLength)
			return pathLength
		}
		for (const otherNode of valves.get(current.valve)!.tunnels) {
			if (closedNodes.has(otherNode)) {
				continue
			}
			const neighbor: ValveNode = {
				parent: current.valve,
				valve: otherNode,
				h: 0,
			}
			neighbor.h += 1
			const existing = openNodes.get(neighbor.valve)
			if (existing) {
				if (existing.h > neighbor.h) {
					existing.h = neighbor.h
					existing.parent = current.valve
				}
			} else {
				openNodes.set(neighbor.valve, neighbor)
			}
		}
		current = [...openNodes].reduce(
			(best, [, node]) => (node.h > best.h ? node : best),
			{ h: -1 }
		) as ValveNode
	}
	throw 'no path found'
}

function getPathLength(
	start: string,
	from: ValveNode,
	valves: Map<string, ValveNode>
) {
	let length = 0
	let current = from
	while (true) {
		if (current.valve === start) return length
		length++
		current = valves.get(current.parent!)!
	}
}

const evalCache: Map<string, number> = new Map()

const evaluate = (
	valves: ReturnType<typeof parseInput>,
	minutes = 30,
	banned: string[] = [],
	fromValve = 'AA',
	minute = 1,
	pressureReleased = 0,
	bestPressure = 0
) => {
	const closedValves = [...valves]
		.filter(
			([name, valve]) => !valve.open && valve.rate > 0 && !banned.includes(name)
		)
		.map(([name]) => name)
	const releasePerMinute = [...valves].reduce(
		(acc, [, valve]) => (valve.open ? valve.rate + acc : acc),
		0
	)
	if (closedValves.length === 0 || minute === minutes) {
		const finalPressureReleased =
			pressureReleased + releasePerMinute * (minutes + 1 - minute)
		if (finalPressureReleased > bestPressure) {
			return finalPressureReleased
		}
		return bestPressure
	}
	const cacheKey = [
		fromValve,
		minute,
		closedValves.join(':'),
		pressureReleased,
	].join('+')
	const cached = evalCache.get(cacheKey)
	if (cached) return cached
	let thisBest = 0
	const valveChoices = closedValves
		.map((valve) => {
			const steps = findPath(fromValve, valve, valves)
			return [
				valve,
				steps,
				(minutes - minute - steps) * valves.get(valve)!.rate,
			] as [string, number, number]
		})
		.sort(([, , a], [, , b]) => b - a)
		.slice(0, 3)
	for (const [valveName, steps] of valveChoices) {
		const timeToOpen = steps + 1
		if (minute + timeToOpen > minutes) {
			const best = evaluate(
				valves,
				minutes,
				banned,
				'',
				minutes,
				pressureReleased + releasePerMinute * (minutes - minute),
				bestPressure
			)
			if (best > thisBest) thisBest = best
			continue
		}
		const releaseMeantime = releasePerMinute * timeToOpen
		const valvesClone = new Map(
			[...valves].map(([valveName, valve]) => [valveName, { ...valve }])
		)
		valvesClone.get(valveName)!.open = true
		const best = evaluate(
			valvesClone,
			minutes,
			banned,
			valveName,
			minute + timeToOpen,
			pressureReleased + releaseMeantime,
			bestPressure
		)
		if (best > thisBest) thisBest = best
	}
	evalCache.set(cacheKey, thisBest)
	return thisBest
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	pathCache.clear()
	evalCache.clear()
	const bestPressure = evaluate(input)
	return bestPressure.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	pathCache.clear()
	evalCache.clear()
	const MINUTES = 26
	const ratedValves = [...input]
		.filter(([, valve]) => valve.rate > 0)
		.map(([name]) => name)
	ratedValves.sort()
	const ratedValveCount = ratedValves.length
	const maxValvesPerAgent = Math.min(
		ratedValveCount,
		Math.floor((MINUTES - 1) / 3)
	)
	const minBanned = Math.max(1, ratedValveCount - maxValvesPerAgent)
	const maxBanned = Math.floor(ratedValveCount / 2)
	const banLists = new Array(1 << ratedValveCount)
		.fill(0)
		.map((e1, i) => ratedValves.filter((e2, j) => i & (1 << j)))
		.filter((list) => list.length >= minBanned && list.length <= maxBanned)
	let bestPressure = 0
	const attemptedBanInverts: Set<string> = new Set()
	for (const banList of banLists) {
		const banString = banList.join(':')
		const banInverse = ratedValves.filter((v) => !banList.includes(v))
		if (attemptedBanInverts.has(banString)) continue
		const banInverseString = banInverse.join(':')
		const pressure = evaluate(input, MINUTES, banList)
		const inversePressure = evaluate(input, MINUTES, banInverse)
		const combinedPressure = pressure + inversePressure
		if (combinedPressure > bestPressure) bestPressure = combinedPressure
		attemptedBanInverts.add(banInverseString)
	}
	return bestPressure.toString()
}

run({
	part1: {
		tests: [
			{
				input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`,
				expected: '1651',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`,
				expected: '1707',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
