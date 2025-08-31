"use client";

import React, { useState } from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TreeVisualizerComponent from "@/components/algorithm/tree-visualizer";
import TreeInput from "@/components/algorithm/tree-input";
import { VisualizationStep, TreeNode } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface AVLInsertData {
  tree: TreeNode | null;
  value?: number;
}

function generateAVLInsertSteps(data: AVLInsertData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide tree data and value to insert" }];
  }

  const { tree, value } = data[0];

  if (value === undefined) {
    return [{ type: "init", description: "Specify a value to insert into the AVL Tree" }];
  }

  const steps: VisualizationStep[] = [];
  let root = tree ? cloneTree(tree) : null;
  const rootRef = { root };

  steps.push({
    type: "init",
    description: `Inserting value ${value} into AVL Tree (self-balancing BST)`,
    data: { tree: rootRef.root },
    highlights: []
  });

  if (!rootRef.root) {
    rootRef.root = new TreeNode(value);
    steps.push({
      type: "create-root",
      description: `Tree is empty. Creating root node with value ${value}`,
      data: { tree: rootRef.root },
      highlights: [value]
    });
  } else {
    rootRef.root = insertAVL(rootRef.root, value, steps, rootRef);
  }

  steps.push({
    type: "complete",
    description: `Successfully inserted ${value} into the AVL Tree (balanced)`,
    data: { tree: rootRef.root },
    highlights: [value]
  });

  return steps;
}

function insertAVL(node: TreeNode, value: number, steps: VisualizationStep[], rootRef: { root: TreeNode | null }): TreeNode {
  // Standard BST insert with tracing
  steps.push({
    type: "compare",
    description: `Comparing ${value} with current node ${node.value}`,
    data: { tree: rootRef.root },
    highlights: [node.value]
  });

  if (value < node.value) {
    if (!node.left) {
      node.left = new TreeNode(value);
      steps.push({
        type: "insert-left",
        description: `${value} < ${node.value}, inserting as left child`,
        data: { tree: rootRef.root },
        highlights: [value, node.value]
      });
    } else {
      steps.push({
        type: "go-left",
        description: `${value} < ${node.value}, go to left subtree`,
        data: { tree: rootRef.root },
        highlights: [node.value]
      });
      node.left = insertAVL(node.left, value, steps, rootRef);
    }
  } else if (value > node.value) {
    if (!node.right) {
      node.right = new TreeNode(value);
      steps.push({
        type: "insert-right",
        description: `${value} > ${node.value}, inserting as right child`,
        data: { tree: rootRef.root },
        highlights: [value, node.value]
      });
    } else {
      steps.push({
        type: "go-right",
        description: `${value} > ${node.value}, go to right subtree`,
        data: { tree: rootRef.root },
        highlights: [node.value]
      });
      node.right = insertAVL(node.right, value, steps, rootRef);
    }
  } else {
    steps.push({
      type: "duplicate",
      description: `Value ${value} already exists. AVL trees typically disallow duplicates. No change.`,
      data: { tree: rootRef.root },
      highlights: [node.value]
    });
    return node; // no duplicates
  }

  // Recompute balance and apply rotations if needed
  const balance = getBalance(node);

  steps.push({
    type: "balance-check",
    description: `Node ${node.value} balance factor = ${balance} (left height ${getHeight(node.left)}, right height ${getHeight(node.right)})`,
    data: { tree: rootRef.root },
    highlights: [node.value]
  });

  // Left Left Case
  if (balance > 1 && value < (node.left?.value ?? Number.NEGATIVE_INFINITY)) {
    steps.push({
      type: "rotation",
      description: `Left-Left case at ${node.value}: Right rotate`,
      data: { tree: rootRef.root },
      highlights: [node.value, node.left!.value]
    });
    const rotated = rightRotate(node);
    if (rootRef.root === node) rootRef.root = rotated;
    steps.push({
      type: "rotation-done",
      description: `Right rotation done at ${node.value} → new subtree root ${rotated.value}`,
      data: { tree: rootRef.root },
      highlights: [rotated.value]
    });
    return rotated;
  }

  // Right Right Case
  if (balance < -1 && value > (node.right?.value ?? Number.POSITIVE_INFINITY)) {
    steps.push({
      type: "rotation",
      description: `Right-Right case at ${node.value}: Left rotate`,
      data: { tree: rootRef.root },
      highlights: [node.value, node.right!.value]
    });
    const rotated = leftRotate(node);
    if (rootRef.root === node) rootRef.root = rotated;
    steps.push({
      type: "rotation-done",
      description: `Left rotation done at ${node.value} → new subtree root ${rotated.value}`,
      data: { tree: rootRef.root },
      highlights: [rotated.value]
    });
    return rotated;
  }

  // Left Right Case
  if (balance > 1 && value > (node.left?.value ?? Number.NEGATIVE_INFINITY)) {
    steps.push({
      type: "rotation",
      description: `Left-Right case at ${node.value}: Left rotate left child ${node.left!.value}`,
      data: { tree: rootRef.root },
      highlights: [node.value, node.left!.value]
    });
    node.left = leftRotate(node.left!);
    steps.push({
      type: "rotation",
      description: `Then right rotate at ${node.value}`,
      data: { tree: rootRef.root },
      highlights: [node.value]
    });
    const rotated = rightRotate(node);
    if (rootRef.root === node) rootRef.root = rotated;
    steps.push({
      type: "rotation-done",
      description: `Left-Right rotations done → new subtree root ${rotated.value}`,
      data: { tree: rootRef.root },
      highlights: [rotated.value]
    });
    return rotated;
  }

  // Right Left Case
  if (balance < -1 && value < (node.right?.value ?? Number.POSITIVE_INFINITY)) {
    steps.push({
      type: "rotation",
      description: `Right-Left case at ${node.value}: Right rotate right child ${node.right!.value}`,
      data: { tree: rootRef.root },
      highlights: [node.value, node.right!.value]
    });
    node.right = rightRotate(node.right!);
    steps.push({
      type: "rotation",
      description: `Then left rotate at ${node.value}`,
      data: { tree: rootRef.root },
      highlights: [node.value]
    });
    const rotated = leftRotate(node);
    if (rootRef.root === node) rootRef.root = rotated;
    steps.push({
      type: "rotation-done",
      description: `Right-Left rotations done → new subtree root ${rotated.value}`,
      data: { tree: rootRef.root },
      highlights: [rotated.value]
    });
    return rotated;
  }

  return node;
}

function leftRotate(z: TreeNode): TreeNode {
  const y = z.right!;
  const T2 = y.left || null;

  // Perform rotation
  y.left = z;
  z.right = T2 || undefined;

  return y;
}

function rightRotate(z: TreeNode): TreeNode {
  const y = z.left!;
  const T3 = y.right || null;

  // Perform rotation
  y.right = z;
  z.left = T3 || undefined;

  return y;
}

function getHeight(node?: TreeNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left || null), getHeight(node.right || null));
}

function getBalance(node?: TreeNode | null): number {
  if (!node) return 0;
  return getHeight(node.left || null) - getHeight(node.right || null);
}

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  const cloned = new TreeNode(node.value);
  cloned.left = cloneTree(node.left || null) || undefined;
  cloned.right = cloneTree(node.right || null) || undefined;
  return cloned;
}

function getRoot(node: TreeNode): TreeNode | null {
  // We don't track parent pointers; return the highest known root by climbing not possible.
  // For our steps, providing any reference that ultimately contains the latest structure is fine.
  // We'll just return the passed node's topmost reachable root by a shallow copy placeholder.
  // Since our visualizer re-renders with the provided snapshot, we can return the current root
  // by walking up not available; instead, we rely on callers passing the up-to-date root.
  return node; // Best-effort; subsequent step after rotations provides correct root explicitly.
}

function AVLInsertInput({ data, onDataChange }: { data: AVLInsertData[]; onDataChange: (data: AVLInsertData[]) => void; }) {
  const [insertValue, setInsertValue] = useState<string>("");
  const currentData = data[0] || { tree: null };

  const handleTreeChange = (newTreeData: any[]) => {
    const treeData = newTreeData[0] || { tree: null };
    onDataChange([{ ...currentData, tree: treeData.tree }]);
  };

  const handleInsertValueChange = (value: string) => {
    setInsertValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onDataChange([{ ...currentData, value: numValue }]);
    }
  };

  return (
    <div className="space-y-4">
      <TreeInput data={[{ tree: currentData.tree }]} onDataChange={handleTreeChange} />

      <div className="border-t border-gray-600 pt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Value to Insert (AVL)
        </label>
        <input
          type="number"
          value={insertValue}
          onChange={(e) => handleInsertValueChange(e.target.value)}
          placeholder="Enter value to insert"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

const pseudocode = [
  "function avlInsert(root, value):",
  "  if root is null: return new TreeNode(value)",
  "  if value < root.value: root.left = avlInsert(root.left, value)",
  "  else if value > root.value: root.right = avlInsert(root.right, value)",
  "  else: return root  // no duplicates",
  "  ",
  "  // update balance and rotate if needed",
  "  balance = height(root.left) - height(root.right)",
  "  if balance > 1 and value < root.left.value: return rightRotate(root)      // LL",
  "  if balance < -1 and value > root.right.value: return leftRotate(root)     // RR",
  "  if balance > 1 and value > root.left.value: root.left = leftRotate(root.left); return rightRotate(root)  // LR",
  "  if balance < -1 and value < root.right.value: root.right = rightRotate(root.right); return leftRotate(root)  // RL",
  "  return root"
];

// Sample AVL scenario (will trigger LL rotation on insert 5)
const initialData: AVLInsertData[] = [{
  tree: (() => {
    const root = new TreeNode(30);
    root.left = new TreeNode(20);
    root.left.left = new TreeNode(10);
    return root;
  })(),
  value: 5
}];

const relatedProblems = leetcodeProblems["avl-insert"] || [];

export default function AVLInsertPage() {
  return (
    <AlgorithmPageTemplate
      title="AVL Insert"
      description="Insert a node into an AVL tree (a self-balancing BST). After standard BST insertion, the tree rebalances itself using rotations to ensure heights differ by at most 1."
      timeComplexity="O(log n)"
      spaceComplexity="O(log n) recursion or O(1) iterative"
      visualizationComponent={TreeVisualizerComponent}
      generateSteps={generateAVLInsertSteps}
      initialData={initialData}
      dataInputComponent={AVLInsertInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Tree Algorithms"
    />
  );
}