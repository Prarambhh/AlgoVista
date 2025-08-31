"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function generateInterpolationSearchSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  // Ensure sorted array
  const array = [...arr].sort((a, b) => a - b);
  const n = array.length;
  if (n === 0) return steps;

  const target = array[Math.floor(n * 0.6)] || array[n - 1];

  steps.push({ type: "init", description: `Interpolation Search for ${target} in sorted array`, data: [...array] });

  let low = 0, high = n - 1;

  while (low <= high && target >= array[low] && target <= array[high]) {
    if (low === high) {
      if (array[low] === target) {
        steps.push({ type: "found", description: `Found at index ${low}`, data: [...array], highlights: [low] });
      } else {
        steps.push({ type: "not-found", description: `Not found`, data: [...array] });
      }
      return steps;
    }

    // Probing position
    const pos = low + Math.floor(((target - array[low]) * (high - low)) / (array[high] - array[low]));
    steps.push({
      type: "probe",
      description: `Probe position ${pos} using interpolation formula`,
      data: [...array],
      pointer: pos,
      pointers: [low, high]
    });

    if (array[pos] === target) {
      steps.push({ type: "found", description: `Found target at index ${pos}`, data: [...array], highlights: [pos] });
      return steps;
    }

    if (array[pos] < target) {
      steps.push({ type: "move-low", description: `Move low to ${pos + 1}`, data: [...array] });
      low = pos + 1;
    } else {
      steps.push({ type: "move-high", description: `Move high to ${pos - 1}`, data: [...array] });
      high = pos - 1;
    }
  }

  steps.push({ type: "not-found", description: "Element not found or out of range", data: [...array] });
  return steps;
}

const pseudocode = [
  "function interpolationSearch(arr, target):",
  "  low = 0, high = n-1",
  "  while low <= high and target >= arr[low] and target <= arr[high]:",
  "    if low == high:",
  "      if arr[low] == target: return low",
  "      else: return -1",
  "    pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])",
  "    if arr[pos] == target: return pos",
  "    if arr[pos] < target: low = pos + 1",
  "    else: high = pos - 1",
  "  return -1"
];

export default function InterpolationSearchPage() {
  const relatedProblems = leetcodeProblems["interpolation-search"] || [];

  return (
    <AlgorithmPageTemplate
      title="Interpolation Search"
      description="Interpolation Search improves on binary search for uniformly distributed sorted arrays by probing positions based on the key's value."
      timeComplexity="O(log log n) average, O(n) worst"
      spaceComplexity="O(1)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateInterpolationSearchSteps}
      initialData={[10, 20, 30, 40, 50, 60, 70, 80, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Searching Algorithm"
    />
  );
}