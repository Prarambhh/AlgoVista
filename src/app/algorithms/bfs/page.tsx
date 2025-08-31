"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import GraphVisualizerComponent from "@/components/algorithm/graph-visualizer";
import GraphInput from "@/components/algorithm/graph-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface BFSData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode: string;
}

function generateBFSSteps(data: BFSData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide graph data to start BFS visualization" }];
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
      // Add reverse edge for undirected graph if not explicitly defined
      adjList[edge.target].push(edge.source);
    }
  });

  const visited = new Set<string>();
  const queue: string[] = [];
  const visitedOrder: string[] = [];

  // Initialize
  steps.push({
    type: "init",
    description: `Initialize BFS from node ${startNode}. Queue: [${startNode}]`,
    highlights: [startNode],
    data: { visited: [], queue: [startNode], current: null }
  });

  queue.push(startNode);
  visited.add(startNode);
  visitedOrder.push(startNode);

  // BFS traversal
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    steps.push({
      type: "visit",
      description: `Visit node ${current}. Queue: [${queue.join(", ")}]`,
      highlights: [current],
      data: { 
        visited: [...visitedOrder], 
        queue: [...queue], 
        current: current,
        highlightEdges: adjList[current].map(neighbor => ({ source: current, target: neighbor }))
      }
    });

    // Explore neighbors
    for (const neighbor of adjList[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        visitedOrder.push(neighbor);
        
        steps.push({
          type: "discover",
          description: `Discover node ${neighbor} from ${current}. Add to queue.`,
          highlights: [neighbor],
          data: { 
            visited: [...visitedOrder], 
            queue: [...queue], 
            current: current,
            highlightEdges: [{ source: current, target: neighbor }]
          }
        });
      }
    }
  }

  // Complete
  steps.push({
    type: "complete",
    description: `BFS complete! Visited order: ${visitedOrder.join(" → ")}`,
    data: { visited: visitedOrder, queue: [], current: null }
  });

  return steps;
}

const initialData: BFSData[] = [{
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
  "function BFS(graph, startNode):",
  "    queue = [startNode]",
  "    visited = {startNode}",
  "    result = []",
  "",
  "    while queue is not empty:",
  "        current = queue.dequeue()",
  "        result.add(current)",
  "",
  "        for neighbor in graph[current]:",
  "            if neighbor not in visited:",
  "                visited.add(neighbor)",
  "                queue.enqueue(neighbor)",
  "",
  "    return result"
];

const relatedProblems = [
  {
    id: 102,
    title: "Binary Tree Level Order Traversal",
    slug: "binary-tree-level-order-traversal",
    difficulty: "Medium" as const
  },
  {
    id: 107,
    title: "Binary Tree Level Order Traversal II",
    slug: "binary-tree-level-order-traversal-ii",
    difficulty: "Medium" as const
  },
  {
    id: 111,
    title: "Minimum Depth of Binary Tree",
    slug: "minimum-depth-of-binary-tree",
    difficulty: "Easy" as const
  },
  {
    id: 199,
    title: "Binary Tree Right Side View",
    slug: "binary-tree-right-side-view",
    difficulty: "Medium" as const
  },
  {
    id: 207,
    title: "Course Schedule",
    slug: "course-schedule",
    difficulty: "Medium" as const
  }
];

export default function BFSPage() {
  return (
    <AlgorithmPageTemplate
      title="Breadth-First Search (BFS)"
      description="BFS is a graph traversal algorithm that explores vertices level by level, visiting all neighbors of a vertex before moving to the next level. It uses a queue data structure and guarantees finding the shortest path in unweighted graphs."
      timeComplexity="O(V + E)"
      spaceComplexity="O(V)"
      visualizationComponent={GraphVisualizerComponent}
      generateSteps={generateBFSSteps}
      initialData={initialData}
      dataInputComponent={GraphInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Graph Algorithms"
    />
  );
}