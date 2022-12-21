# 🎄 Advent of Code 2022 - day 21 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/21)

## Notes

Oh god, this was a disaster.

Part 1 went pretty smooth.

In part 2 I had to make a fresh `monkeyMap` every time, so I could try a new human number with unsolved monkeys each time. But I forgot that I was still iterating over the original monkey array and I spent way too long debugging this. UGH!

Then to get the actual answer, I did some very hacky trial and error by skipping over thousands, or millions, of human values at a time to see how the final root numbers compared. They appeared to have a linear relationship to the human value, which I guess I should be proud of myself for noticing. I was console logging the comparison every X number of steps. As they became closer, I would tweak the starting human value and step size to get closer and closer until I finally hit the solution.

I'm not going to commit that terrible code. By the time this file is committed, I will have come up with a real solution.

Update: Okay, I found a solution. The relationship between the human value and the a/b difference is not quite linear. So I settled on doing a somewhat messy method of increasing the step size until the difference inverts, then going back at a lower step speed. I'm happy with the solve time now.
