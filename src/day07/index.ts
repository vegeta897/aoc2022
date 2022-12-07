import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput
		.trim()
		.split('\n')
		.map((v) => v.split(' '))

const getDirSizeMap = (inputLines: string[][]) => {
	const dirSizeMap: Map<string, number> = new Map()
	const currentDir: string[] = []
	dirSizeMap.set('/', 0) // Root
	for (const words of inputLines) {
		if (words[0] === '$') {
			// Command
			if (words[1] === 'cd') {
				// Change dir
				const changeTo = words[2]
				if (changeTo === '..') {
					currentDir.pop()
				} else if (changeTo === '/') {
					currentDir.length = 0
				} else {
					currentDir.push(changeTo)
				}
			} else if (words[1] === 'ls') {
				// List contents
			}
		} else if (words[0] === 'dir') {
			// Dir
			dirSizeMap.set([...currentDir, words[1]].join('/'), 0)
		} else {
			// File
			const path = [...currentDir]
			// Crawl up dir tree to update each dir size
			while (path.length > 0) {
				dirSizeMap.set(
					path.join('/'),
					dirSizeMap.get(path.join('/'))! + +words[0]
				)
				path.pop()
			}
			dirSizeMap.set('/', dirSizeMap.get('/')! + +words[0]) // Root
		}
	}
	return dirSizeMap
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const dirSizeMap = getDirSizeMap(input)
	let totalSizeOfDirsUnder100000 = 0
	for (const [_path, dirSize] of dirSizeMap) {
		if (dirSize <= 100000) {
			totalSizeOfDirsUnder100000 += dirSize
		}
	}
	return totalSizeOfDirsUnder100000.toString()
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const dirSizeMap = getDirSizeMap(input)
	const needToFree = 30000000 - (70000000 - dirSizeMap.get('/')!)
	let closestSize = Infinity
	for (const [_path, dirSize] of dirSizeMap) {
		if (dirSize >= needToFree && dirSize < closestSize) {
			closestSize = dirSize
		}
	}
	return closestSize.toString()
}

run({
	part1: {
		tests: [
			{
				input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
				expected: '95437',
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
				expected: '24933642',
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	// onlyTests: true,
})
