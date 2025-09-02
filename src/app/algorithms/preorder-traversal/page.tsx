"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TreeVisualizerComponent from "@/components/algorithm/tree-visualizer";
import TreeInput from "@/components/algorithm/tree-input";
import { VisualizationStep, TreeNode } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface PreorderData {
  tree: TreeNode | null;
}

function generatePreorderSteps(data: PreorderData[]): VisualizationStep[] {
  if (!data.length || !data[0].tree) {
    return [{ type: "init", description: "Provide tree data to start Preorder Traversal visualization" }];
  }

  const tree = data[0].tree;
  const steps: VisualizationStep[] = [];
  const result: number[] = [];

  steps.push({
    type: "init",
    description: "Starting Preorder Traversal: Root → Left → Right",
    highlights: [],
    data: { result: [] }
  });

  function preorderTraversal(node: TreeNode | null): void {
    if (!node) return;

    // Visit root (current node) first
    result.push(node.value);
    steps.push({
      type: "visit",
      description: `Visiting node ${node.value} (adding to result)`,
      highlights: [node.value],
      data: { result: [...result], current: node.value, action: "visiting" }
    });

    // Visit left subtree
    if (node.left) {
      steps.push({
        type: "traverse_left",
        description: `Traversing to left child of ${node.value}`,
        highlights: [node.value],
        data: { result: [...result], current: node.value, action: "going_left" }
      });
      preorderTraversal(node.left);
    }

    // Visit right subtree
    if (node.right) {
      steps.push({
        type: "traverse_right",
        description: `Traversing to right child of ${node.value}`,
        highlights: [node.value],
        data: { result: [...result], current: node.value, action: "going_right" }
      });
      preorderTraversal(node.right);
    }

    // Backtrack
    steps.push({
      type: "backtrack",
      description: `Finished processing node ${node.value}, backtracking`,
      highlights: [],
      data: { result: [...result], current: node.value, action: "backtracking" }
    });
  }

  preorderTraversal(tree);

  steps.push({
    type: "complete",
    description: `Preorder Traversal Complete! Result: [${result.join(', ')}]`,
    highlights: [],
    data: { result: [...result], final: true }
  });

  return steps;
}

const pseudocode = [
  "function preorderTraversal(node):",
  "  if node is null:",
  "    return",
  "  ",
  "  // Visit current node",
  "  visit(node)",
  "  ",
  "  // Traverse left subtree",
  "  preorderTraversal(node.left)",
  "  ",
  "  // Traverse right subtree", 
  "  preorderTraversal(node.right)"
];

// Sample tree data
const initialData: PreorderData[] = [{
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
const relatedProblems = leetcodeProblems["preorder-traversal"] || [];

const codeSamples = {
  javascript: `// Preorder Tree Traversal (Recursive)
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function preorderTraversal(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    
    result.push(node.val); // Visit root first
    traverse(node.left);   // Visit left subtree
    traverse(node.right);  // Visit right subtree
  }
  
  traverse(root);
  return result;
}

// Iterative Preorder using Stack
function preorderTraversalIterative(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];
  
  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    if (node.right) stack.push(node.right); // Push right first
    if (node.left) stack.push(node.left);   // then left so left is processed first
  }
  
  return result;
}`,

  python: `# Preorder Tree Traversal (Recursive)
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder_traversal(root):
    result = []
    
    def traverse(node):
        if not node:
            return
        
        result.append(node.val)   # Visit root first
        traverse(node.left)       # Visit left subtree
        traverse(node.right)      # Visit right subtree
    
    traverse(root)
    return result

# Iterative Preorder using Stack
def preorder_traversal_iterative(root):
    if not root:
        return []
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result`,

  java: `// Preorder Tree Traversal (Recursive)
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class PreorderTraversal {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        traverse(root, result);
        return result;
    }
    
    private void traverse(TreeNode node, List<Integer> result) {
        if (node == null) return;
        result.add(node.val);          // Visit root first
        traverse(node.left, result);   // Visit left subtree
        traverse(node.right, result);  // Visit right subtree
    }
    
    // Iterative Preorder using Stack
    public List<Integer> preorderTraversalIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            result.add(node.val);
            if (node.right != null) stack.push(node.right);
            if (node.left != null) stack.push(node.left);
        }
        return result;
    }
}`
};

export default function PreorderTraversalPage() {
  return (
    <AlgorithmPageTemplate
      title="Preorder Traversal"
      description="Preorder traversal visits nodes in the order: Root → Left → Right. This order is useful for creating a copy of the tree or prefix expressions."
      timeComplexity="O(n)"
      spaceComplexity="O(h) where h is tree height"
      visualizationComponent={TreeVisualizerComponent}
      generateSteps={generatePreorderSteps}
      initialData={initialData}
      dataInputComponent={TreeInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Tree Algorithms"
      code={codeSamples}
    />
  );
}