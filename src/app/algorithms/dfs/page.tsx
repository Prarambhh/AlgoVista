"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import GraphVisualizerComponent from "@/components/algorithm/graph-visualizer";
import GraphInput from "@/components/algorithm/graph-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface DFSData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode: string;
}

function generateDFSSteps(data: DFSData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide graph data to start DFS visualization" }];
  }

  const { nodes, edges, startNode } = data[0];
  const steps: VisualizationStep[] = [];
  
  // Build adjacency list
  const adjList: { [key: string]: string[] } = {};
  nodes.forEach(node => {
    adjList[node.id] = [];
  });
  edges.forEach(edge => {
    adjList[edge.source].push(edge.target);
    if (!edges.some(e => e.source === edge.target && e.target === edge.source)) {
      // Add reverse for undirected visualization unless explicitly directed
      adjList[edge.target].push(edge.source);
    }
  });

  const visited = new Set<string>();
  const order: string[] = [];

  function dfs(u: string, parent: string | null) {
    visited.add(u);
    order.push(u);

    steps.push({
      type: "visit",
      description: `Visit ${u}${parent ? ` from ${parent}` : ''}`,
      highlights: [u],
      data: { visited: [...order], current: u, highlightEdges: parent ? [{ source: parent, target: u }] : [] }
    });

    for (const v of adjList[u]) {
      if (!visited.has(v)) {
        steps.push({
          type: "explore",
          description: `Explore edge ${u} → ${v}`,
          data: { visited: [...order], current: u, highlightEdges: [{ source: u, target: v }] },
          highlights: [v]
        });
        dfs(v, u);
      } else {
        steps.push({
          type: "back-edge",
          description: `Encounter visited node ${v} from ${u}`,
          data: { visited: [...order], current: u, highlightEdges: [{ source: u, target: v }] }
        });
      }
    }

    steps.push({
      type: "backtrack",
      description: `Backtrack from ${u}`,
      data: { visited: [...order], current: u }
    });
  }

  steps.push({ type: "init", description: `Start DFS from ${startNode}`, highlights: [startNode] });
  dfs(startNode, null);
  steps.push({ type: "complete", description: `DFS complete! Order: ${order.join(" → ")}`, data: { visited: order } });

  return steps;
}

const initialData: DFSData[] = [{
  nodes: [
    { id: "A", label: "A" },
    { id: "B", label: "B" },
    { id: "C", label: "C" },
    { id: "D", label: "D" },
    { id: "E", label: "E" }
  ],
  edges: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" },
    { source: "C", target: "E" },
    { source: "D", target: "E" }
  ],
  startNode: "A"
}];

const pseudocode = [
  "function DFS(graph, start):",
  "    visited = set()",
  "    result = []",
  "",
  "    function dfs(u):",
  "        visited.add(u)",
  "        result.add(u)",
  "        for v in graph[u]:",
  "            if v not in visited:",
  "                dfs(v)",
  "",
  "    dfs(start)",
  "    return result"
];

const relatedProblems = [
  { id: 100, title: "Same Tree", slug: "same-tree", difficulty: "Easy" as const },
  { id: 101, title: "Symmetric Tree", slug: "symmetric-tree", difficulty: "Easy" as const },
  { id: 112, title: "Path Sum", slug: "path-sum", difficulty: "Easy" as const },
  { id: 230, title: "Kth Smallest Element in a BST", slug: "kth-smallest-element-in-a-bst", difficulty: "Medium" as const },
  { id: 207, title: "Course Schedule", slug: "course-schedule", difficulty: "Medium" as const }
];

const codeSamples = {
  "JavaScript": `function dfs(graph, start) {
  const visited = new Set();
  const order = [];
  function visit(u) {
    visited.add(u);
    order.push(u);
    for (const v of (graph[u] || [])) {
      if (!visited.has(v)) visit(v);
    }
  }
  visit(start);
  return order;
}`,
  "Python": `def dfs(graph, start):
    visited = set()
    order = []
    def visit(u):
        visited.add(u)
        order.append(u)
        for v in graph.get(u, []):
            if v not in visited:
                visit(v)
    visit(start)
    return order`,
  "Java": `import java.util.*;

class Graph {
    private final Map<Integer, List<Integer>> adj = new HashMap<>();
    public void addEdge(int u, int v) {
        adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        adj.computeIfAbsent(v, k -> new ArrayList<>()).add(u); // undirected
    }
    public List<Integer> dfs(int start) {
        List<Integer> order = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        dfsUtil(start, visited, order);
        return order;
    }
    private void dfsUtil(int u, Set<Integer> visited, List<Integer> order) {
        visited.add(u);
        order.add(u);
        for (int v : adj.getOrDefault(u, Collections.emptyList())) {
            if (!visited.contains(v)) dfsUtil(v, visited, order);
        }
    }
}`
};

export default function DFSPage() {
  return (
    <AlgorithmPageTemplate
      title="Depth-First Search (DFS)"
      description="DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It can be implemented recursively or with a stack."
      timeComplexity="O(V + E)"
      spaceComplexity="O(V)"
      visualizationComponent={GraphVisualizerComponent}
      generateSteps={generateDFSSteps}
      initialData={initialData}
      dataInputComponent={GraphInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Graph Algorithms"
      code={codeSamples}
    />
  );
}