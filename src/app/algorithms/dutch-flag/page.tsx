"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import DutchFlagVisualizerComponent from "@/components/algorithm/dutch-flag-visualizer";
import DutchFlagInput from "@/components/algorithm/dutch-flag-input";
import { VisualizationStep } from "@/lib/visualization-utils";

interface DutchFlagData {
  array: number[];
}

const initialData: DutchFlagData[] = [
  {
    array: [2, 0, 1, 2, 1, 0, 1]
  }
];

function generateDutchFlagSteps(data: DutchFlagData): VisualizationStep[] {
  const { array } = data;
  const steps: VisualizationStep[] = [];
  const arr = [...array]; // Work with a copy

  if (arr.length === 0) {
    steps.push({
      id: 0,
      type: "empty",
      description: "Array is empty. Nothing to sort.",
      data: {
        array: [],
        low: 0,
        mid: 0,
        high: 0,
        completed: true,
        swappedIndices: []
      }
    });
    return steps;
  }

  let low = 0;
  let mid = 0;
  let high = arr.length - 1;

  // Initial state
  steps.push({
    id: 0,
    type: "init",
    description: `Initialize pointers: low=0, mid=0, high=${high}. We'll partition the array into three regions: 0s [0,low-1], 1s [low,mid-1], 2s [high+1,n-1], unknown [mid,high].`,
    data: {
      array: [...arr],
      low,
      mid,
      high,
      completed: false,
      swappedIndices: []
    }
  });

  while (mid <= high) {
    const currentElement = arr[mid];
    
    if (currentElement === 0) {
      // Swap with low pointer
      steps.push({
        id: steps.length,
        type: "prepare-swap-low",
        description: `arr[${mid}] = ${currentElement} is 0. Swap with arr[${low}] = ${arr[low]} and increment both low and mid pointers.`,
        data: {
          array: [...arr],
          low,
          mid,
          high,
          completed: false,
          swappedIndices: [low, mid]
        }
      });

      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      low++;
      mid++;

      steps.push({
        id: steps.length,
        type: "after-swap-low",
        description: `After swap: low=${low}, mid=${mid}. The 0 is now in the correct position.`,
        data: {
          array: [...arr],
          low,
          mid,
          high,
          completed: false,
          swappedIndices: []
        }
      });

    } else if (currentElement === 1) {
      // Just move mid pointer
      steps.push({
        id: steps.length,
        type: "mid-stay",
        description: `arr[${mid}] = ${currentElement} is 1. It's already in the correct region. Just increment mid pointer.`,
        data: {
          array: [...arr],
          low,
          mid,
          high,
          completed: false,
          swappedIndices: []
        }
      });

      mid++;

      steps.push({
        id: steps.length,
        type: "after-mid-increment",
        description: `After incrementing: mid=${mid}. The 1 is in the correct position.`,
        data: {
          array: [...arr],
          low,
          mid,
          high,
          completed: false,
          swappedIndices: []
        }
      });

    } else { // currentElement === 2
      // Swap with high pointer
      steps.push({
        id: steps.length,
        type: "prepare-swap-high",
        description: `arr[${mid}] = ${currentElement} is 2. Swap with arr[${high}] = ${arr[high]} and decrement high pointer. Don't increment mid as we need to check the swapped element.`,
        data: {
          array: [...arr],
          low,
          mid,
          high,
          completed: false,
          swappedIndices: [mid, high]
        }
      });

      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      high--;

      steps.push({
        id: steps.length,
        type: "after-swap-high",
        description: `After swap: high=${high}. The 2 is now in the correct position. mid stays at ${mid} to process the swapped element.`,
        data: {
          array: [...arr],
          low,
          mid,
          high,
          completed: false,
          swappedIndices: []
        }
      });
    }
  }

  // Final result
  steps.push({
    id: steps.length,
    type: "complete",
    description: `Algorithm completed! Array is now partitioned: 0s in [0,${low-1}], 1s in [${low},${mid-1}], 2s in [${high+1},${arr.length-1}]. The Dutch National Flag is sorted!`,
    data: {
      array: [...arr],
      low,
      mid,
      high,
      completed: true,
      swappedIndices: []
    }
  });

  return steps;
}

const pseudocode = [
  "function dutchNationalFlag(arr):",
  "  low = 0",
  "  mid = 0", 
  "  high = length(arr) - 1",
  "  ",
  "  while mid <= high:",
  "    if arr[mid] == 0:",
  "      swap(arr[low], arr[mid])",
  "      low++",
  "      mid++",
  "    else if arr[mid] == 1:",
  "      mid++",
  "    else: // arr[mid] == 2",
  "      swap(arr[mid], arr[high])",
  "      high--",
  "      // Don't increment mid",
  "  ",
  "  return arr"
];

const relatedProblems = [
  { id: 75, title: "Sort Colors", slug: "sort-colors", difficulty: "Medium" as const },
  { id: 215, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium" as const },
  { id: 324, title: "Wiggle Sort II", slug: "wiggle-sort-ii", difficulty: "Medium" as const },
  { id: 148, title: "Sort List", slug: "sort-list", difficulty: "Medium" as const },
  { id: 912, title: "Sort an Array", slug: "sort-an-array", difficulty: "Medium" as const }
];

// Adapter to match AlgorithmPageTemplate's expected input component signature
function DutchFlagInputWrapper({ data, onDataChange }: { data: any[]; onDataChange: (data: any[]) => void; }) {
  const current: DutchFlagData = data[0] || { array: [] };
  const handleChange = (payload: { array: number[] }) => {
    onDataChange([{ array: payload.array }]);
  };
  return <DutchFlagInput onDataChange={handleChange} onVisualize={() => {}} />;
}

export default function DutchFlagPage() {
  return (
    <AlgorithmPageTemplate
      title="Dutch National Flag"
      description="Sort an array containing only 0s, 1s, and 2s in linear time using three-way partitioning. The algorithm partitions the array into three regions using three pointers."
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      visualizationComponent={DutchFlagVisualizerComponent}
      generateSteps={(data) => generateDutchFlagSteps(data[0])}
      initialData={initialData}
      dataInputComponent={DutchFlagInputWrapper}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Arrays"
    />
  );
}