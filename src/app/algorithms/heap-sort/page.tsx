"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";

function generateHeapSortSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    type: "init",
    description: "Starting Heap Sort. Build a max heap, then repeatedly extract the maximum element.",
    data: [...array]
  });

  const heapify = (arr: number[], n: number, i: number) => {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      steps.push({
        type: "compare-left",
        description: `Compare left child ${arr[l]} with current largest ${arr[largest]}`,
        data: [...arr],
        compares: [l, largest]
      });
      if (arr[l] > arr[largest]) largest = l;
    }
    if (r < n) {
      steps.push({
        type: "compare-right",
        description: `Compare right child ${arr[r]} with current largest ${arr[largest]}`,
        data: [...arr],
        compares: [r, largest]
      });
      if (arr[r] > arr[largest]) largest = r;
    }

    if (largest !== i) {
      steps.push({
        type: "swap",
        description: `Swap ${arr[i]} with larger child ${arr[largest]}`,
        data: [...arr],
        swaps: [i, largest]
      });
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  };

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      type: "heapify-build",
      description: `Heapify subtree rooted at index ${i}`,
      data: [...array],
      highlights: [i]
    });
    heapify(array, n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      type: "swap-root",
      description: `Swap root ${array[0]} with last element ${array[i]} and reduce heap size`,
      data: [...array],
      swaps: [0, i]
    });
    [array[0], array[i]] = [array[i], array[0]];

    steps.push({
      type: "heapify-reduce",
      description: `Heapify reduced heap (size ${i}) from root`,
      data: [...array],
      highlights: [0]
    });
    heapify(array, i, 0);
  }

  steps.push({
    type: "complete",
    description: "Heap Sort complete! Array is now fully sorted.",
    data: [...array],
    highlights: Array.from({ length: n }, (_, i) => i)
  });

  return steps;
}

const pseudocode = [
  "function heapSort(arr):",
  "    buildMaxHeap(arr)",
  "    for i = n-1 downto 1:",
  "        swap arr[0], arr[i]",
  "        heapify(arr, i, 0)",
  "",
  "function heapify(arr, n, i):",
  "    largest = i",
  "    left = 2*i + 1, right = 2*i + 2",
  "    if left < n and arr[left] > arr[largest]: largest = left",
  "    if right < n and arr[right] > arr[largest]: largest = right",
  "    if largest != i: swap arr[i], arr[largest]; heapify(arr, n, largest)"
];

const relatedProblems = [
  { id: 215, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium" as const },
  { id: 347, title: "Top K Frequent Elements", slug: "top-k-frequent-elements", difficulty: "Medium" as const },
  { id: 703, title: "Kth Largest Element in a Stream", slug: "kth-largest-element-in-a-stream", difficulty: "Easy" as const }
];

export default function HeapSortPage() {
  return (
    <AlgorithmPageTemplate
      title="Heap Sort"
      description="Heap Sort builds a max heap from the input array, then repeatedly extracts the maximum element and places it at the end of the array, reducing the heap size each time."
      timeComplexity="O(n log n)"
      spaceComplexity="O(1)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateHeapSortSteps}
      initialData={[64, 34, 25, 12, 22, 11, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Sorting Algorithm"
    />
  );
}