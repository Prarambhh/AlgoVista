"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";

function generateSelectionSortSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    type: "init",
    description: "Starting Selection Sort. Find minimum element and move to beginning.",
    data: [...array]
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    steps.push({
      type: "select-start",
      description: `Pass ${i + 1}: Finding minimum element from position ${i} onwards`,
      data: [...array],
      highlights: [i],
      pointer: i
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: "compare",
        description: `Comparing elements at positions ${minIdx} (${array[minIdx]}) and ${j} (${array[j]})`,
        data: [...array],
        compares: [minIdx, j],
        highlights: [i]
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;
        steps.push({
          type: "new-min",
          description: `Found new minimum: ${array[j]} at position ${j}`,
          data: [...array],
          highlights: [i, minIdx],
          compares: [j]
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        type: "swap-prepare",
        description: `Swapping minimum element ${array[minIdx]} at position ${minIdx} with element ${array[i]} at position ${i}`,
        data: [...array],
        swaps: [i, minIdx]
      });

      // Perform swap
      [array[i], array[minIdx]] = [array[minIdx], array[i]];

      steps.push({
        type: "swap-complete",
        description: `Swap complete. Position ${i} now contains the correct minimum element`,
        data: [...array],
        highlights: [i]
      });
    } else {
      steps.push({
        type: "no-swap",
        description: `Element ${array[i]} is already in the correct position`,
        data: [...array],
        highlights: [i]
      });
    }
  }

  steps.push({
    type: "complete",
    description: "Selection Sort complete! Array is now sorted.",
    data: [...array],
    highlights: Array.from({ length: n }, (_, i) => i)
  });

  return steps;
}

const pseudocode = [
  "for i = 0 to n-2:",
  "    min_idx = i",
  "    for j = i+1 to n-1:",
  "        if arr[j] < arr[min_idx]:",
  "            min_idx = j",
  "    if min_idx != i:",
  "        swap arr[i] and arr[min_idx]"
];

const relatedProblems = [
  { id: 912, title: "Sort an Array", slug: "sort-an-array", difficulty: "Medium" as const },
  { id: 215, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium" as const },
  { id: 973, title: "K Closest Points to Origin", slug: "k-closest-points-to-origin", difficulty: "Medium" as const }
];

export default function SelectionSortPage() {
  return (
    <AlgorithmPageTemplate
      title="Selection Sort"
      description="Selection Sort works by repeatedly finding the minimum element from the unsorted portion and moving it to the beginning. It divides the array into sorted and unsorted regions, growing the sorted region one element at a time."
      timeComplexity="O(n²)"
      spaceComplexity="O(1)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateSelectionSortSteps}
      initialData={[64, 34, 25, 12, 22, 11, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Sorting Algorithm"
    />
  );
}