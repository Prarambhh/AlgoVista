"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function SimpleTextVisualizer({ step }: { step: VisualizationStep }) {
  return (
    <div className="p-4 card">
      <p className="font-medium">{step.description ?? ""}</p>
    </div>
  );
}

function TrieWordsAndQueryInput({ data, onDataChange }: { data: any[]; onDataChange: (d: any[]) => void }) {
  const list = Array.isArray(data) ? (data as any[]) : [];
  const words = Array.isArray(list[0]) ? (list[0] as string[]) : ["trie", "tree", "algo"]; 
  const query = typeof list[1] === "string" ? (list[1] as string) : "tree";
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-muted">Dictionary words (comma-separated)</label>
        <input
          className="input w-full"
          value={words.join(", ")}
          onChange={(e) => {
            const newWords = e.target.value
              .split(",")
              .map((w) => w.trim())
              .filter(Boolean);
            onDataChange([newWords, query]);
          }}
          placeholder="e.g., trie, tree, algo"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted">Search word</label>
        <input
          className="input w-full"
          value={query}
          onChange={(e) => onDataChange([words, e.target.value])}
          placeholder="e.g., tree"
        />
      </div>
    </div>
  );
}

function generateTrieSearchSteps(data: any[]): VisualizationStep[] {
  const words: string[] = (Array.isArray(data) && Array.isArray(data[0])) ? (data[0] as string[]) : [];
  const query: string = (Array.isArray(data) && typeof data[1] === "string") ? (data[1] as string) : "";

  const steps: VisualizationStep[] = [];
  if (!words.length || !query) {
    return [{ type: "init", description: "Enter dictionary words and a search word to visualize trie search." }];
  }

  steps.push({ type: "init", description: `Build trie from ${words.length} word(s), then search for \"${query}\".` });

  // Build phase (narrative)
  for (const w of words) {
    steps.push({ type: "insert", description: `Insert word: "${w}" (building the trie)` });
    for (let i = 0; i < w.length; i++) {
      steps.push({ type: "step", description: `Ensure node for '${w[i]}' exists` });
    }
    steps.push({ type: "mark", description: `Mark end of word: "${w}"` });
  }

  // Search phase (narrative)
  steps.push({ type: "search", description: `Search for \"${query}\" from root` });
  for (let i = 0; i < query.length; i++) {
    steps.push({ type: "step", description: `Follow edge for '${query[i]}'` });
  }
  steps.push({ type: "result", description: `Check terminal flag at final node: ${words.includes(query) ? "found" : "not found"}` });

  steps.push({ type: "complete", description: "Trie search visualization finished (narrative view)." });
  return steps;
}

const pseudocode: string[] = [
  "build trie from dictionary words",
  "node = root",
  "for ch in query:",
  "  if no child ch: return false",
  "  node = node.child[ch]",
  "return node.terminal"
];

const relatedProblems = (leetcodeProblems["trie-search"] || []) as Array<{
  id: number; title: string; slug: string; difficulty: string;
}>;

export default function TrieSearchPage() {
  return (
    <AlgorithmPageTemplate
      title="Trie Search"
      description="Search a word in a trie built from a list of dictionary words. This page currently shows narrative steps."
      timeComplexity="O(length of query)"
      spaceComplexity="O(total characters for building)"
      visualizationComponent={SimpleTextVisualizer}
      generateSteps={generateTrieSearchSteps}
      initialData={[["trie", "tree", "algo"], "tree"]}
      dataInputComponent={TrieWordsAndQueryInput}
      pseudocode={pseudocode}
       code={codeSamples}
       relatedProblems={relatedProblems}
       category="Trie"
     />
   );
 }
 
const codeSamples = {
  javascript: `// Trie Search - JavaScript\nclass TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return node.isEnd;\n  }\n}\n\n// Example:\n// const trie = new Trie();\n// ["trie","tree","algo"].forEach(w => trie.insert(w));\n// console.log(trie.search("tree")); // true\n// console.log(trie.search("tr"));   // false`,

  python: `# Trie Search - Python\nclass TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\n    def search(self, word: str) -> bool:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n# Example:\n# trie = Trie()\n# for w in ["trie","tree","algo"]:\n#     trie.insert(w)\n# print(trie.search("tree"))  # True\n# print(trie.search("tr"))    # False`,

  java: `// Trie Search - Java\nimport java.util.*;\nclass TrieNode {\n    Map<Character, TrieNode> children = new HashMap<>();\n    boolean isEnd = false;\n}\nclass Trie {\n    TrieNode root = new TrieNode();\n    public void insert(String word) {\n        TrieNode node = root;\n        for (char ch : word.toCharArray()) {\n            node.children.putIfAbsent(ch, new TrieNode());\n            node = node.children.get(ch);\n        }\n        node.isEnd = true;\n    }\n    public boolean search(String word) {\n        TrieNode node = root;\n        for (char ch : word.toCharArray()) {\n            TrieNode next = node.children.get(ch);\n            if (next == null) return false;\n            node = next;\n        }\n        return node.isEnd;\n    }\n}\n// Example:\n// Trie trie = new Trie();\n// for (String w : Arrays.asList("trie","tree","algo")) trie.insert(w);\n// System.out.println(trie.search("tree")); // true\n// System.out.println(trie.search("tr"));   // false`
};