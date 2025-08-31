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
      relatedProblems={relatedProblems}
      category="Data Structures"
    />
  );
}