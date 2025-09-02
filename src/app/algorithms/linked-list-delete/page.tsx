"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import LinkedListVisualizerComponent from "@/components/algorithm/linked-list-visualizer";
import LinkedListDeleteInput from "@/components/algorithm/linked-list-delete-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface LinkedListNode {
  value: number;
  next: LinkedListNode | null;
}

interface LinkedListDeleteOperation {
  type: 'delete';
  position: number; // 0-based index
}

interface LinkedListDeleteData {
  initialList: number[];
  operations: LinkedListDeleteOperation[];
}

const initialData: LinkedListDeleteData[] = [
  {
    initialList: [1, 2, 3, 4, 5],
    operations: [
      { type: 'delete', position: 2 },
      { type: 'delete', position: 0 },
      { type: 'delete', position: 2 }
    ]
  }
];

function arrayToLinkedList(arr: number[]): LinkedListNode | null {
  if (arr.length === 0) return null;
  
  const head: LinkedListNode = { value: arr[0], next: null };
  let current = head;
  
  for (let i = 1; i < arr.length; i++) {
    current.next = { value: arr[i], next: null };
    current = current.next;
  }
  
  return head;
}

function linkedListToArray(head: LinkedListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  
  while (current) {
    result.push(current.value);
    current = current.next;
  }
  
  return result;
}

function generateLinkedListDeleteSteps(data: LinkedListDeleteData): VisualizationStep[] {
  const { initialList, operations } = data;
  const steps: VisualizationStep[] = [];
  
  let currentList = arrayToLinkedList(initialList);
  
  // Initial state
  steps.push({
    type: "initial",
    description: `Initial linked list: ${linkedListToArray(currentList).join(' -> ')} -> null`,
    highlights: [],
    data: { list: linkedListToArray(currentList) }
  });
  
  operations.forEach((operation, opIndex) => {
    const { position } = operation;
    const currentArray = linkedListToArray(currentList);
    
    // Show operation start
    steps.push({
      type: "operation-start",
      description: `Operation ${opIndex + 1}: Delete node at position ${position}`,
      highlights: [],
      data: { list: currentArray, deletePosition: position }
    });
    
    // Handle edge cases
    if (position < 0) {
      steps.push({
        type: "error",
        description: `Error: Cannot delete at negative position ${position}`,
        highlights: [],
        data: { list: currentArray, error: true }
      });
      return;
    }
    
    if (position >= currentArray.length) {
      steps.push({
        type: "error",
        description: `Error: Position ${position} is beyond list bounds (length: ${currentArray.length})`,
        highlights: [],
        data: { list: currentArray, error: true }
      });
      return;
    }
    
    if (currentArray.length === 0) {
      steps.push({
        type: "error",
        description: "Error: Cannot delete from empty list",
        highlights: [],
        data: { list: currentArray, error: true }
      });
      return;
    }
    
    const valueToDelete = currentArray[position];
    
    // Show the node to be deleted
    steps.push({
      type: "highlight",
      description: `Highlighting node at position ${position} with value ${valueToDelete}`,
      highlights: [position],
      data: { list: currentArray, deletePosition: position, deleteValue: valueToDelete }
    });
    
    // Delete at beginning (head)
    if (position === 0) {
      steps.push({
        type: "delete-head",
        description: "Deleting head node. Update head pointer to next node.",
        highlights: [0],
        data: { list: currentArray, deletePosition: position }
      });
      
      currentList = currentList!.next;
    } else {
      // Delete at middle or end
      steps.push({
        type: "traverse",
        description: `Traversing to position ${position - 1} to find the node before deletion point`,
        highlights: [position - 1],
        data: { list: currentArray, deletePosition: position }
      });
      
      // Find the node before the one to delete
      let current = currentList;
      for (let i = 0; i < position - 1; i++) {
        current = current!.next;
      }
      
      steps.push({
        type: "update-pointer",
        description: `Updating pointer: node at position ${position - 1} now points to node at position ${position + 1}`,
        highlights: [position - 1, position + 1],
        data: { list: currentArray, deletePosition: position }
      });
      
      // Update the pointer to skip the node to delete
      current!.next = current!.next!.next;
    }
    
    steps.push({
      type: "delete-complete",
      description: `Successfully deleted node with value ${valueToDelete} at position ${position}. New list: ${linkedListToArray(currentList).join(' -> ')} -> null`,
      highlights: [],
      data: { list: linkedListToArray(currentList), deletedNode: true }
    });
  });
  
  // Final state
  steps.push({
    type: "final",
    description: `All operations completed. Final list: ${linkedListToArray(currentList).join(' -> ')} -> null`,
    highlights: [],
    data: { list: linkedListToArray(currentList) }
  });
  
  return steps;
}

const pseudocode = [
  "function deleteAtPosition(head, position):",
  "    // Handle edge cases",
  "    if position < 0 or head is null:",
  "        return error",
  "    ",
  "    // Delete head node",
  "    if position == 0:",
  "        newHead = head.next",
  "        delete head",
  "        return newHead",
  "    ",
  "    // Traverse to node before deletion point",
  "    current = head",
  "    for i = 0 to position - 2:",
  "        if current.next is null:",
  "            return error  // Position out of bounds",
  "        current = current.next",
  "    ",
  "    // Check if node to delete exists",
  "    if current.next is null:",
  "        return error  // Position out of bounds",
  "    ",
  "    // Update pointer to skip the node",
  "    nodeToDelete = current.next",
  "    current.next = nodeToDelete.next",
  "    delete nodeToDelete",
  "    ",
  "    return head"
];

const relatedProblems = leetcodeProblems["linked-list-delete"] || [];

const codeSamples = {
  javascript: `// Singly linked list node
class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

// Delete node at a given 0-based position, return new head
function deleteAtPosition(head, position) {
  if (position < 0 || head === null) return head; // invalid or empty
  if (position === 0) return head.next; // delete head
  let prev = head;
  for (let i = 0; i < position - 1 && prev !== null; i++) {
    prev = prev.next;
  }
  if (prev === null || prev.next === null) return head; // out of bounds
  prev.next = prev.next.next; // unlink
  return head;
}

// Usage
// let head = new ListNode(1, new ListNode(2, new ListNode(3)));
// head = deleteAtPosition(head, 1); // list becomes 1 -> 3`,

  python: `# Singly linked list node
class ListNode:
    def __init__(self, value=0, next=None):
        self.value = value
        self.next = next

# Delete node at a given 0-based position, return new head
def delete_at_position(head: 'ListNode | None', position: int) -> 'ListNode | None':
    if position < 0 or head is None:
        return head
    if position == 0:
        return head.next
    prev = head
    for _ in range(position - 1):
        if prev is None:
            return head
        prev = prev.next
    if prev is None or prev.next is None:
        return head
    prev.next = prev.next.next
    return head

# Usage
# head = ListNode(1, ListNode(2, ListNode(3)))
# head = delete_at_position(head, 1)  # list becomes 1 -> 3`,

  java: `// Singly linked list node
class ListNode {
    int value;
    ListNode next;
    ListNode(int value) { this.value = value; }
}

// Delete node at a given 0-based position, return new head
static ListNode deleteAtPosition(ListNode head, int position) {
    if (position < 0 || head == null) return head;
    if (position == 0) return head.next;
    ListNode prev = head;
    for (int i = 0; i < position - 1 && prev != null; i++) {
        prev = prev.next;
    }
    if (prev == null || prev.next == null) return head; // out of bounds
    prev.next = prev.next.next; // unlink
    return head;
}

// Usage
// ListNode head = new ListNode(1);
// head.next = new ListNode(2);
// head.next.next = new ListNode(3);
// head = deleteAtPosition(head, 1); // list becomes 1 -> 3`
};

export default function LinkedListDeletePage() {
  return (
    <AlgorithmPageTemplate
      title="Linked List Delete"
      description="Delete nodes at specific positions in a linked list. This operation involves traversing to the deletion point and updating pointer references to maintain the list structure."
      timeComplexity="O(n) where n is the position"
      spaceComplexity="O(1)"
      visualizationComponent={LinkedListVisualizerComponent}
      generateSteps={(data) => generateLinkedListDeleteSteps(data[0])}
      initialData={initialData}
      dataInputComponent={LinkedListDeleteInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Data Structures"
      code={codeSamples}
    />
  );
}