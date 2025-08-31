"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function generateHeapInsertSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = new Array<number>(arr.length);

  if (arr.length === 0) {
    return [{ type: "init", description: "Provide a non-empty array to visualize Heap Insert" }];
  }

  steps.push({
    type: "init",
    description: "Build a Max-Heap by inserting elements one by one and sifting up to restore heap property.",
    data: [...arr]
  });

  const parent = (i: number) => Math.floor((i - 1) / 2);

  for (let i = 0; i < arr.length; i++) {
    array[i] = arr[i];
    steps.push({
      type: "insert",
      description: `Insert value ${arr[i]} at position ${i}`,
      data: [...array],
      highlights: [i],
      pointer: i
    });

    // Sift up
    let child = i;
    while (child > 0 && array[parent(child)] < array[child]) {
      const p = parent(child);
      steps.push({
        type: "compare",
        description: `Compare child index ${child} (value ${array[child]}) with parent index ${p} (value ${array[p]})`,
        data: [...array],
        compares: [child, p],
        pointers: [child, p]
      });

      steps.push({
        type: "swap",
        description: `Swap ${array[child]} (index ${child}) with parent ${array[p]} (index ${p}) to restore heap property`,
        data: [...array],
        swaps: [child, p],
        highlights: [child, p]
      });
      [array[child], array[p]] = [array[p], array[child]];
      child = p;
    }

    steps.push({
      type: "heap-after-insert",
      description: `Heap after inserting index ${i}: first ${i + 1} elements satisfy max-heap property`,
      data: [...array],
      highlights: Array.from({ length: i + 1 }, (_, k) => k)
    });
  }

  steps.push({
    type: "complete",
    description: `All insertions complete. Built max-heap over the first ${arr.length} elements.`,
    data: [...array],
    highlights: Array.from({ length: arr.length }, (_, k) => k)
  });

  return steps;
}

const pseudocode: string[] = [
  "for each element x in input:",
  "  place x at the end of heap",
  "  while x has a parent and parent(x) < x:",
  "    swap x with parent(x) (sift up)",
  "max-heap property is maintained after each insertion"
];

const relatedProblems = (leetcodeProblems["heap-insert"] || []) as Array<{
  id: number; title: string; slug: string; difficulty: string;
}>;

export default function HeapInsertPage() {
  return (
    <AlgorithmPageTemplate
      title="Heap Insert (Max-Heap)"
      description="Insert elements into a max-heap one by one, sifting up to ensure every parent is greater than its children."
      timeComplexity="O(log n) per insert, O(n log n) for n inserts"
      spaceComplexity="O(1) auxiliary"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateHeapInsertSteps}
      initialData={[3, 1, 6, 5, 2, 4]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Data Structures"
    />
  );
}