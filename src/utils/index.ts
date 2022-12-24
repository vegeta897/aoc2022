/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */
export const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max)

export const sign = (value: number) => (value >= 0 ? 1 : -1)

export const leastCommonMultiple = (a: number, b: number) =>
	Math.abs(a * b) / greatestCommonDivisor(a, b)

const greatestCommonDivisor = (a: number, b: number) => {
	while (b) {
		const bb = b
		b = a % b
		a = bb
	}
	return a
}
