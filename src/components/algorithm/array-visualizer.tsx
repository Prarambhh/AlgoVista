"use client";

import React, { useEffect, useRef } from "react";
import { ArrayVisualizer, VisualizationStep } from "@/lib/visualization-utils";

interface ArrayVisualizerProps {
  data?: any[];
  step: VisualizationStep;
  onDataChange?: (data: any[]) => void;
}

export default function ArrayVisualizerComponent({ data = [], step }: ArrayVisualizerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const vizRef = useRef<ArrayVisualizer | null>(null);

  useEffect(() => {
    if (svgRef.current && !vizRef.current) {
      vizRef.current = new ArrayVisualizer({ container: svgRef.current as any });
    }
  }, []);

  useEffect(() => {
    if (!vizRef.current || !svgRef.current) return;
    vizRef.current.renderArray(data as number[], step);
  }, [data, step]);

  return <svg ref={svgRef} className="w-full h-[280px]" />;
}