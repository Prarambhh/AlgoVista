"use client";

import React, { useEffect, useRef } from "react";
import { TreeVisualizer, TreeNode, VisualizationStep } from "@/lib/visualization-utils";

interface TreeVisualizerComponentProps {
  data?: any[]; // AlgorithmPageTemplate passes an array (we expect [{ tree: TreeNode | null }])
  step: VisualizationStep;
  onDataChange?: (data: any[]) => void;
}

export default function TreeVisualizerComponent({ data, step }: TreeVisualizerComponentProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const visualizer = useRef<TreeVisualizer | null>(null);

  // Resolve tree from the provided data shape
  const baseTree: TreeNode | null = Array.isArray(data) && data.length > 0
    ? (data[0] as { tree: TreeNode | null }).tree
    : null;

  // Prefer step-provided tree snapshot if available (for operations like insert/delete)
  const treeToRender: TreeNode | null = (step && (step as any).data && (step as any).data.tree)
    ? (step as any).data.tree as TreeNode
    : baseTree;

  useEffect(() => {
    if (svgRef.current && !visualizer.current) {
      visualizer.current = new TreeVisualizer({
        container: svgRef.current as any,
        width: 640,
        height: 400,
        nodeRadius: 25,
        nodeColor: "#374151",
        highlightColor: "#10b981",
        textColor: "#ffffff",
        linkColor: "#6b7280"
      });
    }
  }, []);

  useEffect(() => {
    if (visualizer.current) {
      visualizer.current.renderTree(treeToRender, step);
    }
  }, [treeToRender, step]);

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