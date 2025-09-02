"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import GraphVisualizerComponent from "@/components/algorithm/graph-visualizer";
import GraphInput from "@/components/algorithm/graph-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface BFData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode: string;
}

function generateBellmanFordSteps(data: BFData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide graph data to start Bellman-Ford visualization" }];
  }

  const { nodes, edges, startNode } = data[0];
  const steps: VisualizationStep[] = [];

  const dist: { [key: string]: number } = {};
  const prev: { [key: string]: string | null } = {};

  nodes.forEach(n => {
    dist[n.id] = n.id === startNode ? 0 : Infinity;
    prev[n.id] = null;
  });

  steps.push({ type: "init", description: `Initialize distances. Start at ${startNode}`, highlights: [startNode], data: { distances: { ...dist } } });

  // Relax edges |V|-1 times
  for (let i = 1; i < nodes.length; i++) {
    let updated = false;
    for (const e of edges) {
      const u = e.source, v = e.target;
      const w = e.weight ?? 1;
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
        updated = true;
        steps.push({
          type: "relax",
          description: `Iteration ${i}: Relax edge ${u}→${v}, dist[${v}] = ${dist[v]}`,
          highlights: [v],
          data: { distances: { ...dist }, highlightEdges: [{ source: u, target: v }] }
        });
      }
    }
    if (!updated) {
      steps.push({ type: "optimum", description: `No updates in iteration ${i}, early stop.` });
      break;
    }
  }

  // Check for negative weight cycles
  let hasNegativeCycle = false;
  for (const e of edges) {
    const u = e.source, v = e.target;
    const w = e.weight ?? 1;
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      hasNegativeCycle = true;
      steps.push({ type: "negative-cycle", description: `Negative cycle detected via edge ${u}→${v}.` });
      break;
    }
  }

  steps.push({ type: "complete", description: hasNegativeCycle ? "Completed with negative cycle detected." : "Bellman-Ford complete!", data: { distances: { ...dist }, prev: { ...prev } } });

  return steps;
}

const initialData: BFData[] = [{
  nodes: [
    { id: "A", label: "A" },
    { id: "B", label: "B" },
    { id: "C", label: "C" },
    { id: "D", label: "D" }
  ],
  edges: [
    { source: "A", target: "B", weight: 1 },
    { source: "B", target: "C", weight: 3 },
    { source: "A", target: "C", weight: 10 },
    { source: "C", target: "D", weight: -4 },
    { source: "D", target: "B", weight: -2 }
  ],
  startNode: "A"
}];

const pseudocode = [
  "function bellmanFord(graph, start):",
  "    dist[start] = 0; for v != start: dist[v] = ∞",
  "    repeat |V|-1 times:",
  "        for each edge (u, v, w):",
  "            if dist[u] + w < dist[v]:",
  "                dist[v] = dist[u] + w; prev[v] = u",
  "    for each edge (u, v, w):",
  "        if dist[u] + w < dist[v]:",
  "            report negative cycle"
];

const relatedProblems = [
  { id: 787, title: "Cheapest Flights Within K Stops", slug: "cheapest-flights-within-k-stops", difficulty: "Medium" as const },
  { id: 1514, title: "Path with Maximum Probability", slug: "path-with-maximum-probability", difficulty: "Medium" as const }
];

const codeSamples = {
  "JavaScript": `function bellmanFord(graph, start) {
  const dist = {};
  const prev = {};
  for (const u in graph) {
    dist[u] = u === start ? 0 : Infinity;
    prev[u] = null;
  }
  // Relax edges |V|-1 times
  for (let i = 0; i < Object.keys(graph).length - 1; i++) {
    for (const u in graph) {
      if (dist[u] === Infinity) continue;
      for (const {to, w} of graph[u]) {
        if (dist[u] + w < dist[to]) {
          dist[to] = dist[u] + w;
          prev[to] = u;
        }
      }
    }
  }
  // Check for negative cycle
  for (const u in graph) {
    if (dist[u] === Infinity) continue;
    for (const {to, w} of graph[u]) {
      if (dist[u] + w < dist[to]) {
        throw new Error("Graph contains negative cycle");
      }
    }
  }
  return {dist, prev};
}`,
  "Python": `def bellman_ford(graph, start):
    dist = {u: 0 if u == start else float('inf') for u in graph}
    prev = {u: None for u in graph}
    
    # Relax edges |V|-1 times
    for _ in range(len(graph) - 1):
        for u in graph:
            if dist[u] == float('inf'):
                continue
            for v, w in graph[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    prev[v] = u
    
    # Check for negative cycle
    for u in graph:
        if dist[u] == float('inf'):
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                raise ValueError("Graph contains negative cycle")
    
    return dist, prev`,
  "Java": `import java.util.*;

class BellmanFord {
    static class Edge {
        int from, to, weight;
        Edge(int from, int to, int weight) {
            this.from = from; this.to = to; this.weight = weight;
        }
    }
    
    public static Map<Integer, Integer> bellmanFord(List<Edge> edges, int n, int start) {
        Map<Integer, Integer> dist = new HashMap<>();
        Map<Integer, Integer> prev = new HashMap<>();
        
        for (int i = 0; i < n; i++) {
            dist.put(i, i == start ? 0 : Integer.MAX_VALUE);
            prev.put(i, null);
        }
        
        // Relax edges |V|-1 times
        for (int i = 0; i < n - 1; i++) {
            for (Edge e : edges) {
                if (dist.get(e.from) != Integer.MAX_VALUE &&
                    dist.get(e.from) + e.weight < dist.get(e.to)) {
                    dist.put(e.to, dist.get(e.from) + e.weight);
                    prev.put(e.to, e.from);
                }
            }
        }
        
        // Check for negative cycle
        for (Edge e : edges) {
            if (dist.get(e.from) != Integer.MAX_VALUE &&
                dist.get(e.from) + e.weight < dist.get(e.to)) {
                throw new RuntimeException("Graph contains negative cycle");
            }
        }
        
        return dist;
    }
}`
};
export default function BellmanFordPage() {
  return (
    <AlgorithmPageTemplate
      title="Bellman-Ford Algorithm"
      description="Bellman-Ford computes shortest paths from a single source even with negative edge weights, and detects negative cycles."
      timeComplexity="O(VE)"
      spaceComplexity="O(V)"
      visualizationComponent={GraphVisualizerComponent}
      generateSteps={generateBellmanFordSteps}
      initialData={initialData}
      dataInputComponent={GraphInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Graph Algorithms"
      code={codeSamples}
    />
  );
}