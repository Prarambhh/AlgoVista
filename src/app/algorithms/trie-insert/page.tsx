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
      relatedProblems={relatedProblems}
      category="Data Structures"
    />
  );
}