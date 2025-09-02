"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";

function generateBinarySearchSteps(arr: number[], target?: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr].sort((a, b) => a - b);
  const tgt = target !== undefined ? target : array[Math.floor(array.length / 2)];

  steps.push({
    type: "init",
    description: `Starting Binary Search for target ${tgt}. Array must be sorted.`,
    data: [...array],
    highlights: Array.from({ length: array.length }, (_, i) => i)
  });

  let left = 0, right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      type: "check-mid",
      description: `Check middle at index ${mid}: ${array[mid]}`,
      data: [...array],
      pointer: mid,
      pointers: [left, right]
    });

    if (array[mid] === tgt) {
      steps.push({
        type: "found",
        description: `Target ${tgt} found at index ${mid}!`,
        data: [...array],
        highlights: [mid]
      });
      break;
    } else if (array[mid] < tgt) {
      steps.push({
        type: "move-right",
        description: `${array[mid]} < ${tgt}, search the right half`,
        data: [...array],
        highlights: Array.from({ length: right - (mid + 1) + 1 }, (_, i) => mid + 1 + i),
        pointers: [mid + 1, right]
      });
      left = mid + 1;
    } else {
      steps.push({
        type: "move-left",
        description: `${array[mid]} > ${tgt}, search the left half`,
        data: [...array],
        highlights: Array.from({ length: (mid - 1) - left + 1 }, (_, i) => left + i),
        pointers: [left, mid - 1]
      });
      right = mid - 1;
    }
  }

  if (steps[steps.length - 1]?.type !== "found") {
    steps.push({
      type: "not-found",
      description: `Target ${tgt} not found in the array`,
      data: [...array]
    });
  }

  return steps;
}

const pseudocode = [
  "function binarySearch(arr, target):",
  "    left = 0, right = n - 1",
  "    while left <= right:",
  "        mid = (left + right) / 2",
  "        if arr[mid] == target: return mid",
  "        else if arr[mid] < target: left = mid + 1",
  "        else: right = mid - 1",
  "    return -1"
];

const relatedProblems = [
  { id: 704, title: "Binary Search", slug: "binary-search", difficulty: "Easy" as const },
  { id: 33, title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", difficulty: "Medium" as const },
  { id: 34, title: "Find First and Last Position of Element in Sorted Array", slug: "find-first-and-last-position-of-element-in-sorted-array", difficulty: "Medium" as const }
];

const codeSamples: Record<string, string> = {
  javascript: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // Found target
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Target not found
}

// Example usage
const sortedArr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log("Array:", sortedArr);
console.log("Search for 7:", binarySearch(sortedArr, 7)); // Output: 3
console.log("Search for 4:", binarySearch(sortedArr, 4)); // Output: -1`,

  python: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Found target
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Target not found

# Example usage
sorted_arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print("Array:", sorted_arr)
print("Search for 7:", binary_search(sorted_arr, 7))  # Output: 3
print("Search for 4:", binary_search(sorted_arr, 4))  # Output: -1`,

  java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2; // Avoid overflow
            
            if (arr[mid] == target) {
                return mid; // Found target
            } else if (arr[mid] < target) {
                left = mid + 1; // Search right half
            } else {
                right = mid - 1; // Search left half
            }
        }
        
        return -1; // Target not found
    }
    
    public static void main(String[] args) {
        int[] sortedArr = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
        System.out.println("Array: " + java.util.Arrays.toString(sortedArr));
        System.out.println("Search for 7: " + binarySearch(sortedArr, 7)); // Output: 3
        System.out.println("Search for 4: " + binarySearch(sortedArr, 4)); // Output: -1
    }
}`
};

export default function BinarySearchPage() {
  return (
    <AlgorithmPageTemplate
      title="Binary Search"
      description="Binary Search efficiently finds target elements in a sorted array by repeatedly dividing the search range in half."
      timeComplexity="O(log n)"
      spaceComplexity="O(1)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateBinarySearchSteps}
      initialData={[5, 2, 9, 1, 6, 3, 8, 4, 7]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      code={codeSamples}
      relatedProblems={relatedProblems}
      category="Searching Algorithm"
    />
  );
}