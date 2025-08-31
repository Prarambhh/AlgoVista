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
    />
  );
}