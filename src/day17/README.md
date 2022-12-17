# 🎄 Advent of Code 2022 - day 17 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/17)

## Notes

This was an AWESOME day.

Part 1 was pretty straightforward. It was fun to program a tetris sim. I had a few slip-ups, like forgetting to check rock collision for wind, and not accounting for blocks that fall below the highest one.

Part 2 upped the ante, of course. At first, I could still run the same solution but with map chunking to avoid running out of memory. After making as many optimizations as I could, I was clearing about 10 million chunks every 3-4 seconds[^1]. That was going to take ~100 hours to finish. It slowly became clear that no amount of optimizing the simulation would get that down to a realistic timeframe. I had to find a big shortcut.

And I did! I realized that since the rock and wind patterns are on a loop, there must be a point where the last X number of rocks increases the total height by a certain amount every time. I did some trial and error to find the magic number of rocks that I could skip, and then it was just a matter of simulating up to the skip point, skipping, and then simulating the tail end, and adding the skipped height to the final height.

I was really amazed when one of my first results was correct. It felt awesome.

Then I went back and figured out how to calculate that magic number of rocks, and did some nice refactoring. It even occurred to me that I could use a generator function to iterate over the blocks in each rock! It's been years since I've used those. There's still a duplicated segment of 11 lines, but I'm okay with it.

[^1]: [Screenshot of how slow it was going](src/day17/this-aint-it.png)
