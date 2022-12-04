# 🎄 Advent of Code 2022 - day 4 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/4)

## Notes

These seem to be getting easier! Part 1 was tripping me up because I forgot to convert the sector IDs to strings.

Then in part 2, I tried for too long to come up with a comparison statement to detect overlaps, when I should have (and eventually did) just taken the "brute force" route by iterating each sector.

My submitted solution for that involved creating a set populated by A's sectors, then iterating B's sectors to see if the set contained it. Then I rewrote it to be even simpler and quicker, where I just iterated through A's sectors and checked if they were between B's start and end sectors.
