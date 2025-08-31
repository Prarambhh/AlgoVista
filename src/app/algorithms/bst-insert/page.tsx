"use client";

import React, { useState } from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TreeVisualizerComponent from "@/components/algorithm/tree-visualizer";
import TreeInput from "@/components/algorithm/tree-input";
import { VisualizationStep, TreeNode } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface BSTInsertData {
  tree: TreeNode | null;
  value?: number;
}

function generateBSTInsertSteps(data: BSTInsertData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide tree data and value to insert" }];
  }

  const { tree, value } = data[0];
  
  if (value === undefined) {
    return [{ type: "init", description: "Specify a value to insert into the BST" }];
  }

  const steps: VisualizationStep[] = [];
  let currentTree = tree ? cloneTree(tree) : null;

  steps.push({
    type: "init",
    description: `Inserting value ${value} into Binary Search Tree`,
    data: { tree: currentTree },
    highlights: []
  });

  if (!currentTree) {
    currentTree = new TreeNode(value);
    steps.push({
      type: "create-root",
      description: `Tree is empty. Creating root node with value ${value}`,
      data: { tree: currentTree },
      highlights: [value]
    });
  } else {
    insertIntoBST(currentTree, value, steps);
  }

  steps.push({
    type: "complete",
    description: `Successfully inserted ${value} into the BST`,
    data: { tree: currentTree },
    highlights: [value]
  });

  return steps;
}

function insertIntoBST(root: TreeNode, value: number, steps: VisualizationStep[]): TreeNode {
  let current = root;
  
  while (true) {
    steps.push({
      type: "compare",
      description: `Comparing ${value} with current node ${current.value}`,
      data: { tree: root },
      highlights: [current.value]
    });

    if (value < current.value) {
      if (!current.left) {
        current.left = new TreeNode(value);
        steps.push({
          type: "insert-left",
          description: `${value} < ${current.value}, inserting as left child`,
          data: { tree: root },
          highlights: [value, current.value]
        });
        break;
      } else {
        steps.push({
          type: "go-left",
          description: `${value} < ${current.value}, going to left subtree`,
          data: { tree: root },
          highlights: [current.value]
        });
        current = current.left;
      }
    } else if (value > current.value) {
      if (!current.right) {
        current.right = new TreeNode(value);
        steps.push({
          type: "insert-right",
          description: `${value} > ${current.value}, inserting as right child`,
          data: { tree: root },
          highlights: [value, current.value]
        });
        break;
      } else {
        steps.push({
          type: "go-right",
          description: `${value} > ${current.value}, going to right subtree`,
          data: { tree: root },
          highlights: [current.value]
        });
        current = current.right;
      }
    } else {
      steps.push({
        type: "duplicate",
        description: `Value ${value} already exists in BST. No insertion needed.`,
        data: { tree: root },
        highlights: [current.value]
      });
      break;
    }
  }

  return root;
}

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  const cloned = new TreeNode(node.value);
  cloned.left = cloneTree(node.left || null) || undefined;
  cloned.right = cloneTree(node.right || null) || undefined;
  return cloned;
}

// Custom input component for BST operations
function BSTInsertInput({ data, onDataChange }: { data: BSTInsertData[], onDataChange: (data: BSTInsertData[]) => void }) {
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
      <TreeInput 
        data={[{ tree: currentData.tree }]} 
        onDataChange={handleTreeChange}
      />
      
      <div className="border-t border-gray-600 pt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Value to Insert
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
  "function insertBST(root, value):",
  "  if root is null:",
  "    return new TreeNode(value)",
  "  ",
  "  current = root",
  "  while true:",
  "    if value < current.value:",
  "      if current.left is null:",
  "        current.left = new TreeNode(value)",
  "        break",
  "      current = current.left",
  "    elif value > current.value:",
  "      if current.right is null:",
  "        current.right = new TreeNode(value)",
  "        break",
  "      current = current.right",
  "    else:",
  "      break  // duplicate value",
  "  return root"
];

// Sample BST
const initialData: BSTInsertData[] = [{
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
  value: 8
}];

const relatedProblems = leetcodeProblems["bst-insert"] || [];

export default function BSTInsertPage() {
  return (
    <AlgorithmPageTemplate
      title="BST Insert"
      description="Insert a new node in Binary Search Tree while maintaining the BST property: left subtree contains values less than root, right subtree contains values greater than root."
      timeComplexity="O(h) where h is tree height"
      spaceComplexity="O(1) iterative, O(h) recursive"
      visualizationComponent={TreeVisualizerComponent}
      generateSteps={generateBSTInsertSteps}
      initialData={initialData}
      dataInputComponent={BSTInsertInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Tree Algorithms"
    />
  );
}