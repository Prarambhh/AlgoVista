"use client";

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

const codeSamples = {
  javascript: `// A* Search Algorithm (graph as adjacency list)
// graph: { node: [{ neighbor, weight }, ...] }
function reconstructPath(cameFrom, current){
  const path = [];
  while(current !== null && current !== undefined){
    path.unshift(current);
    current = cameFrom[current];
  }
  return path;
}

function aStar(graph, start, goal, heuristic){
  const openSet = new Set([start]);
  const closedSet = new Set();
  const cameFrom = {};
  const gScore = {}; const fScore = {};
  Object.keys(graph).forEach(n => { gScore[n] = Infinity; fScore[n] = Infinity; cameFrom[n] = null; });
  gScore[start] = 0;
  fScore[start] = heuristic(start, goal);

  while(openSet.size > 0){
    // Find node in openSet with lowest fScore
    let current = null, best = Infinity;
    for(const n of openSet){
      if(fScore[n] < best){ best = fScore[n]; current = n; }
    }

    if(current === goal){
      return reconstructPath(cameFrom, current);
    }

    openSet.delete(current);
    closedSet.add(current);

    for(const { neighbor, weight } of graph[current]){
      if(closedSet.has(neighbor)) continue;
      const tentativeG = gScore[current] + weight;
      if(!openSet.has(neighbor)) openSet.add(neighbor);
      else if(tentativeG >= gScore[neighbor]) continue;

      cameFrom[neighbor] = current;
      gScore[neighbor] = tentativeG;
      fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal);
    }
  }

  return null; // no path
}

// Example heuristic (Manhattan-like on indices or custom)
function heuristicExample(a, b){
  // Placeholder: return 0 for Dijkstra behavior or supply domain-specific heuristic
  return 0;
}

// Usage example (graph setup omitted)
// const path = aStar(graph, 'A', 'F', heuristicExample);`,

  python: `# A* Search Algorithm (graph as adjacency dict)
# graph: { node: [(neighbor, weight), ...] }
from math import inf

def reconstruct_path(came_from, current):
    path = []
    while current is not None:
        path.insert(0, current)
        current = came_from[current]
    return path


def a_star(graph, start, goal, heuristic):
    open_set = {start}
    closed_set = set()
    came_from = {n: None for n in graph.keys()}
    g_score = {n: inf for n in graph.keys()}
    f_score = {n: inf for n in graph.keys()}
    g_score[start] = 0
    f_score[start] = heuristic(start, goal)

    while open_set:
        current = min(open_set, key=lambda n: f_score[n])
        if current == goal:
            return reconstruct_path(came_from, current)

        open_set.remove(current)
        closed_set.add(current)

        for neighbor, weight in graph[current]:
            if neighbor in closed_set:
                continue
            tentative_g = g_score[current] + weight
            if neighbor not in open_set:
                open_set.add(neighbor)
            elif tentative_g >= g_score[neighbor]:
                continue
            came_from[neighbor] = current
            g_score[neighbor] = tentative_g
            f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)

    return None  # no path

# Example heuristic
def heuristic_example(a, b):
    return 0  # Replace with domain-specific heuristic

# Usage example
# path = a_star(graph, 'A', 'F', heuristic_example)`,

  java: `// A* Search Algorithm
import java.util.*;

class Edge { String neighbor; int weight; Edge(String n, int w){ neighbor=n; weight=w; } }

public class AStarExample {
    // graph: Map<String, List<Edge>>
    public static List<String> aStar(Map<String, List<Edge>> graph, String start, String goal, java.util.function.BiFunction<String,String,Integer> heuristic){
        Set<String> openSet = new HashSet<>(); openSet.add(start);
        Set<String> closedSet = new HashSet<>();
        Map<String, String> cameFrom = new HashMap<>();
        Map<String, Integer> gScore = new HashMap<>();
        Map<String, Integer> fScore = new HashMap<>();
        for(String n : graph.keySet()){ gScore.put(n, Integer.MAX_VALUE); fScore.put(n, Integer.MAX_VALUE); cameFrom.put(n, null); }
        gScore.put(start, 0);
        fScore.put(start, heuristic.apply(start, goal));

        while(!openSet.isEmpty()){
            String current = null; int best = Integer.MAX_VALUE;
            for(String n : openSet){
                int f = fScore.get(n);
                if(f < best){ best = f; current = n; }
            }
            if(current.equals(goal)){
                return reconstructPath(cameFrom, current);
            }
            openSet.remove(current);
            closedSet.add(current);

            for(Edge e : graph.getOrDefault(current, Collections.emptyList())){
                String neighbor = e.neighbor; int weight = e.weight;
                if(closedSet.contains(neighbor)) continue;
                int tentativeG = safeAdd(gScore.get(current), weight);
                if(!openSet.contains(neighbor)) openSet.add(neighbor);
                else if(tentativeG >= gScore.get(neighbor)) continue;
                cameFrom.put(neighbor, current);
                gScore.put(neighbor, tentativeG);
                fScore.put(neighbor, safeAdd(gScore.get(neighbor), heuristic.apply(neighbor, goal)));
            }
        }
        return null; // no path
    }

    private static int safeAdd(int a, int b){
        long s = (long)a + (long)b; return s > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int)s;
    }

    private static List<String> reconstructPath(Map<String,String> cameFrom, String current){
        LinkedList<String> path = new LinkedList<>();
        String cur = current;
        while(cur != null){ path.addFirst(cur); cur = cameFrom.get(cur); }
        return path;
    }

    // Example heuristic
    public static int heuristicExample(String a, String b){ return 0; }

    // Usage example (graph setup omitted)
    // List<String> path = aStar(graph, "A", "F", (x, y) -> heuristicExample(x, y));
}`
};

export default function AStarPage() {
  return (
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
        code={codeSamples}
      />
  );
}