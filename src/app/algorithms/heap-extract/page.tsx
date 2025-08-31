"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function generateHeapExtractSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  if (arr.length === 0) {
    return [{ type: "init", description: "Provide a non-empty max-heap array to visualize Extract-Max" }];
  }

  const a = [...arr];
  steps.push({ type: "init", description: "Start with a max-heap represented as an array", data: [...a] });

  const n = a.length;
  const swap = (i: number, j: number) => {
    steps.push({ type: "swap", description: `Swap index ${i} and ${j}`, data: [...a], swaps: [i, j], highlights: [i, j] });
    [a[i], a[j]] = [a[j], a[i]];
  };
  const left = (i: number) => 2 * i + 1;
  const right = (i: number) => 2 * i + 2;

  // Extract max: move last element to root
  steps.push({ type: "extract", description: `Extract max ${a[0]} from root`, data: [...a], highlights: [0], pointer: 0 });
  swap(0, n - 1);
  const max = a[n - 1];
  a.length = n - 1;
  steps.push({ type: "remove", description: `Remove last element (former max ${max})`, data: [...a] });

  // Heapify down
  let i = 0;
  while (true) {
    let largest = i;
    const l = left(i);
    const r = right(i);
    if (l < a.length) {
      steps.push({ type: "compare", description: `Compare parent ${i} with left child ${l}`, data: [...a], compares: [i, l], pointers: [i, l] });
      if (a[l] > a[largest]) largest = l;
    }
    if (r < a.length) {
      steps.push({ type: "compare", description: `Compare current largest ${largest} with right child ${r}`, data: [...a], compares: [largest, r], pointers: [largest, r] });
      if (a[r] > a[largest]) largest = r;
    }
    if (largest !== i) {
      swap(i, largest);
      i = largest;
    } else {
      break;
    }
  }

  steps.push({ type: "complete", description: `Heap after extract-max; extracted value: ${max}` , data: [...a] });
  return steps;
}

const pseudocode: string[] = [
  "max = heap[0]",
  "swap heap[0] with heap[n-1]",
  "remove last element",
  "i = 0",
  "while i has a child larger than heap[i]:",
  "  swap heap[i] with its largest child",
  "  i = index of that child",
  "return max"
];

const relatedProblems = (leetcodeProblems["heap-extract"] || []) as Array<{
  id: number; title: string; slug: string; difficulty: string;
}>;

export default function HeapExtractPage() {
  return (
    <AlgorithmPageTemplate
      title="Heap Extract-Max"
      description="Remove the maximum element from a max-heap, then heapify-down to restore the heap property."
      timeComplexity="O(log n)"
      spaceComplexity="O(1) auxiliary"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateHeapExtractSteps}
      initialData={[9, 5, 6, 2, 3, 4]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Data Structures"
    />
  );
}