"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function generateRadixSortSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    type: "init",
    description: "Starting Radix Sort - sorting by individual digits",
    data: [...array]
  });

  // Find the maximum number to know number of digits
  const max = Math.max(...array);
  const maxDigits = max.toString().length;
  
  // Do counting sort for every digit
  for (let digit = 1; digit <= maxDigits; digit++) {
    steps.push({
      type: "digit",
      description: `Sorting by digit ${digit} (from right)`,
      data: [...array]
    });

    // Create buckets for digits 0-9
    const buckets: number[][] = Array.from({length: 10}, () => []);
    
    // Distribute elements into buckets based on current digit
    for (let i = 0; i < array.length; i++) {
      const digitValue = Math.floor(array[i] / Math.pow(10, digit - 1)) % 10;
      buckets[digitValue].push(array[i]);
      
      steps.push({
        type: "bucket",
        description: `Placing ${array[i]} into bucket ${digitValue} (digit ${digit})`,
        data: [...array],
        highlights: [i]
      });
    }
    
    // Collect elements from buckets
    let index = 0;
    for (let bucket = 0; bucket < 10; bucket++) {
      for (let num of buckets[bucket]) {
        array[index] = num;
        steps.push({
          type: "collect",
          description: `Collecting ${num} from bucket ${bucket}`,
          data: [...array],
          highlights: [index]
        });
        index++;
      }
    }
    
    steps.push({
      type: "digit-complete",
      description: `Completed sorting by digit ${digit}`,
      data: [...array]
    });
  }

  steps.push({
    type: "complete",
    description: "Radix Sort completed! Array is now sorted.",
    data: [...array],
    highlights: Array.from({length: array.length}, (_, i) => i)
  });

  return steps;
}

const pseudocode = [
  "function radixSort(arr):",
  "  max = findMax(arr)",
  "  digits = numberOfDigits(max)",
  "  ",
  "  for digit = 1 to digits:",
  "    buckets = createBuckets(0-9)",
  "    ",
  "    // Distribute into buckets",
  "    for each element in arr:",
  "      digitValue = getDigit(element, digit)",
  "      buckets[digitValue].add(element)",
  "    ",
  "    // Collect from buckets",
  "    index = 0",
  "    for bucket = 0 to 9:",
  "      for each element in bucket:",
  "        arr[index++] = element",
  "  ",
  "  return arr"
];

const codeSamples = {
  JavaScript: `function radixSort(arr) {
  const max = Math.max(...arr);
  const maxDigits = max.toString().length;
  let output = [...arr];
  for (let d = 0; d < maxDigits; d++) {
    const buckets = Array.from({ length: 10 }, () => []);
    for (const num of output) {
      const digit = Math.floor(num / Math.pow(10, d)) % 10;
      buckets[digit].push(num);
    }
    output = [].concat(...buckets);
  }
  return output;
}`,
  Python: `def radix_sort(arr):
  if not arr:
      return arr
  max_val = max(arr)
  exp = 1
  output = list(arr)
  while max_val // exp > 0:
      buckets = [[] for _ in range(10)]
      for num in output:
          digit = (num // exp) % 10
          buckets[digit].append(num)
      output = [num for bucket in buckets for num in bucket]
      exp *= 10
  return output`,
  Java: `import java.util.*;
public class RadixSort {
  public static void radixSort(int[] arr) {
      if (arr.length == 0) return;
      int max = Arrays.stream(arr).max().getAsInt();
      int exp = 1;
      int[] output = Arrays.copyOf(arr, arr.length);
      while (max / exp > 0) {
          int[] count = new int[10];
          for (int num : output) {
              int digit = (num / exp) % 10;
              count[digit]++;
          }
          for (int i = 1; i < 10; i++) count[i] += count[i - 1];
          int[] temp = new int[output.length];
          for (int i = output.length - 1; i >= 0; i--) {
              int digit = (output[i] / exp) % 10;
              temp[--count[digit]] = output[i];
          }
          output = temp;
          exp *= 10;
      }
      System.arraycopy(output, 0, arr, 0, arr.length);
  }
}`
};

export default function RadixSortPage() {
  const relatedProblems = leetcodeProblems["radix-sort"] || [];

  return (
    <AlgorithmPageTemplate
      title="Radix Sort"
      description="Non-comparison sorting algorithm that sorts integers by processing individual digits. It processes digits from least significant to most significant using stable counting sort."
      timeComplexity="O(d × (n + k))"
      spaceComplexity="O(n + k)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateRadixSortSteps}
      initialData={[170, 45, 75, 90, 2, 802, 24, 66]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      code={codeSamples}
      relatedProblems={relatedProblems}
      category="Sorting Algorithm"
    />
  );
}