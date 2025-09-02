"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";
import TrieVisualizerComponent, { TrieNodeSnap } from "@/components/algorithm/trie-visualizer";
import TrieOperationsInput, { TrieOpsData, TrieOperation } from "@/components/algorithm/trie-operations-input";

// Utilities to build a trie snapshot and to clone it for steps
function makeNode(id: string, char: string): TrieNodeSnap {
  return { id, char, isEnd: false, children: {} };
}

function buildTrie(words: string[]): TrieNodeSnap {
  const root = makeNode("$", "∅");
  for (const w of words) {
    let node = root;
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      const nextId = node.id === "$" ? ch : node.id + ch;
      if (!node.children[ch]) node.children[ch] = makeNode(nextId, ch);
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  return root;
}

function cloneTrie(node: TrieNodeSnap): TrieNodeSnap {
  const copy: TrieNodeSnap = { id: node.id, char: node.char, isEnd: node.isEnd, children: {} };
  for (const [ch, child] of Object.entries(node.children)) {
    copy.children[ch] = cloneTrie(child);
  }
  return copy;
}

function collectTerminalIds(node: TrieNodeSnap): string[] {
  const res: string[] = [];
  const stack: TrieNodeSnap[] = [node];
  while (stack.length) {
    const cur = stack.pop()!;
    if (cur.isEnd) res.push(cur.id);
    for (const ch in cur.children) stack.push(cur.children[ch]);
  }
  return res;
}

function ensurePath(root: TrieNodeSnap, word: string, upto: number): { node: TrieNodeSnap; created: boolean } {
  let node = root;
  let createdAny = false;
  for (let i = 0; i < upto; i++) {
    const ch = word[i];
    const nextId = node.id === "$" ? ch : node.id + ch;
    if (!node.children[ch]) {
      node.children[ch] = makeNode(nextId, ch);
      createdAny = true;
    }
    node = node.children[ch];
  }
  return { node, created: createdAny };
}

function generateTrieSteps(trieData: TrieOpsData): VisualizationStep[] {
  const { initialWords, operations } = trieData;
  const steps: VisualizationStep[] = [];

  // Build initial trie from initialWords
  let root = buildTrie(initialWords);

  steps.push({
    type: "init",
    description: initialWords.length
      ? `Initialized trie with ${initialWords.length} word(s).`
      : "Initialized empty trie.",
    data: { trie: cloneTrie(root), pseudocodeLine: 1, terminalNodes: collectTerminalIds(root) }
  });

  operations.forEach((op, idx) => {
    if (op.type === "insert") {
      const word = op.word;
      steps.push({
        type: "insert-start",
        description: `Operation ${idx + 1}: INSERT("${word}") - traverse/extend path for each character.`,
        data: { trie: cloneTrie(root), currentWord: word, pseudocodeLine: 4, terminalNodes: collectTerminalIds(root) },
      });

      let node = root;
      for (let i = 0; i < word.length; i++) {
        const ch = word[i];
        const nextId = node.id === "$" ? ch : node.id + ch;
        const created = !node.children[ch];
        if (!node.children[ch]) node.children[ch] = makeNode(nextId, ch);
        const parentId = node.id;
        node = node.children[ch];

        steps.push({
          type: created ? "insert-create" : "insert-traverse",
          description: created
            ? `Create node for '${ch}' and connect from ${parentId === "$" ? "root" : `"${parentId}"`} → "${node.id}"`
            : `Traverse existing edge '${ch}' to node "${node.id}"`,
          data: {
            trie: cloneTrie(root),
            highlightEdges: [{ source: parentId, target: node.id }],
            createdEdges: created ? [{ source: parentId, target: node.id }] : undefined,
            pseudocodeLine: created ? 5 : 6,
            terminalNodes: collectTerminalIds(root)
          },
          highlights: [node.id]
        });
      }

      node.isEnd = true;
      steps.push({
        type: "insert-mark",
        description: `Mark end-of-word at node "${node.id}" for "${word}"`,
        data: { trie: cloneTrie(root), pseudocodeLine: 7, terminalNodes: collectTerminalIds(root) },
        highlights: [node.id]
      });
    } else if (op.type === "search") {
      const word = op.word;
      steps.push({
        type: "search-start",
        description: `Operation ${idx + 1}: SEARCH("${word}") - follow edges for each character.`,
        data: { trie: cloneTrie(root), currentWord: word, pseudocodeLine: 9, terminalNodes: collectTerminalIds(root) }
      });

      let node: TrieNodeSnap | null = root;
      let failedAt = -1;
      for (let i = 0; i < word.length; i++) {
        const ch = word[i];
        const parentId = node!.id;
        if (!node!.children[ch]) {
          failedAt = i;
          steps.push({
            type: "search-miss",
            description: `No child '${ch}' from ${parentId === "$" ? "root" : `"${parentId}"`} — search fails.`,
            data: { trie: cloneTrie(root), pseudocodeLine: 11, terminalNodes: collectTerminalIds(root) },
          });
          break;
        }
        node = node!.children[ch];
        steps.push({
          type: "search-step",
          description: `Follow edge '${ch}' to node "${node.id}"`,
          data: { trie: cloneTrie(root), highlightEdges: [{ source: parentId, target: node.id }], pseudocodeLine: 12, terminalNodes: collectTerminalIds(root) },
          highlights: [node.id]
        });
      }

      if (failedAt === -1) {
        const found = !!node?.isEnd;
        steps.push({
          type: "search-result",
          description: `Search result for "${word}": ${found ? "FOUND (terminal)" : "NOT FOUND (not terminal)"}.`,
          data: { trie: cloneTrie(root), pseudocodeLine: 13, terminalNodes: collectTerminalIds(root) },
          highlights: node ? [node.id] : []
        });
      }
    }
  });

  steps.push({ type: "complete", description: "All operations completed.", data: { trie: cloneTrie(root), terminalNodes: collectTerminalIds(root) } });
  return steps;
}

const pseudocode: string[] = [
  "trie = empty",
  "for op in operations:",
  "  if op.type == 'insert':",
  "    node = root",
  "    for ch in op.word:",
  "      if no child ch: create child",
  "      node = node.child[ch]",
  "    node.terminal = true",
  "  else if op.type == 'search':",
  "    node = root",
  "    for ch in op.word:",
  "      if no child ch: return false",
  "      node = node.child[ch]",
  "    return node.terminal",
];

const relatedProblems = (() => {
  const arr = [
    ...(leetcodeProblems["trie-search"] || []),
    ...(leetcodeProblems["trie-insert"] || []),
  ];
  const seen = new Set<number>();
  return arr.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
})();

const initialData: TrieOpsData[] = [
  {
    initialWords: ["trie", "tree", "algo"],
    operations: [
      { type: "insert", word: "data" },
      { type: "search", word: "tree" },
      { type: "search", word: "tried" },
      { type: "insert", word: "trial" },
      { type: "search", word: "trial" },
    ],
  },
];

// Language-specific code samples for Trie operations
const codeSamples: Record<string, string> = {
  javascript: `class TrieNode {\n  constructor() {\n    this.children = {}; // Map<char, TrieNode>\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n\n  search(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return !!node.isEnd;\n  }\n}\n\n// Example\nconst trie = new Trie();\ntrie.insert("tree");\nconsole.log(trie.search("tree")); // true\nconsole.log(trie.search("trie")); // false`,
  python: `class TrieNode:\n    def __init__(self):\n        self.children = {}  # dict[str, TrieNode]\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\n    def search(self, word: str) -> bool:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n# Example\ntrie = Trie()\ntrie.insert("tree")\nprint(trie.search("tree"))  # True\nprint(trie.search("trie"))  # False`,
  java: `import java.util.*;\n\nclass TrieNode {\n    Map<Character, TrieNode> children = new HashMap<>();\n    boolean isEnd = false;\n}\n\npublic class Trie {\n    private final TrieNode root = new TrieNode();\n\n    public void insert(String word) {\n        TrieNode node = root;\n        for (char ch : word.toCharArray()) {\n            node.children.putIfAbsent(ch, new TrieNode());\n            node = node.children.get(ch);\n        }\n        node.isEnd = true;\n    }\n\n    public boolean search(String word) {\n        TrieNode node = root;\n        for (char ch : word.toCharArray()) {\n            if (!node.children.containsKey(ch)) return false;\n            node = node.children.get(ch);\n        }\n        return node.isEnd;\n    }\n\n    public static void main(String[] args) {\n        Trie trie = new Trie();\n        trie.insert("tree");\n        System.out.println(trie.search("tree")); // true\n        System.out.println(trie.search("trie")); // false\n    }\n}`
};

export default function TrieOperationsPage() {
  return (
    <AlgorithmPageTemplate
      title="Trie Operations (Insert & Search)"
      description="Visualize a sequence of Trie operations using a dedicated graph-based trie visualizer."
      timeComplexity="O(total characters for inserts + total query lengths)"
      spaceComplexity="O(total distinct prefixes)"
      visualizationComponent={TrieVisualizerComponent}
      generateSteps={(data) => generateTrieSteps((data[0] as TrieOpsData))}
      initialData={initialData}
      dataInputComponent={TrieOperationsInput}
      pseudocode={pseudocode}
      code={codeSamples}
      relatedProblems={relatedProblems as any}
      category="Data Structures"
    />
  );
}