"use client";

import React, { useState, useEffect } from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import TreeVisualizerComponent from "@/components/algorithm/tree-visualizer";
import TreeInput from "@/components/algorithm/tree-input";
import { VisualizationStep, TreeNode } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface AVLDeleteData {
  tree: TreeNode | null;
  value?: number;
}

function generateAVLDeleteSteps(data: AVLDeleteData[]): VisualizationStep[] {
  if (!data.length) {
    return [{ type: "init", description: "Provide tree data and a value to delete" }];
  }

  const { tree, value } = data[0];

  if (value === undefined) {
    return [{ type: "init", description: "Specify a value to delete from the AVL Tree" }];
  }

  const steps: VisualizationStep[] = [];
  let root = tree ? cloneTree(tree) : null;
  const rootRef = { root };
  const foundRef = { found: false };

  steps.push({
    type: "init",
    description: `Deleting value ${value} from AVL Tree (self-balancing BST)`,
    data: { tree: rootRef.root },
    highlights: []
  });

  if (!rootRef.root) {
    steps.push({
      type: "empty-tree",
      description: "Tree is empty. Nothing to delete.",
      data: { tree: rootRef.root },
      highlights: []
    });
    steps.push({
      type: "complete",
      description: `Delete complete. ${value} was not found (empty tree).`,
      data: { tree: rootRef.root },
      highlights: []
    });
    return steps;
  }

  rootRef.root = deleteAVL(rootRef.root, value, steps, rootRef, foundRef);

  if (!foundRef.found) {
    steps.push({
      type: "not-found",
      description: `${value} was not found in the AVL Tree`,
      data: { tree: rootRef.root },
      highlights: []
    });
  }

  steps.push({
    type: "complete",
    description: foundRef.found
      ? `Delete complete. ${value} has been removed and tree rebalanced if needed.`
      : `Delete complete. ${value} was not found.`,
    data: { tree: rootRef.root },
    highlights: []
  });

  return steps;
}

function deleteAVL(
  node: TreeNode | null,
  value: number,
  steps: VisualizationStep[],
  rootRef: { root: TreeNode | null },
  foundRef: { found: boolean }
): TreeNode | null {
  if (!node) {
    steps.push({
      type: "dead-end",
      description: `Reached null. ${value} not found along this path`,
      data: { tree: rootRef.root },
      highlights: []
    });
    return null;
  }

  steps.push({
    type: "compare",
    description: `Comparing ${value} with current node ${node.value}`,
    data: { tree: rootRef.root },
    highlights: [node.value]
  });

  if (value < node.value) {
    steps.push({
      type: "go-left",
      description: `${value} < ${node.value}, go to left subtree`,
      data: { tree: rootRef.root },
      highlights: [node.value]
    });
    node.left = deleteAVL(node.left || null, value, steps, rootRef, foundRef) || undefined;
  } else if (value > node.value) {
    steps.push({
      type: "go-right",
      description: `${value} > ${node.value}, go to right subtree`,
      data: { tree: rootRef.root },
      highlights: [node.value]
    });
    node.right = deleteAVL(node.right || null, value, steps, rootRef, foundRef) || undefined;
  } else {
    // Found node to delete
    foundRef.found = true;

    // Case: node with only one child or no child
    if (!node.left && !node.right) {
      steps.push({
        type: "delete-leaf",
        description: `Node ${node.value} is a leaf. Remove it`,
        data: { tree: rootRef.root },
        highlights: [node.value]
      });
      return null;
    }

    if (!node.left || !node.right) {
      const child = (node.left || node.right)!;
      steps.push({
        type: "delete-one-child",
        description: `Node ${node.value} has one child. Replace it with child ${child.value}`,
        data: { tree: rootRef.root },
        highlights: [node.value, child.value]
      });
      return child;
    }

    // Node with two children: Get inorder successor (smallest in right subtree)
    steps.push({
      type: "two-children",
      description: `Node ${node.value} has two children. Find inorder successor in right subtree`,
      data: { tree: rootRef.root },
      highlights: [node.value]
    });

    const succ = minValueNode(node.right!);
    steps.push({
      type: "successor",
      description: `Inorder successor is ${succ.value}`,
      data: { tree: rootRef.root },
      highlights: [succ.value]
    });

    const oldVal = node.value;
    node.value = succ.value;
    steps.push({
      type: "replace",
      description: `Replace node ${oldVal} value with successor ${succ.value}`,
      data: { tree: rootRef.root },
      highlights: [node.value]
    });

    node.right = deleteAVL(node.right || null, succ.value, steps, rootRef, foundRef) || undefined;
  }

  // Balance this ancestor node
  const balance = getBalance(node);
  steps.push({
    type: "balance-check",
    description: `Node ${node.value} balance = ${balance} (L=${getHeight(node.left || null)}, R=${getHeight(node.right || null)})`,
    data: { tree: rootRef.root },
    highlights: [node.value]
  });

  // Left heavy
  if (balance > 1) {
    const leftBal = getBalance(node.left || null);
    // LL
    if (leftBal >= 0) {
      steps.push({
        type: "rotation",
        description: `Left-Left imbalance at ${node.value}. Right rotate`,
        data: { tree: rootRef.root },
        highlights: [node.value, (node.left as TreeNode).value]
      });
      const rotated = rightRotate(node);
      if (rootRef.root === node) rootRef.root = rotated;
      steps.push({
        type: "rotation-done",
        description: `Right rotation done → new subtree root ${rotated.value}`,
        data: { tree: rootRef.root },
        highlights: [rotated.value]
      });
      return rotated;
    }
    // LR
    steps.push({
      type: "rotation",
      description: `Left-Right imbalance at ${node.value}. Left rotate left child`,
      data: { tree: rootRef.root },
      highlights: [node.value, (node.left as TreeNode).value]
    });
    node.left = leftRotate(node.left as TreeNode);
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

  // Right heavy
  if (balance < -1) {
    const rightBal = getBalance(node.right || null);
    // RR
    if (rightBal <= 0) {
      steps.push({
        type: "rotation",
        description: `Right-Right imbalance at ${node.value}. Left rotate`,
        data: { tree: rootRef.root },
        highlights: [node.value, (node.right as TreeNode).value]
      });
      const rotated = leftRotate(node);
      if (rootRef.root === node) rootRef.root = rotated;
      steps.push({
        type: "rotation-done",
        description: `Left rotation done → new subtree root ${rotated.value}`,
        data: { tree: rootRef.root },
        highlights: [rotated.value]
      });
      return rotated;
    }
    // RL
    steps.push({
      type: "rotation",
      description: `Right-Left imbalance at ${node.value}. Right rotate right child`,
      data: { tree: rootRef.root },
      highlights: [node.value, (node.right as TreeNode).value]
    });
    node.right = rightRotate(node.right as TreeNode);
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

function minValueNode(node: TreeNode): TreeNode {
  let current = node;
  while (current.left) current = current.left;
  return current;
}

function leftRotate(z: TreeNode): TreeNode {
  const y = z.right!;
  const T2 = y.left || null;

  y.left = z;
  z.right = T2 || undefined;

  return y;
}

function rightRotate(z: TreeNode): TreeNode {
  const y = z.left!;
  const T3 = y.right || null;

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

function AVLDeleteInput({ data, onDataChange }: { data: AVLDeleteData[]; onDataChange: (data: AVLDeleteData[]) => void; }) {
  const [deleteValue, setDeleteValue] = useState<string>("");
  const currentData = data[0] || { tree: null };

  useEffect(() => {
    const v = currentData.value;
    setDeleteValue(v !== undefined ? String(v) : "");
  }, [currentData.value]);

  const handleTreeChange = (newTreeData: any[]) => {
    const treeData = newTreeData[0] || { tree: null };
    onDataChange([{ ...currentData, tree: treeData.tree }]);
  };

  const handleDeleteValueChange = (value: string) => {
    setDeleteValue(value);
    if (value.trim() === "") {
      onDataChange([{ ...currentData, value: undefined }]);
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onDataChange([{ ...currentData, value: numValue }]);
    }
  };

  return (
    <div className="space-y-4">
      <TreeInput data={[{ tree: currentData.tree }]} onDataChange={handleTreeChange} />

      <div className="border-t border-gray-600 pt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Value to Delete (AVL)</label>
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
  "function avlDelete(root, value):",
  "  if root is null: return root",
  "  if value < root.value: root.left = avlDelete(root.left, value)",
  "  else if value > root.value: root.right = avlDelete(root.right, value)",
  "  else:",
  "    // node to delete",
  "    if not root.left and not root.right: root = null",
  "    else if not root.left or not root.right: root = root.left or root.right",
  "    else: succ = minValue(root.right); root.value = succ.value; root.right = avlDelete(root.right, succ.value)",
  "  if root is null: return root",
  "  balance = height(root.left) - height(root.right)",
  "  if balance > 1 and balance(left) >= 0: return rightRotate(root)       // LL",
  "  if balance > 1 and balance(left) < 0: root.left = leftRotate(root.left); return rightRotate(root)  // LR",
  "  if balance < -1 and balance(right) <= 0: return leftRotate(root)     // RR",
  "  if balance < -1 and balance(right) > 0: root.right = rightRotate(root.right); return leftRotate(root) // RL",
  "  return root"
];

// Sample tree and deletion that may trigger rebalancing
const initialData: AVLDeleteData[] = [{
  tree: (() => {
    const r = new TreeNode(30);
    r.left = new TreeNode(20);
    r.right = new TreeNode(40);
    (r.left as TreeNode).left = new TreeNode(10);
    (r.left as TreeNode).right = new TreeNode(25);
    return r;
  })(),
  value: 40
}];

const relatedProblems = leetcodeProblems["avl-delete"] || [];

const codeSamples = {
  "JavaScript": `class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }
  
  getHeight(node) {
    return node ? node.height : 0;
  }
  
  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }
  
  updateHeight(node) {
    if (node) {
      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }
  }
  
  rotateRight(z) {
    const y = z.left;
    const T3 = y.right;
    
    y.right = z;
    z.left = T3;
    
    this.updateHeight(z);
    this.updateHeight(y);
    
    return y;
  }
  
  rotateLeft(z) {
    const y = z.right;
    const T2 = y.left;
    
    y.left = z;
    z.right = T2;
    
    this.updateHeight(z);
    this.updateHeight(y);
    
    return y;
  }
  
  minValueNode(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
  
  delete(node, value) {
    if (!node) return node;
    
    if (value < node.value) {
      node.left = this.delete(node.left, value);
    } else if (value > node.value) {
      node.right = this.delete(node.right, value);
    } else {
      // Node to be deleted
      if (!node.left || !node.right) {
        const temp = node.left || node.right;
        if (!temp) {
          node = null;
        } else {
          node = temp;
        }
      } else {
        // Node with two children
        const temp = this.minValueNode(node.right);
        node.value = temp.value;
        node.right = this.delete(node.right, temp.value);
      }
    }
    
    if (!node) return node;
    
    // Update height
    this.updateHeight(node);
    
    // Check balance and rotate if needed
    const balance = this.getBalance(node);
    
    // Left Left Case
    if (balance > 1 && this.getBalance(node.left) >= 0) {
      return this.rotateRight(node);
    }
    
    // Left Right Case
    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    
    // Right Right Case
    if (balance < -1 && this.getBalance(node.right) <= 0) {
      return this.rotateLeft(node);
    }
    
    // Right Left Case
    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    
    return node;
  }
  
  deleteValue(value) {
    this.root = this.delete(this.root, value);
  }
}`,
  "Python": `class AVLNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def __init__(self):
        self.root = None
    
    def get_height(self, node):
        return node.height if node else 0
    
    def get_balance(self, node):
        return (self.get_height(node.left) - self.get_height(node.right)) if node else 0
    
    def update_height(self, node):
        if node:
            node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
    
    def rotate_right(self, z):
        y = z.left
        T3 = y.right
        
        # Perform rotation
        y.right = z
        z.left = T3
        
        # Update heights
        self.update_height(z)
        self.update_height(y)
        
        return y
    
    def rotate_left(self, z):
        y = z.right
        T2 = y.left
        
        # Perform rotation
        y.left = z
        z.right = T2
        
        # Update heights
        self.update_height(z)
        self.update_height(y)
        
        return y
    
    def min_value_node(self, node):
        while node.left:
            node = node.left
        return node
    
    def delete(self, node, value):
        if not node:
            return node
        
        if value < node.value:
            node.left = self.delete(node.left, value)
        elif value > node.value:
            node.right = self.delete(node.right, value)
        else:
            # Node to be deleted
            if not node.left or not node.right:
                temp = node.left or node.right
                if not temp:
                    node = None
                else:
                    node = temp
            else:
                # Node with two children
                temp = self.min_value_node(node.right)
                node.value = temp.value
                node.right = self.delete(node.right, temp.value)
        
        if not node:
            return node
        
        # Update height
        self.update_height(node)
        
        # Check balance and rotate if needed
        balance = self.get_balance(node)
        
        # Left Left Case
        if balance > 1 and self.get_balance(node.left) >= 0:
            return self.rotate_right(node)
        
        # Left Right Case
        if balance > 1 and self.get_balance(node.left) < 0:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)
        
        # Right Right Case
        if balance < -1 and self.get_balance(node.right) <= 0:
            return self.rotate_left(node)
        
        # Right Left Case
        if balance < -1 and self.get_balance(node.right) > 0:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)
        
        return node
    
    def delete_value(self, value):
        self.root = self.delete(self.root, value)`,
  "Java": `class AVLNode {
    int value;
    AVLNode left, right;
    int height;
    
    AVLNode(int value) {
        this.value = value;
        this.height = 1;
    }
}

public class AVLTree {
    private AVLNode root;
    
    public int getHeight(AVLNode node) {
        return (node == null) ? 0 : node.height;
    }
    
    public int getBalance(AVLNode node) {
        return (node == null) ? 0 : getHeight(node.left) - getHeight(node.right);
    }
    
    public void updateHeight(AVLNode node) {
        if (node != null) {
            node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
        }
    }
    
    public AVLNode rotateRight(AVLNode z) {
        AVLNode y = z.left;
        AVLNode T3 = y.right;
        
        // Perform rotation
        y.right = z;
        z.left = T3;
        
        // Update heights
        updateHeight(z);
        updateHeight(y);
        
        return y;
    }
    
    public AVLNode rotateLeft(AVLNode z) {
        AVLNode y = z.right;
        AVLNode T2 = y.left;
        
        // Perform rotation
        y.left = z;
        z.right = T2;
        
        // Update heights
        updateHeight(z);
        updateHeight(y);
        
        return y;
    }
    
    public AVLNode minValueNode(AVLNode node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
    
    public AVLNode delete(AVLNode node, int value) {
        if (node == null) {
            return node;
        }
        
        if (value < node.value) {
            node.left = delete(node.left, value);
        } else if (value > node.value) {
            node.right = delete(node.right, value);
        } else {
            // Node to be deleted
            if (node.left == null || node.right == null) {
                AVLNode temp = (node.left != null) ? node.left : node.right;
                if (temp == null) {
                    node = null;
                } else {
                    node = temp;
                }
            } else {
                // Node with two children
                AVLNode temp = minValueNode(node.right);
                node.value = temp.value;
                node.right = delete(node.right, temp.value);
            }
        }
        
        if (node == null) {
            return node;
        }
        
        // Update height
        updateHeight(node);
        
        // Check balance and rotate if needed
        int balance = getBalance(node);
        
        // Left Left Case
        if (balance > 1 && getBalance(node.left) >= 0) {
            return rotateRight(node);
        }
        
        // Left Right Case
        if (balance > 1 && getBalance(node.left) < 0) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        
        // Right Right Case
        if (balance < -1 && getBalance(node.right) <= 0) {
            return rotateLeft(node);
        }
        
        // Right Left Case
        if (balance < -1 && getBalance(node.right) > 0) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        
        return node;
    }
    
    public void deleteValue(int value) {
        root = delete(root, value);
    }
}`
};

export default function AVLDeletePage() {
  return (
    <AlgorithmPageTemplate
      title="AVL Delete"
      description="Delete a node from an AVL tree. After standard BST deletion, perform rotations to keep the tree height-balanced."
      timeComplexity="O(log n)"
      spaceComplexity="O(log n) recursion or O(1) iterative"
      visualizationComponent={TreeVisualizerComponent}
      generateSteps={generateAVLDeleteSteps}
      initialData={initialData}
      dataInputComponent={AVLDeleteInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Tree Algorithms"
      code={codeSamples}
    />
  );
}