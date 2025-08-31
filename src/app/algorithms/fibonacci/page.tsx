"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import FibonacciVisualizerComponent from "@/components/algorithm/fibonacci-visualizer";
import NumericInput from "@/components/algorithm/numeric-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

const initialData = [10];

function generateFibonacciSteps(data: any[]): VisualizationStep[] {
  const n = Array.isArray(data) && data.length > 0 
    ? (typeof data[0] === 'object' && data[0].n !== undefined ? data[0].n : data[0])
    : 10;

  const steps: VisualizationStep[] = [];
  const memo: { [key: number]: number } = {};
  let calculations = 0;
  let cacheHits = 0;

  function fibMemo(num: number): number {
    calculations++;
    
    if (num <= 1) {
      memo[num] = num;
      steps.push({
        type: "base-case",
        description: `Base case: F(${num}) = ${num}`,
        data: { memo: { ...memo }, current: num, calculations, cacheHits }
      });
      return num;
    }

    if (memo[num] !== undefined) {
      cacheHits++;
      steps.push({
        type: "cache-hit",
        description: `Cache hit: F(${num}) = ${memo[num]} (already computed)`,
        data: { memo: { ...memo }, current: num, calculations, cacheHits }
      });
      return memo[num];
    }

    steps.push({
      type: "compute",
      description: `Computing F(${num}) = F(${num-1}) + F(${num-2})`,
      data: { memo: { ...memo }, current: num, calculations, cacheHits }
    });

    const result = fibMemo(num - 1) + fibMemo(num - 2);
    memo[num] = result;

    steps.push({
      type: "store",
      description: `Storing F(${num}) = ${result} in memoization table`,
      data: { memo: { ...memo }, current: num, result, calculations, cacheHits }
    });

    return result;
  }

  // Initialize
  steps.push({
    type: "init",
    description: `Starting Fibonacci computation for F(${n}) using Dynamic Programming with memoization`,
    data: { memo: {}, current: -1, calculations: 0, cacheHits: 0 }
  });

  // Compute fibonacci
  const finalResult = fibMemo(n);

  // Final step
  steps.push({
    type: "complete",
    description: `Fibonacci computation complete! F(${n}) = ${finalResult}. Total calculations: ${calculations}, Cache hits: ${cacheHits}`,
    data: { memo: { ...memo }, current: n, result: finalResult, calculations, cacheHits }
  });

  return steps;
}

const pseudocode = [
  "function fibonacci(n, memo = {}):",
  "  if n <= 1:",
  "    return n",
  "  ",
  "  if memo[n] exists:",
  "    return memo[n]  // Cache hit",
  "  ",
  "  memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)",
  "  return memo[n]"
];

const relatedProblems = [
  {
    id: 509,
    title: "Fibonacci Number",
    slug: "fibonacci-number",
    difficulty: "Easy" as const
  },
  {
    id: 70,
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy" as const
  },
  {
    id: 1137,
    title: "N-th Tribonacci Number",
    slug: "n-th-tribonacci-number",
    difficulty: "Easy" as const
  },
  {
    id: 746,
    title: "Min Cost Climbing Stairs",
    slug: "min-cost-climbing-stairs",
    difficulty: "Easy" as const
  },
  {
    id: 198,
    title: "House Robber",
    slug: "house-robber",
    difficulty: "Medium" as const
  }
];

export default function FibonacciPage() {
  return (
    <AlgorithmPageTemplate
      title="Fibonacci (Dynamic Programming)"
      description="The Fibonacci sequence using Dynamic Programming with memoization. This approach reduces time complexity from O(2^n) to O(n) by storing previously computed values to avoid redundant calculations."
      timeComplexity="O(n)"
      spaceComplexity="O(n)"
      visualizationComponent={FibonacciVisualizerComponent}
      generateSteps={generateFibonacciSteps}
      initialData={initialData}
      dataInputComponent={NumericInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Dynamic Programming"
    />
  );
}