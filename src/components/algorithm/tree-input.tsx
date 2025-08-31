"use client";

import React, { useEffect, useState } from "react";
import { TreeNode } from "@/lib/visualization-utils";

interface TreeInputProps {
  data: any[]; // AlgorithmPageTemplate passes an array (we expect [{ tree: TreeNode | null }])
  onDataChange: (data: any[]) => void;
}

export default function TreeInput({ data, onDataChange }: TreeInputProps) {
  const [inputValue, setInputValue] = useState<string>("");

  // Resolve tree from the provided data shape
  const tree: TreeNode | null = Array.isArray(data) && data.length > 0
    ? (data[0] as { tree: TreeNode | null }).tree
    : null;

  const parseArrayToTree = (arr: (number | null)[]): TreeNode | null => {
    if (arr.length === 0 || arr[0] === null) return null;

    const root = new TreeNode(arr[0]!);
    const queue: TreeNode[] = [root];
    let i = 1;

    while (queue.length > 0 && i < arr.length) {
      const node = queue.shift()!;

      if (i < arr.length && arr[i] !== null) {
        node.left = new TreeNode(arr[i]!);
        queue.push(node.left);
      }
      i++;

      if (i < arr.length && arr[i] !== null) {
        node.right = new TreeNode(arr[i]!);
        queue.push(node.right);
      }
      i++;
    }

    return root;
  };

  const treeToArray = (root: TreeNode | null): (number | null)[] => {
    if (!root) return [];
    
    const result: (number | null)[] = [];
    const queue: (TreeNode | null)[] = [root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        result.push(node.value);
        queue.push(node.left || null);
        queue.push(node.right || null);
      } else {
        result.push(null);
      }
    }
    
    // Remove trailing nulls
    while (result.length > 0 && result[result.length - 1] === null) {
      result.pop();
    }
    
    return result;
  };

  const handleCustomInput = () => {
    try {
      const values = inputValue
        .split(",")
        .map(v => v.trim() === "null" ? null : parseInt(v.trim()))
        .filter(v => !isNaN(v as number) || v === null);
      
      const newTree = parseArrayToTree(values);
      onDataChange([{ tree: newTree }]);
    } catch (error) {
      alert("Invalid input format. Please use comma-separated numbers or 'null'.");
    }
  };

  const generateRandomTree = () => {
    const size = Math.floor(Math.random() * 10) + 5;
    const values: (number | null)[] = [];
    
    for (let i = 0; i < size; i++) {
      if (Math.random() < 0.8) { // 80% chance of having a value
        values.push(Math.floor(Math.random() * 99) + 1);
      } else {
        values.push(null);
      }
    }
    
    const newTree = parseArrayToTree(values);
    onDataChange([{ tree: newTree }]);
  };

  const generateBST = () => {
    const values = [10, 5, 15, 2, 7, 12, 18, 1, 3, 6, 9, 11, 14, 16, 20];
    const newTree = parseArrayToTree(values);
    onDataChange([{ tree: newTree }]);
  };

  const currentArray = treeToArray(tree);

  // Sync the input field with the current tree representation (e.g., after URL restore)
  useEffect(() => {
    const next = currentArray.join(", ");
    setInputValue((prev) => (prev !== next ? next : prev));
  }, [tree]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Current Tree (Level-order): [{currentArray.join(", ")}]
        </label>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter level-order values: 1,2,3,null,5,6"
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
        />
        <button
          onClick={handleCustomInput}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={generateRandomTree}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Random Tree
        </button>
        <button
          onClick={generateBST}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Sample BST
        </button>
      </div>
    </div>
  );
}