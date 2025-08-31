"use client";

import React, { useEffect, useState } from "react";
import { GraphNode, GraphEdge } from "@/lib/visualization-utils";

interface GraphInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function GraphInput({ data, onDataChange }: GraphInputProps) {
  const [nodeInput, setNodeInput] = useState<string>("");
  const [edgeInput, setEdgeInput] = useState<string>("");

  // Extract graph data from the array structure
  const graphData = Array.isArray(data) && data.length > 0 ? data[0] : { nodes: [], edges: [] };
  const nodes = graphData.nodes || [];
  const edges = graphData.edges || [];

  // Sync local inputs with prop data for URL-restore safety
  useEffect(() => {
    const nodeLabels = Array.isArray(nodes) ? nodes.map((n: GraphNode) => n.label ?? n.id).join(",") : "";
    const edgeLabels = Array.isArray(edges)
      ? edges
          .map((e: GraphEdge) =>
            e.weight !== undefined && e.weight !== null
              ? `${e.source}-${e.target}:${e.weight}`
              : `${e.source}-${e.target}`
          )
          .join(",")
      : "";

    setNodeInput((prev) => (prev !== nodeLabels ? nodeLabels : prev));
    setEdgeInput((prev) => (prev !== edgeLabels ? edgeLabels : prev));
  }, [nodes, edges]);

  const handleCustomInput = () => {
    try {
      // Parse nodes: "A,B,C,D"
      const nodeLabels = nodeInput
        .split(",")
        .map(n => n.trim())
        .filter(n => n.length > 0);
      
      const nodes: GraphNode[] = nodeLabels.map(label => ({
        id: label,
        label: label
      }));

      // Parse edges: "A-B,B-C,C-D" or "A-B:5,B-C:3" (with weights)
      const edges: GraphEdge[] = edgeInput
        .split(",")
        .map(e => e.trim())
        .filter(e => e.length > 0)
        .map(edge => {
          const [connection, weight] = edge.split(":");
          const [source, target] = connection.split("-");
          return {
            source: source.trim(),
            target: target.trim(),
            weight: weight ? parseInt(weight.trim()) : undefined
          };
        });

      // Preserve the original data structure
      const updatedData = [...data];
      if (updatedData.length > 0) {
        updatedData[0] = { ...updatedData[0], nodes, edges };
      } else {
        updatedData.push({ nodes, edges });
      }
      onDataChange(updatedData);
    } catch (error) {
      alert("Invalid input format. Nodes: 'A,B,C' Edges: 'A-B,B-C' or 'A-B:5,B-C:3'");
    }
  };

  const generateSampleGraph = () => {
    const nodes: GraphNode[] = [
      { id: "A", label: "A" },
      { id: "B", label: "B" },
      { id: "C", label: "C" },
      { id: "D", label: "D" },
      { id: "E", label: "E" }
    ];

    const edges: GraphEdge[] = [
      { source: "A", target: "B", weight: 4 },
      { source: "A", target: "C", weight: 2 },
      { source: "B", target: "C", weight: 1 },
      { source: "B", target: "D", weight: 5 },
      { source: "C", target: "D", weight: 8 },
      { source: "C", target: "E", weight: 10 },
      { source: "D", target: "E", weight: 2 }
    ];

    // Preserve the original data structure
    const updatedData = [...data];
    if (updatedData.length > 0) {
      updatedData[0] = { ...updatedData[0], nodes, edges };
    } else {
      updatedData.push({ nodes, edges });
    }
    onDataChange(updatedData);
  };

  const generateTreeGraph = () => {
    const nodes: GraphNode[] = [
      { id: "1", label: "1" },
      { id: "2", label: "2" },
      { id: "3", label: "3" },
      { id: "4", label: "4" },
      { id: "5", label: "5" },
      { id: "6", label: "6" },
      { id: "7", label: "7" }
    ];

    const edges: GraphEdge[] = [
      { source: "1", target: "2" },
      { source: "1", target: "3" },
      { source: "2", target: "4" },
      { source: "2", target: "5" },
      { source: "3", target: "6" },
      { source: "3", target: "7" }
    ];

    // Preserve the original data structure
    const updatedData = [...data];
    if (updatedData.length > 0) {
      updatedData[0] = { ...updatedData[0], nodes, edges };
    } else {
      updatedData.push({ nodes, edges });
    }
    onDataChange(updatedData);
  };

  const generateGridGraph = () => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // 3x3 grid
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const id = `${i},${j}`;
        nodes.push({ id, label: id });
        
        // Add horizontal edges
        if (j < 2) {
          edges.push({ source: id, target: `${i},${j + 1}` });
        }
        
        // Add vertical edges
        if (i < 2) {
          edges.push({ source: id, target: `${i + 1},${j}` });
        }
      }
    }

    // Preserve the original data structure (array with first element holding graph)
    const updatedData = [...data];
    if (updatedData.length > 0) {
      updatedData[0] = { ...updatedData[0], nodes, edges };
    } else {
      updatedData.push({ nodes, edges });
    }
    onDataChange(updatedData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Current Graph: {nodes.length} nodes, {edges.length} edges
        </label>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={nodeInput}
          onChange={(e) => setNodeInput(e.target.value)}
          placeholder="Nodes: A,B,C,D"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
        />
        <input
          type="text"
          value={edgeInput}
          onChange={(e) => setEdgeInput(e.target.value)}
          placeholder="Edges: A-B,B-C,C-D or A-B:5,B-C:3 (with weights)"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
        />
        <button
          onClick={handleCustomInput}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply Custom Graph
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={generateSampleGraph}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Weighted Graph
        </button>
        <button
          onClick={generateTreeGraph}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Tree Graph
        </button>
        <button
          onClick={generateGridGraph}
          className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          Grid Graph
        </button>
      </div>
    </div>
  );
}