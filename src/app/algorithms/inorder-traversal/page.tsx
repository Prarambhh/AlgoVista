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

const codeSamples = {
  javascript: `// Inorder Tree Traversal (Recursive)
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function inorderTraversal(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    
    traverse(node.left);   // Visit left subtree
    result.push(node.val); // Visit root
    traverse(node.right);  // Visit right subtree
  }
  
  traverse(root);
  return result;
}

// Iterative Inorder using Stack
function inorderTraversalIterative(root) {
  const result = [];
  const stack = [];
  let current = root;
  
  while (current || stack.length) {
    // Go to leftmost node
    while (current) {
      stack.push(current);
      current = current.left;
    }
    
    // Process node
    current = stack.pop();
    result.push(current.val);
    
    // Move to right subtree
    current = current.right;
  }
  
  return result;
}`,

  python: `# Inorder Tree Traversal (Recursive)
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    result = []
    
    def traverse(node):
        if not node:
            return
        
        traverse(node.left)   # Visit left subtree
        result.append(node.val)  # Visit root
        traverse(node.right)  # Visit right subtree
    
    traverse(root)
    return result

# Iterative Inorder using Stack
def inorder_traversal_iterative(root):
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process node
        current = stack.pop()
        result.append(current.val)
        
        # Move to right subtree
        current = current.right
    
    return result`,

  java: `// Inorder Tree Traversal (Recursive)
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

public class InorderTraversal {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        traverse(root, result);
        return result;
    }
    
    private void traverse(TreeNode node, List<Integer> result) {
        if (node == null) return;
        
        traverse(node.left, result);  // Visit left subtree
        result.add(node.val);         // Visit root
        traverse(node.right, result); // Visit right subtree
    }
    
    // Iterative Inorder using Stack
    public List<Integer> inorderTraversalIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;
        
        while (current != null || !stack.isEmpty()) {
            // Go to leftmost node
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            
            // Process node
            current = stack.pop();
            result.add(current.val);
            
            // Move to right subtree
            current = current.right;
        }
        
        return result;
    }
}`
};

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
      code={codeSamples}
    />
  );
}