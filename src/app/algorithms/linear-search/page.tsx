"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";

function generateLinearSearchSteps(arr: number[], target: number = arr[Math.floor(arr.length / 2)]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    type: "init",
    description: `Starting Linear Search for target ${target}. Check each element sequentially.`,
    data: [...array]
  });

  for (let i = 0; i < array.length; i++) {
    steps.push({
      type: "check",
      description: `Check element at index ${i}: ${array[i]}`,
      data: [...array],
      pointer: i,
      compares: [i]
    });

    if (array[i] === target) {
      steps.push({
        type: "found",
        description: `Target ${target} found at index ${i}!`,
        data: [...array],
        highlights: [i]
      });
      return steps;
    } else {
      steps.push({
        type: "not-match",
        description: `${array[i]} ≠ ${target}, continue searching`,
        data: [...array],
        compares: [i]
      });
    }
  }

  steps.push({
    type: "not-found",
    description: `Target ${target} not found in the array`,
    data: [...array]
  });

  return steps;
}

const pseudocode = [
  "function linearSearch(arr, target):",
  "    for i = 0 to n-1:",
  "        if arr[i] == target:",
  "            return i",
  "    return -1"
];

const relatedProblems = [
  { id: 34, title: "Find First and Last Position of Element in Sorted Array", slug: "find-first-and-last-position-of-element-in-sorted-array", difficulty: "Medium" as const },
  { id: 33, title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", difficulty: "Medium" as const },
  { id: 283, title: "Move Zeroes", slug: "move-zeroes", difficulty: "Easy" as const }
];

export default function LinearSearchPage() {
  return (
    <AlgorithmPageTemplate
      title="Linear Search"
      description="Linear Search (also called Sequential Search) is the simplest searching algorithm that sequentially checks each element in the array until the target element is found or the end of the array is reached."
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateLinearSearchSteps}
      initialData={[64, 34, 25, 12, 22, 11, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Searching Algorithm"
    />
  );
}