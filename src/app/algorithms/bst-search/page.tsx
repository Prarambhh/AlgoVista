"use client";

import React, { useState, useEffect } from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TreeVisualizerComponent from "@/components/algorithm/tree-visualizer";
import TreeInput from "@/components/algorithm/tree-input";
import { VisualizationStep, TreeNode } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface BSTSearchData {
  tree: TreeNode | null;
  target?: number;
}

// Validate BST property to help users avoid incorrect expectations when providing arbitrary trees
function isValidBST(node: TreeNode | null, min: number = -Infinity, max: number = Infinity): boolean {
  if (!node) return true;
  if (node.value <= min || node.value >= max) return false;
  return isValidBST(node.left || null, min, node.value) && isValidBST(node.right || null, node.value, max);
}

function generateBSTSearchSteps(data: BSTSearchData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide tree data and a value to search" }];
  }

  const { tree, target } = data[0];

  if (target === undefined) {
    return [{ type: "init", description: "Specify a target value to search in the BST" }];
  }

  const steps: VisualizationStep[] = [];
  const currentTree = tree;

  steps.push({
    type: "init",
    description: `Searching for value ${target} in Binary Search Tree`,
    data: { tree: currentTree },
    highlights: []
  });

  // Warn if the provided tree doesn't satisfy BST property
  if (currentTree && !isValidBST(currentTree)) {
    steps.push({
      type: "warning",
      description: "Warning: The provided tree may not satisfy the BST property. Search assumes BST ordering.",
      data: { tree: currentTree },
      highlights: []
    });
  }

  if (!currentTree) {
    steps.push({
      type: "empty-tree",
      description: "Tree is empty. Target not found.",
      data: { tree: currentTree },
      highlights: []
    });
    steps.push({
      type: "complete",
      description: `Search complete. ${target} was not found in the BST`,
      data: { tree: currentTree },
      highlights: []
    });
    return steps;
  }

  let current: TreeNode | null = currentTree;
  let found = false;

  while (current) {
    steps.push({
      type: "compare",
      description: `Comparing target ${target} with current node ${current.value}`,
      data: { tree: currentTree },
      highlights: [current.value]
    });

    if (target === current.value) {
      steps.push({
        type: "found",
        description: `Found ${target} at node with value ${current.value}`,
        data: { tree: currentTree },
        highlights: [current.value]
      });
      found = true;
      break;
    } else if (target < current.value) {
      steps.push({
        type: "go-left",
        description: `${target} < ${current.value}, go to left subtree`,
        data: { tree: currentTree },
        highlights: [current.value]
      });
      current = current.left || null;
    } else {
      steps.push({
        type: "go-right",
        description: `${target} > ${current.value}, go to right subtree`,
        data: { tree: currentTree },
        highlights: [current.value]
      });
      current = current.right || null;
    }
  }

  if (!found) {
    steps.push({
      type: "not-found",
      description: `Reached a null child. ${target} is not present in the BST`,
      data: { tree: currentTree },
      highlights: []
    });
  }

  steps.push({
    type: "complete",
    description: found
      ? `Search complete. ${target} found in the BST`
      : `Search complete. ${target} not found in the BST`,
    data: { tree: currentTree },
    highlights: found ? [target] : []
  });

  return steps;
}

// Custom input component for BST Search
function BSTSearchInput({ data, onDataChange }: { data: BSTSearchData[], onDataChange: (data: BSTSearchData[]) => void }) {
  const [searchValue, setSearchValue] = useState<string>("");

  const currentData = data[0] || { tree: null };

  useEffect(() => {
    setSearchValue(currentData.target !== undefined ? String(currentData.target) : "");
  }, [currentData.target]);

  const handleTreeChange = (newTreeData: any[]) => {
    const treeData = newTreeData[0] || { tree: null };
    onDataChange([{ ...currentData, tree: treeData.tree }]);
  };

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
    if (value === "") {
      onDataChange([{ ...currentData, target: undefined }]);
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onDataChange([{ ...currentData, target: numValue }]);
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
          Value to Search
        </label>
        <input
          type="number"
          value={searchValue}
          onChange={(e) => handleSearchValueChange(e.target.value)}
          placeholder="Enter value to search"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

const pseudocode = [
  "function searchBST(root, target):",
  "  current = root",
  "  while current is not null:",
  "    if target == current.value: return current",
  "    else if target < current.value: current = current.left",
  "    else: current = current.right",
  "  return null"
];

// Sample BST
const initialData: BSTSearchData[] = [{
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
  target: 7
}];

const relatedProblems = leetcodeProblems["bst-search"] || [];

export default function BSTSearchPage() {
  return (
    <AlgorithmPageTemplate
      title="BST: Search"
      description="Search for a value in a Binary Search Tree"
      timeComplexity="O(log n) average, O(n) worst"
      spaceComplexity="O(1)"
      visualizationComponent={TreeVisualizerComponent}
      generateSteps={generateBSTSearchSteps}
      initialData={initialData}
      dataInputComponent={BSTSearchInput}
      pseudocode={pseudocode}
      code={codeSamples}
      relatedProblems={relatedProblems}
      category="Trees"
    />
   );
}

const codeSamples = {
  javascript: `// Binary Search Tree Search - JavaScript
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function searchBST(root, val) {
  // Base case: if tree is empty or node not found
  if (!root) {
    return null;
  }
  
  // If value matches current node
  if (root.val === val) {
    return root;
  }
  
  // Search left subtree if value is smaller
  if (val < root.val) {
    return searchBST(root.left, val);
  }
  
  // Search right subtree if value is larger
  return searchBST(root.right, val);
}

// Iterative approach
function searchBSTIterative(root, val) {
  let current = root;
  
  while (current) {
    if (current.val === val) {
      return current;
    }
    
    if (val < current.val) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  
  return null; // Not found
}

// Check if value exists in BST
function containsValue(root, val) {
  return searchBST(root, val) !== null;
}`,

  python: `# Binary Search Tree Search - Python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def search_bst(root, val):
    """
    Search for a value in BST (recursive approach)
    Time: O(log n) average, O(n) worst case
    Space: O(log n) average, O(n) worst case (recursion stack)
    """
    # Base case: if tree is empty or node not found
    if not root:
        return None
    
    # If value matches current node
    if root.val == val:
        return root
    
    # Search left subtree if value is smaller
    if val < root.val:
        return search_bst(root.left, val)
    
    # Search right subtree if value is larger
    return search_bst(root.right, val)

def search_bst_iterative(root, val):
    """
    Search for a value in BST (iterative approach)
    Time: O(log n) average, O(n) worst case
    Space: O(1)
    """
    current = root
    
    while current:
        if current.val == val:
            return current
        
        if val < current.val:
            current = current.left
        else:
            current = current.right
    
    return None  # Not found

def contains_value(root, val):
    """Check if value exists in BST"""
    return search_bst(root, val) is not None

def find_min(root):
    """Find minimum value in BST"""
    if not root:
        return None
    
    while root.left:
        root = root.left
    return root

def find_max(root):
    """Find maximum value in BST"""
    if not root:
        return None
    
    while root.right:
        root = root.right
    return root`,

  java: `// Binary Search Tree Search - Java
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

public class BSTSearch {
    /**
     * Search for a value in BST (recursive approach)
     * Time: O(log n) average, O(n) worst case
     * Space: O(log n) average, O(n) worst case (recursion stack)
     */
    public TreeNode searchBST(TreeNode root, int val) {
        // Base case: if tree is empty or node not found
        if (root == null) {
            return null;
        }
        
        // If value matches current node
        if (root.val == val) {
            return root;
        }
        
        // Search left subtree if value is smaller
        if (val < root.val) {
            return searchBST(root.left, val);
        }
        
        // Search right subtree if value is larger
        return searchBST(root.right, val);
    }
    
    /**
     * Search for a value in BST (iterative approach)
     * Time: O(log n) average, O(n) worst case
     * Space: O(1)
     */
    public TreeNode searchBSTIterative(TreeNode root, int val) {
        TreeNode current = root;
        
        while (current != null) {
            if (current.val == val) {
                return current;
            }
            
            if (val < current.val) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        return null; // Not found
    }
    
    /**
     * Check if value exists in BST
     */
    public boolean containsValue(TreeNode root, int val) {
        return searchBST(root, val) != null;
    }
    
    /**
     * Find minimum value in BST
     */
    public TreeNode findMin(TreeNode root) {
        if (root == null) return null;
        
        while (root.left != null) {
            root = root.left;
        }
        return root;
    }
    
    /**
     * Find maximum value in BST
     */
    public TreeNode findMax(TreeNode root) {
        if (root == null) return null;
        
        while (root.right != null) {
            root = root.right;
        }
        return root;
    }
}`
};