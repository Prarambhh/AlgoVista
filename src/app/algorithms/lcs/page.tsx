"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import LCSVisualizerComponent from "@/components/algorithm/lcs-visualizer";
import LCSInput from "@/components/algorithm/lcs-input";
import { VisualizationStep } from "@/lib/visualization-utils";

interface LCSData {
  string1: string;
  string2: string;
}

const initialData: LCSData[] = [
  {
    string1: "ABCDGH",
    string2: "AEDFHR"
  }
];

function generateLCSSteps(data: LCSData[]): VisualizationStep[] {
  const { string1, string2 } = data[0] || { string1: "", string2: "" };
  const steps: VisualizationStep[] = [];
  const m = string1.length;
  const n = string2.length;

  if (m === 0 || n === 0) {
    steps.push({
      id: 0,
      type: "complete",
      description: "One or both strings are empty. LCS length is 0.",
      data: {
        string1,
        string2,
        dpTable: [[0]],
        currentRow: 0,
        currentCol: 0,
        lcsLength: 0,
        lcsString: "",
        phase: "complete",
        backtrackPath: []
      }
    });
    return steps;
  }

  // Initialize DP table
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  // Initial state
  steps.push({
    id: 0,
    type: "init",
    description: `Initialize DP table of size ${m + 1} × ${n + 1}. First row and column are filled with 0s representing empty string comparisons.`,
    data: {
      string1,
      string2,
      dpTable: dp.map(row => [...row]),
      currentRow: 0,
      currentCol: 0,
      lcsLength: 0,
      lcsString: "",
      phase: "building" as const,
      backtrackPath: []
    }
  });

  // Build DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = string1[i - 1];
      const char2 = string2[j - 1];

      if (char1 === char2) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          id: steps.length,
          type: "match",
          description: `Characters match: '${char1}' = '${char2}'. dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i-1][j-1]} + 1 = ${dp[i][j]}.`,
          data: {
            string1,
            string2,
            dpTable: dp.map(row => [...row]),
            currentRow: i,
            currentCol: j,
            lcsLength: dp[i][j],
            lcsString: "",
            phase: "building" as const,
            backtrackPath: []
          }
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          id: steps.length,
          type: "no-match",
          description: `Characters don't match: '${char1}' ≠ '${char2}'. dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}.`,
          data: {
            string1,
            string2,
            dpTable: dp.map(row => [...row]),
            currentRow: i,
            currentCol: j,
            lcsLength: dp[i][j],
            lcsString: "",
            phase: "building" as const,
            backtrackPath: []
          }
        });
      }
    }
  }

  // Backtrack to find LCS
  let lcs = "";
  let i = m, j = n;
  const backtrackPath: Array<{row: number; col: number}> = [];

  steps.push({
    id: steps.length,
    type: "backtrack-start",
    description: `DP table complete! LCS length is ${dp[m][n]}. Now backtracking from dp[${m}][${n}] to reconstruct the LCS string.`,
    data: {
      string1,
      string2,
      dpTable: dp.map(row => [...row]),
      currentRow: i,
      currentCol: j,
      lcsLength: dp[m][n],
      lcsString: "",
      phase: "backtracking" as const,
      backtrackPath: [...backtrackPath]
    }
  });

  while (i > 0 && j > 0) {
    backtrackPath.push({row: i, col: j});
    
    if (string1[i - 1] === string2[j - 1]) {
      lcs = string1[i - 1] + lcs;
      steps.push({
        id: steps.length,
        type: "backtrack-match",
        description: `Characters match: '${string1[i-1]}' = '${string2[j-1]}'. Add '${string1[i-1]}' to LCS and move diagonally to dp[${i-1}][${j-1}].`,
        data: {
          string1,
          string2,
          dpTable: dp.map(row => [...row]),
          currentRow: i - 1,
          currentCol: j - 1,
          lcsLength: dp[m][n],
          lcsString: lcs,
          phase: "backtracking" as const,
          backtrackPath: [...backtrackPath]
        }
      });
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      steps.push({
        id: steps.length,
        type: "backtrack-up",
        description: `Characters don't match. dp[${i-1}][${j}] = ${dp[i-1][j]} > dp[${i}][${j-1}] = ${dp[i][j-1]}. Move up to dp[${i-1}][${j}].`,
        data: {
          string1,
          string2,
          dpTable: dp.map(row => [...row]),
          currentRow: i - 1,
          currentCol: j,
          lcsLength: dp[m][n],
          lcsString: lcs,
          phase: "backtracking" as const,
          backtrackPath: [...backtrackPath]
        }
      });
      i--;
    } else {
      steps.push({
        id: steps.length,
        type: "backtrack-left",
        description: `Characters don't match. dp[${i}][${j-1}] = ${dp[i][j-1]} ≥ dp[${i-1}][${j}] = ${dp[i-1][j]}. Move left to dp[${i}][${j-1}].`,
        data: {
          string1,
          string2,
          dpTable: dp.map(row => [...row]),
          currentRow: i,
          currentCol: j - 1,
          lcsLength: dp[m][n],
          lcsString: lcs,
          phase: "backtracking" as const,
          backtrackPath: [...backtrackPath]
        }
      });
      j--;
    }
  }

  // Final result
  steps.push({
    id: steps.length,
    type: "complete",
    description: `Backtracking complete! The Longest Common Subsequence is "${lcs}" with length ${lcs.length}. The algorithm traced the optimal path through the DP table.`,
    data: {
      string1,
      string2,
      dpTable: dp.map(row => [...row]),
      currentRow: -1,
      currentCol: -1,
      lcsLength: dp[m][n],
      lcsString: lcs,
      phase: "complete" as const,
      backtrackPath
    }
  });

  return steps;
}

const pseudocode = [
  "function LCS(string1, string2):",
  "  m = length(string1)",
  "  n = length(string2)",
  "  dp = matrix[m+1][n+1] filled with 0",
  "  ",
  "  // Build DP table",
  "  for i = 1 to m:",
  "    for j = 1 to n:",
  "      if string1[i-1] == string2[j-1]:",
  "        dp[i][j] = dp[i-1][j-1] + 1",
  "      else:",
  "        dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
  "  ",
  "  // Backtrack to find LCS",
  "  lcs = \"\"",
  "  i = m, j = n",
  "  while i > 0 and j > 0:",
  "    if string1[i-1] == string2[j-1]:",
  "      lcs = string1[i-1] + lcs",
  "      i--, j--",
  "    else if dp[i-1][j] > dp[i][j-1]:",
  "      i--",
  "    else:",
  "      j--",
  "  ",
  "  return lcs"
];

const relatedProblems = [
  { id: 1143, title: "Longest Common Subsequence", slug: "longest-common-subsequence", difficulty: "Medium" as const },
  { id: 712, title: "Minimum ASCII Delete Sum for Two Strings", slug: "minimum-ascii-delete-sum-for-two-strings", difficulty: "Medium" as const },
  { id: 583, title: "Delete Operation for Two Strings", slug: "delete-operation-for-two-strings", difficulty: "Medium" as const },
  { id: 1035, title: "Uncrossed Lines", slug: "uncrossed-lines", difficulty: "Medium" as const },
  { id: 516, title: "Longest Palindromic Subsequence", slug: "longest-palindromic-subsequence", difficulty: "Medium" as const }
];

const codeSamples = {
  "JavaScript": `// Longest Common Subsequence - returns the LCS string
function lcs(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  // Build length table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  
  // Reconstruct LCS string
  let i = m, j = n;
  const res = [];
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) { res.push(s1[i - 1]); i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return res.reverse().join('');
}`,
  "Python": `# Longest Common Subsequence - returns the LCS string
def lcs(s1: str, s2: str) -> str:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    i, j = m, n
    res = []
    while i > 0 and j > 0:
        if s1[i - 1] == s2[j - 1]:
            res.append(s1[i - 1])
            i -= 1; j -= 1
        elif dp[i - 1][j] >= dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(res))`,
  "Java": `// Longest Common Subsequence - returns the LCS string
public static String lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1))
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    int i = m, j = n;
    StringBuilder sb = new StringBuilder();
    while (i > 0 && j > 0) {
        if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
            sb.append(s1.charAt(i - 1));
            i--; j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return sb.reverse().toString();
}`
};
export default function LCSPage() {
  return (
    <AlgorithmPageTemplate
      title="Longest Common Subsequence"
      description="Find the longest common subsequence between two strings using dynamic programming. Visualizes the DP table build and the backtracking path to reconstruct the sequence."
      timeComplexity="O(m × n)"
      spaceComplexity="O(m × n)"
      visualizationComponent={LCSVisualizerComponent}
      generateSteps={generateLCSSteps}
      initialData={initialData}
      dataInputComponent={LCSInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Dynamic Programming"
      code={codeSamples}
    />
  );
}