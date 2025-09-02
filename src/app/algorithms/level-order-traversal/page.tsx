"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TreeVisualizerComponent from "@/components/algorithm/tree-visualizer";
import TreeInput from "@/components/algorithm/tree-input";
import { VisualizationStep, TreeNode } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface LevelOrderData {
  tree: TreeNode | null;
}

function generateLevelOrderSteps(data: LevelOrderData[]): VisualizationStep[] {
  if (!data.length || !data[0].tree) {
    return [{ type: "init", description: "Provide tree data to start Level-order Traversal visualization" }];
  }

  const tree = data[0].tree;
  const steps: VisualizationStep[] = [];
  const result: number[][] = [];

  steps.push({
    type: "init",
    description: "Starting Level-order Traversal (BFS) from root",
    highlights: [],
    data: { result: [] }
  });

  const queue: Array<{ node: TreeNode, level: number }> = [];
  queue.push({ node: tree, level: 0 });

  while (queue.length) {
    const { node, level } = queue.shift()!;

    if (result.length === level) result.push([]);
    result[level].push(node.value);

    steps.push({
      type: "visit",
      description: `Visit node ${node.value} at level ${level}`,
      highlights: [node.value],
      data: { result: result.map(row => [...row]), current: node.value, level }
    });

    if (node.left) {
      steps.push({
        type: "enqueue",
        description: `Enqueue left child ${node.left.value} of ${node.value}`,
        highlights: [node.value],
        data: { result: result.map(row => [...row]), enqueue: node.left.value, parent: node.value }
      });
      queue.push({ node: node.left, level: level + 1 });
    }

    if (node.right) {
      steps.push({
        type: "enqueue",
        description: `Enqueue right child ${node.right.value} of ${node.value}`,
        highlights: [node.value],
        data: { result: result.map(row => [...row]), enqueue: node.right.value, parent: node.value }
      });
      queue.push({ node: node.right, level: level + 1 });
    }
  }

  steps.push({
    type: "complete",
    description: `Level-order Traversal Complete! Result: [${result.map(l => `[${l.join(', ')}]`).join(', ')}]`,
    highlights: [],
    data: { result: result.map(row => [...row]), final: true }
  });

  return steps;
}

const pseudocode = [
  "function levelOrderTraversal(root):",
  "  if root is null: return",
  "  queue = [root]",
  "  result = []",
  "  level = 0",
  "  while queue not empty:",
  "    size = queue.length",
  "    levelNodes = []",
  "    repeat size times:",
  "      node = queue.dequeue()",
  "      levelNodes.add(node.value)",
  "      if node.left: queue.enqueue(node.left)",
  "      if node.right: queue.enqueue(node.right)",
  "    result.add(levelNodes)",
  "    level = level + 1",
];

// Sample tree data
const initialData: LevelOrderData[] = [{
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
const relatedProblems = leetcodeProblems["level-order-traversal"] || [];

const codeSamples = {
  javascript: `// Level-order (BFS) Traversal of Binary Tree
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function levelOrder(root) {
  const result = [];
  if (!root) return result;
  const queue = [root];
  
  while (queue.length) {
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,

  python: `# Level-order (BFS) Traversal of Binary Tree
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    result = []
    if not root:
        return result
    queue = deque([root])
    
    while queue:
        size = len(queue)
        level = []
        for _ in range(size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,

  java: `// Level-order (BFS) Traversal of Binary Tree
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

public class LevelOrderTraversal {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}`
};

export default function LevelOrderTraversalPage() {
  return (
    <AlgorithmPageTemplate
      title="Level-order Traversal"
      description="Level-order traversal visits nodes level by level from top to bottom (BFS on trees)."
      timeComplexity="O(n)"
      spaceComplexity="O(n) in worst case for queue"
      visualizationComponent={TreeVisualizerComponent}
      generateSteps={generateLevelOrderSteps}
      initialData={initialData}
      dataInputComponent={TreeInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Tree Algorithms"
      code={codeSamples}
    />
  );
}