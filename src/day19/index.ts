import run from 'aocrunner'
import * as util from '../utils/index.js'

type Resource = 'ore' | 'clay' | 'obsidian' | 'geode'
type Costs = { ore: number; clay: number; obsidian: number }
type Blueprint = {
	id: number
	costs: Record<Resource, Costs>
	maxOreCost: number
}

const parseInput = (rawInput: string): Blueprint[] =>
	rawInput
		.trim()
		.split('\n')
		.map((line) => {
			const id = +line.match(/Blueprint (\d+):/)![1]
			const ore = {
				ore: +line.match(/ore robot costs (\d+) ore/)![1],
				clay: 0,
				obsidian: 0,
			}
			const clay = {
				ore: +line.match(/clay robot costs (\d+) ore/)![1],
				clay: 0,
				obsidian: 0,
			}
			const [, oreObs, clayObs] = line.match(
				/obsidian robot costs (\d+) ore and (\d+) clay/
			)!
			const obsidian = {
				ore: +oreObs,
				clay: +clayObs,
				obsidian: 0,
			}
			const [, oreGeo, obsGeo] = line.match(
				/geode robot costs (\d+) ore and (\d+) obsidian/
			)!
			const geode = {
				ore: +oreGeo,
				clay: 0,
				obsidian: +obsGeo,
			}
			return {
				id,
				costs: { ore, clay, obsidian, geode },
				maxOreCost: Math.max(ore.ore, clay.ore, obsidian.ore, geode.ore),
			}
		})

const evalCache: Map<string, [number, string]> = new Map()

let MAX_MINUTES = 24 // TODO: Change to 24

const produce = (
	bots: Record<Resource, number>,
	store: Record<Resource, number>
) => {
	store.ore += bots.ore
	store.clay += bots.clay
	store.obsidian += bots.obsidian
	store.geode += bots.geode
}

const evaluate = (
	info: Blueprint,
	minute = 1,
	store: Record<Resource, number> = { ore: 0, clay: 0, obsidian: 0, geode: 0 },
	bots: Record<Resource, number> = {
		ore: 1,
		clay: 0,
		obsidian: 0,
		geode: 0,
	},
	building: Resource | null = null,
	buildOrder = ''
): [number, string] => {
	if (minute === 1) {
		const minWait = Math.min(info.costs.ore.ore, info.costs.clay.ore)
		store.ore += minWait
		return evaluate(info, minute + minWait, store)
	}
	if (minute === MAX_MINUTES) {
		produce(bots, store)
		return [store.geode, buildOrder]
	}
	// const cacheKey = minute + '#' + building + '#' + buildOrder
	// const cached = minute < 15 && evalCache.get(cacheKey)
	// if (cached) {
	// 	console.log('cache grab')
	// 	// TODO: Is cache used at all?
	// 	return cached
	// }
	if (building) {
		produce(bots, store)
		bots[building as Resource]++
		buildOrder += ' ' + building
		const result = evaluate(info, minute + 1, store, bots, null, buildOrder)
		// evalCache.set(cacheKey, result)
		return result
	}
	let best = [0, '']
	if (minute === MAX_MINUTES - 1 && bots.geode === 0) return [0, buildOrder]
	if (
		bots.ore >= info.costs.geode.ore &&
		bots.obsidian === info.costs.geode.obsidian
	) {
		for (let m = minute; m <= MAX_MINUTES; m++) {
			produce(bots, store)
			bots.geode++
			buildOrder += ' geode'
		}
		return [store.geode, buildOrder]
	}
	for (const nextBot in info.costs) {
		if (nextBot === 'ore' && bots.ore === info.maxOreCost) continue
		if (nextBot === 'clay' && bots.clay === info.costs.obsidian.clay) continue
		if (
			nextBot === 'obsidian' &&
			bots.clay === 0 &&
			bots.obsidian === info.costs.geode.obsidian
		)
			continue
		if (nextBot === 'geode' && (bots.clay === 0 || bots.obsidian === 0))
			continue
		const nextBotCosts = Object.entries(
			info.costs[nextBot as keyof Blueprint['costs']]
		)
		// Skip if not producing needed resource
		if (
			nextBotCosts.some(([resource, amount]) => {
				return amount > 0 && bots[resource as Resource] === 0
			})
		)
			continue
		const waitMinutes = nextBotCosts.reduce((acc, resource) => {
			if (resource[1] === 0) return acc
			const inStore = store[resource[0] as Resource]
			if (resource[1] <= inStore) return acc
			const making = bots[resource[0] as Resource]
			const mins = Math.ceil((resource[1] - inStore) / making)
			return mins > acc ? mins : acc
		}, 0)
		if (minute + waitMinutes + 1 > MAX_MINUTES) continue
		if (nextBot !== 'geode' && minute + waitMinutes + 1 >= MAX_MINUTES - 1)
			continue
		const storeClone = { ...store }
		for (let i = 0; i < waitMinutes; i++) {
			produce(bots, storeClone)
		}
		for (const [resource, amount] of nextBotCosts) {
			storeClone[resource as Resource] -= amount
		}
		const result = evaluate(
			info,
			minute + waitMinutes,
			storeClone,
			{ ...bots },
			nextBot as Resource,
			buildOrder
		)
		if (result[0] > best[0]) best = result
	}
	if (bots.geode > 0) {
		// Evaluate doing nothing for the rest of time
		const storeClone = { ...store }
		for (let m = minute; m <= MAX_MINUTES; m++) {
			produce(bots, storeClone)
		}
		if (storeClone.geode > best[0]) best = [storeClone.geode, buildOrder]
	}
	// if (minute < 15) evalCache.set(cacheKey, best as [number, string])
	return best as [number, string]
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	MAX_MINUTES = 24
	let qualitySum = 0
	for (const blueprint of input) {
		console.log('EVAL BLUEPRINT', blueprint.id)
		evalCache.clear()
		const [geodes, buildOrder] = evaluate(blueprint)
		const quality = geodes * blueprint.id
		console.log('EVAL FINISHED', blueprint.id, geodes, quality, buildOrder)
		qualitySum += quality
	}
	return qualitySum.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput).slice(0, 3)
	MAX_MINUTES = 32
	let geodeProduct = 1
	for (const blueprint of input) {
		console.log('EVAL BLUEPRINT', blueprint.id)
		evalCache.clear()
		const [geodes, buildOrder] = evaluate(blueprint)
		console.log('EVAL FINISHED', blueprint.id, geodes, buildOrder)
		geodeProduct *= geodes
	}
	// 112 TOO LOW!
	return geodeProduct.toString()
}

run({
	part1: {
		tests: [
			{
				input: `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
			Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`,
				expected: '33',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			// {
			// 	input: `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
			// Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`,
			// 	expected: '3472',
			// },
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
