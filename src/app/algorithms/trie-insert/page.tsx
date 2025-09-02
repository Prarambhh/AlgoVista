"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

// Minimal visualizer that renders steps' description list until a dedicated Trie visualizer exists
function SimpleTextVisualizer({ step }: { step: VisualizationStep }) {
  return (
    <div className="p-4 card">
      <p className="font-medium">{step.description ?? ""}</p>
    </div>
  );
}

// Input component allowing a list of words (comma-separated)
function TrieWordsInput({ data, onDataChange }: { data: any[]; onDataChange: (d: any[]) => void }) {
  const value = Array.isArray(data) ? (data as string[]) : [];
  return (
    <div className="space-y-2">
      <label className="text-sm text-muted">Words (comma-separated)</label>
      <input
        className="input w-full"
        value={value.join(", ")}
        onChange={(e) => {
          const words = e.target.value
            .split(",")
            .map((w) => w.trim())
            .filter(Boolean);
          onDataChange(words);
        }}
        placeholder="e.g., trie, tree, algo"
      />
    </div>
  );
}

function generateTrieInsertSteps(words: string[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  if (!words || words.length === 0) {
    return [{ type: "init", description: "Enter one or more words to visualize trie insertion." }];
  }

  steps.push({ type: "init", description: `Start inserting ${words.length} word(s) into an empty trie.` });

  // Simulate insertion narratively
  for (const word of words) {
    steps.push({ type: "insert", description: `Insert word: \"${word}\"` });
    for (let i = 0; i < word.length; i++) {
      const prefix = word.slice(0, i + 1);
      steps.push({ type: "step", description: `Add node for character '${word[i]}' (prefix: ${prefix})` });
    }
    steps.push({ type: "mark", description: `Mark end of word: \"${word}\"` });
  }

  steps.push({ type: "complete", description: "All words inserted into trie (narrative view)." });
  return steps;
}

const pseudocode: string[] = [
  "trie = empty",
  "for each word:",
  "  node = root",
  "  for ch in word:",
  "    if node has no child ch: create child",
  "    node = node.child[ch]",
  "  mark node as terminal"
];

const relatedProblems = (leetcodeProblems["trie-insert"] || []) as Array<{
  id: number; title: string; slug: string; difficulty: string;
}>;

export default function TrieInsertPage() {
  return (
    <AlgorithmPageTemplate
      title="Trie Insert"
      description="Insert words into a trie. This page currently shows narrative steps; a rich trie visualizer can be added next."
      timeComplexity="O(total characters)"
      spaceComplexity="O(total characters)"
      visualizationComponent={SimpleTextVisualizer}
      generateSteps={generateTrieInsertSteps}
      initialData={["trie", "tree", "algo"]}
      dataInputComponent={TrieWordsInput}
      pseudocode={pseudocode}
       code={codeSamples}
       relatedProblems={relatedProblems}
       category="Trie"
     />
   );
 }
 
const codeSamples = {
  javascript: `// Trie Insert - JavaScript\nclass TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n}\n\n// Example:\n// const trie = new Trie();\n// trie.insert("apple");`,

  python: `# Trie Insert - Python\nclass TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\n# Example:\n# trie = Trie()\n# trie.insert("apple")`,

  java: `// Trie Insert - Java\nimport java.util.*;\nclass TrieNode {\n    Map<Character, TrieNode> children = new HashMap<>();\n    boolean isEnd = false;\n}\nclass Trie {\n    TrieNode root = new TrieNode();\n    public void insert(String word) {\n        TrieNode node = root;\n        for (char ch : word.toCharArray()) {\n            node.children.putIfAbsent(ch, new TrieNode());\n            node = node.children.get(ch);\n        }\n        node.isEnd = true;\n    }\n}\n// Example:\n// Trie trie = new Trie();\n// trie.insert("apple");`
};