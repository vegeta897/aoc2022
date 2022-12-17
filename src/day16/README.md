# 🎄 Advent of Code 2022 - day 16 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/16)

## Notes

Good lord. Part 1 alone was a doozy, taking me over 2 hours. Realizing I had to check every permutation instead of just trying to find the most optimal next node took some time. 

Then in part 2, I spent most of the time trying to modify my big `evaluate` function to handle two agents. My god, it was messy, in all iterations. It was so miserable trying to manage whether each agent was pathing, needed a path, or needed to stop entirely. I couldn't even figure out how to test each agent individually heading toward the final closed valve. In retrospect, I could have tested to see who was closer. But wait, what if there was a tie? Ahh!

I finally had the breakthrough that I could simulate one agent at a time by making lists of "banned" valves, so each agent gets a mutually exclusive list of closed (and rated) valves they can open. Despite this being successful, it took 15-20 minutes of runtime to give me the right answer, and a full hour to finish all permutations.

By the time of this commit, I went back and made some optimizations, specifically with the ban lists. By calculating the maximum number of valves one agent could open (a naive upper boundary of 2 minutes per rated valve), we know that the minimum amount of banned valves must be the number of valves that can't be opened by that agent. On the other side, the maximum number of valves banned is half the number of rated valves, because anything more than that would be an inverse of an existing ban. I also do a check to see if each ban was already tried as the other agent's ban.

It was still quite slow after that (~6 minutes) but it was better than an hour. I even added caching of best pressure for each evaluation based on a hash of all the state, but it still didn't improve it much despite grabbing cached values thousands of times.

Finally, when evaluating the next valve to go to, I calculated the total pressure released by that valve and only evaluated the top 3. This feels very hacky, because it may not work with other inputs, but screw it, it gets the total time for both parts down to ~30 seconds.
