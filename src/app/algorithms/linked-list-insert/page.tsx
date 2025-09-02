"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import LinkedListVisualizerComponent from "@/components/algorithm/linked-list-visualizer";
import LinkedListInput from "@/components/algorithm/linked-list-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

interface LinkedListNode {
  value: number;
  next: LinkedListNode | null;
}

interface LinkedListOperation {
  type: 'insert';
  value: number;
  position: number; // 0-based index
}

interface LinkedListData {
  initialList: number[];
  operations: LinkedListOperation[];
}

const initialData: LinkedListData[] = [
  {
    initialList: [1, 2, 4],
    operations: [
      { type: 'insert', value: 3, position: 2 },
      { type: 'insert', value: 0, position: 0 },
      { type: 'insert', value: 5, position: 5 }
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

function generateLinkedListInsertSteps(data: LinkedListData): VisualizationStep[] {
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
    const { value, position } = operation;
    const currentArray = linkedListToArray(currentList);
    
    // Show operation start
    steps.push({
      type: "operation-start",
      description: `Operation ${opIndex + 1}: Insert ${value} at position ${position}`,
      highlights: [],
      data: { list: currentArray, insertValue: value, insertPosition: position }
    });
    
    // Handle edge cases
    if (position < 0) {
      steps.push({
        type: "error",
        description: `Error: Cannot insert at negative position ${position}`,
        highlights: [],
        data: { list: currentArray, error: true }
      });
      return;
    }
    
    if (position > currentArray.length) {
      steps.push({
        type: "error",
        description: `Error: Position ${position} is beyond list length ${currentArray.length}`,
        highlights: [],
        data: { list: currentArray, error: true }
      });
      return;
    }
    
    // Insert at beginning
    if (position === 0) {
      steps.push({
        type: "insert-head",
        description: `Inserting ${value} at head (position 0)`,
        highlights: [0],
        data: { list: currentArray, insertValue: value, insertPosition: 0 }
      });
      
      const newNode: LinkedListNode = { value, next: currentList };
      currentList = newNode;
      
      steps.push({
        type: "insert-complete",
        description: `Successfully inserted ${value} at head. New list: ${linkedListToArray(currentList).join(' -> ')} -> null`,
        highlights: [0],
        data: { list: linkedListToArray(currentList), newNode: true }
      });
      return;
    }
    
    // Insert at middle or end
    steps.push({
      type: "traverse-start",
      description: `Traversing to position ${position - 1} to find insertion point`,
      highlights: [],
      data: { list: currentArray, traversePosition: 0 }
    });
    
    // Show traversal steps
    for (let i = 0; i < position - 1; i++) {
      steps.push({
        type: "traverse",
        description: `At position ${i}, moving to next node`,
        highlights: [i],
        data: { list: currentArray, traversePosition: i }
      });
    }
    
    steps.push({
      type: "insert-middle",
      description: `Found insertion point at position ${position - 1}. Inserting ${value} after this node`,
      highlights: [position - 1],
      data: { list: currentArray, insertValue: value, insertPosition: position }
    });
    
    // Perform the insertion
    let current = currentList;
    for (let i = 0; i < position - 1; i++) {
      current = current!.next;
    }
    
    const newNode: LinkedListNode = { value, next: current!.next };
    current!.next = newNode;
    
    steps.push({
      type: "insert-complete",
      description: `Successfully inserted ${value} at position ${position}. New list: ${linkedListToArray(currentList).join(' -> ')} -> null`,
      highlights: [position],
      data: { list: linkedListToArray(currentList), newNode: true }
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
  "function insertAtPosition(head, value, position):",
  "  if position == 0:",
  "    newNode = createNode(value)",
  "    newNode.next = head",
  "    return newNode",
  "  ",
  "  current = head",
  "  for i = 0 to position-2:",
  "    if current == null:",
  "      throw error 'Position out of bounds'",
  "    current = current.next",
  "  ",
  "  newNode = createNode(value)",
  "  newNode.next = current.next",
  "  current.next = newNode",
  "  return head"
];

const relatedProblems = leetcodeProblems["linked-list-insert"] || [
  { id: 21, title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "Easy" as const },
  { id: 206, title: "Reverse Linked List", slug: "reverse-linked-list", difficulty: "Easy" as const },
  { id: 2, title: "Add Two Numbers", slug: "add-two-numbers", difficulty: "Medium" as const }
];

const codeSamples = {
  javascript: `// Singly Linked List insert at position
class ListNode {
  constructor(val, next=null){ this.val = val; this.next = next; }
}
function insertAtPosition(head, value, position){
  if(position === 0) return new ListNode(value, head);
  let curr = head;
  for(let i=0; i<position-1; i++){
    if(!curr) throw new Error('Position out of bounds');
    curr = curr.next;
  }
  const node = new ListNode(value, curr ? curr.next : null);
  if(!curr) throw new Error('Position out of bounds');
  curr.next = node;
  return head;
}`,

  python: `# Singly Linked List insert at position
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def insert_at_position(head, value, position):
    if position == 0:
        return ListNode(value, head)
    curr = head
    for _ in range(position - 1):
        if curr is None:
            raise Exception('Position out of bounds')
        curr = curr.next
    node = ListNode(value, curr.next if curr else None)
    if curr is None:
        raise Exception('Position out of bounds')
    curr.next = node
    return head`,

  java: `// Singly Linked List insert at position
class ListNode {
    int val; ListNode next; ListNode(int v){ val=v; }
}
class LinkedListOps {
    public ListNode insertAtPosition(ListNode head, int value, int position){
        if(position == 0) return new ListNode(value){ { next = head; } };
        ListNode curr = head;
        for(int i=0;i<position-1;i++){
            if(curr == null) throw new RuntimeException("Position out of bounds");
            curr = curr.next;
        }
        if(curr == null) throw new RuntimeException("Position out of bounds");
        ListNode node = new ListNode(value);
        node.next = curr.next;
        curr.next = node;
        return head;
    }
}`
};

export default function LinkedListInsertPage() {
  return (
    <AlgorithmPageTemplate
      title="Linked List Insert"
      description="Insert nodes at specific positions in a linked list. This operation involves traversing to the insertion point and updating pointer references to maintain the list structure."
      timeComplexity="O(n) where n is the position"
      spaceComplexity="O(1)"
      visualizationComponent={LinkedListVisualizerComponent}
      generateSteps={(data) => generateLinkedListInsertSteps(data[0])}
      initialData={initialData}
      dataInputComponent={LinkedListInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Data Structures"
      code={codeSamples}
    />
  );
}