"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import GraphVisualizerComponent from "@/components/algorithm/graph-visualizer";
import GraphInput from "@/components/algorithm/graph-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface FWData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

function generateFloydWarshallSteps(data: FWData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide graph data to start Floyd-Warshall visualization" }];
  }

  const { nodes, edges } = data[0];
  const steps: VisualizationStep[] = [];
  const n = nodes.length;
  
  // Initialize distance matrix
  const dist: number[][] = Array(n).fill(null).map(() => Array(n).fill(Infinity));
  const nodeMap: { [key: string]: number } = {};
  
  nodes.forEach((node, i) => {
    nodeMap[node.id] = i;
    dist[i][i] = 0;
  });

  edges.forEach(edge => {
    const i = nodeMap[edge.source];
    const j = nodeMap[edge.target];
    dist[i][j] = edge.weight || 1;
  });

  steps.push({
    type: "init",
    description: "Initialize distance matrix: direct edges and 0 for self-loops, ∞ for others",
    data: { matrix: dist.map(row => [...row]), iteration: -1 }
  });

  // Floyd-Warshall triple loop
  for (let k = 0; k < n; k++) {
    steps.push({
      type: "iteration",
      description: `Iteration k=${k}: Use node ${nodes[k].id} as intermediate vertex`,
      highlights: [nodes[k].id],
      data: { matrix: dist.map(row => [...row]), iteration: k, intermediate: k }
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          const oldDist = dist[i][j];
          dist[i][j] = dist[i][k] + dist[k][j];
          
          steps.push({
            type: "update",
            description: `Update dist[${nodes[i].id}][${nodes[j].id}] from ${oldDist === Infinity ? '∞' : oldDist} to ${dist[i][j]} via ${nodes[k].id}`,
            highlights: [nodes[i].id, nodes[j].id, nodes[k].id],
            data: { 
              matrix: dist.map(row => [...row]), 
              iteration: k, 
              intermediate: k,
              updated: [i, j],
              path: [nodes[i].id, nodes[k].id, nodes[j].id]
            }
          });
        }
      }
    }
  }

  steps.push({
    type: "complete",
    description: "Floyd-Warshall complete! All-pairs shortest distances computed",
    data: { matrix: dist.map(row => [...row]), iteration: n }
  });

  return steps;
}

const initialData: FWData[] = [{
  nodes: [
    { id: "A", label: "A" },
    { id: "B", label: "B" },
    { id: "C", label: "C" },
    { id: "D", label: "D" }
  ],
  edges: [
    { source: "A", target: "B", weight: 3 },
    { source: "A", target: "C", weight: 8 },
    { source: "A", target: "E", weight: -4 },
    { source: "B", target: "D", weight: 1 },
    { source: "B", target: "E", weight: 7 },
    { source: "C", target: "B", weight: 4 },
    { source: "D", target: "A", weight: 2 },
    { source: "D", target: "C", weight: -5 },
    { source: "E", target: "D", weight: 6 }
  ]
}];

const pseudocode = [
  "function floydWarshall(graph):",
  "    dist = adjacency matrix of graph",
  "    n = number of vertices",
  "",
  "    for k from 0 to n-1:",
  "        for i from 0 to n-1:",
  "            for j from 0 to n-1:",
  "                if dist[i][k] + dist[k][j] < dist[i][j]:",
  "                    dist[i][j] = dist[i][k] + dist[k][j]",
  "",
  "    return dist"
];

const relatedProblems = [
  {
    id: 1334,
    title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
    slug: "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
    difficulty: "Medium" as const
  },
  {
    id: 1462,
    title: "Course Schedule IV",
    slug: "course-schedule-iv",
    difficulty: "Medium" as const
  }
];

const codeSamples = {
  "JavaScript": `function floydWarshall(graph) {
  const dist = graph.map(row => row.slice());
  const n = dist.length;
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}`,
  "Python": `def floyd_warshall(graph):
    dist = [row[:] for row in graph]
    n = len(dist)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,
  "Java": `public class FloydWarshall {
    static final int INF = 1_000_000_000;
    public static int[][] floydWarshall(int[][] graph) {
        int n = graph.length;
        int[][] dist = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = graph[i][j];
            }
        }
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        return dist;
    }
}`
};

export default function FloydWarshallPage() {
  return (
    <AlgorithmPageTemplate
      title="Floyd-Warshall Algorithm"
      description="Floyd-Warshall finds shortest paths between all pairs of vertices in a weighted graph. It can handle negative edges but not negative cycles."
      timeComplexity="O(V³)"
      spaceComplexity="O(V²)"
      visualizationComponent={GraphVisualizerComponent}
      generateSteps={generateFloydWarshallSteps}
      initialData={initialData}
      dataInputComponent={GraphInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Graph Algorithms"
      code={codeSamples}
    />
  );
}