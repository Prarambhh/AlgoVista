"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TreeVisualizerComponent from "@/components/algorithm/tree-visualizer";
import TreeInput from "@/components/algorithm/tree-input";
import { VisualizationStep, TreeNode } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface InorderData {
  tree: TreeNode | null;
}

function generateInorderSteps(data: InorderData[]): VisualizationStep[] {
  if (!data.length || !data[0].tree) {
    return [{ type: "init", description: "Provide tree data to start Inorder Traversal visualization" }];
  }

  const tree = data[0].tree;
  const steps: VisualizationStep[] = [];
  const result: number[] = [];

  steps.push({
    type: "init",
    description: "Starting Inorder Traversal: Left → Root → Right",
    highlights: [],
    data: { result: [] }
  });

  function inorderTraversal(node: TreeNode | null): void {
    if (!node) return;

    // Visit left subtree first
    if (node.left) {
      steps.push({
        type: "traverse_left",
        description: `Traversing to left child of ${node.value}`,
        highlights: [node.value],
        data: { result: [...result], current: node.value, action: "going_left" }
      });
      inorderTraversal(node.left);
    }

    // Visit root (current node)
    result.push(node.value);
    steps.push({
      type: "visit",
      description: `Visiting node ${node.value} (adding to result)`,
      highlights: [node.value],
      data: { result: [...result], current: node.value, action: "visiting" }
    });

    // Visit right subtree
    if (node.right) {
      steps.push({
        type: "traverse_right",
        description: `Traversing to right child of ${node.value}`,
        highlights: [node.value],
        data: { result: [...result], current: node.value, action: "going_right" }
      });
      inorderTraversal(node.right);
    }

    // Backtrack
    steps.push({
      type: "backtrack",
      description: `Finished processing node ${node.value}, backtracking`,
      highlights: [],
      data: { result: [...result], current: node.value, action: "backtracking" }
    });
  }

  inorderTraversal(tree);

  steps.push({
    type: "complete",
    description: `Inorder Traversal Complete! Result: [${result.join(', ')}]`,
    highlights: [],
    data: { result: [...result], final: true }
  });

  return steps;
}

const pseudocode = [
  "function inorderTraversal(node):",
  "  if node is null:",
  "    return",
  "  ",
  "  // Traverse left subtree",
  "  inorderTraversal(node.left)",
  "  ",
  "  // Visit current node",
  "  visit(node)",
  "  ",
  "  // Traverse right subtree", 
  "  inorderTraversal(node.right)"
];

// Sample tree data
const initialData: InorderData[] = [{
  tree: (() => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.left = new TreeNode(6);
    root.right.right = new TreeNode(7);
    return root;
  })()
}];

// Related LeetCode problems
const relatedProblems = leetcodeProblems["inorder-traversal"] || [];

export default function InorderTraversalPage() {
  return (
    <AlgorithmPageTemplate
      title="Inorder Traversal"
      description="Inorder traversal visits nodes in the order: Left → Root → Right. For binary search trees, this gives nodes in sorted order."
      timeComplexity="O(n)"
      spaceComplexity="O(h) where h is tree height"
      visualizationComponent={TreeVisualizerComponent}
      generateSteps={generateInorderSteps}
      initialData={initialData}
      dataInputComponent={TreeInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Tree Algorithms"
    />
  );
}