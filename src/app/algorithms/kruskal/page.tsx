"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import GraphVisualizerComponent from "@/components/algorithm/graph-visualizer";
import GraphInput from "@/components/algorithm/graph-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface KruskalData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

function generateKruskalSteps(data: KruskalData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide graph data to start Kruskal's MST visualization" }];
  }

  const { nodes, edges } = data[0];
  const steps: VisualizationStep[] = [];
  
  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => (a.weight || 0) - (b.weight || 0));
  
  // Initialize Union-Find
  const parent: { [key: string]: string } = {};
  const rank: { [key: string]: number } = {};
  
  nodes.forEach(node => {
    parent[node.id] = node.id;
    rank[node.id] = 0;
  });

  function find(x: string): string {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x: string, y: string): boolean {
    const rootX = find(x);
    const rootY = find(y);
    
    if (rootX === rootY) return false;
    
    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }
    return true;
  }

  const mstEdges: GraphEdge[] = [];
  let totalWeight = 0;

  steps.push({
    type: "init",
    description: `Sort edges by weight: ${sortedEdges.map(e => `${e.source}-${e.target}(${e.weight})`).join(', ')}`,
    data: { sortedEdges: [...sortedEdges], mstEdges: [], totalWeight: 0 }
  });

  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const u = edge.source;
    const v = edge.target;
    const weight = edge.weight || 0;

    steps.push({
      type: "consider",
      description: `Consider edge ${u}-${v} with weight ${weight}`,
      highlights: [u, v],
      data: { 
        sortedEdges: [...sortedEdges], 
        mstEdges: [...mstEdges], 
        totalWeight,
        currentEdge: edge,
        highlightEdges: [edge]
      }
    });

    if (find(u) !== find(v)) {
      union(u, v);
      mstEdges.push(edge);
      totalWeight += weight;
      
      steps.push({
        type: "accept",
        description: `Accept edge ${u}-${v}. No cycle formed. MST weight: ${totalWeight}`,
        highlights: [u, v],
        data: { 
          sortedEdges: [...sortedEdges], 
          mstEdges: [...mstEdges], 
          totalWeight,
          highlightEdges: [...mstEdges]
        }
      });
    } else {
      steps.push({
        type: "reject",
        description: `Reject edge ${u}-${v}. Would create a cycle.`,
        data: { 
          sortedEdges: [...sortedEdges], 
          mstEdges: [...mstEdges], 
          totalWeight,
          rejectedEdge: edge
        }
      });
    }

    if (mstEdges.length === nodes.length - 1) {
      break;
    }
  }

  steps.push({
    type: "complete",
    description: `Kruskal's MST complete! Total weight: ${totalWeight}`,
    data: { 
      sortedEdges: [...sortedEdges], 
      mstEdges: [...mstEdges], 
      totalWeight,
      highlightEdges: [...mstEdges]
    }
  });

  return steps;
}

const initialData: KruskalData[] = [{
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
  ]
}];

const pseudocode = [
  "function kruskal(graph):",
  "    mst = []",
  "    sort edges by weight",
  "    for each vertex v: makeSet(v)",
  "",
  "    for each edge (u,v,w) in sorted order:",
  "        if findSet(u) ≠ findSet(v):",
  "            mst.add((u,v,w))",
  "            union(u, v)",
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

export default function KruskalPage() {
  return (
    <AlgorithmPageTemplate
      title="Kruskal's MST"
      description="Kruskal's algorithm finds a minimum spanning tree by sorting edges by weight and adding them if they don't create a cycle, using Union-Find data structure."
      timeComplexity="O(E log E)"
      spaceComplexity="O(V)"
      visualizationComponent={GraphVisualizerComponent}
      generateSteps={generateKruskalSteps}
      initialData={initialData}
      dataInputComponent={GraphInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Graph Algorithms"
    />
  );
}