"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function generateLISSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const n = arr.length;
  if (n === 0) {
    return [{ type: "init", description: "Provide a non-empty array to visualize LIS" }];
  }

  steps.push({
    type: "init",
    description: "Find the Longest Increasing Subsequence (LIS) using O(n^2) dynamic programming. dp[i] = length of LIS ending at i; prev[i] stores the predecessor index.",
    data: { arr: [...arr] }
  });

  const dp = new Array(n).fill(1);
  const prev = new Array(n).fill(-1);

  let maxLen = 1;
  let maxIdx = 0;

  for (let i = 0; i < n; i++) {
    steps.push({
      type: "consider-i",
      description: `Consider i=${i} (value ${arr[i]}) as the end of a subsequence. Initialize dp[${i}] = 1`,
      pointers: [i],
      highlights: [i],
      data: { i, dp: [...dp], prev: [...prev] }
    });

    for (let j = 0; j < i; j++) {
      steps.push({
        type: "compare",
        description: `Compare j=${j} (value ${arr[j]}) with i=${i} (value ${arr[i]}). If arr[j] < arr[i], try extending subsequence ending at j.`,
        compares: [j, i],
        pointers: [j, i],
        data: { i, j, dp: [...dp], prev: [...prev] }
      });

      if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
        const newVal = dp[j] + 1;
        dp[i] = newVal;
        prev[i] = j;
        steps.push({
          type: "update",
          description: `arr[j] < arr[i] and dp[j]+1 > dp[i]. Update dp[${i}] = ${newVal}, prev[${i}] = ${j}.`,
          highlights: [i, j],
          pointers: [j, i],
          data: { i, j, dp: [...dp], prev: [...prev] }
        });
      }
    }

    if (dp[i] > maxLen) {
      maxLen = dp[i];
      maxIdx = i;
      steps.push({
        type: "new-max",
        description: `New longest length found: dp[${i}] = ${dp[i]} (maxLen = ${maxLen})`,
        highlights: [i],
        pointer: i,
        data: { i, maxLen, maxIdx, dp: [...dp], prev: [...prev] }
      });
    }
  }

  // Backtrack to reconstruct one LIS
  const sequenceIndices: number[] = [];
  let k = maxIdx;
  while (k !== -1) {
    sequenceIndices.push(k);
    k = prev[k];
  }
  sequenceIndices.reverse();

  steps.push({
    type: "backtrack-start",
    description: `Backtrack from index ${maxIdx} to reconstruct an LIS of length ${maxLen}.`,
    highlights: [maxIdx],
    pointer: maxIdx,
    data: { dp: [...dp], prev: [...prev], maxIdx, maxLen }
  });

  for (let t = 0; t < sequenceIndices.length; t++) {
    const upto = sequenceIndices.slice(0, t + 1);
    steps.push({
      type: "backtrack-progress",
      description: `LIS so far (indices): [${upto.join(", ")}] => values: [${upto.map((x) => arr[x]).join(", ")}]`,
      highlights: upto,
      pointers: upto,
      data: { lisIndices: [...upto], lisValues: upto.map((x) => arr[x]) }
    });
  }

  steps.push({
    type: "complete",
    description: `Complete. LIS length = ${maxLen}. One LIS: [${sequenceIndices.map((x) => arr[x]).join(", ")}].`,
    highlights: sequenceIndices,
    pointers: sequenceIndices,
    data: { dp, prev, lisIndices: sequenceIndices, lisValues: sequenceIndices.map((x) => arr[x]) }
  });

  return steps;
}

const pseudocode: string[] = [
  "dp[i] = 1 for all i; prev[i] = -1",
  "for i from 0 to n-1:",
  "  for j from 0 to i-1:",
  "    if arr[j] < arr[i] and dp[j] + 1 > dp[i]:",
  "      dp[i] = dp[j] + 1; prev[i] = j",
  "track maxLen and maxIdx",
  "backtrack from maxIdx using prev[] to reconstruct an LIS"
];

const relatedProblems = (leetcodeProblems["longest-increasing-subsequence"] || []) as Array<{
  id: number; title: string; slug: string; difficulty: string;
}>;

export default function LISPage() {
  return (
    <AlgorithmPageTemplate
      title="Longest Increasing Subsequence"
      description="Find the LIS using a classic O(n^2) DP approach. We compute the length of the longest increasing subsequence ending at each index and then backtrack to reconstruct one LIS."
      timeComplexity="O(n^2)"
      spaceComplexity="O(n)"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateLISSteps}
      initialData={[10, 9, 2, 5, 3, 7, 101, 18]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Dynamic Programming"
    />
  );
}