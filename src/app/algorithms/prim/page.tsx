"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import GraphVisualizerComponent from "@/components/algorithm/graph-visualizer";
import GraphInput from "@/components/algorithm/graph-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface PrimData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode: string;
}

function generatePrimSteps(data: PrimData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide graph data to start Prim's MST visualization" }];
  }

  const { nodes, edges, startNode } = data[0];
  const steps: VisualizationStep[] = [];
  
  // Build adjacency list with weights
  const adjList: { [key: string]: { neighbor: string; weight: number }[] } = {};
  nodes.forEach(node => {
    adjList[node.id] = [];
  });
  edges.forEach(edge => {
    const weight = edge.weight || 1;
    adjList[edge.source].push({ neighbor: edge.target, weight });
    adjList[edge.target].push({ neighbor: edge.source, weight });
  });

  const inMST = new Set<string>();
  const mstEdges: GraphEdge[] = [];
  const key: { [key: string]: number } = {};
  const parent: { [key: string]: string | null } = {};
  let totalWeight = 0;

  // Initialize all keys to infinity except start
  nodes.forEach(node => {
    key[node.id] = node.id === startNode ? 0 : Infinity;
    parent[node.id] = null;
  });

  steps.push({
    type: "init",
    description: `Start Prim's MST from ${startNode}. Initialize keys: ${startNode}=0, others=∞`,
    highlights: [startNode],
    data: { keys: { ...key }, mstEdges: [], totalWeight: 0, inMST: [] }
  });

  while (inMST.size < nodes.length) {
    // Find minimum key vertex not in MST
    let minKey = Infinity;
    let u = "";
    for (const node of nodes) {
      if (!inMST.has(node.id) && key[node.id] < minKey) {
        minKey = key[node.id];
        u = node.id;
      }
    }

    if (!u) break;

    inMST.add(u);

    // Add edge to MST (except for start node)
    if (parent[u]) {
      const edge: GraphEdge = { source: parent[u]!, target: u, weight: key[u] };
      mstEdges.push(edge);
      totalWeight += key[u];
      
      steps.push({
        type: "add",
        description: `Add ${parent[u]}-${u} to MST (weight: ${key[u]}). Total weight: ${totalWeight}`,
        highlights: [u, parent[u]!],
        data: { 
          keys: { ...key }, 
          mstEdges: [...mstEdges], 
          totalWeight,
          inMST: [...inMST],
          highlightEdges: [...mstEdges]
        }
      });
    } else {
      steps.push({
        type: "start",
        description: `Add starting vertex ${u} to MST`,
        highlights: [u],
        data: { keys: { ...key }, mstEdges: [], totalWeight: 0, inMST: [...inMST] }
      });
    }

    // Update keys of adjacent vertices
    for (const { neighbor, weight } of adjList[u]) {
      if (!inMST.has(neighbor) && weight < key[neighbor]) {
        const oldKey = key[neighbor];
        key[neighbor] = weight;
        parent[neighbor] = u;
        
        steps.push({
          type: "update",
          description: `Update key[${neighbor}] from ${oldKey === Infinity ? '∞' : oldKey} to ${weight} via ${u}`,
          highlights: [neighbor, u],
          data: { 
            keys: { ...key }, 
            mstEdges: [...mstEdges], 
            totalWeight,
            inMST: [...inMST],
            highlightEdges: [...mstEdges]
          }
        });
      }
    }
  }

  steps.push({
    type: "complete",
    description: `Prim's MST complete! Total weight: ${totalWeight}`,
    data: { 
      keys: { ...key }, 
      mstEdges: [...mstEdges], 
      totalWeight,
      inMST: [...inMST],
      highlightEdges: [...mstEdges]
    }
  });

  return steps;
}

const initialData: PrimData[] = [{
  nodes: [
    { id: "A", label: "A" },
    { id: "B", label: "B" },
    { id: "C", label: "C" },
    { id: "D", label: "D" },
    { id: "E", label: "E" }
  ],
  edges: [
    { source: "A", target: "B", weight: 2 },
    { source: "A", target: "C", weight: 3 },
    { source: "B", target: "C", weight: 1 },
    { source: "B", target: "D", weight: 1 },
    { source: "C", target: "D", weight: 4 },
    { source: "C", target: "E", weight: 5 },
    { source: "D", target: "E", weight: 2 }
  ],
  startNode: "A"
}];

const pseudocode = [
  "function prim(graph, start):",
  "    mst = []",
  "    inMST = {start}",
  "    for each vertex v: key[v] = ∞",
  "    key[start] = 0",
  "",
  "    while |inMST| < |vertices|:",
  "        u = vertex with min key not in MST",
  "        add u to inMST",
  "        for each neighbor v of u:",
  "            if v not in MST and weight(u,v) < key[v]:",
  "                key[v] = weight(u,v)",
  "                parent[v] = u",
  "",
  "    return mst"
];

const relatedProblems = [
  {
    id: 1584,
    title: "Min Cost to Connect All Points",
    slug: "min-cost-to-connect-all-points",
    difficulty: "Medium" as const
  },
  {
    id: 1135,
    title: "Connecting Cities With Minimum Cost",
    slug: "connecting-cities-with-minimum-cost",
    difficulty: "Medium" as const
  }
];

const codeSamples = {
  "JavaScript": `function prim(graph) {
  const n = graph.length;
  const visited = Array(n).fill(false);
  const minEdge = Array(n).fill(Infinity);
  minEdge[0] = 0;
  const mst = [];
  let totalWeight = 0;
  
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!visited[v] && (u === -1 || minEdge[v] < minEdge[u])) {
        u = v;
      }
    }
    
    visited[u] = true;
    totalWeight += minEdge[u];
    
    for (let v = 0; v < n; v++) {
      if (!visited[v] && graph[u][v] < minEdge[v]) {
        minEdge[v] = graph[u][v];
      }
    }
  }
  
  return totalWeight;
}`,
  "Python": `import heapq

def prim(graph):
    n = len(graph)
    visited = [False] * n
    min_heap = [(0, 0)]  # (weight, vertex)
    total_weight = 0
    mst_edges = []
    
    while min_heap:
        weight, u = heapq.heappop(min_heap)
        
        if visited[u]:
            continue
            
        visited[u] = True
        total_weight += weight
        
        for v in range(n):
            if not visited[v] and graph[u][v] > 0:
                heapq.heappush(min_heap, (graph[u][v], v))
    
    return total_weight`,
  "Java": `import java.util.*;

class Edge {
    int to, weight;
    Edge(int to, int weight) {
        this.to = to;
        this.weight = weight;
    }
}

public static int prim(List<List<Edge>> graph) {
    int n = graph.size();
    boolean[] visited = new boolean[n];
    PriorityQueue<Edge> pq = new PriorityQueue<>((a, b) -> a.weight - b.weight);
    
    pq.offer(new Edge(0, 0));
    int totalWeight = 0;
    
    while (!pq.isEmpty()) {
        Edge curr = pq.poll();
        int u = curr.to;
        
        if (visited[u]) continue;
        
        visited[u] = true;
        totalWeight += curr.weight;
        
        for (Edge edge : graph.get(u)) {
            if (!visited[edge.to]) {
                pq.offer(edge);
            }
        }
    }
    
    return totalWeight;
}`
};

export default function PrimPage() {
  return (
    <AlgorithmPageTemplate
      title="Prim's MST"
      description="Prim's algorithm grows a minimum spanning tree starting from any vertex, always choosing the minimum weight edge that connects a new vertex to the tree."
      timeComplexity="O(V²) or O(E log V) with heap"
      spaceComplexity="O(V)"
      visualizationComponent={GraphVisualizerComponent}
      generateSteps={generatePrimSteps}
      initialData={initialData}
      dataInputComponent={GraphInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Graph Algorithms"
      code={codeSamples}
    />
  );
}