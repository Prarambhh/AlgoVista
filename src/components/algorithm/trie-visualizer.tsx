"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { GraphVisualizer, VisualizationStep, GraphNode, GraphEdge } from "@/lib/visualization-utils";

// Plain trie snapshot types expected in step.data.trie
export type TrieNodeSnap = {
  id: string;          // stable id derived from path (e.g., "$", "a", "ap", ...)
  char: string;        // character for this node; root uses "∅"
  isEnd: boolean;
  children: Record<string, TrieNodeSnap>;
};

interface TrieVisualizerProps {
  data?: any[];
  step: VisualizationStep;
  onDataChange?: (data: any[]) => void;
}

export default function TrieVisualizerComponent({ step }: TrieVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const visualizer = useRef<GraphVisualizer | null>(null);

  const trie: TrieNodeSnap | null = (step?.data && (step.data as any).trie) ? (step.data as any).trie as TrieNodeSnap : null;

  // Compute graph nodes/edges from trie snapshot with a tree-like layered layout
  const { nodes, edges } = useMemo(() => {
    const result = { nodes: [] as GraphNode[], edges: [] as GraphEdge[] };
    if (!trie) return result;

    // Collect nodes by depth
    const levels: TrieNodeSnap[][] = [];
    const queue: Array<{ node: TrieNodeSnap; depth: number }> = [{ node: trie, depth: 0 }];
    const seen = new Set<string>();

    while (queue.length) {
      const { node, depth } = queue.shift()!;
      if (seen.has(node.id)) continue;
      seen.add(node.id);
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(node);
      for (const ch of Object.keys(node.children)) {
        const child = node.children[ch];
        queue.push({ node: child, depth: depth + 1 });
        result.edges.push({ source: node.id, target: child.id });
      }
    }

    // Layout params
    const width = 640;
    const height = 400;
    const top = 40;
    const bottom = 20;
    const vGap = Math.max(60, Math.floor((height - top - bottom) / Math.max(1, levels.length - 1 || 1)));
    const hMargin = 40;

    // Place nodes per level
    for (let d = 0; d < levels.length; d++) {
      const row = levels[d];
      const count = row.length;
      for (let i = 0; i < row.length; i++) {
        const n = row[i];
        const x = count === 1
          ? width / 2
          : hMargin + (i + 1) * ((width - 2 * hMargin) / (count + 1));
        const y = top + d * vGap;
        result.nodes.push({ id: n.id, label: n.char, x, y });
      }
    }

    return result;
  }, [trie]);

  useEffect(() => {
    if (svgRef.current && !visualizer.current) {
      visualizer.current = new GraphVisualizer({
        container: svgRef.current as any,
        width: 640,
        height: 400,
        nodeRadius: 18,
        nodeColor: "#374151",
        highlightColor: "#10b981",
        visitedColor: "#60a5fa",
        edgeColor: "#6b7280",
        highlightEdgeColor: "#f59e0b",
      });
    }
  }, []);

  useEffect(() => {
    if (visualizer.current) {
      visualizer.current.renderGraph(nodes, edges, step);
    }
  }, [nodes, edges, step]);

  return (
    <div className="w-full flex justify-center">
      <svg
        ref={svgRef}
        className="border border-gray-600 rounded-lg bg-gray-900"
        style={{ maxWidth: "100%", height: "400px" }}
      />
    </div>
  );
}