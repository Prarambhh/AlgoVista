"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import EditDistanceVisualizer from "@/components/algorithm/edit-distance-visualizer";
import EditDistanceInput from "@/components/algorithm/edit-distance-input";
import { VisualizationStep } from "@/lib/visualization-utils";

interface EditDistanceData {
  string1: string;
  string2: string;
}

const initialData: EditDistanceData[] = [
  { string1: "kitten", string2: "sitting" }
];

function generateEditDistanceSteps(dataArr: EditDistanceData[]): VisualizationStep[] {
  const { string1, string2 } = dataArr[0] || { string1: "", string2: "" };
  const steps: VisualizationStep[] = [];

  const m = string1.length;
  const n = string2.length;

  // Initialize dp table (m+1) x (n+1)
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Base cases initialization
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  steps.push({
    id: 0,
    type: "init",
    description: `Initialize DP table of size ${m + 1} × ${n + 1}. First row and column represent converting to/from empty string using insertions or deletions.`,
    data: {
      string1,
      string2,
      dpTable: dp.map(row => [...row]),
      currentRow: 0,
      currentCol: 0,
      phase: "building",
      operation: "Initialize base cases",
      editsSoFar: [],
      editCounts: { insert: 0, delete: 0, replace: 0 },
    }
  });

  // Build DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (string1[i - 1] === string2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({
          id: steps.length,
          type: "match",
          description: `Characters match: '${string1[i-1]}' = '${string2[j-1]}'. Cost = dp[${i-1}][${j-1}] = ${dp[i-1][j-1]}`,
          data: {
            string1,
            string2,
            dpTable: dp.map(row => [...row]),
            currentRow: i,
            currentCol: j,
            phase: "building",
            operation: "Match (no cost)",
            editsSoFar: [],
            editCounts: { insert: 0, delete: 0, replace: 0 },
          }
        });
      } else {
        const insert = dp[i][j - 1] + 1;
        const del = dp[i - 1][j] + 1;
        const replace = dp[i - 1][j - 1] + 1;
        dp[i][j] = Math.min(insert, del, replace);
        const op = dp[i][j] === insert ? `Insert '${string2[j-1]}'` : dp[i][j] === del ? `Delete '${string1[i-1]}'` : `Replace '${string1[i-1]}' with '${string2[j-1]}'`;
        steps.push({
          id: steps.length,
          type: "choose-op",
          description: `Choose min of insert(${insert}), delete(${del}), replace(${replace}) = ${dp[i][j]}.`,
          data: {
            string1,
            string2,
            dpTable: dp.map(row => [...row]),
            currentRow: i,
            currentCol: j,
            phase: "building",
            operation: op,
            editsSoFar: [],
            editCounts: { insert: 0, delete: 0, replace: 0 },
          }
        });
      }
    }
  }

  // Backtracking to show path of operations
  let i = m, j = n;
  const backtrackPath: Array<{ row: number; col: number }> = [];
  const edits: Array<any> = [];
  let counts = { insert: 0, delete: 0, replace: 0 };

  steps.push({
    id: steps.length,
    type: "backtrack-start",
    description: `DP table built. Edit distance is ${dp[m][n]}. Backtracking to recover operations...`,
    data: {
      string1,
      string2,
      dpTable: dp.map(row => [...row]),
      currentRow: i,
      currentCol: j,
      phase: "backtracking",
      operation: "Start backtracking",
      backtrackPath: [...backtrackPath],
      editsSoFar: [],
      editCounts: counts,
    }
  });

  while (i > 0 || j > 0) {
    backtrackPath.push({ row: i, col: j });
    if (i > 0 && j > 0 && string1[i - 1] === string2[j - 1]) {
      steps.push({
        id: steps.length,
        type: "backtrack-match",
        description: `Characters match at (${i}, ${j}). Move diagonally without cost.`,
        data: {
          string1,
          string2,
          dpTable: dp.map(row => [...row]),
          currentRow: i - 1,
          currentCol: j - 1,
          phase: "backtracking",
          operation: "Match (no operation)",
          backtrackPath: [...backtrackPath],
          editsSoFar: [...edits],
          editCounts: counts,
        }
      });
      i--; j--;
    } else {
      const candidates: Array<{ cost: number; move: string; ni: number; nj: number; op: string; type: "insert" | "delete" | "replace" } > = [];
      if (i > 0) candidates.push({ cost: dp[i - 1][j] + 1, move: "up", ni: i - 1, nj: j, op: `Delete '${string1[i-1]}'`, type: "delete" });
      if (j > 0) candidates.push({ cost: dp[i][j - 1] + 1, move: "left", ni: i, nj: j - 1, op: `Insert '${string2[j-1]}'`, type: "insert" });
      if (i > 0 && j > 0) candidates.push({ cost: dp[i - 1][j - 1] + 1, move: "diag", ni: i - 1, nj: j - 1, op: `Replace '${string1[i-1]}' with '${string2[j-1]}'`, type: "replace" });
      const best = candidates.reduce((a, b) => (a.cost <= b.cost ? a : b));

      // Record specific edit
      if (best.type === "delete") {
        edits.push({ type: "delete", fromChar: string1[i - 1], fromIndex: i - 1 });
        counts = { ...counts, delete: counts.delete + 1 };
      } else if (best.type === "insert") {
        edits.push({ type: "insert", toChar: string2[j - 1], toIndex: j - 1 });
        counts = { ...counts, insert: counts.insert + 1 };
      } else if (best.type === "replace") {
        edits.push({ type: "replace", fromChar: string1[i - 1], toChar: string2[j - 1], fromIndex: i - 1 });
        counts = { ...counts, replace: counts.replace + 1 };
      }

      steps.push({
        id: steps.length,
        type: "backtrack-op",
        description: `Backtrack step: choose operation '${best.op}' (cost leads to ${best.cost}).`,
        data: {
          string1,
          string2,
          dpTable: dp.map(row => [...row]),
          currentRow: best.ni,
          currentCol: best.nj,
          phase: "backtracking",
          operation: best.op,
          backtrackPath: [...backtrackPath],
          editsSoFar: [...edits],
          editCounts: counts,
        }
      });
      i = best.ni;
      j = best.nj;
    }
  }

  steps.push({
    id: steps.length,
    type: "complete",
    description: `Backtracking complete. Minimum edit distance is ${dp[m][n]}.`,
    data: {
      string1,
      string2,
      dpTable: dp.map(row => [...row]),
      currentRow: -1,
      currentCol: -1,
      phase: "complete",
      operation: `Distance = ${dp[m][n]}`,
      backtrackPath,
      edits,
      editCounts: counts,
    }
  });

  return steps;
}

const pseudocode = [
  "function EditDistance(s1, s2):",
  "  m = length(s1)",
  "  n = length(s2)",
  "  dp = matrix[m+1][n+1]",
  "  for i = 0..m: dp[i][0] = i",
  "  for j = 0..n: dp[0][j] = j",
  "  for i = 1..m:",
  "    for j = 1..n:",
  "      if s1[i-1] == s2[j-1]:",
  "        dp[i][j] = dp[i-1][j-1]",
  "      else:",
  "        dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
  "  return dp[m][n]"
];

const relatedProblems = [
  { id: 72, title: "Edit Distance", slug: "edit-distance", difficulty: "Hard" as const },
  { id: 583, title: "Delete Operation for Two Strings", slug: "delete-operation-for-two-strings", difficulty: "Medium" as const },
  { id: 712, title: "Minimum ASCII Delete Sum for Two Strings", slug: "minimum-ascii-delete-sum-for-two-strings", difficulty: "Medium" as const }
];

const codeSamples = {
  "JavaScript": `// Edit Distance (Levenshtein Distance)
function editDistance(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // delete
          dp[i][j - 1],     // insert
          dp[i - 1][j - 1]  // replace
        );
      }
    }
  }
  
  return dp[m][n];
}`,
  "Python": `# Edit Distance (Levenshtein Distance)
def edit_distance(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],     # delete
                    dp[i][j - 1],     # insert
                    dp[i - 1][j - 1]  # replace
                )
    
    return dp[m][n]`,
  "Java": `// Edit Distance (Levenshtein Distance)
public static int editDistance(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    // Base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(Math.min(
                    dp[i - 1][j],     // delete
                    dp[i][j - 1]),    // insert
                    dp[i - 1][j - 1]  // replace
                );
            }
        }
    }
    
    return dp[m][n];
}`
};

export default function EditDistancePage() {
  return (
    <AlgorithmPageTemplate
      title="Edit Distance (Levenshtein)"
      description="Compute the minimum number of operations (insert, delete, replace) required to transform one string into another using dynamic programming."
      timeComplexity="O(m × n)"
      spaceComplexity="O(m × n)"
      visualizationComponent={EditDistanceVisualizer}
      generateSteps={generateEditDistanceSteps}
      initialData={initialData}
      dataInputComponent={EditDistanceInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Dynamic Programming"
      code={codeSamples}
    />
  );
}