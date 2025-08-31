"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";

function generateInsertionSortSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    type: "init",
    description: "Starting Insertion Sort. Build sorted array one element at a time.",
    data: [...array],
    highlights: [0]
  });

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    steps.push({
      type: "select-key",
      description: `Pass ${i}: Select element ${key} at position ${i} to insert into sorted portion`,
      data: [...array],
      highlights: [i],
      compares: [i]
    });

    while (j >= 0 && array[j] > key) {
      steps.push({
        type: "compare",
        description: `Comparing ${array[j]} at position ${j} with key ${key}. ${array[j]} > ${key}, so shift right`,
        data: [...array],
        compares: [j, i],
        highlights: Array.from({ length: i }, (_, idx) => idx)
      });

      array[j + 1] = array[j];
      
      steps.push({
        type: "shift",
        description: `Shift ${array[j]} from position ${j} to position ${j + 1}`,
        data: [...array],
        highlights: Array.from({ length: i }, (_, idx) => idx),
        swaps: [j, j + 1]
      });

      j--;
    }

    if (j >= 0) {
      steps.push({
        type: "compare-final",
        description: `Comparing ${array[j]} at position ${j} with key ${key}. ${array[j]} <= ${key}, found insertion point`,
        data: [...array],
        compares: [j],
        highlights: Array.from({ length: i + 1 }, (_, idx) => idx)
      });
    }

    array[j + 1] = key;
    
    steps.push({
      type: "insert",
      description: `Insert key ${key} at position ${j + 1}. First ${i + 1} elements are now sorted`,
      data: [...array],
      highlights: Array.from({ length: i + 1 }, (_, idx) => idx),
      compares: [j + 1]
    });
  }

  steps.push({
    type: "complete",
    description: "Insertion Sort complete! All elements are now in sorted order.",
    data: [...array],
    highlights: Array.from({ length: n }, (_, i) => i)
  });

  return steps;
}

const pseudocode = [
  "for i = 1 to n-1:",
  "    key = arr[i]",
  "    j = i - 1",
  "    while j >= 0 and arr[j] > key:",
  "        arr[j + 1] = arr[j]",
  "        j = j - 1",
  "    arr[j + 1] = key"
];

const relatedProblems = [
  { id: 147, title: "Insertion Sort List", slug: "insertion-sort-list", difficulty: "Medium" as const },
  { id: 912, title: "Sort an Array", slug: "sort-an-array", difficulty: "Medium" as const },
  { id: 148, title: "Sort List", slug: "sort-list", difficulty: "Medium" as const }
];

export default function InsertionSortPage() {
  return (
    <AlgorithmPageTemplate
      title="Insertion Sort"
      description="Insertion Sort builds the final sorted array one element at a time. It works by taking elements from the unsorted portion and inserting them into their correct position in the sorted portion, similar to sorting playing cards in your hands."
      timeComplexity="O(n²)"
      spaceComplexity="O(1)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateInsertionSortSteps}
      initialData={[64, 34, 25, 12, 22, 11, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Sorting Algorithm"
    />
  );
}