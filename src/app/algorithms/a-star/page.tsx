import React, { Suspense } from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import GraphVisualizerComponent from "@/components/algorithm/graph-visualizer";
import GraphInput from "@/components/algorithm/graph-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface AStarData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode: string;
  goalNode: string;
}

function generateAStarSteps(data: AStarData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide graph data with start and goal to start A* visualization" }];
  }

  const { nodes, edges, startNode, goalNode } = data[0];
  const steps: VisualizationStep[] = [];
  
  // Build adjacency list with weights
  const adjList: { [key: string]: { neighbor: string; weight: number }[] } = {};
  nodes.forEach(node => {
    adjList[node.id] = [];
  });
  edges.forEach(edge => {
    const weight = edge.weight || 1;
    adjList[edge.source].push({ neighbor: edge.target, weight });
  });

  // Heuristic function (Manhattan distance approximation)
  function heuristic(nodeId: string): number {
    // For demonstration, use simple character distance
    const nodeIndex = nodes.findIndex(n => n.id === nodeId);
    const goalIndex = nodes.findIndex(n => n.id === goalNode);
    return Math.abs(nodeIndex - goalIndex);
  }

  const gScore: { [key: string]: number } = {};
  const fScore: { [key: string]: number } = {};
  const cameFrom: { [key: string]: string | null } = {};
  const openSet = new Set([startNode]);
  const closedSet = new Set<string>();

  nodes.forEach(node => {
    gScore[node.id] = node.id === startNode ? 0 : Infinity;
    fScore[node.id] = node.id === startNode ? heuristic(startNode) : Infinity;
    cameFrom[node.id] = null;
  });

  steps.push({
    type: "init",
    description: `A* from ${startNode} to ${goalNode}. f(${startNode}) = g(0) + h(${heuristic(startNode)}) = ${fScore[startNode]}`,
    highlights: [startNode, goalNode],
    data: { 
      gScore: { ...gScore }, 
      fScore: { ...fScore }, 
      openSet: [...openSet], 
      closedSet: [...closedSet],
      path: []
    }
  });

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current = "";
    let minF = Infinity;
    for (const node of openSet) {
      if (fScore[node] < minF) {
        minF = fScore[node];
        current = node;
      }
    }

    if (current === goalNode) {
      // Reconstruct path
      const path: string[] = [];
      let temp: string | null = current;
      while (temp) {
        path.unshift(temp);
        temp = cameFrom[temp];
      }
      
      steps.push({
        type: "found",
        description: `Goal reached! Path: ${path.join(' → ')} (cost: ${gScore[goalNode]})`,
        highlights: path,
        data: { 
          gScore: { ...gScore }, 
          fScore: { ...fScore }, 
          openSet: [], 
          closedSet: [...closedSet, current],
          path: [...path]
        }
      });
      return steps;
    }

    openSet.delete(current);
    closedSet.add(current);

    steps.push({
      type: "explore",
      description: `Explore ${current} (f=${fScore[current]}, g=${gScore[current]}, h=${heuristic(current)})`,
      highlights: [current],
      data: { 
        gScore: { ...gScore }, 
        fScore: { ...fScore }, 
        openSet: [...openSet], 
        closedSet: [...closedSet],
        current: current
      }
    });

    for (const { neighbor, weight } of adjList[current]) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = gScore[current] + weight;

      if (!openSet.has(neighbor)) {
        openSet.add(neighbor);
      } else if (tentativeG >= gScore[neighbor]) {
        continue;
      }

      cameFrom[neighbor] = current;
      gScore[neighbor] = tentativeG;
      fScore[neighbor] = gScore[neighbor] + heuristic(neighbor);

      steps.push({
        type: "update",
        description: `Update ${neighbor}: g=${gScore[neighbor]}, h=${heuristic(neighbor)}, f=${fScore[neighbor]}`,
        highlights: [current, neighbor],
        data: { 
          gScore: { ...gScore }, 
          fScore: { ...fScore }, 
          openSet: [...openSet], 
          closedSet: [...closedSet],
          highlightEdges: [{ source: current, target: neighbor }]
        }
      });
    }
  }

  steps.push({
    type: "no-path",
    description: "No path found to goal!",
    data: { 
      gScore: { ...gScore }, 
      fScore: { ...fScore }, 
      openSet: [], 
      closedSet: [...closedSet],
      path: []
    }
  });

  return steps;
}

const initialData: AStarData[] = [{
  nodes: [
    { id: "A", label: "A" },
    { id: "B", label: "B" },
    { id: "C", label: "C" },
    { id: "D", label: "D" },
    { id: "E", label: "E" },
    { id: "F", label: "F" }
  ],
  edges: [
    { source: "A", target: "B", weight: 1 },
    { source: "A", target: "C", weight: 4 },
    { source: "B", target: "C", weight: 2 },
    { source: "B", target: "D", weight: 5 },
    { source: "C", target: "D", weight: 1 },
    { source: "C", target: "E", weight: 3 },
    { source: "D", target: "F", weight: 2 },
    { source: "E", target: "F", weight: 1 }
  ],
  startNode: "A",
  goalNode: "F"
}];

const pseudocode = [
  "function aStar(graph, start, goal):",
  "    openSet = {start}",
  "    gScore[start] = 0",
  "    fScore[start] = heuristic(start, goal)",
  "",
  "    while openSet is not empty:",
  "        current = node in openSet with lowest fScore",
  "        if current == goal: return path",
  "",
  "        openSet.remove(current)",
  "        closedSet.add(current)",
  "",
  "        for each neighbor of current:",
  "            if neighbor in closedSet: continue",
  "            tentativeG = gScore[current] + weight(current, neighbor)",
  "            if neighbor not in openSet: openSet.add(neighbor)",
  "            elif tentativeG >= gScore[neighbor]: continue",
  "",
  "            cameFrom[neighbor] = current",
  "            gScore[neighbor] = tentativeG",
  "            fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal)",
  "",
  "    return failure"
];

const relatedProblems = [
  {
    id: 1091,
    title: "Shortest Path in Binary Matrix",
    slug: "shortest-path-in-binary-matrix",
    difficulty: "Medium" as const
  },
  {
    id: 1730,
    title: "Shortest Path to Get Food",
    slug: "shortest-path-to-get-food",
    difficulty: "Medium" as const
  }
];

export default function AStarPage() {
  return (
    <Suspense fallback={<div className="container-px py-8 text-muted">Loading...</div>}>
      <AlgorithmPageTemplate
        title="A* Search Algorithm"
        description="A* is a graph traversal and path search algorithm that uses heuristics to find the optimal path from start to goal efficiently by combining Dijkstra's algorithm with greedy best-first search."
        timeComplexity="O(b^d) where b is branching factor, d is depth"
        spaceComplexity="O(b^d)"
        visualizationComponent={GraphVisualizerComponent}
        generateSteps={generateAStarSteps}
        initialData={initialData}
        dataInputComponent={GraphInput}
        pseudocode={pseudocode}
        relatedProblems={relatedProblems}
        category="Graph Algorithms"
      />
    </Suspense>
  );
}