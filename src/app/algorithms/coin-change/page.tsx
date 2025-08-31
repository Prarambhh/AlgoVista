"use client";

import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import CoinChangeVisualizer from "@/components/algorithm/coin-change-visualizer";
import CoinChangeInput from "@/components/algorithm/coin-change-input";
import { VisualizationStep } from "@/lib/visualization-utils";

// Generate visualization steps for Coin Change (min coins)
function generateCoinChangeSteps(data: any[]): VisualizationStep[] {
  const { coins = [1, 2, 5], amount = 11 } = (data && data[0]) || {};
  const max = amount + 1; // sentinel for infinity
  const n = coins.length;

  // dp[i][a] = min coins to make amount a using first i coins (unbounded)
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(amount + 1).fill(max));
  const take: boolean[][] = Array.from({ length: n + 1 }, () => Array(amount + 1).fill(false));

  // base case: 0 coins to make amount 0
  for (let i = 0; i <= n; i++) dp[i][0] = 0;

  const steps: VisualizationStep[] = [];

  // Add initial step
  steps.push({
    type: "info",
    description: `Initialize DP table with size ${(n + 1)} x ${(amount + 1)}. dp[i][0] = 0, others = ∞ (sentinel ${max}).`,
    data: { coins, amount, dp: dp.map((r) => [...r]), currentI: 0, currentA: 0, phase: "building" },
  });

  for (let i = 1; i <= n; i++) {
    for (let a = 1; a <= amount; a++) {
      const without = dp[i - 1][a];
      let best = without;
      let choose = false;
      if (a - coins[i - 1] >= 0 && dp[i][a - coins[i - 1]] + 1 < best) {
        best = dp[i][a - coins[i - 1]] + 1;
        choose = true; // take current coin (unbounded -> stay in same row)
      }
      dp[i][a] = best;
      take[i][a] = choose;

      steps.push({
        type: "step",
        description: choose
          ? `At i=${i} (coin=${coins[i - 1]}), a=${a}: take coin -> 1 + dp[${i}][${a - coins[i - 1]}] vs skip dp[${i - 1}][${a}] => dp=${best}`
          : `At i=${i} (coin=${coins[i - 1]}), a=${a}: skip -> dp[${i - 1}][${a}]=${without}`,
        data: { coins, amount, dp: dp.map((r) => [...r]), currentI: i, currentA: a, phase: "building" },
        highlights: [{ row: i, col: a } as any],
      });
    }
  }

  const minCoins = dp[n][amount];
  if (minCoins >= max) {
    steps.push({
      type: "result",
      description: `No solution: amount ${amount} cannot be formed with given coins`,
      data: { coins, amount, dp: dp.map((r) => [...r]), currentI: n, currentA: amount, phase: "complete", solutionExists: false, minCoins: Infinity, chosenCoins: [] },
    });
    return steps;
  }

  // Backtrack to reconstruct chosen coins and record path
  const chosen: number[] = [];
  let i = n, a = amount;
  const path: Array<{ row: number; col: number }> = [{ row: i, col: a }];

  steps.push({
    type: "info",
    description: `Backtracking to reconstruct chosen coins from dp[${n}][${amount}]=${minCoins}`,
    data: { coins, amount, dp: dp.map((r) => [...r]), currentI: i, currentA: a, phase: "backtracking", backtrackPath: [...path] },
  });

  while (a > 0 && i > 0) {
    if (take[i][a]) {
      chosen.push(coins[i - 1]);
      a -= coins[i - 1];
      path.push({ row: i, col: a });
      steps.push({
        type: "step",
        description: `Take coin ${coins[i - 1]} -> move to dp[${i}][${a}]`,
        data: { coins, amount, dp: dp.map((r) => [...r]), currentI: i, currentA: a, phase: "backtracking", chosenCoins: [...chosen], backtrackPath: [...path] },
      });
    } else {
      i -= 1;
      path.push({ row: i, col: a });
      steps.push({
        type: "step",
        description: `Skip coin ${coins[i]} -> move to dp[${i}][${a}]`,
        data: { coins, amount, dp: dp.map((r) => [...r]), currentI: i, currentA: a, phase: "backtracking", chosenCoins: [...chosen], backtrackPath: [...path] },
      });
    }
  }

  steps.push({
    type: "result",
    description: `Minimum coins = ${minCoins}. Reconstruction complete.`,
    data: { coins, amount, dp: dp.map((r) => [...r]), currentI: i, currentA: a, phase: "complete", chosenCoins: chosen, minCoins, solutionExists: true, backtrackPath: [...path] },
  });

  return steps;
}

const pseudocode = [
  "function coinChangeMinCoins(coins, amount):",
  "  max = amount + 1  // sentinel for infinity",
  "  n = len(coins)",
  "  dp = array (n+1) x (amount+1) filled with max",
  "  for i in 0..n: dp[i][0] = 0",
  "",
  "  for i in 1..n:",
  "    for a in 1..amount:",
  "      dp[i][a] = dp[i-1][a] // skip coin i-1",
  "      if a - coins[i-1] >= 0:",
  "        dp[i][a] = min(dp[i][a], 1 + dp[i][a - coins[i-1]]) // take coin i-1 (unbounded)",
  "",
  "  if dp[n][amount] == max: return -1, []",
  "",
  "  // reconstruct",
  "  chosen = []",
  "  i = n; a = amount",
  "  while a > 0 and i > 0:",
  "    if dp[i][a] == 1 + dp[i][a - coins[i-1]]:",
  "      chosen.append(coins[i-1]); a -= coins[i-1]",
  "    else:",
  "      i -= 1",
  "  return dp[n][amount], chosen",
];

const relatedProblems = [
  { id: 322, title: "Coin Change", slug: "coin-change", difficulty: "Medium" as const },
  { id: 518, title: "Coin Change II", slug: "coin-change-ii", difficulty: "Medium" as const },
  { id: 279, title: "Perfect Squares", slug: "perfect-squares", difficulty: "Medium" as const },
];

export default function Page() {
  return (
    <AlgorithmPageTemplate
      title="Coin Change (Min Coins)"
      description="Find the minimum number of coins needed to make a given amount using unlimited coins of given denominations. Visualizes DP table building and reconstruction of chosen coins."
      timeComplexity="O(n × amount)"
      spaceComplexity="O(n × amount)"
      visualizationComponent={CoinChangeVisualizer}
      generateSteps={generateCoinChangeSteps}
      initialData={[{ coins: [1, 2, 5], amount: 11 }]}
      dataInputComponent={CoinChangeInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Dynamic Programming"
    />
  );
}