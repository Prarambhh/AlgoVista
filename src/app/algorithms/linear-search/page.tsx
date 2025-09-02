"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";

function generateLinearSearchSteps(arr: number[], target: number = arr[Math.floor(arr.length / 2)]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    type: "init",
    description: `Starting Linear Search for target ${target}. Check each element sequentially.`,
    data: [...array]
  });

  for (let i = 0; i < array.length; i++) {
    steps.push({
      type: "check",
      description: `Check element at index ${i}: ${array[i]}`,
      data: [...array],
      pointer: i,
      compares: [i]
    });

    if (array[i] === target) {
      steps.push({
        type: "found",
        description: `Target ${target} found at index ${i}!`,
        data: [...array],
        highlights: [i]
      });
      return steps;
    } else {
      steps.push({
        type: "not-match",
        description: `${array[i]} ≠ ${target}, continue searching`,
        data: [...array],
        compares: [i]
      });
    }
  }

  steps.push({
    type: "not-found",
    description: `Target ${target} not found in the array`,
    data: [...array]
  });

  return steps;
}

const pseudocode = [
  "function linearSearch(arr, target):",
  "    for i = 0 to n-1:",
  "        if arr[i] == target:",
  "            return i",
  "    return -1"
];

const relatedProblems = [
  { id: 34, title: "Find First and Last Position of Element in Sorted Array", slug: "find-first-and-last-position-of-element-in-sorted-array", difficulty: "Medium" as const },
  { id: 33, title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", difficulty: "Medium" as const },
  { id: 283, title: "Move Zeroes", slug: "move-zeroes", difficulty: "Easy" as const }
];

const codeSamples: Record<string, string> = {
  javascript: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Found target
        }
    }
    return -1; // Target not found
}

// Example usage
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log("Array:", arr);
console.log("Search for 22:", linearSearch(arr, 22)); // e.g., Output: index
console.log("Search for 100:", linearSearch(arr, 100)); // Output: -1`,

  python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Found target
    return -1  # Target not found

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
print("Array:", arr)
print("Search for 22:", linear_search(arr, 22))  # e.g., Output: index
print("Search for 100:", linear_search(arr, 100))  # Output: -1`,

  java: `public class LinearSearch {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i; // Found target
            }
        }
        return -1; // Target not found
    }
    
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Array: " + java.util.Arrays.toString(arr));
        System.out.println("Search for 22: " + linearSearch(arr, 22)); // e.g., Output: index
        System.out.println("Search for 100: " + linearSearch(arr, 100)); // Output: -1
    }
}`
};

export default function LinearSearchPage() {
  return (
    <AlgorithmPageTemplate
      title="Linear Search"
      description="Linear Search (also called Sequential Search) is the simplest searching algorithm that sequentially checks each element in the array until the target element is found or the end of the array is reached."
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateLinearSearchSteps}
      initialData={[64, 34, 25, 12, 22, 11, 90]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      code={codeSamples}
      relatedProblems={relatedProblems}
      category="Searching Algorithm"
    />
  );
}