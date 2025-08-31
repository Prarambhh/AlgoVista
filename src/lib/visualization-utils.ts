import * as d3 from "d3";
import { useState, useEffect } from "react";

export interface VisualizationStep {
  type: string;
  id?: number;
  description: string;
  data?: any;
  highlights?: (number | string)[];
  compares?: number[];
  swaps?: [number, number];
  pointer?: number;
  pointers?: number[];
}

export interface ArrayVisualizationConfig {
  container: string;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  barColor?: string;
  highlightColor?: string;
  compareColor?: string;
  swapColor?: string;
  pointerColor?: string;
}

export class ArrayVisualizer {
  private svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  private width: number;
  private height: number;
  private margin: { top: number; right: number; bottom: number; left: number };
  private colors: {
    bar: string;
    highlight: string;
    compare: string;
    swap: string;
    pointer: string;
  };

  constructor(config: ArrayVisualizationConfig) {
    this.width = config.width || 640;
    this.height = config.height || 280;
    this.margin = config.margin || { top: 20, right: 20, bottom: 40, left: 40 };
    this.colors = {
      bar: config.barColor || "#374151",
      highlight: config.highlightColor || "#10b981",
      compare: config.compareColor || "#f59e0b",
      swap: config.swapColor || "#ef4444",
      pointer: config.pointerColor || "#3b82f6"
    };

    this.svg = d3
      .select(config.container)
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("width", "100%")
      .attr("height", this.height);
  }

  renderArray(values: number[], step?: VisualizationStep) {
    this.svg.selectAll("*").remove();

    const contentWidth = this.width - this.margin.left - this.margin.right;
    const contentHeight = this.height - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .domain(d3.range(values.length).map(String))
      .range([this.margin.left, this.width - this.margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(values) || 10])
      .range([this.height - this.margin.bottom, this.margin.top]);

    // Draw bars
    this.svg
      .selectAll("rect")
      .data(values)
      .join("rect")
      .attr("x", (_, i) => x(String(i))!)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d))
      .attr("height", (d) => y(0) - y(d))
      .attr("rx", 4)
      .style("fill", (_, i) => this.getBarColor(i, step))
      .style("stroke", (_, i) => this.getBarStroke(i, step))
      .style("stroke-width", 2);

    // Draw values on bars
    this.svg
      .selectAll("text.value")
      .data(values)
      .join("text")
      .attr("class", "value")
      .attr("x", (_, i) => x(String(i))! + x.bandwidth() / 2)
      .attr("y", (d) => y(d) - 5)
      .attr("text-anchor", "middle")
      .style("fill", "#D1D5DB")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text((d) => d);

    // Draw indices
    this.svg
      .selectAll("text.index")
      .data(values)
      .join("text")
      .attr("class", "index")
      .attr("x", (_, i) => x(String(i))! + x.bandwidth() / 2)
      .attr("y", this.height - this.margin.bottom + 15)
      .attr("text-anchor", "middle")
      .style("fill", "#9CA3AF")
      .style("font-size", "10px")
      .text((_, i) => i);

    // Draw pointers
    if (step?.pointer !== undefined) {
      this.drawPointer(x(String(step.pointer))! + x.bandwidth() / 2, "single");
    }
    
    if (step?.pointers) {
      step.pointers.forEach((p, idx) => {
        if (p !== -1) {
          this.drawPointer(x(String(p))! + x.bandwidth() / 2, `pointer-${idx}`);
        }
      });
    }

    // Draw step description
    if (step?.description) {
      this.svg
        .append("text")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top - 5)
        .style("fill", "#D1D5DB")
        .style("font-size", "14px")
        .style("font-weight", "500")
        .text(step.description);
    }
  }

  private getBarColor(index: number, step?: VisualizationStep): string {
    if (!step) return this.colors.bar;
    
    if (step.swaps && (step.swaps[0] === index || step.swaps[1] === index)) {
      return this.colors.swap;
    }
    
    if (step.compares && step.compares.includes(index)) {
      return this.colors.compare;
    }
    
    if (step.highlights && step.highlights.includes(index)) {
      return this.colors.highlight;
    }
    
    return this.colors.bar;
  }

  private getBarStroke(index: number, step?: VisualizationStep): string {
    if (!step) return "none";
    
    if (step.pointer === index || (step.pointers && step.pointers.includes(index))) {
      return this.colors.pointer;
    }
    
    return "none";
  }

  private drawPointer(x: number, id: string) {
    const g = this.svg.append("g").attr("class", `pointer-${id}`);
    
    // Arrow
    g.append("polygon")
      .attr("points", `${x-5},${this.height - this.margin.bottom + 20} ${x+5},${this.height - this.margin.bottom + 20} ${x},${this.height - this.margin.bottom + 25}`)
      .style("fill", this.colors.pointer);
  }
}

export class TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  id: string;

  constructor(value: number, id?: string) {
    this.value = value;
    this.id = id || `node-${value}-${Date.now()}`;
  }
}

export interface TreeVisualizationConfig {
  container: string;
  width?: number;
  height?: number;
  nodeRadius?: number;
  nodeColor?: string;
  highlightColor?: string;
  textColor?: string;
  linkColor?: string;
}

export class TreeVisualizer {
  private svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  private width: number;
  private height: number;
  private nodeRadius: number;
  private colors: {
    node: string;
    highlight: string;
    text: string;
    link: string;
  };

  constructor(config: TreeVisualizationConfig) {
    this.width = config.width || 640;
    this.height = config.height || 400;
    this.nodeRadius = config.nodeRadius || 20;
    this.colors = {
      node: config.nodeColor || "#374151",
      highlight: config.highlightColor || "#10b981",
      text: config.textColor || "#ffffff",
      link: config.linkColor || "#6b7280"
    };

    this.svg = d3
      .select(config.container)
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("width", "100%")
      .attr("height", this.height);
  }

  renderTree(root: TreeNode | null, step?: VisualizationStep) {
    this.svg.selectAll("*").remove();

    if (!root) return;

    const nodes = this.calculatePositions(root);
    const links = this.getLinks(nodes);

    // Draw links
    this.svg
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("x1", d => d.source.x!)
      .attr("y1", d => d.source.y!)
      .attr("x2", d => d.target.x!)
      .attr("y2", d => d.target.y!)
      .style("stroke", this.colors.link)
      .style("stroke-width", 2);

    // Draw nodes
    this.svg
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", d => d.x!)
      .attr("cy", d => d.y!)
      .attr("r", this.nodeRadius)
      .style("fill", d => this.getNodeColor(d, step))
      .style("stroke", "#ffffff")
      .style("stroke-width", 2);

    // Draw node values
    this.svg
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", d => d.x!)
      .attr("y", d => d.y!)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", this.colors.text)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(d => d.value);

    // Draw step description
    if (step?.description) {
      this.svg
        .append("text")
        .attr("x", 20)
        .attr("y", 20)
        .style("fill", "#D1D5DB")
        .style("font-size", "14px")
        .style("font-weight", "500")
        .text(step.description);
    }
  }

  private calculatePositions(root: TreeNode): TreeNode[] {
    const nodes: TreeNode[] = [];
    const levels: TreeNode[][] = [];
    
    // BFS to get level order
    const queue: { node: TreeNode; level: number }[] = [{ node: root, level: 0 }];
    
    while (queue.length > 0) {
      const { node, level } = queue.shift()!;
      
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
      nodes.push(node);
      
      if (node.left) queue.push({ node: node.left, level: level + 1 });
      if (node.right) queue.push({ node: node.right, level: level + 1 });
    }
    
    // Calculate positions
    const levelHeight = this.height / (levels.length + 1);
    
    levels.forEach((levelNodes, levelIndex) => {
      const levelWidth = this.width / (levelNodes.length + 1);
      levelNodes.forEach((node, nodeIndex) => {
        node.x = levelWidth * (nodeIndex + 1);
        node.y = levelHeight * (levelIndex + 1);
      });
    });
    
    return nodes;
  }

  private getLinks(nodes: TreeNode[]): Array<{ source: TreeNode; target: TreeNode }> {
    const links: Array<{ source: TreeNode; target: TreeNode }> = [];
    
    nodes.forEach(node => {
      if (node.left) links.push({ source: node, target: node.left });
      if (node.right) links.push({ source: node, target: node.right });
    });
    
    return links;
  }

  private getNodeColor(node: TreeNode, step?: VisualizationStep): string {
    if (!step) return this.colors.node;
    
    if (step.highlights && step.highlights.includes(node.value)) {
      return this.colors.highlight;
    }
    
    return this.colors.node;
  }
}

export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface GraphVisualizationConfig {
  container: string;
  width?: number;
  height?: number;
  nodeRadius?: number;
  nodeColor?: string;
  highlightColor?: string;
  visitedColor?: string;
  edgeColor?: string;
  highlightEdgeColor?: string;
  createdEdgeColor?: string;
  terminalStrokeColor?: string;
}

export class GraphVisualizer {
  private svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  private width: number;
  private height: number;
  private nodeRadius: number;
  private colors: {
    node: string;
    highlight: string;
    visited: string;
    edge: string;
    highlightEdge: string;
    createdEdge: string;
    terminalStroke: string;
  };

  constructor(config: GraphVisualizationConfig) {
    this.width = config.width || 640;
    this.height = config.height || 400;
    this.nodeRadius = config.nodeRadius || 25;
    this.colors = {
      node: config.nodeColor || "#374151",
      highlight: config.highlightColor || "#10b981",
      visited: config.visitedColor || "#6366f1",
      edge: config.edgeColor || "#6b7280",
      highlightEdge: config.highlightEdgeColor || "#f59e0b",
      createdEdge: config.createdEdgeColor || "#22c55e",
      terminalStroke: config.terminalStrokeColor || "#22d3ee"
    };

    this.svg = d3
      .select(config.container)
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("width", "100%")
      .attr("height", this.height);
  }

  renderGraph(nodes: GraphNode[], edges: GraphEdge[], step?: VisualizationStep) {
    this.svg.selectAll("*").remove();

    // Auto-layout nodes if positions not set
    this.calculatePositions(nodes);

    // Draw edges
    this.svg
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("x1", d => this.getNodeById(nodes, d.source)?.x!)
      .attr("y1", d => this.getNodeById(nodes, d.source)?.y!)
      .attr("x2", d => this.getNodeById(nodes, d.target)?.x!)
      .attr("y2", d => this.getNodeById(nodes, d.target)?.y!)
      .style("stroke", d => this.getEdgeColor(d, step))
      .style("stroke-width", d => this.getEdgeWidth(d, step))
      .style("stroke-dasharray", d => this.getEdgeDash(d, step))
      .attr("marker-end", "url(#arrowhead)");

    // Draw edge weights
    edges.forEach(edge => {
      if (edge.weight !== undefined) {
        const source = this.getNodeById(nodes, edge.source)!;
        const target = this.getNodeById(nodes, edge.target)!;
        const midX = (source.x! + target.x!) / 2;
        const midY = (source.y! + target.y!) / 2;

        this.svg
          .append("text")
          .attr("x", midX)
          .attr("y", midY)
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .style("fill", "#ffffff")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .style("background", "#000000")
          .text(edge.weight);
      }
    });

    // Draw nodes
    this.svg
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", d => d.x!)
      .attr("cy", d => d.y!)
      .attr("r", this.nodeRadius)
      .style("fill", d => this.getNodeColor(d, step))
      .style("stroke", d => this.getNodeStrokeColor(d, step))
      .style("stroke-width", d => this.getNodeStrokeWidth(d, step));

    // Draw node labels
    this.svg
      .selectAll("text.node-label")
      .data(nodes)
      .join("text")
      .attr("class", "node-label")
      .attr("x", d => d.x!)
      .attr("y", d => d.y!)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", "#ffffff")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(d => d.label);

    // Add arrow marker
    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", this.colors.edge);

    // Draw step description
    if (step?.description) {
      this.svg
        .append("text")
        .attr("x", 20)
        .attr("y", 20)
        .style("fill", "#D1D5DB")
        .style("font-size", "14px")
        .style("font-weight", "500")
        .text(step.description);
    }
  }

  private calculatePositions(nodes: GraphNode[]) {
    const radius = Math.min(this.width, this.height) / 3;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    nodes.forEach((node, index) => {
      if (node.x === undefined || node.y === undefined) {
        const angle = (2 * Math.PI * index) / nodes.length;
        node.x = centerX + radius * Math.cos(angle);
        node.y = centerY + radius * Math.sin(angle);
      }
    });
  }

  private getNodeById(nodes: GraphNode[], id: string): GraphNode | undefined {
    return nodes.find(n => n.id === id);
  }

  private getNodeColor(node: GraphNode, step?: VisualizationStep): string {
    if (!step) return this.colors.node;
    
    if (step.highlights && step.highlights.includes(node.id)) {
      return this.colors.highlight;
    }
    
    if (step.data?.visited && step.data.visited.includes(node.id)) {
      return this.colors.visited;
    }
    
    return this.colors.node;
  }

  private getEdgeColor(edge: GraphEdge, step?: VisualizationStep): string {
    if (!step) return this.colors.edge;

    if (step.data?.createdEdges &&
        step.data.createdEdges.some((e: any) =>
          (e.source === edge.source && e.target === edge.target) ||
          (e.source === edge.target && e.target === edge.source)
        )) {
      return this.colors.createdEdge;
    }

    if (step.data?.highlightEdges && 
        step.data.highlightEdges.some((e: any) => 
          (e.source === edge.source && e.target === edge.target) ||
          (e.source === edge.target && e.target === edge.source)
        )) {
      return this.colors.highlightEdge;
    }

    return this.colors.edge;
  }

  private getEdgeWidth(edge: GraphEdge, step?: VisualizationStep): number {
    if (!step) return 2;

    if (step.data?.createdEdges &&
        step.data.createdEdges.some((e: any) => 
          (e.source === edge.source && e.target === edge.target) ||
          (e.source === edge.target && e.target === edge.source)
        )) {
      return 5;
    }

    if (step.data?.highlightEdges && 
        step.data.highlightEdges.some((e: any) => 
          (e.source === edge.source && e.target === edge.target) ||
          (e.source === edge.target && e.target === edge.source)
        )) {
      return 4;
    }

    return 2;
  }

  private getEdgeDash(edge: GraphEdge, step?: VisualizationStep): string | undefined {
    if (!step) return undefined;

    if (step.data?.highlightEdges &&
        step.data.highlightEdges.some((e: any) =>
          (e.source === edge.source && e.target === edge.target) ||
          (e.source === edge.target && e.target === edge.source)
        )) {
      return "4,2"; // dashed for traversal
    }

    return undefined; // solid by default and for created edges
  }

  private getNodeStrokeColor(node: GraphNode, step?: VisualizationStep): string {
    if (step?.data?.terminalNodes && step.data.terminalNodes.includes(node.id)) {
      return this.colors.terminalStroke;
    }
    return "#ffffff";
  }

  private getNodeStrokeWidth(node: GraphNode, step?: VisualizationStep): number {
    if (step?.data?.terminalNodes && step.data.terminalNodes.includes(node.id)) {
      return 3;
    }
    return 2;
  }
}

// Control utilities
export function useVisualizationControls(steps: VisualizationStep[], speed: number = 600) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const id = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
      setIntervalId(id);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const step = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return {
    currentStep: steps[currentStep],
    stepIndex: currentStep,
    isPlaying,
    play,
    pause,
    step,
    reset,
    setStep: setCurrentStep
  };
}