# 🎄 Advent of Code 2022 - day 18 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/18)

## Notes

I did great on this one, except for a stumble in part 2.

My magic number for deciding that an empty space was not closed in was 1000 cubes. At that point, I stop the crawler and consider it open to the outside. As chance would have it, my puzzle input had plenty of 1-2 cube spaces, and one big space.

That one big space was **1018 cubes**, just barely exceeding my check. I wonder if that was intentional.

So I spent a good 10 or 15 minutes debugging a problem that didn't exist! I feel like I would have had a chance at a top 1000 rank for both parts if I hadn't messed that up. As it is, I ranked #874 and #1637, which aren't bad at all.

Now to see if I can find a way to calculate an upper limit on the size of that big empty space.

*20 minutes pass*

A-ha! I calculated an upper limit by finding the bounding box of the droplet and getting its volume. Then I subtracted the total number of solid cubes from it. Then for each enclosed space found, I subtracted its volume and the number of solid cubes that contain it, to make future searches quicker.

That was clever, but there was an even simpler way! With the bounding box, I can simply check if my crawler has gone outside of it. If it has, then it aborts immediately. Now I don't need an upper limit on crawled cubes, because it will _always_ either hit the bounding box (usually fairly quickly) or finish crawling the enclosed space.
