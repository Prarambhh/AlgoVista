"use client";

import leetcode from "@/data/leetcode.json";

const pseudocode = [
  "function bubbleSort(arr):",
  "  n = length(arr)",
  "  for i from 0 to n-1:",
  "    for j from 0 to n-i-2:",
  "      if arr[j] > arr[j+1]:",
  "        swap(arr[j], arr[j+1])",
  "  return arr"
];

const codeSamples = {
  "JavaScript": `function bubbleSort(arr) {
  const n = arr.length;
  const result = [...arr];
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        // Swap elements
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  
  return result;
}`,
  "Python": `def bubble_sort(arr):
    n = len(arr)
    result = arr.copy()
    
    for i in range(n - 1):
        for j in range(n - i - 1):
            if result[j] > result[j + 1]:
                # Swap elements
                result[j], result[j + 1] = result[j + 1], result[j]
    
    return result`,
  "Java": `public class BubbleSort {
    public static int[] bubbleSort(int[] arr) {
        int n = arr.length;
        int[] result = arr.clone();
        
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (result[j] > result[j + 1]) {
                    // Swap elements
                    int temp = result[j];
                    result[j] = result[j + 1];
                    result[j + 1] = temp;
                }
            }
        }
        
        return result;
    }
}`
};

import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";

function generateBubbleSortSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    type: "init",
    description: "Starting Bubble Sort - comparing adjacent elements",
    data: [...array]
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: "compare",
        description: `Comparing elements at positions ${j} and ${j + 1}`,
        data: [...array],
        compares: [j, j + 1]
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({
          type: "swap",
          description: `Swapping ${array[j + 1]} and ${array[j]} (elements were out of order)`,
          data: [...array],
          swaps: [j, j + 1]
        });
      }
    }

    steps.push({
      type: "pass-complete",
      description: `Pass ${i + 1} complete - largest element "bubbled" to position ${n - i - 1}`,
      data: [...array],
      highlights: [n - i - 1]
    });
  }

  steps.push({
    type: "complete",
    description: "Bubble Sort complete! Array is now sorted.",
    data: [...array],
    highlights: Array.from({ length: n }, (_, i) => i)
  });

  return steps;
}

export default function BubbleSortPage() {
  const relatedProblems = leetcode["bubble-sort"] || [];

  return (
    <AlgorithmPageTemplate
      title="Bubble Sort"
      description="Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
      timeComplexity="O(n²)"
      spaceComplexity="O(1)"
      category="Sorting Algorithm"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateBubbleSortSteps}
      initialData={[64, 34, 25, 12, 22, 11, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      code={codeSamples}
    />
  );
}