"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";

function generateQuickSortSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    type: "init",
    description: "Starting Quick Sort. Choose pivot, partition around it, then recursively sort.",
    data: [...array]
  });

  function quickSort(arr: number[], low: number, high: number) {
    if (low < high) {
      const pivotIndex = partition(arr, low, high);
      
      steps.push({
        type: "partition-complete",
        description: `Partition complete. Pivot ${arr[pivotIndex]} is in correct position at index ${pivotIndex}`,
        data: [...arr],
        highlights: [pivotIndex],
        compares: Array.from({ length: high - low + 1 }, (_, i) => low + i)
      });

      quickSort(arr, low, pivotIndex - 1);
      quickSort(arr, pivotIndex + 1, high);
    }
  }

  function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    
    steps.push({
      type: "choose-pivot",
      description: `Choose pivot: ${pivot} at index ${high}`,
      data: [...arr],
      highlights: [high],
      pointer: high
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        type: "compare-with-pivot",
        description: `Compare ${arr[j]} with pivot ${pivot}`,
        data: [...arr],
        compares: [j, high],
        pointers: [i + 1, j]
      });

      if (arr[j] < pivot) {
        i++;
        
        if (i !== j) {
          steps.push({
            type: "swap-smaller",
            description: `${arr[j]} < ${pivot}, swap with element at index ${i}`,
            data: [...arr],
            swaps: [i, j]
          });
          
          [arr[i], arr[j]] = [arr[j], arr[i]];
          
          steps.push({
            type: "swap-complete",
            description: `Swapped ${arr[j]} and ${arr[i]}`,
            data: [...arr],
            highlights: [i]
          });
        } else {
          steps.push({
            type: "no-swap-needed",
            description: `${arr[j]} < ${pivot}, already in correct relative position`,
            data: [...arr],
            highlights: [j]
          });
        }
      }
    }

    // Place pivot in correct position
    steps.push({
      type: "place-pivot",
      description: `Place pivot ${pivot} in correct position by swapping with element at index ${i + 1}`,
      data: [...arr],
      swaps: [i + 1, high]
    });

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    return i + 1;
  }

  quickSort(array, 0, array.length - 1);

  steps.push({
    type: "complete",
    description: "Quick Sort complete! Array is now fully sorted.",
    data: [...array],
    highlights: Array.from({ length: array.length }, (_, i) => i)
  });

  return steps;
}

const pseudocode = [
  "function quickSort(arr, low, high):",
  "    if low < high:",
  "        pivotIndex = partition(arr, low, high)",
  "        quickSort(arr, low, pivotIndex - 1)",
  "        quickSort(arr, pivotIndex + 1, high)",
  "",
  "function partition(arr, low, high):",
  "    pivot = arr[high]",
  "    i = low - 1",
  "    for j = low to high - 1:",
  "        if arr[j] < pivot:",
  "            i++",
  "            swap arr[i] and arr[j]",
  "    swap arr[i + 1] and arr[high]",
  "    return i + 1"
];

const relatedProblems = [
  { id: 912, title: "Sort an Array", slug: "sort-an-array", difficulty: "Medium" as const },
  { id: 215, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium" as const },
  { id: 75, title: "Sort Colors", slug: "sort-colors", difficulty: "Medium" as const },
  { id: 324, title: "Wiggle Sort II", slug: "wiggle-sort-ii", difficulty: "Medium" as const }
];

const codeSamples: Record<string, string> = {
  javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {\n    if (low < high) {\n        const pivotIndex = partition(arr, low, high);\n        quickSort(arr, low, pivotIndex - 1);\n        quickSort(arr, pivotIndex + 1, high);\n    }\n    return arr;\n}\n\nfunction partition(arr, low, high) {\n    const pivot = arr[high]; // Choose last element as pivot\n    let i = low - 1; // Index of smaller element\n    \n    for (let j = low; j < high; j++) {\n        if (arr[j] <= pivot) {\n            i++;\n            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements\n        }\n    }\n    \n    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Place pivot\n    return i + 1;\n}\n\n// Example usage\nconst arr = [64, 34, 25, 12, 22, 11, 90];\nconsole.log("Original:", arr);\nconsole.log("Sorted:", quickSort([...arr]));`,
  python: `def quick_sort(arr, low=0, high=None):\n    if high is None:\n        high = len(arr) - 1\n    \n    if low < high:\n        pivot_index = partition(arr, low, high)\n        quick_sort(arr, low, pivot_index - 1)\n        quick_sort(arr, pivot_index + 1, high)\n    \n    return arr\n\ndef partition(arr, low, high):\n    pivot = arr[high]  # Choose last element as pivot\n    i = low - 1  # Index of smaller element\n    \n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]  # Swap elements\n    \n    arr[i + 1], arr[high] = arr[high], arr[i + 1]  # Place pivot\n    return i + 1\n\n# Example usage\narr = [64, 34, 25, 12, 22, 11, 90]\nprint("Original:", arr)\nprint("Sorted:", quick_sort(arr.copy()))`,
  java: `import java.util.Arrays;\n\npublic class QuickSort {\n    public static void quickSort(int[] arr, int low, int high) {\n        if (low < high) {\n            int pivotIndex = partition(arr, low, high);\n            quickSort(arr, low, pivotIndex - 1);\n            quickSort(arr, pivotIndex + 1, high);\n        }\n    }\n    \n    private static int partition(int[] arr, int low, int high) {\n        int pivot = arr[high]; // Choose last element as pivot\n        int i = low - 1; // Index of smaller element\n        \n        for (int j = low; j < high; j++) {\n            if (arr[j] <= pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        \n        int temp = arr[i + 1];\n        arr[i + 1] = arr[high];\n        arr[high] = temp;\n        \n        return i + 1;\n    }\n    \n    public static void main(String[] args) {\n        int[] arr = {64, 34, 25, 12, 22, 11, 90};\n        System.out.println("Original: " + java.util.Arrays.toString(arr));\n        quickSort(arr, 0, arr.length - 1);\n        System.out.println("Sorted: " + java.util.Arrays.toString(arr));\n    }\n}`
};

export default function QuickSortPage() {
  return (
    <AlgorithmPageTemplate
      title="Quick Sort"
      description="Quick Sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it, placing smaller elements before and larger elements after the pivot. It then recursively sorts the sub-arrays."
      timeComplexity="O(n log n) avg, O(n²) worst"
      spaceComplexity="O(log n)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateQuickSortSteps}
      initialData={[64, 34, 25, 12, 22, 11, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      code={codeSamples}
      relatedProblems={relatedProblems}
      category="Sorting Algorithm"
    />
  );
}