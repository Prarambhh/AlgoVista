export type AlgorithmCategory =
  | "Arrays"
  | "Strings"
  | "Sorting"
  | "Searching"
  | "Linked List"
  | "Stacks & Queues"
  | "Trees"
  | "Graphs"
  | "Dynamic Programming"
  | "Backtracking"
  | "Greedy"
  | "Math";

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
}

export interface LeetCodeProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface AlgorithmDetail extends AlgorithmMeta {
  pseudocode: string[];
  code: {
    javascript: string;
    python: string;
    java: string;
  };
  defaultInput?: string;
}