"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function generateJumpSearchSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr].sort((a, b) => a - b); // Ensure array is sorted
  const target = array[Math.floor(array.length * 0.7)] || array[array.length - 1]; // Pick a target

  steps.push({
    type: "init",
    description: `Jump Search for target ${target} in sorted array`,
    data: [...array]
  });

  const n = array.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;

  steps.push({
    type: "step-size",
    description: `Optimal jump step size: √${n} = ${step}`,
    data: [...array]
  });

  // Jumping phase
  while (array[Math.min(step, n) - 1] < target) {
    steps.push({
      type: "jump",
      description: `Jumping to position ${step}, value: ${array[Math.min(step, n) - 1]}`,
      data: [...array],
      pointers: [prev, Math.min(step, n) - 1]
    });

    prev = step;
    step += Math.floor(Math.sqrt(n));
    
    if (prev >= n) {
      steps.push({
        type: "not-found",
        description: "Element not found - jumped beyond array",
        data: [...array]
      });
      return steps;
    }
  }

  steps.push({
    type: "range-found",
    description: `Target likely in range [${prev}, ${Math.min(step, n) - 1}]`,
    data: [...array],
    highlights: Array.from({length: Math.min(step, n) - prev}, (_, i) => prev + i)
  });

  // Linear search in the identified block
  while (array[prev] < target) {
    steps.push({
      type: "linear-search",
      description: `Linear search at position ${prev}, value: ${array[prev]}`,
      data: [...array],
      pointer: prev,
      compares: [prev]
    });

    prev++;
    
    if (prev === Math.min(step, n)) {
      steps.push({
        type: "not-found",
        description: "Element not found in the block",
        data: [...array]
      });
      return steps;
    }
  }

  if (array[prev] === target) {
    steps.push({
      type: "found",
      description: `Found target ${target} at position ${prev}!`,
      data: [...array],
      highlights: [prev]
    });
  } else {
    steps.push({
      type: "not-found",
      description: "Element not found",
      data: [...array]
    });
  }

  return steps;
}

const pseudocode = [
  "function jumpSearch(arr, target):",
  "  n = length(arr)",
  "  step = sqrt(n)",
  "  prev = 0",
  "  ",
  "  // Jumping phase",
  "  while arr[min(step, n)-1] < target:",
  "    prev = step",
  "    step += sqrt(n)",
  "    if prev >= n:",
  "      return -1",
  "  ",
  "  // Linear search in block",
  "  while arr[prev] < target:",
  "    prev++",
  "    if prev == min(step, n):",
  "      return -1",
  "  ",
  "  if arr[prev] == target:",
  "    return prev",
  "  return -1"
];

const codeSamples = {
  "JavaScript": `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  // Jump to the right block
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) {
      return -1; // Not found
    }
  }
  
  // Linear search in the identified block
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) {
      return -1; // Not found
    }
  }
  
  // If element is found
  if (arr[prev] === target) {
    return prev;
  }
  
  return -1; // Not found
}`,
  "Python": `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    
    # Jump to the right block
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1  # Not found
    
    # Linear search in the identified block
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1  # Not found
    
    # If element is found
    if arr[prev] == target:
        return prev
    
    return -1  # Not found`,
  "Java": `public class JumpSearch {
    public static int jumpSearch(int[] arr, int target) {
        int n = arr.length;
        int step = (int) Math.sqrt(n);
        int prev = 0;
        
        // Jump to the right block
        while (arr[Math.min(step, n) - 1] < target) {
            prev = step;
            step += (int) Math.sqrt(n);
            if (prev >= n) {
                return -1; // Not found
            }
        }
        
        // Linear search in the identified block
        while (arr[prev] < target) {
            prev++;
            if (prev == Math.min(step, n)) {
                return -1; // Not found
            }
        }
        
        // If element is found
        if (arr[prev] == target) {
            return prev;
        }
        
        return -1; // Not found
    }
}`
};

export default function JumpSearchPage() {
  const relatedProblems = leetcodeProblems["jump-search"] || [];

  return (
    <AlgorithmPageTemplate
      title="Jump Search"
      description="Jump Search works on sorted arrays by jumping ahead by fixed steps, then performing linear search in the identified block. Optimal step size is √n."
      timeComplexity="O(√n)"
      spaceComplexity="O(1)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateJumpSearchSteps}
      initialData={[1, 3, 5, 7, 9, 11, 13, 15, 17, 19]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Searching Algorithm"
      code={codeSamples}
    />
  );
}