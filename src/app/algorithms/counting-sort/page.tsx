"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function generateCountingSortSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  if (arr.length === 0) return steps;

  const array = [...arr];
  const min = Math.min(...array);
  const max = Math.max(...array);

  steps.push({ type: "init", description: `Initialize counting sort for range [${min}, ${max}]`, data: [...array] });

  // Create count array
  const range = max - min + 1;
  const count = new Array(range).fill(0);

  // Count occurrences
  for (let i = 0; i < array.length; i++) {
    count[array[i] - min]++;
    steps.push({
      type: "count",
      description: `Counting occurrence of value ${array[i]}`,
      data: [...array],
      highlights: [i]
    });
  }

  // Accumulate counts
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
    steps.push({
      type: "accumulate",
      description: `Accumulating counts at index ${i} -> ${count[i]}`,
      data: [...array]
    });
  }

  // Build output array (stable)
  const output = new Array(array.length).fill(0);
  for (let i = array.length - 1; i >= 0; i--) {
    const val = array[i];
    const pos = count[val - min] - 1;
    output[pos] = val;
    count[val - min]--;
    steps.push({
      type: "place",
      description: `Placing value ${val} at output index ${pos}`,
      data: [...output],
      highlights: [pos]
    });
  }

  // Copy back to original
  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    steps.push({
      type: "copy",
      description: `Copying back value ${output[i]} to original array index ${i}`,
      data: [...array],
      highlights: [i]
    });
  }

  steps.push({
    type: "complete",
    description: "Counting Sort completed! Array is now sorted.",
    data: [...array],
    highlights: Array.from({length: array.length}, (_, i) => i)
  });

  return steps;
}

const pseudocode = [
  "function countingSort(arr):",
  "  min = findMin(arr)",
  "  max = findMax(arr)",
  "  range = max - min + 1",
  "  count = array(range) initialized to 0",
  "  output = array(n)",
  "  ",
  "  // Count occurrences",
  "  for i from 0 to n-1:",
  "    count[arr[i] - min]++",
  "  ",
  "  // Accumulate counts",
  "  for i from 1 to range-1:",
  "    count[i] += count[i-1]",
  "  ",
  "  // Build output (stable)",
  "  for i from n-1 downto 0:",
  "    output[count[arr[i] - min] - 1] = arr[i]",
  "    count[arr[i] - min]--",
  "  ",
  "  // Copy back",
  "  for i from 0 to n-1:",
  "    arr[i] = output[i]",
  "  ",
  "  return arr"
];

export default function CountingSortPage() {
  const relatedProblems = leetcodeProblems["counting-sort"] || [];

  return (
    <AlgorithmPageTemplate
      title="Counting Sort"
      description="Counting Sort is a non-comparison sorting algorithm that counts the occurrences of each distinct element and calculates positions to build the sorted array. Best for small integer ranges."
      timeComplexity="O(n + k)"
      spaceComplexity="O(n + k)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateCountingSortSteps}
      initialData={[4, 2, 2, 8, 3, 3, 1]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Sorting Algorithm"
    />
  );
}