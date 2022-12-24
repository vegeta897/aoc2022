import run from 'aocrunner'
import * as util from '../utils/index.js'

type XY = [number, number]
type DirNum = 0 | 1 | 2 | 3
type Blizzard = {
	dir: DirNum
	xy: XY
}
const dirArrows = ['>', 'v', '<', '^']
const dirs: XY[] = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1],
]
const dirsAndSelf: XY[] = [...dirs, [0, 0]]

const parseInput = (rawInput: string) => {
	const blizzards: Blizzard[] = []
	const rows = rawInput.trim().split('\n')
	const bottomWallY = rows.length - 1
	const rightWallX = rows[0].length - 1
	rows.forEach((line, y) => {
		if (y === 0 || y === bottomWallY) return
		line.split('').forEach((char, x) => {
			if (x === 0 || x === rightWallX) return
			if (dirArrows.includes(char)) {
				blizzards.push({ xy: [x, y], dir: dirArrows.indexOf(char) as DirNum })
			}
		})
	})
	const exit = [rightWallX - 1, bottomWallY] as XY
	return { blizzards, bottomWallY, rightWallX, exit }
}

const grid = (xy: XY) => xy[0] + ':' + xy[1]
const addGrid = (a: XY, b: XY): XY => [a[0] + b[0], a[1] + b[1]]

const stateCache: number[] = []

const buildForecast = (
	blizzards: Blizzard[],
	{ bottomWallY, rightWallX }: { bottomWallY: number; rightWallX: number }
) => {
	const forecast = []
	const horizontalSpace = rightWallX - 1
	const verticalSpace = bottomWallY - 1
	const loopTime = util.leastCommonMultiple(horizontalSpace, verticalSpace)
	for (let m = 0; m < loopTime; m++) {
		const blizzardGrids: Set<string> = new Set()
		for (const blizzard of blizzards) {
			const nextXY = addGrid(blizzard.xy, dirs[blizzard.dir])
			if (nextXY[0] === 0) nextXY[0] = rightWallX - 1
			else if (nextXY[0] === rightWallX) nextXY[0] = 1
			else if (nextXY[1] === 0) nextXY[1] = bottomWallY - 1
			else if (nextXY[1] === bottomWallY) nextXY[1] = 1
			blizzard.xy = nextXY
			blizzardGrids.add(grid(nextXY))
		}
		forecast[m] = blizzardGrids
	}
	return forecast
}

const takeStep = (
	options: {
		bottomWallY: number
		rightWallX: number
		start: XY
		exit: XY
		best: number
		maxMins: number
		forecast: Set<string>[]
	},
	me: XY = [1, 0],
	minute = 1
) => {
	if (minute === options.maxMins) return Infinity
	if (minute > options.best) return Infinity
	const cacheIndex = (me[0] << 20) + (me[1] << 12) + minute
	const cachedState = stateCache[cacheIndex]
	if (cachedState) return cachedState
	const blizzardGrids = options.forecast[(minute - 1) % options.forecast.length]
	let localBest = Infinity
	for (const dir of dirsAndSelf) {
		if (me[0] === 1 && dir[0] === -1) continue
		if (me[0] === options.rightWallX - 1 && dir[0] === 1) continue
		if (
			me[0] === options.start[0] &&
			me[1] === options.start[1] &&
			dir[0] !== 0
		)
			continue
		const moveTo = addGrid(me, dir)
		if (moveTo[0] === options.exit[0] && moveTo[1] === options.exit[1]) {
			if (minute < options.best) options.best = minute
			return minute
		}
		if (moveTo[1] === options.exit[1]) continue
		if (moveTo[1] === options.start[1] && moveTo[0] !== options.start[0])
			continue
		if (moveTo[1] < 0 || moveTo[1] > options.bottomWallY) continue
		if (!blizzardGrids.has(grid(moveTo))) {
			const minutes = takeStep(options, moveTo, minute + 1)
			if (minutes < localBest) localBest = minutes
		}
	}
	stateCache[cacheIndex] = localBest
	return localBest
}

const part1 = (rawInput: string) => {
	const { blizzards, bottomWallY, rightWallX, exit } = parseInput(rawInput)
	stateCache.length = 0
	const forecast = buildForecast(blizzards, { bottomWallY, rightWallX })
	const bestTime = takeStep({
		bottomWallY,
		rightWallX,
		forecast,
		start: [1, 0],
		exit,
		best: Infinity,
		maxMins: (bottomWallY + rightWallX) * 3,
	})
	return bestTime.toString()
}

const part2 = (rawInput: string) => {
	const { blizzards, bottomWallY, rightWallX, exit } = parseInput(rawInput)
	const forecast = buildForecast(blizzards, { bottomWallY, rightWallX })
	const maxMins = (bottomWallY + rightWallX) * 3
	const options = {
		bottomWallY,
		rightWallX,
		forecast,
		start: [1, 0] as XY,
		exit,
		best: Infinity,
		maxMins,
	}
	stateCache.length = 0
	const bestTime1 = takeStep(options)
	if (bestTime1 === Infinity) throw 'failed on trip 1'
	stateCache.length = 0
	const bestTime2 = takeStep(
		{
			...options,
			best: Infinity,
			start: exit,
			exit: [1, 0],
			maxMins: bestTime1 + maxMins,
		},
		exit,
		bestTime1 + 1
	)
	if (bestTime2 === Infinity) throw 'failed on trip 2'
	stateCache.length = 0
	const bestTime3 = takeStep(
		{ ...options, best: Infinity, maxMins: bestTime2 + maxMins },
		[1, 0],
		bestTime2 + 1
	)
	if (bestTime3 === Infinity) throw 'failed on trip 3'
	return bestTime3.toString()
}

run({
	part1: {
		tests: [
			{
				input: `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`,
				expected: '18',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`,
				expected: '54',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
