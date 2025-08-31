"use client";

import React, { useState } from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TreeVisualizerComponent from "@/components/algorithm/tree-visualizer";
import TreeInput from "@/components/algorithm/tree-input";
import { VisualizationStep, TreeNode } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface BSTDeleteData {
  tree: TreeNode | null;
  value?: number;
}

function generateBSTDeleteSteps(data: BSTDeleteData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide tree data and a value to delete" }];
  }

  const { tree, value } = data[0];

  if (value === undefined) {
    return [{ type: "init", description: "Specify a value to delete from the BST" }];
  }

  const steps: VisualizationStep[] = [];

  // Work on a cloned tree so we don't mutate input
  let root = tree ? cloneTree(tree) : null;

  steps.push({
    type: "init",
    description: `Deleting value ${value} from Binary Search Tree`,
    data: { tree: root },
    highlights: []
  });

  if (!root) {
    steps.push({
      type: "empty-tree",
      description: "Tree is empty. Nothing to delete.",
      data: { tree: root },
      highlights: []
    });
    steps.push({
      type: "complete",
      description: `Delete complete. ${value} was not found (empty tree).`,
      data: { tree: root },
      highlights: []
    });
    return steps;
  }

  let current: TreeNode | null = root;
  let parent: TreeNode | null = null;
  let found = false;

  // Helper to replace a child pointer of parent from oldChild to newChild
  const replaceChild = (parentNode: TreeNode | null, oldChild: TreeNode, newChild: TreeNode | null) => {
    if (!parentNode) {
      // replacing root
      root = newChild;
    } else if (parentNode.left === oldChild) {
      parentNode.left = newChild || undefined;
    } else if (parentNode.right === oldChild) {
      parentNode.right = newChild || undefined;
    }
  };

  while (current) {
    steps.push({
      type: "compare",
      description: `Comparing ${value} with current node ${current.value}`,
      data: { tree: root },
      highlights: [current.value]
    });

    if (value < current.value) {
      steps.push({
        type: "go-left",
        description: `${value} < ${current.value}, go to left subtree`,
        data: { tree: root },
        highlights: [current.value]
      });
      parent = current;
      current = current.left || null;
    } else if (value > current.value) {
      steps.push({
        type: "go-right",
        description: `${value} > ${current.value}, go to right subtree`,
        data: { tree: root },
        highlights: [current.value]
      });
      parent = current;
      current = current.right || null;
    } else {
      // Found the node to delete
      found = true;
      steps.push({
        type: "found",
        description: `Found node ${current.value} to delete`,
        data: { tree: root },
        highlights: [current.value]
      });

      // Case 1: Leaf node
      if (!current.left && !current.right) {
        replaceChild(parent, current, null);
        steps.push({
          type: "delete-leaf",
          description: `Node ${current.value} is a leaf. Removing it.`,
          data: { tree: root },
          highlights: [current.value]
        });
        break;
      }

      // Case 2: One child
      if (!current.left || !current.right) {
        const child = current.left ? current.left : current.right!;
        replaceChild(parent, current, child);
        steps.push({
          type: "delete-one-child",
          description: `Node ${current.value} has one child. Replacing it with child ${child.value}.`,
          data: { tree: root },
          highlights: [current.value, child.value]
        });
        break;
      }

      // Case 3: Two children -> Use inorder successor (smallest in right subtree)
      let succParent: TreeNode = current;
      let succ: TreeNode = current.right!;
      steps.push({
        type: "find-successor-start",
        description: `Node ${current.value} has two children. Find inorder successor (min in right subtree).`,
        data: { tree: root },
        highlights: [current.value]
      });
      while (succ.left) {
        steps.push({
          type: "find-successor",
          description: `Move left from ${succ.value} to find minimum in right subtree`,
          data: { tree: root },
          highlights: [succ.value]
        });
        succParent = succ;
        succ = succ.left;
      }
      steps.push({
        type: "successor-found",
        description: `Inorder successor found: ${succ.value}`,
        data: { tree: root },
        highlights: [succ.value]
      });

      // Replace current node's value with successor's value
      const oldValue = current.value;
      current.value = succ.value;
      steps.push({
        type: "replace-with-successor",
        description: `Replace value ${oldValue} with inorder successor ${succ.value}`,
        data: { tree: root },
        highlights: [current.value]
      });

      // Remove successor node from its original location
      if (succParent.left === succ) {
        succParent.left = succ.right || undefined; // might be null or right child
      } else {
        succParent.right = succ.right || undefined;
      }
      steps.push({
        type: "remove-successor",
        description: `Remove successor node ${succ.value} from its original position`,
        data: { tree: root },
        highlights: [succ.value]
      });

      break;
    }
  }

  if (!found) {
    steps.push({
      type: "not-found",
      description: `${value} was not found in the BST`,
      data: { tree: root },
      highlights: []
    });
  }

  steps.push({
    type: "complete",
    description: found
      ? `Delete complete. ${value} has been removed (if present).`
      : `Delete complete. ${value} was not found.`,
    data: { tree: root },
    highlights: []
  });

  return steps;
}

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  const cloned = new TreeNode(node.value);
  cloned.left = cloneTree(node.left || null) || undefined;
  cloned.right = cloneTree(node.right || null) || undefined;
  return cloned;
}

// Custom input component for BST Delete
function BSTDeleteInput({ data, onDataChange }: { data: BSTDeleteData[], onDataChange: (data: BSTDeleteData[]) => void }) {
  const [deleteValue, setDeleteValue] = useState<string>("");

  const currentData = data[0] || { tree: null };

  const handleTreeChange = (newTreeData: any[]) => {
    const treeData = newTreeData[0] || { tree: null };
    onDataChange([{ ...currentData, tree: treeData.tree }]);
  };

  const handleDeleteValueChange = (value: string) => {
    setDeleteValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onDataChange([{ ...currentData, value: numValue }]);
    }
  };

  return (
    <div className="space-y-4">
      <TreeInput
        data={[{ tree: currentData.tree }]}
        onDataChange={handleTreeChange}
      />

      <div className="border-t border-gray-600 pt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Value to Delete
        </label>
        <input
          type="number"
          value={deleteValue}
          onChange={(e) => handleDeleteValueChange(e.target.value)}
          placeholder="Enter value to delete"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

const pseudocode = [
  "function deleteBST(root, value):",
  "  parent = null, current = root",
  "  while current is not null:",
  "    if value < current.value: parent = current; current = current.left",
  "    else if value > current.value: parent = current; current = current.right",
  "    else:",
  "      // found node",
  "      if current.left is null and current.right is null:",
  "        // leaf",
  "        replace(parent, current, null)",
  "      else if current.left is null or current.right is null:",
  "        // one child",
  "        child = current.left ? current.left : current.right",
  "        replace(parent, current, child)",
  "      else:",
  "        // two children",
  "        succParent = current; succ = current.right",
  "        while succ.left is not null: succParent = succ; succ = succ.left",
  "        current.value = succ.value",
  "        // delete successor",
  "        if succParent.left == succ: succParent.left = succ.right else succParent.right = succ.right",
  "      break",
  "  return root"
];

// Sample BST
const initialData: BSTDeleteData[] = [{
  tree: (() => {
    const root = new TreeNode(10);
    root.left = new TreeNode(5);
    root.right = new TreeNode(15);
    root.left.left = new TreeNode(3);
    root.left.right = new TreeNode(7);
    root.right.left = new TreeNode(12);
    root.right.right = new TreeNode(18);
    return root;
  })(),
  value: 15
}];

const relatedProblems = leetcodeProblems["bst-delete"] || [];

export default function BSTDeletePage() {
  return (
    <AlgorithmPageTemplate
      title="BST Delete"
      description="Delete a node from a Binary Search Tree handling leaf, one-child, and two-children cases using the inorder successor."
      timeComplexity="O(h) where h is tree height"
      spaceComplexity="O(1) iterative"
      visualizationComponent={TreeVisualizerComponent}
      generateSteps={generateBSTDeleteSteps}
      initialData={initialData}
      dataInputComponent={BSTDeleteInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Tree Algorithms"
    />
  );
}