"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import SlidingWindowVisualizerComponent from "@/components/algorithm/sliding-window-visualizer";
import SlidingWindowInput from "@/components/algorithm/sliding-window-input";
import { VisualizationStep } from "@/lib/visualization-utils";

interface SlidingWindowData {
  array: number[];
  windowSize: number;
}

const initialData: SlidingWindowData[] = [
  {
    array: [2, 1, 5, 1, 3, 2],
    windowSize: 3
  }
];

function generateSlidingWindowSteps(data: SlidingWindowData): VisualizationStep[] {
  const { array, windowSize } = data;
  const steps: VisualizationStep[] = [];

  if (array.length === 0 || windowSize <= 0 || windowSize > array.length) {
    steps.push({
      type: "invalid-input",
      id: 0,
      description: "Invalid input: array is empty or window size is invalid.",
      data: {
        array: [],
        windowSize: 0,
        windowStart: 0,
        windowEnd: 0,
        currentSum: 0,
        maxSum: 0,
        bestStart: 0
      }
    });
    return steps;
  }

  let maxSum = 0;
  let currentSum = 0;
  let bestStart = 0;

  // Calculate sum of first window
  for (let i = 0; i < windowSize; i++) {
    currentSum += array[i];
  }
  maxSum = currentSum;

  // Initial window
  steps.push({
    type: "init",
    id: 0,
    description: `Initialize first window of size ${windowSize}. Calculate sum: ${array.slice(0, windowSize).join(' + ')} = ${currentSum}.`,
    data: {
      array: [...array],
      windowSize,
      windowStart: 0,
      windowEnd: windowSize - 1,
      currentSum,
      maxSum,
      bestStart
    }
  });

  // Slide the window
  for (let i = windowSize; i < array.length; i++) {
    const removeElement = array[i - windowSize];
    const addElement = array[i];
    
    // Show the sliding operation
    steps.push({
      type: "slide",
      id: steps.length,
      description: `Slide window: remove ${removeElement} from left, add ${addElement} to right. New sum = ${currentSum} - ${removeElement} + ${addElement} = ${currentSum - removeElement + addElement}.`,
      data: {
        array: [...array],
        windowSize,
        windowStart: i - windowSize + 1,
        windowEnd: i,
        currentSum: currentSum,
        maxSum,
        bestStart
      }
    });

    currentSum = currentSum - removeElement + addElement;

    if (currentSum > maxSum) {
      maxSum = currentSum;
      bestStart = i - windowSize + 1;
      
      steps.push({
        type: "new-max",
        id: steps.length,
        description: `New maximum found! Current sum (${currentSum}) > previous max (${maxSum}). Update max sum = ${currentSum}, best window starts at index ${bestStart}.`,
        data: {
          array: [...array],
          windowSize,
          windowStart: i - windowSize + 1,
          windowEnd: i,
          currentSum,
          maxSum,
          bestStart
        }
      });
    } else {
      steps.push({
        type: "no-update",
        id: steps.length,
        description: `Current sum (${currentSum}) ≤ max sum (${maxSum}). No update needed.`,
        data: {
          array: [...array],
          windowSize,
          windowStart: i - windowSize + 1,
          windowEnd: i,
          currentSum,
          maxSum,
          bestStart
        }
      });
    }
  }

  // Final result
  const bestWindow = array.slice(bestStart, bestStart + windowSize);
  steps.push({
    type: "complete",
    id: steps.length,
    description: `Algorithm completed! Maximum sum window: [${bestWindow.join(', ')}] with sum ${maxSum} at indices [${bestStart}, ${bestStart + windowSize - 1}].`,
    data: {
      array: [...array],
      windowSize,
      windowStart: bestStart,
      windowEnd: bestStart + windowSize - 1,
      currentSum,
      maxSum,
      bestStart
    }
  });

  return steps;
}

const pseudocode = [
  "function maxSumWindow(arr, k):",
  "  maxSum = 0",
  "  currentSum = 0",
  "  ",
  "  // Calculate sum of first window",
  "  for i = 0 to k - 1:",
  "    currentSum += arr[i]",
  "  maxSum = currentSum",
  "  ",
  "  // Slide the window",
  "  for i = k to length(arr) - 1:",
  "    currentSum = currentSum - arr[i-k] + arr[i]",
  "    maxSum = max(maxSum, currentSum)",
  "  ",
  "  return maxSum"
];

const relatedProblems = [
  { id: 209, title: "Minimum Size Subarray Sum", slug: "minimum-size-subarray-sum", difficulty: "Medium" as const },
  { id: 3, title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium" as const },
  { id: 424, title: "Longest Repeating Character Replacement", slug: "longest-repeating-character-replacement", difficulty: "Medium" as const },
  { id: 567, title: "Permutation in String", slug: "permutation-in-string", difficulty: "Medium" as const },
  { id: 438, title: "Find All Anagrams in a String", slug: "find-all-anagrams-in-a-string", difficulty: "Medium" as const }
];

const codeSamples = {
  javascript: `// Maximum sum subarray of size k using Sliding Window
function maxSumSubarray(arr, k) {
  if (k <= 0 || k > arr.length) return 0;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    if (windowSum > maxSum) maxSum = windowSum;
  }
  return maxSum;
}`,

  python: `# Maximum sum subarray of size k using Sliding Window
def max_sum_subarray(arr, k):
    if k <= 0 or k > len(arr):
        return 0
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        if window_sum > max_sum:
            max_sum = window_sum
    return max_sum`,

  java: `// Maximum sum subarray of size k using Sliding Window
public class SlidingWindowMaxSum {
    public int maxSumSubarray(int[] arr, int k) {
        if (arr == null || k <= 0 || k > arr.length) return 0;
        int windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i];
        int maxSum = windowSum;
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            if (windowSum > maxSum) maxSum = windowSum;
        }
        return maxSum;
    }
}`
};

export default function SlidingWindowPage() {
  return (
    <AlgorithmPageTemplate
      title="Sliding Window (Maximum Sum Subarray)"
      description="Find the maximum sum of a subarray with a fixed size k using the sliding window technique. Efficiently compute sums by adding new elements and removing old ones as the window slides."
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      visualizationComponent={SlidingWindowVisualizerComponent}
      generateSteps={(data) => generateSlidingWindowSteps(data[0])}
      initialData={initialData}
      dataInputComponent={SlidingWindowInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Arrays"
      code={codeSamples}
    />
  );
}