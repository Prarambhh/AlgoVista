"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function SimpleTextVisualizer({ step }: { step: VisualizationStep }) {
  return (
    <div className="p-4 card">
      <p className="font-medium">{step.description ?? ""}</p>
      {Array.isArray(step.data) && step.data.length > 0 && (
        <pre className="text-xs text-muted mt-2 overflow-auto">{JSON.stringify(step.data, null, 2)}</pre>
      )}
    </div>
  );
}

function DimensionsInput({ data, onDataChange }: { data: any[]; onDataChange: (d: any[]) => void }) {
  const dims = (Array.isArray(data) && Array.isArray(data[0])) ? (data[0] as number[]) : [10, 20, 30, 40];
  return (
    <div className="space-y-2">
      <label className="text-sm text-muted">Dimensions (e.g., 10,20,30,40)</label>
      <input
        className="input w-full"
        value={dims.join(",")}
        onChange={(e) => {
          const arr = e.target.value
            .split(",")
            .map((v) => Number(v.trim()))
            .filter((v) => Number.isFinite(v) && v > 0);
          onDataChange([arr]);
        }}
      />
    </div>
  );
}

function generateMCMSteps(data: any[]): VisualizationStep[] {
  const p: number[] = (Array.isArray(data) && Array.isArray(data[0])) ? (data[0] as number[]) : [];
  const steps: VisualizationStep[] = [];
  const n = p.length - 1; // number of matrices
  if (n <= 1) {
    return [{ type: "init", description: "Provide at least two matrices (length of dimensions >= 3)." }];
  }
  steps.push({ type: "init", description: `Matrices A1..A${n} with dimensions vector [${p.join(", ")}] (Ai has shape p[i-1] x p[i]).` });

  const m: number[][] = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  const s: number[][] = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));

  for (let L = 2; L <= n; L++) {
    steps.push({ type: "length", description: `Consider chain length L=${L}` });
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;
      m[i][j] = Number.POSITIVE_INFINITY;
      steps.push({ type: "subproblem", description: `Solve M[${i}][${j}] (A${i}..A${j})`, data: [{ i, j }] });
      for (let k = i; k <= j - 1; k++) {
        const q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
        steps.push({ type: "compute", description: `k=${k}: cost = M[${i}][${k}] + M[${k + 1}][${j}] + ${p[i - 1]}*${p[k]}*${p[j]} = ${q}`, data: [{ i, k, j, cost: q }] });
        if (q < m[i][j]) {
          m[i][j] = q;
          s[i][j] = k;
          steps.push({ type: "update", description: `Update M[${i}][${j}] = ${q} with split at k=${k}` });
        }
      }
    }
  }

  function buildParens(i: number, j: number): string {
    if (i === j) return `A${i}`;
    const k = s[i][j];
    return `(${buildParens(i, k)} x ${buildParens(k + 1, j)})`;
  }

  const order = buildParens(1, n);
  steps.push({ type: "complete", description: `Minimum multiplications: ${m[1][n]}. Optimal order: ${order}.`, data: [{ m, s }] });
  return steps;
}

const pseudocode: string[] = [
  "for L = 2..n:",
  "  for i = 1..n-L+1:",
  "    j = i+L-1; M[i][j] = +inf",
  "    for k = i..j-1:",
  "      q = M[i][k] + M[k+1][j] + p[i-1]*p[k]*p[j]",
  "      if q < M[i][j]: M[i][j] = q; S[i][j] = k",
  "recover order from S table"
];

const relatedProblems = (leetcodeProblems["matrix-chain-multiplication"] || []) as Array<{
  id: number; title: string; slug: string; difficulty: string;
}>;

export default function MatrixChainMultiplicationPage() {
  return (
    <AlgorithmPageTemplate
      title="Matrix Chain Multiplication"
      description="Dynamic programming to find the most efficient way to multiply a given sequence of matrices."
      timeComplexity="O(n^3)"
      spaceComplexity="O(n^2)"
      visualizationComponent={SimpleTextVisualizer}
      generateSteps={generateMCMSteps}
      initialData={[[10, 20, 30, 40]]}
      dataInputComponent={DimensionsInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Dynamic Programming"
    />
  );
}