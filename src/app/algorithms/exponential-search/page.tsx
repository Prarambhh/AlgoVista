"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function generateExponentialSearchSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr].sort((a, b) => a - b);
  const target = array[Math.floor(array.length * 0.5)] || array[array.length - 1];
  const n = array.length;

  steps.push({ type: "init", description: `Exponential Search for ${target} in sorted array`, data: [...array] });

  if (array[0] === target) {
    steps.push({ type: "found", description: `Found at index 0`, data: [...array], highlights: [0] });
    return steps;
  }

  let bound = 1;
  while (bound < n && array[bound] <= target) {
    steps.push({ type: "bound", description: `Increasing bound to ${bound}, value: ${array[bound]}`, data: [...array], highlights: [bound] });
    bound *= 2;
  }

  const left = Math.floor(bound / 2);
  const right = Math.min(bound, n - 1);

  steps.push({ type: "range", description: `Binary search in range [${left}, ${right}]`, data: [...array], pointers: [left, right] });

  // Binary search within bounds
  let l = left, r = right;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    steps.push({ type: "binary-step", description: `Check mid ${mid} (value ${array[mid]})`, data: [...array], pointer: mid, pointers: [l, r] });

    if (array[mid] === target) {
      steps.push({ type: "found", description: `Found target at index ${mid}`, data: [...array], highlights: [mid] });
      return steps;
    } else if (array[mid] < target) {
      steps.push({ type: "move-left", description: `Move left to ${mid + 1}`, data: [...array] });
      l = mid + 1;
    } else {
      steps.push({ type: "move-right", description: `Move right to ${mid - 1}`, data: [...array] });
      r = mid - 1;
    }
  }

  steps.push({ type: "not-found", description: "Element not found", data: [...array] });
  return steps;
}

const pseudocode = [
  "function exponentialSearch(arr, target):",
  "  if arr[0] == target: return 0",
  "  bound = 1",
  "  while bound < n and arr[bound] <= target:",
  "    bound = bound * 2",
  "  left = bound/2",
  "  right = min(bound, n-1)",
  "  return binarySearch(arr, left, right, target)"
];

export default function ExponentialSearchPage() {
  const relatedProblems = leetcodeProblems["exponential-search"] || [];

  return (
    <AlgorithmPageTemplate
      title="Exponential Search"
      description="Exponential Search finds the range where the target may reside by exponentially increasing bounds, then performs binary search within that range."
      timeComplexity="O(log n)"
      spaceComplexity="O(1)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateExponentialSearchSteps}
      initialData={[2, 3, 4, 10, 40, 55, 60, 70, 80, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Searching Algorithm"
    />
  );
}