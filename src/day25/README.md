# 🎄 Advent of Code 2022 - day 25 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/25)

## Notes

Interesting one. Converting from Snafu to decimal was quite simple. The other way around was tricky. My first idea was to just increment a Snafu number starting from `0` a number of times equal to the decimal value. This was infeasible for the real input value that I had to convert.

While trying to shortcut to a higher starting value to begin incrementing from, my shortcut eventually ended up being the entire function, giving me the final Snafu number. Neat!

I spent 10-20 minutes debugging my correct answer because `aocrunner` was not [sending it correctly](https://github.com/caderek/aocrunner/pull/28). I finally just manually submitted it on the AoC page, and it was indeed correct. Oh well, I've had worse speed bumps this year!
