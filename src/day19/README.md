# 🎄 Advent of Code 2022 - day 19 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/19)

## Notes

More permutations!

I immediately liked the premise of this one, because it felt so much like a Factorio-style game. The challenge here was ruling out as many fail-states as possible. Caching seemed to have no purpose, unless I was just doing it wrong.

There is certainly more room for optimizing here, but the cruel thing is that blueprint #2 in the example input takes _soooo long_ to evaluate in part 2, whereas my actual input goes through part 2 in just 20 seconds. If I had just tried that sooner, instead of waiting for the test, I could have submitted much sooner.

Update: I looked on reddit for post-submission tips, particularly about caching. I think my method doesn't benefit from it, but I'm not sure. The build-order is all that matters, and I'm never repeating one.

Update 2: Since build orders are always unique, I instead cached based on number of bots and ores. I didn't use a map because of map size limits. Instead, I'm using a nested array with 2 numeric cache keys, inspired by [this solution](https://www.reddit.com/r/adventofcode/comments/zpihwi/comment/j0tmq48/?utm_source=reddit&utm_medium=web2x&context=3). Despite this, I still exceed heap size on part 2 with the example input. Weird, but I don't care anymore.
