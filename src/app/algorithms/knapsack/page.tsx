"use client";

import { useState } from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import KnapsackVisualizerComponent from "@/components/algorithm/knapsack-visualizer";
import KnapsackInput from "@/components/algorithm/knapsack-input";
import { VisualizationStep } from "@/lib/visualization-utils";

interface KnapsackItem {
  weight: number;
  value: number;
  name: string;
}

interface KnapsackData {
  items: KnapsackItem[];
  capacity: number;
}

const initialData: KnapsackData[] = [
  {
    items: [
      { weight: 2, value: 3, name: "Item 1" },
      { weight: 3, value: 4, name: "Item 2" },
      { weight: 4, value: 5, name: "Item 3" },
      { weight: 5, value: 6, name: "Item 4" }
    ],
    capacity: 8
  }
];

const generateKnapsackSteps = (data: KnapsackData[]): VisualizationStep[] => {
  const knapsackData = data[0];
  const { items, capacity } = knapsackData;
  const steps: VisualizationStep[] = [];
  const n = items.length;

  // Create DP table: dp[i][w] = maximum value using first i items with weight limit w
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  // Initial step
  steps.push({
    id: 0,
    type: "init",
    description: `Starting 0/1 Knapsack with ${n} items and capacity ${capacity}. Initializing DP table.`,
    data: {
      dp: dp.map(row => [...row]),
      currentItem: 0,
      currentWeight: 0,
      solution: [],
      maxValue: 0
    }
  });

  // Fill DP table
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    
    for (let w = 0; w <= capacity; w++) {
      if (item.weight <= w) {
        // Can include item: max(include, exclude)
        const includeValue = item.value + dp[i - 1][w - item.weight];
        const excludeValue = dp[i - 1][w];
        
        dp[i][w] = Math.max(includeValue, excludeValue);
        
        steps.push({
          id: steps.length,
          type: "dp-include-exclude",
          description: `Item ${i}: ${item.name} (w=${item.weight}, v=${item.value}). Weight limit ${w}. ` +
                      `Include: ${includeValue}, Exclude: ${excludeValue}. Taking max: ${dp[i][w]}.`,
          data: {
            dp: dp.map(row => [...row]),
            currentItem: i,
            currentWeight: w,
            solution: [],
            maxValue: dp[i][w],
            includeValue,
            excludeValue
          }
        });
      } else {
        // Cannot include item
        dp[i][w] = dp[i - 1][w];
        
        steps.push({
          id: steps.length,
          type: "dp-exclude",
          description: `Item ${i}: ${item.name} (w=${item.weight}, v=${item.value}). Weight limit ${w}. ` +
                      `Item too heavy, excluding. Value: ${dp[i][w]}.`,
          data: {
            dp: dp.map(row => [...row]),
            currentItem: i,
            currentWeight: w,
            solution: [],
            maxValue: dp[i][w]
          }
        });
      }
    }
  }

  // Backtrack to find solution
  const solution: number[] = [];
  let i = n;
  let w = capacity;

  steps.push({
    id: steps.length,
    type: "backtrack-start",
    description: `Maximum value found: ${dp[n][capacity]}. Now backtracking to find selected items.`,
    data: {
      dp: dp.map(row => [...row]),
      currentItem: i,
      currentWeight: w,
      solution: [...solution],
      maxValue: dp[n][capacity]
    }
  });

  while (i > 0 && w > 0) {
    // If value came from including current item
    if (dp[i][w] !== dp[i - 1][w]) {
      solution.push(i - 1); // Add item index
      w -= items[i - 1].weight;
      
      steps.push({
        id: steps.length,
        type: "backtrack-include",
        description: `Item ${i}: ${items[i - 1].name} was included in optimal solution. ` +
                    `Remaining capacity: ${w}.`,
        data: {
          dp: dp.map(row => [...row]),
          currentItem: i,
          currentWeight: w,
          solution: [...solution],
          maxValue: dp[n][capacity]
        }
      });
    } else {
      steps.push({
        id: steps.length,
        type: "backtrack-skip",
        description: `Item ${i}: ${items[i - 1].name} was not included in optimal solution.`,
        data: {
          dp: dp.map(row => [...row]),
          currentItem: i,
          currentWeight: w,
          solution: [...solution],
          maxValue: dp[n][capacity]
        }
      });
    }
    i--;
  }

  // Final solution
  solution.reverse(); // Show in original order
  steps.push({
    id: steps.length,
    type: "complete",
    description: `Optimal solution found! Selected items: ${solution.map(idx => items[idx].name).join(", ")}. ` +
                `Total value: ${dp[n][capacity]}, Total weight: ${solution.reduce((sum, idx) => sum + items[idx].weight, 0)}.`,
    data: {
      dp: dp.map(row => [...row]),
      currentItem: 0,
      currentWeight: 0,
      solution: [...solution],
      maxValue: dp[n][capacity]
    }
  });

  return steps;
};

  const pseudocode = [
    "function knapsack(items, capacity):",
    "  n = number of items",
    "  dp = array of size (n+1) x (capacity+1) initialized to 0",
    "  ",
    "  for i from 1 to n:",
    "    for w from 0 to capacity:",
    "      if items[i-1].weight <= w:",
    "        include = items[i-1].value + dp[i-1][w - items[i-1].weight]",
    "        exclude = dp[i-1][w]",
    "        dp[i][w] = max(include, exclude)",
    "      else:",
    "        dp[i][w] = dp[i-1][w]",
    "  ",
    "  // backtrack to find selected items",
    "  w = capacity",
    "  selected = []",
    "  for i from n down to 1:",
    "    if dp[i][w] != dp[i-1][w]:",
    "      selected.push(i-1)",
    "      w -= items[i-1].weight",
    "  return dp[n][capacity], selected"
  ];

  const relatedProblems = [
    {
      id: 416,
      title: "Partition Equal Subset Sum",
      slug: "partition-equal-subset-sum",
      difficulty: "Medium" as const
    },
    {
      id: 494,
      title: "Target Sum",
      slug: "target-sum",
      difficulty: "Medium" as const
    },
    {
      id: 474,
      title: "Ones and Zeroes",
      slug: "ones-and-zeroes",
      difficulty: "Medium" as const
    },
    {
      id: 1049,
      title: "Last Stone Weight II",
      slug: "last-stone-weight-ii",
      difficulty: "Medium" as const
    },
    {
      id: 879,
      title: "Profitable Schemes",
      slug: "profitable-schemes",
      difficulty: "Hard" as const
    }
  ];
  
  const codeSamples = {
    "JavaScript": `// 0/1 Knapsack Dynamic Programming solution
  function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w], // don't take item
            dp[i - 1][w - weights[i - 1]] + values[i - 1] // take item
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }
    
    return dp[n][capacity];
  }`,
    "Python": `# 0/1 Knapsack Dynamic Programming solution
  def knapsack(weights, values, capacity):
      n = len(weights)
      dp = [[0] * (capacity + 1) for _ in range(n + 1)]
      
      for i in range(1, n + 1):
          for w in range(1, capacity + 1):
              if weights[i - 1] <= w:
                  dp[i][w] = max(
                      dp[i - 1][w],  # don't take item
                      dp[i - 1][w - weights[i - 1]] + values[i - 1]  # take item
                  )
              else:
                  dp[i][w] = dp[i - 1][w]
      
      return dp[n][capacity]`,
    "Java": `// 0/1 Knapsack Dynamic Programming solution
  public static int knapsack(int[] weights, int[] values, int capacity) {
      int n = weights.length;
      int[][] dp = new int[n + 1][capacity + 1];
      
      for (int i = 1; i <= n; i++) {
          for (int w = 1; w <= capacity; w++) {
              if (weights[i - 1] <= w) {
                  dp[i][w] = Math.max(
                      dp[i - 1][w], // don't take item
                      dp[i - 1][w - weights[i - 1]] + values[i - 1] // take item
                  );
              } else {
                  dp[i][w] = dp[i - 1][w];
              }
          }
      }
      
      return dp[n][capacity];
  }`
  };
  
export default function KnapsackPage() {
  return (
    <AlgorithmPageTemplate
      title="0/1 Knapsack (Dynamic Programming)"
      description="The classic 0/1 Knapsack problem using Dynamic Programming. Each item can only be taken once. Find the maximum value that can be achieved within the weight capacity."
      timeComplexity="O(n × capacity)"
      spaceComplexity="O(n × capacity)"
      visualizationComponent={KnapsackVisualizerComponent}
      generateSteps={generateKnapsackSteps}
      initialData={initialData}
      dataInputComponent={KnapsackInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Dynamic Programming"
      code={codeSamples}
    />
  );
}