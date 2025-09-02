"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import StackVisualizerComponent from "@/components/algorithm/stack-visualizer";
import StackInput from "@/components/algorithm/stack-input";
import { VisualizationStep } from "@/lib/visualization-utils";

interface StackOperation {
  type: 'push' | 'pop';
  value?: number;
}

interface StackData {
  initialStack: number[];
  operations: StackOperation[];
}

const initialData: StackData[] = [
  {
    initialStack: [1, 2, 3],
    operations: [
      { type: 'push', value: 4 },
      { type: 'push', value: 5 },
      { type: 'pop' },
      { type: 'push', value: 6 },
      { type: 'pop' },
      { type: 'pop' }
    ]
  }
];

function generateStackSteps(stackData: StackData): VisualizationStep[] {
  const { initialStack, operations } = stackData;
  const steps: VisualizationStep[] = [];
  let currentStack = [...initialStack];

  // Initial state
  steps.push({
    type: "init",
    id: 0,
    description: `Initial stack with ${currentStack.length} elements: [${currentStack.join(', ')}]. Ready to execute ${operations.length} operations.`,
    data: {
      stack: [...currentStack],
      operationIndex: 0,
      highlightTop: false
    }
  });

  // Execute each operation
  operations.forEach((operation, index) => {
    if (operation.type === 'push') {
      // Show operation about to be executed
      steps.push({
        type: "push-start",
        id: steps.length,
        description: `Operation ${index + 1}: PUSH(${operation.value}). Adding ${operation.value} to the top of the stack.`,
        data: {
          stack: [...currentStack],
          operation,
          operationIndex: index,
          highlightTop: false
        }
      });

      // Execute push
      currentStack.push(operation.value!);
      
      steps.push({
        type: "push-complete",
        id: steps.length,
        description: `PUSH completed. ${operation.value} added to top. Stack size: ${currentStack.length}. Top element: ${currentStack[currentStack.length - 1]}.`,
        data: {
          stack: [...currentStack],
          operation,
          operationIndex: index,
          highlightTop: true
        }
      });

    } else if (operation.type === 'pop') {
      // Show operation about to be executed
      if (currentStack.length === 0) {
        steps.push({
          type: "pop-invalid",
          id: steps.length,
          description: `Operation ${index + 1}: POP attempted on empty stack. Stack underflow - operation cannot be performed.`,
          data: {
            stack: [...currentStack],
            operation,
            operationIndex: index,
            highlightTop: false
          }
        });
      } else {
        const topValue = currentStack[currentStack.length - 1];
        
        steps.push({
          type: "pop-start",
          id: steps.length,
          description: `Operation ${index + 1}: POP. Removing top element (${topValue}) from the stack.`,
          data: {
            stack: [...currentStack],
            operation,
            operationIndex: index,
            highlightTop: true
          }
        });

        // Execute pop
        const poppedValue = currentStack.pop()!;
        
        steps.push({
          type: "pop-complete",
          id: steps.length,
          description: `POP completed. Removed ${poppedValue} from top. Stack size: ${currentStack.length}. ${currentStack.length > 0 ? `New top: ${currentStack[currentStack.length - 1]}` : 'Stack is now empty'}.`,
          data: {
            stack: [...currentStack],
            operation,
            operationIndex: index,
            poppedValue,
            highlightTop: currentStack.length > 0
          }
        });
      }
    }
  });

  // Final state
  steps.push({
    type: "complete",
    id: steps.length,
    description: `All operations completed. Final stack: [${currentStack.join(', ')}]. Total operations executed: ${operations.length}.`,
    data: {
      stack: [...currentStack],
      operationIndex: operations.length,
      highlightTop: false
    }
  });

  return steps;
}

const pseudocode = [
  "class Stack:",
  "  def __init__(self):",
  "    self.items = []",
  "  ",
  "  def push(item):",
  "    self.items.append(item)",
  "    return True",
  "  ",
  "  def pop():",
  "    if self.is_empty():",
  "      raise Exception('Stack underflow')",
  "    return self.items.pop()",
  "  ",
  "  def top():",
  "    if self.is_empty():",
  "      return None",
  "    return self.items[-1]",
  "  ",
  "  def is_empty():",
  "    return len(self.items) == 0",
  "  ",
  "  def size():",
  "    return len(self.items)"
];

const relatedProblems = [
  { id: 20, title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy" as const },
  { id: 155, title: "Min Stack", slug: "min-stack", difficulty: "Medium" as const },
  { id: 232, title: "Implement Queue using Stacks", slug: "implement-queue-using-stacks", difficulty: "Easy" as const },
  { id: 150, title: "Evaluate Reverse Polish Notation", slug: "evaluate-reverse-polish-notation", difficulty: "Medium" as const },
  { id: 739, title: "Daily Temperatures", slug: "daily-temperatures", difficulty: "Medium" as const }
];

const codeSamples = {
  javascript: `// Stack implementation using array
class Stack {
  constructor(){ this.items = []; }
  push(x){ this.items.push(x); }
  pop(){ if(this.isEmpty()) throw new Error('Underflow'); return this.items.pop(); }
  top(){ return this.isEmpty() ? null : this.items[this.items.length - 1]; }
  isEmpty(){ return this.items.length === 0; }
  size(){ return this.items.length; }
}

// Usage
const s = new Stack();
s.push(1); s.push(2); s.pop();`,

  python: `# Stack implementation using list
class Stack:
    def __init__(self):
        self.items = []
    def push(self, x):
        self.items.append(x)
    def pop(self):
        if self.is_empty():
            raise Exception('Underflow')
        return self.items.pop()
    def top(self):
        return None if self.is_empty() else self.items[-1]
    def is_empty(self):
        return len(self.items) == 0
    def size(self):
        return len(self.items)

# Usage
s = Stack()
s.push(1); s.push(2); s.pop()`,

  java: `// Stack implementation using Deque
import java.util.*;
class StackDS {
    private Deque<Integer> stack = new ArrayDeque<>();
    public void push(int x){ stack.push(x); }
    public int pop(){ if(stack.isEmpty()) throw new RuntimeException("Underflow"); return stack.pop(); }
    public Integer top(){ return stack.peek(); }
    public boolean isEmpty(){ return stack.isEmpty(); }
    public int size(){ return stack.size(); }
}

// Usage
// StackDS s = new StackDS();
// s.push(1); s.push(2); s.pop();`
};

export default function StackPage() {
  return (
    <AlgorithmPageTemplate
      title="Stack Operations (Push/Pop)"
      description="Visual demonstration of stack data structure operations. A stack follows LIFO (Last In, First Out) principle where elements are added and removed from the top. Push adds an element to the top, while Pop removes the top element."
      timeComplexity="O(1) per operation"
      spaceComplexity="O(n)"
      visualizationComponent={StackVisualizerComponent}
      generateSteps={(data) => generateStackSteps(data[0])}
      initialData={initialData}
      dataInputComponent={StackInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Data Structures"
      code={codeSamples}
    />
  );
}