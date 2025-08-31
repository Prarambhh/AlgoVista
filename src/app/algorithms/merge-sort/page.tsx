"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";

function generateMergeSortSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    type: "init",
    description: "Starting Merge Sort. Divide array into halves, sort, then merge.",
    data: [...array]
  });

  function mergeSort(arr: number[], left: number, right: number, depth: number = 0) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      type: "divide",
      description: `Divide: Split array from index ${left} to ${right} at position ${mid}`,
      data: [...arr],
      highlights: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      pointer: mid
    });

    // Recursively sort left and right halves
    mergeSort(arr, left, mid, depth + 1);
    mergeSort(arr, mid + 1, right, depth + 1);

    // Merge the sorted halves
    merge(arr, left, mid, right);
  }

  function merge(arr: number[], left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    steps.push({
      type: "merge-start",
      description: `Merge: Combining sorted subarrays [${leftArr.join(", ")}] and [${rightArr.join(", ")}]`,
      data: [...arr],
      highlights: [
        ...Array.from({ length: mid - left + 1 }, (_, i) => left + i),
        ...Array.from({ length: right - mid }, (_, i) => mid + 1 + i)
      ]
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: "merge-compare",
        description: `Compare ${leftArr[i]} and ${rightArr[j]}`,
        data: [...arr],
        compares: [left + i, mid + 1 + j]
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        steps.push({
          type: "merge-place",
          description: `Place ${leftArr[i]} at position ${k}`,
          data: [...arr],
          highlights: [k]
        });
        i++;
      } else {
        arr[k] = rightArr[j];
        steps.push({
          type: "merge-place",
          description: `Place ${rightArr[j]} at position ${k}`,
          data: [...arr],
          highlights: [k]
        });
        j++;
      }
      k++;
    }

    // Copy remaining elements
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        type: "merge-remaining",
        description: `Copy remaining element ${leftArr[i]} to position ${k}`,
        data: [...arr],
        highlights: [k]
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        type: "merge-remaining",
        description: `Copy remaining element ${rightArr[j]} to position ${k}`,
        data: [...arr],
        highlights: [k]
      });
      j++;
      k++;
    }

    steps.push({
      type: "merge-complete",
      description: `Merge complete for range [${left}, ${right}]`,
      data: [...arr],
      highlights: Array.from({ length: right - left + 1 }, (_, i) => left + i)
    });
  }

  mergeSort(array, 0, array.length - 1);

  steps.push({
    type: "complete",
    description: "Merge Sort complete! Array is now fully sorted.",
    data: [...array],
    highlights: Array.from({ length: array.length }, (_, i) => i)
  });

  return steps;
}

const pseudocode = [
  "function mergeSort(arr, left, right):",
  "    if left < right:",
  "        mid = (left + right) / 2",
  "        mergeSort(arr, left, mid)",
  "        mergeSort(arr, mid + 1, right)",
  "        merge(arr, left, mid, right)",
  "",
  "function merge(arr, left, mid, right):",
  "    // Create temp arrays for left and right",
  "    // Merge back into arr[left..right]"
];

const relatedProblems = [
  { id: 912, title: "Sort an Array", slug: "sort-an-array", difficulty: "Medium" as const },
  { id: 148, title: "Sort List", slug: "sort-list", difficulty: "Medium" as const },
  { id: 88, title: "Merge Sorted Array", slug: "merge-sorted-array", difficulty: "Easy" as const },
  { id: 315, title: "Count of Smaller Numbers After Self", slug: "count-of-smaller-numbers-after-self", difficulty: "Hard" as const }
];

export default function MergeSortPage() {
  return (
    <AlgorithmPageTemplate
      title="Merge Sort"
      description="Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them, then merges the sorted halves back together. It guarantees O(n log n) time complexity and is stable."
      timeComplexity="O(n log n)"
      spaceComplexity="O(n)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateMergeSortSteps}
      initialData={[64, 34, 25, 12, 22, 11, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Sorting Algorithm"
    />
  );
}