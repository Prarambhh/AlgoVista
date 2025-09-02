"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import KadaneVisualizerComponent from "@/components/algorithm/kadane-visualizer";
import KadaneInput from "@/components/algorithm/kadane-input";
import { VisualizationStep } from "@/lib/visualization-utils";

interface KadaneData {
  array: number[];
}

const initialData: KadaneData[] = [
  {
    array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
  }
];

function generateKadaneSteps(kadaneData: KadaneData): VisualizationStep[] {
  const { array } = kadaneData;
  const steps: VisualizationStep[] = [];
  
  if (array.length === 0) {
    steps.push({
      id: 0,
      type: "init-empty",
      description: "Empty array provided. Maximum subarray sum is 0.",
      data: {
        array: [],
        currentIndex: 0,
        currentSum: 0,
        maxSum: 0,
        bestStart: 0,
        bestEnd: 0,
        tempStart: 0
      }
    });
    return steps;
  }

  let maxSum = array[0];
  let currentSum = array[0];
  let bestStart = 0;
  let bestEnd = 0;
  let tempStart = 0;

  // Initial state
  steps.push({
    id: 0,
    type: "init",
    description: `Starting Kadane's Algorithm. Initialize maxSum = ${array[0]} and currentSum = ${array[0]} with the first element.`,
    data: {
      array: [...array],
      currentIndex: 0,
      currentSum: array[0],
      maxSum: array[0],
      bestStart: 0,
      bestEnd: 0,
      tempStart: 0
    }
  });

  // Process each element
  for (let i = 1; i < array.length; i++) {
    const element = array[i];
    
    // Show decision point
    if (currentSum < 0) {
      steps.push({
        id: steps.length,
        type: "decision-reset",
        description: `At index ${i}: currentSum (${currentSum}) < 0, so start a new subarray from index ${i} with value ${element}.`,
        data: {
          array: [...array],
          currentIndex: i,
          currentSum: currentSum,
          maxSum: maxSum,
          bestStart: bestStart,
          bestEnd: bestEnd,
          tempStart: tempStart
        }
      });
      
      currentSum = element;
      tempStart = i;
    } else {
      steps.push({
        id: steps.length,
        type: "decision-extend",
        description: `At index ${i}: currentSum (${currentSum}) ≥ 0, so extend current subarray by adding ${element}. New currentSum = ${currentSum + element}.`,
        data: {
          array: [...array],
          currentIndex: i,
          currentSum: currentSum,
          maxSum: maxSum,
          bestStart: bestStart,
          bestEnd: bestEnd,
          tempStart: tempStart
        }
      });
      
      currentSum += element;
    }

    // Update maximum if needed
    if (currentSum > maxSum) {
      maxSum = currentSum;
      bestStart = tempStart;
      bestEnd = i;
      
      steps.push({
        id: steps.length,
        type: "update-max",
        description: `New maximum found! currentSum (${currentSum}) > maxSum (${maxSum}). Update maxSum = ${currentSum}, best subarray: [${bestStart}, ${bestEnd}].`,
        data: {
          array: [...array],
          currentIndex: i,
          currentSum: currentSum,
          maxSum: maxSum,
          bestStart: bestStart,
          bestEnd: bestEnd,
          tempStart: tempStart
        }
      });
    } else {
      steps.push({
        id: steps.length,
        type: "no-update",
        description: `currentSum (${currentSum}) ≤ maxSum (${maxSum}). No update needed. Continue to next element.`,
        data: {
          array: [...array],
          currentIndex: i,
          currentSum: currentSum,
          maxSum: maxSum,
          bestStart: bestStart,
          bestEnd: bestEnd,
          tempStart: tempStart
        }
      });
    }
  }

  // Final result
  const subarray = array.slice(bestStart, bestEnd + 1);
  steps.push({
    id: steps.length,
    type: "complete",
    description: `Algorithm completed! Maximum subarray sum is ${maxSum}, found in subarray [${subarray.join(', ')}] at indices [${bestStart}, ${bestEnd}].`,
    data: {
      array: [...array],
      currentIndex: array.length - 1,
      currentSum: currentSum,
      maxSum: maxSum,
      bestStart: bestStart,
      bestEnd: bestEnd,
      tempStart: tempStart
    }
  });

  return steps;
}

const pseudocode = [
  "function kadane(array):",
  "  maxSum = array[0]",
  "  currentSum = array[0]",
  "  bestStart = 0",
  "  bestEnd = 0",
  "  tempStart = 0",
  "  ",
  "  for i = 1 to length(array) - 1:",
  "    if currentSum < 0:",
  "      currentSum = array[i]",
  "      tempStart = i",
  "    else:",
  "      currentSum += array[i]",
  "    ",
  "    if currentSum > maxSum:",
  "      maxSum = currentSum",
  "      bestStart = tempStart",
  "      bestEnd = i",
  "  ",
  "  return maxSum, bestStart, bestEnd"
];

const relatedProblems = [
  { id: 53, title: "Maximum Subarray", slug: "maximum-subarray", difficulty: "Medium" as const },
  { id: 152, title: "Maximum Product Subarray", slug: "maximum-product-subarray", difficulty: "Medium" as const },
  { id: 121, title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", difficulty: "Easy" as const },
  { id: 918, title: "Maximum Sum Circular Subarray", slug: "maximum-sum-circular-subarray", difficulty: "Medium" as const },
  { id: 1746, title: "Maximum Subarray Sum After One Operation", slug: "maximum-subarray-sum-after-one-operation", difficulty: "Medium" as const }
];

const codeSamples = {
  "JavaScript": `// Kadane's Algorithm - Maximum Subarray Sum
function kadane(arr) {
  if (arr.length === 0) return 0;
  let maxSoFar = arr[0];
  let current = arr[0];
  for (let i = 1; i < arr.length; i++) {
    current = Math.max(arr[i], current + arr[i]);
    maxSoFar = Math.max(maxSoFar, current);
  }
  return maxSoFar;
}`,
  "Python": `# Kadane's Algorithm - Maximum Subarray Sum
def kadane(arr):
    if not arr:
        return 0
    max_so_far = arr[0]
    current = arr[0]
    for x in arr[1:]:
        current = max(x, current + x)
        max_so_far = max(max_so_far, current)
    return max_so_far`,
  "Java": `// Kadane's Algorithm - Maximum Subarray Sum
public static int kadane(int[] arr) {
    if (arr.length == 0) return 0;
    int maxSoFar = arr[0];
    int current = arr[0];
    for (int i = 1; i < arr.length; i++) {
        current = Math.max(arr[i], current + arr[i]);
        maxSoFar = Math.max(maxSoFar, current);
    }
    return maxSoFar;
}`
};

export default function KadanePage() {
  return (
    <AlgorithmPageTemplate
      title="Kadane's Algorithm (Maximum Subarray)"
      description="Kadane's Algorithm finds the contiguous subarray with the largest sum in O(n) time. It uses dynamic programming to track the maximum sum ending at each position, deciding whether to extend the current subarray or start a new one."
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      visualizationComponent={KadaneVisualizerComponent}
      generateSteps={(data) => generateKadaneSteps(data[0])}
      initialData={initialData}
      dataInputComponent={KadaneInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Dynamic Programming"
      code={codeSamples}
    />
  );
}