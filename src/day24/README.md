# 🎄 Advent of Code 2022 - day 24 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/24)

## Notes

This seemed much scarier than it ended up being. I figured out that the blizzard patterns would repeat after a certain amount of time. State could be tracked and cached with just your position and the minute. I hit some speed bumps when debugging the code that invalidated certain illegal moves.

Also, my code for part 2 fails to match the example answer, but gave me the correct answer for my input. Go figure! Leaving in some temp code in case I want to go back and figure out why that's happening.

Update: Figured it out! After optimizing the forecast array to use the least common multiple, I realized something was very wrong, because that was breaking my code when it definitely should not have. I quickly found that my forecast array was missing the last state because I was iterating from 1 instead of 0. This happened to not be an issue in the final runs because the minute never reached the loop point in the forecast, except for the example in part 2. I'm quite relieved that I figured this out before going to bed.
