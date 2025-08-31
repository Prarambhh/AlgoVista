"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TreeVisualizerComponent from "@/components/algorithm/tree-visualizer";
import TreeInput from "@/components/algorithm/tree-input";
import { VisualizationStep, TreeNode } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface PostorderData {
  tree: TreeNode | null;
}

function generatePostorderSteps(data: PostorderData[]): VisualizationStep[] {
  if (!data.length || !data[0].tree) {
    return [{ type: "init", description: "Provide tree data to start Postorder Traversal visualization" }];
  }

  const tree = data[0].tree;
  const steps: VisualizationStep[] = [];
  const result: number[] = [];

  steps.push({
    type: "init",
    description: "Starting Postorder Traversal: Left → Right → Root",
    highlights: [],
    data: { result: [] }
  });

  function postorderTraversal(node: TreeNode | null): void {
    if (!node) return;

    // Visit left subtree
    if (node.left) {
      steps.push({
        type: "traverse_left",
        description: `Traversing to left child of ${node.value}`,
        highlights: [node.value],
        data: { result: [...result], current: node.value, action: "going_left" }
      });
      postorderTraversal(node.left);
    }

    // Visit right subtree
    if (node.right) {
      steps.push({
        type: "traverse_right",
        description: `Traversing to right child of ${node.value}`,
        highlights: [node.value],
        data: { result: [...result], current: node.value, action: "going_right" }
      });
      postorderTraversal(node.right);
    }

    // Visit root (current node) last
    result.push(node.value);
    steps.push({
      type: "visit",
      description: `Visiting node ${node.value} (adding to result)`,
      highlights: [node.value],
      data: { result: [...result], current: node.value, action: "visiting" }
    });

    // Backtrack
    steps.push({
      type: "backtrack",
      description: `Finished processing node ${node.value}, backtracking`,
      highlights: [],
      data: { result: [...result], current: node.value, action: "backtracking" }
    });
  }

  postorderTraversal(tree);

  steps.push({
    type: "complete",
    description: `Postorder Traversal Complete! Result: [${result.join(', ')}]`,
    highlights: [],
    data: { result: [...result], final: true }
  });

  return steps;
}

const pseudocode = [
  "function postorderTraversal(node):",
  "  if node is null:",
  "    return",
  "  ",
  "  // Traverse left subtree",
  "  postorderTraversal(node.left)",
  "  ",
  "  // Traverse right subtree", 
  "  postorderTraversal(node.right)",
  "  ",
  "  // Visit current node",
  "  visit(node)"
];

// Sample tree data
const initialData: PostorderData[] = [{
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
const relatedProblems = leetcodeProblems["postorder-traversal"] || [];

export default function PostorderTraversalPage() {
  return (
    <AlgorithmPageTemplate
      title="Postorder Traversal"
      description="Postorder traversal visits nodes in the order: Left → Right → Root. This order is useful for deleting or freeing nodes and evaluating postfix expressions."
      timeComplexity="O(n)"
      spaceComplexity="O(h) where h is tree height"
      visualizationComponent={TreeVisualizerComponent}
      generateSteps={generatePostorderSteps}
      initialData={initialData}
      dataInputComponent={TreeInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Tree Algorithms"
    />
  );
}