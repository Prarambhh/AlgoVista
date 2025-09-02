"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import GraphVisualizerComponent from "@/components/algorithm/graph-visualizer";
import GraphInput from "@/components/algorithm/graph-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface TopSortData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

function generateTopologicalSortSteps(data: TopSortData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide DAG data to start topological sort visualization" }];
  }

  const { nodes, edges } = data[0];
  const steps: VisualizationStep[] = [];
  
  // Build adjacency list and in-degree count
  const adjList: { [key: string]: string[] } = {};
  const inDegree: { [key: string]: number } = {};
  
  nodes.forEach(node => {
    adjList[node.id] = [];
    inDegree[node.id] = 0;
  });
  
  edges.forEach(edge => {
    adjList[edge.source].push(edge.target);
    inDegree[edge.target]++;
  });

  steps.push({
    type: "init",
    description: `Calculate in-degrees: ${nodes.map(n => `${n.id}(${inDegree[n.id]})`).join(', ')}`,
    data: { inDegree: { ...inDegree }, result: [], queue: [] }
  });

  // Kahn's algorithm
  const queue: string[] = [];
  const result: string[] = [];
  
  // Find all nodes with in-degree 0
  nodes.forEach(node => {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
    }
  });

  steps.push({
    type: "find-sources",
    description: `Find nodes with in-degree 0: [${queue.join(', ')}]`,
    highlights: [...queue],
    data: { inDegree: { ...inDegree }, result: [], queue: [...queue] }
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);
    
    steps.push({
      type: "process",
      description: `Process ${current}. Add to result: [${result.join(', ')}]`,
      highlights: [current],
      data: { 
        inDegree: { ...inDegree }, 
        result: [...result], 
        queue: [...queue],
        processing: current
      }
    });

    // Process all neighbors
    for (const neighbor of adjList[current]) {
      inDegree[neighbor]--;
      
      steps.push({
        type: "reduce",
        description: `Reduce in-degree of ${neighbor} to ${inDegree[neighbor]}`,
        highlights: [current, neighbor],
        data: { 
          inDegree: { ...inDegree }, 
          result: [...result], 
          queue: [...queue],
          highlightEdges: [{ source: current, target: neighbor }]
        }
      });
      
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
        steps.push({
          type: "add-queue",
          description: `${neighbor} in-degree is 0, add to queue: [${queue.join(', ')}]`,
          highlights: [neighbor],
          data: { 
            inDegree: { ...inDegree }, 
            result: [...result], 
            queue: [...queue]
          }
        });
      }
    }
  }

  if (result.length === nodes.length) {
    steps.push({
      type: "complete",
      description: `Topological sort complete! Order: [${result.join(' → ')}]`,
      data: { 
        inDegree: { ...inDegree }, 
        result: [...result], 
        queue: [],
        finalOrder: [...result]
      }
    });
  } else {
    steps.push({
      type: "cycle",
      description: "Cycle detected! Topological sort impossible for this graph.",
      data: { 
        inDegree: { ...inDegree }, 
        result: [...result], 
        queue: [],
        hasCycle: true
      }
    });
  }

  return steps;
}

const initialData: TopSortData[] = [{
  nodes: [
    { id: "A", label: "A" },
    { id: "B", label: "B" },
    { id: "C", label: "C" },
    { id: "D", label: "D" },
    { id: "E", label: "E" },
    { id: "F", label: "F" }
  ],
  edges: [
    { source: "A", target: "C" },
    { source: "A", target: "B" },
    { source: "B", target: "D" },
    { source: "B", target: "E" },
    { source: "C", target: "D" },
    { source: "D", target: "F" },
    { source: "E", target: "F" }
  ]
}];

const pseudocode = [
  "function topologicalSort(graph):",
  "    inDegree = calculate in-degrees",
  "    queue = nodes with in-degree 0",
  "    result = []",
  "",
  "    while queue is not empty:",
  "        current = queue.dequeue()",
  "        result.add(current)",
  "        for each neighbor of current:",
  "            inDegree[neighbor]--",
  "            if inDegree[neighbor] == 0:",
  "                queue.enqueue(neighbor)",
  "",
  "    return result"
];

const relatedProblems = [
  {
    id: 207,
    title: "Course Schedule",
    slug: "course-schedule",
    difficulty: "Medium" as const
  },
  {
    id: 210,
    title: "Course Schedule II",
    slug: "course-schedule-ii",
    difficulty: "Medium" as const
  },
  {
    id: 269,
    title: "Alien Dictionary",
    slug: "alien-dictionary",
    difficulty: "Hard" as const
  }
];

const codeSamples = {
  "JavaScript": `function topologicalSort(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  for (const [u, v] of edges) {
    adj[u].push(v);
    indeg[v]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const v of adj[u]) {
      indeg[v]--;
      if (indeg[v] === 0) queue.push(v);
    }
  }
  return order.length === n ? order : [];
}`,
  "Python": `from collections import deque

def topological_sort(n, edges):
    adj = [[] for _ in range(n)]
    indeg = [0] * n
    for u, v in edges:
        adj[u].append(v)
        indeg[v] += 1
    q = deque([i for i in range(n) if indeg[i] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else []`,
  "Java": `import java.util.*;

public static List<Integer> topologicalSort(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[n];
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        indeg[e[1]]++;
    }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
        int u = q.poll();
        order.add(u);
        for (int v : adj.get(u)) {
            if (--indeg[v] == 0) q.offer(v);
        }
    }
    return order.size() == n ? order : Collections.emptyList();
}`
};

export default function TopologicalSortPage() {
  return (
    <AlgorithmPageTemplate
      title="Topological Sort"
      description="Topological sort orders vertices in a directed acyclic graph (DAG) such that for every directed edge u→v, vertex u comes before v in the ordering."
      timeComplexity="O(V + E)"
      spaceComplexity="O(V)"
      visualizationComponent={GraphVisualizerComponent}
      generateSteps={generateTopologicalSortSteps}
      initialData={initialData}
      dataInputComponent={GraphInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Graph Algorithms"
      code={codeSamples}
    />
  );
}