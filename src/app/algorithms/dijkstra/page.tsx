"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import GraphVisualizerComponent from "@/components/algorithm/graph-visualizer";
import GraphInput from "@/components/algorithm/graph-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface DijkstraData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode: string;
}

function generateDijkstraSteps(data: DijkstraData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide graph data to start Dijkstra's algorithm visualization" }];
  }

  const { nodes, edges, startNode } = data[0];
  const steps: VisualizationStep[] = [];
  
  // Initialize distances and previous nodes
  const dist: { [key: string]: number } = {};
  const prev: { [key: string]: string | null } = {};
  const visited = new Set<string>();
  const unvisited = new Set<string>();

  nodes.forEach(node => {
    dist[node.id] = node.id === startNode ? 0 : Infinity;
    prev[node.id] = null;
    unvisited.add(node.id);
  });

  steps.push({
    type: "init",
    description: `Initialize distances. Start from ${startNode} with distance 0, all others ∞`,
    highlights: [startNode],
    data: { distances: { ...dist }, visited: [], unvisited: [...unvisited] }
  });

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current = null;
    let minDist = Infinity;
    for (const node of unvisited) {
      if (dist[node] < minDist) {
        minDist = dist[node];
        current = node;
      }
    }

    if (!current || dist[current] === Infinity) break;

    unvisited.delete(current);
    visited.add(current);

    steps.push({
      type: "visit",
      description: `Visit ${current} with distance ${dist[current]}`,
      highlights: [current],
      data: { 
        distances: { ...dist }, 
        visited: [...visited], 
        unvisited: [...unvisited],
        current: current
      }
    });

    // Update distances to neighbors
    const neighbors = edges.filter(e => e.source === current);
    for (const edge of neighbors) {
      const neighbor = edge.target;
      if (!visited.has(neighbor)) {
        const alt = dist[current] + (edge.weight || 1);
        if (alt < dist[neighbor]) {
          dist[neighbor] = alt;
          prev[neighbor] = current;
          
          steps.push({
            type: "relax",
            description: `Relax edge ${current}→${neighbor}. Update distance to ${alt}`,
            highlights: [neighbor],
            data: { 
              distances: { ...dist }, 
              visited: [...visited], 
              unvisited: [...unvisited],
              current: current,
              highlightEdges: [{ source: current, target: neighbor }]
            }
          });
        }
      }
    }
  }

  // Build shortest paths
  const paths: { [key: string]: string[] } = {};
  nodes.forEach(node => {
    if (dist[node.id] !== Infinity) {
      const path: string[] = [];
      let current = node.id;
      while (current) {
        path.unshift(current);
        current = prev[current]!;
      }
      paths[node.id] = path;
    }
  });

  steps.push({
    type: "complete",
    description: `Dijkstra's algorithm complete! Shortest distances from ${startNode}`,
    data: { distances: dist, paths: paths, visited: [...visited] }
  });

  return steps;
}

const initialData: DijkstraData[] = [{
  nodes: [
    { id: "A", label: "A" },
    { id: "B", label: "B" },
    { id: "C", label: "C" },
    { id: "D", label: "D" },
    { id: "E", label: "E" }
  ],
  edges: [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 2 },
    { source: "B", target: "C", weight: 1 },
    { source: "B", target: "D", weight: 5 },
    { source: "C", target: "D", weight: 8 },
    { source: "C", target: "E", weight: 10 },
    { source: "D", target: "E", weight: 2 }
  ],
  startNode: "A"
}];

const pseudocode = [
  "function dijkstra(graph, start):",
  "    dist[start] = 0",
  "    for all other vertices v:",
  "        dist[v] = ∞",
  "    ",
  "    unvisited = all vertices",
  "    while unvisited is not empty:",
  "        u = vertex in unvisited with min dist[u]",
  "        remove u from unvisited",
  "        ",
  "        for each neighbor v of u:",
  "            alt = dist[u] + weight(u, v)",
  "            if alt < dist[v]:",
  "                dist[v] = alt",
  "                prev[v] = u"
];

const relatedProblems = [
  {
    id: 743,
    title: "Network Delay Time",
    slug: "network-delay-time",
    difficulty: "Medium" as const
  },
  {
    id: 787,
    title: "Cheapest Flights Within K Stops",
    slug: "cheapest-flights-within-k-stops",
    difficulty: "Medium" as const
  },
  {
    id: 1631,
    title: "Path With Minimum Effort",
    slug: "path-with-minimum-effort",
    difficulty: "Medium" as const
  }
];

const codeSamples = {
  "JavaScript": `function dijkstra(graph, start) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  for (const u in graph) {
    dist[u] = Infinity;
    prev[u] = null;
  }
  dist[start] = 0;
  while (true) {
    let u = null;
    let best = Infinity;
    for (const node in dist) {
      if (!visited.has(node) && dist[node] < best) {
        best = dist[node];
        u = node;
      }
    }
    if (u === null) break;
    visited.add(u);
    for (const { to, w } of (graph[u] || [])) {
      const alt = dist[u] + w;
      if (alt < dist[to]) {
        dist[to] = alt;
        prev[to] = u;
      }
    }
  }
  return { dist, prev };
}`,
  "Python": `import heapq

def dijkstra(graph, start):
    dist = {u: float('inf') for u in graph}
    prev = {u: None for u in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph.get(u, []):
            alt = dist[u] + w
            if alt < dist[v]:
                dist[v] = alt
                prev[v] = u
                heapq.heappush(pq, (alt, v))
    return dist, prev`,
  "Java": `import java.util.*;

class Graph {
    private final Map<Integer, List<int[]>> adj = new HashMap<>(); // u -> list of [v, w]
    public void addEdge(int u, int v, int w) {
        adj.computeIfAbsent(u, k -> new ArrayList<>()).add(new int[]{v, w});
        // For undirected, also add reverse
        adj.computeIfAbsent(v, k -> new ArrayList<>()).add(new int[]{u, w});
    }
    public Map<Integer, Integer> dijkstra(int start) {
        Map<Integer, Integer> dist = new HashMap<>();
        Map<Integer, Integer> prev = new HashMap<>();
        for (int u : adj.keySet()) {
            dist.put(u, Integer.MAX_VALUE);
            prev.put(u, null);
        }
        dist.put(start, 0);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{0, start});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], u = cur[1];
            if (d != dist.get(u)) continue;
            for (int[] e : adj.getOrDefault(u, Collections.emptyList())) {
                int v = e[0], w = e[1];
                int alt = dist.get(u) + w;
                if (alt < dist.getOrDefault(v, Integer.MAX_VALUE)) {
                    dist.put(v, alt);
                    prev.put(v, u);
                    pq.add(new int[]{alt, v});
                }
            }
        }
        return dist; // prev contains parents to reconstruct paths
    }
}`
};

export default function DijkstraPage() {
  return (
    <AlgorithmPageTemplate
      title="Dijkstra's Shortest Path"
      description="Dijkstra's algorithm finds the shortest paths from a source vertex to all other vertices in a weighted graph with non-negative edge weights. It uses a greedy approach with a priority queue."
      timeComplexity="O((V + E) log V)"
      spaceComplexity="O(V)"
      visualizationComponent={GraphVisualizerComponent}
      generateSteps={generateDijkstraSteps}
      initialData={initialData}
      dataInputComponent={GraphInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Graph Algorithms"
      code={codeSamples}
    />
  );
}