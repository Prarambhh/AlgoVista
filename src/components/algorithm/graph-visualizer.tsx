"use client";

import React, { useEffect, useRef } from "react";
import { GraphVisualizer, GraphNode, GraphEdge, VisualizationStep } from "@/lib/visualization-utils";

interface GraphVisualizerComponentProps {
  data?: any[]; // AlgorithmPageTemplate passes an array (we expect [{ nodes, edges }])
  step: VisualizationStep;
  onDataChange?: (data: any[]) => void;
}

export default function GraphVisualizerComponent({ data, step }: GraphVisualizerComponentProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const visualizer = useRef<GraphVisualizer | null>(null);

  // Resolve graph from the provided data shape
  const graph: { nodes: GraphNode[]; edges: GraphEdge[] } = Array.isArray(data) && data.length > 0
    ? (data[0] as { nodes: GraphNode[]; edges: GraphEdge[] })
    : { nodes: [], edges: [] };

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
        highlightEdgeColor: "#f59e0b"
      });
    }
  }, []);

  useEffect(() => {
    if (visualizer.current) {
      visualizer.current.renderGraph(graph.nodes, graph.edges, step);
    }
  }, [graph.nodes, graph.edges, step]);

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