"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TwoPointersVisualizerComponent from "@/components/algorithm/two-pointers-visualizer";
import TwoPointersInput from "@/components/algorithm/two-pointers-input";
import { VisualizationStep } from "@/lib/visualization-utils";

interface TwoPointersData {
  array: number[];
  target: number;
}

const initialData: TwoPointersData[] = [
  {
    array: [1, 2, 3, 4, 6, 8, 9, 14, 15],
    target: 9
  }
];

function generateTwoPointersSteps(data: TwoPointersData): VisualizationStep[] {
  const { array, target } = data;
  const steps: VisualizationStep[] = [];

  const arr = [...array].sort((a, b) => a - b);
  let left = 0;
  let right = arr.length - 1;

  // Initial state
  steps.push({
    type: "init",
    id: 0,
    description: `Initialize two pointers: left at 0 (value ${arr[0] ?? 'N/A'}) and right at ${arr.length - 1} (value ${arr[arr.length - 1] ?? 'N/A'}). Target = ${target}.`,
    data: {
      array: arr,
      left,
      right,
      target,
      sum: arr.length > 1 ? arr[left] + arr[right] : (arr[0] ?? 0),
      found: false
    }
  });

  while (left < right) {
    const sum = arr[left] + arr[right];

    // Show comparison step
    steps.push({
      type: "compare",
      id: steps.length,
      description: `Compare arr[left] (${arr[left]}) + arr[right] (${arr[right]}) = ${sum} with target ${target}.`,
      data: {
        array: arr,
        left,
        right,
        target,
        sum,
        found: sum === target
      }
    });

    if (sum === target) {
      steps.push({
        type: "found",
        id: steps.length,
        description: `Found a pair: ${arr[left]} + ${arr[right]} = ${target}.`,
        data: {
          array: arr,
          left,
          right,
          target,
          sum,
          found: true
        }
      });
      break;
    } else if (sum < target) {
      steps.push({
        type: "move-left-pointer",
        id: steps.length,
        description: `Sum (${sum}) < target (${target}). Move left pointer right to increase sum.`,
        data: {
          array: arr,
          left,
          right,
          target,
          sum,
          found: false
        }
      });
      left++;
    } else {
      steps.push({
        type: "move-right-pointer",
        id: steps.length,
        description: `Sum (${sum}) > target (${target}). Move right pointer left to decrease sum.`,
        data: {
          array: arr,
          left,
          right,
          target,
          sum,
          found: false
        }
      });
      right--;
    }
  }

  if (left >= right) {
    steps.push({
      type: "complete",
      id: steps.length,
      description: `Pointers crossed without finding a pair. No solution exists for target ${target}.`,
      data: {
        array: arr,
        left,
        right,
        target,
        sum: left < arr.length && right >= 0 ? arr[left] + arr[right] : 0,
        found: false
      }
    });
  }

  return steps;
}

const pseudocode = [
  "function twoPointers(arr, target):",
  "  left = 0",
  "  right = arr.length - 1",
  "  while left < right:",
  "    sum = arr[left] + arr[right]",
  "    if sum == target:",
  "      return left, right",
  "    else if sum < target:",
  "      left++",
  "    else:",
  "      right--",
  "  return -1, -1"
];

const relatedProblems = [
  { id: 167, title: "Two Sum II - Input Array Is Sorted", slug: "two-sum-ii-input-array-is-sorted", difficulty: "Medium" as const },
  { id: 15, title: "3Sum", slug: "3sum", difficulty: "Medium" as const },
  { id: 16, title: "3Sum Closest", slug: "3sum-closest", difficulty: "Medium" as const },
  { id: 18, title: "4Sum", slug: "4sum", difficulty: "Medium" as const },
  { id: 633, title: "Sum of Square Numbers", slug: "sum-of-square-numbers", difficulty: "Medium" as const }
];

const codeSamples = {
  javascript: `// Two pointers to find a pair with target sum in a sorted array
function twoPointers(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
  
  python: `# Two pointers to find a pair with target sum in a sorted array
def two_pointers(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return left, right
        if s < target:
            left += 1
        else:
            right -= 1
    return -1, -1`,

  java: `// Two pointers to find a pair with target sum in a sorted array
public class TwoPointersPairSum {
    public int[] twoPointers(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) return new int[]{left, right};
            if (sum < target) left++;
            else right--;
        }
        return new int[]{-1, -1};
    }
}`
};

export default function TwoPointersPage() {
  return (
    <AlgorithmPageTemplate
      title="Two Pointers (Pair with Target Sum)"
      description="Use two pointers on a sorted array to find a pair of numbers that sum to a target value. Move left pointer right when sum is small, right pointer left when sum is large."
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      visualizationComponent={TwoPointersVisualizerComponent}
      generateSteps={(data) => generateTwoPointersSteps(data[0])}
      initialData={initialData}
      dataInputComponent={TwoPointersInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Arrays"
      code={codeSamples}
    />
  );
}