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

const codeSamples: Record<string, string> = {
  javascript: `function selectionSort(arr) {\n  const a = [...arr];\n  const n = a.length;\n  for (let i = 0; i < n - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < n; j++) {\n      if (a[j] < a[minIdx]) minIdx = j;\n    }\n    if (minIdx !== i) {\n      [a[i], a[minIdx]] = [a[minIdx], a[i]];\n    }\n  }\n  return a;\n}\n\n// Example\nconsole.log(selectionSort([64, 34, 25, 12, 22, 11, 90]));`,
  python: `def selection_sort(arr):\n    a = arr.copy()\n    n = len(a)\n    for i in range(n - 1):\n        min_idx = i\n        for j in range(i + 1, n):\n            if a[j] < a[min_idx]:\n                min_idx = j\n        if min_idx != i:\n            a[i], a[min_idx] = a[min_idx], a[i]\n    return a\n\nprint(selection_sort([64, 34, 25, 12, 22, 11, 90]))`,
  java: `import java.util.Arrays;\n\npublic class SelectionSort {\n    public static void selectionSort(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n - 1; i++) {\n            int minIdx = i;\n            for (int j = i + 1; j < n; j++) {\n                if (arr[j] < arr[minIdx]) minIdx = j;\n            }\n            if (minIdx != i) {\n                int temp = arr[i];\n                arr[i] = arr[minIdx];\n                arr[minIdx] = temp;\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {64, 34, 25, 12, 22, 11, 90};\n        selectionSort(arr);\n        System.out.println(Arrays.toString(arr));\n    }\n}`
};

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
      code={codeSamples}
      relatedProblems={relatedProblems}
      category="Sorting Algorithm"
    />
  );
}