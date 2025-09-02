"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import QueueVisualizerComponent from "@/components/algorithm/queue-visualizer";
import QueueInput from "@/components/algorithm/queue-input";
import { VisualizationStep } from "@/lib/visualization-utils";

interface QueueOperation {
  type: 'enqueue' | 'dequeue';
  value?: number;
}

interface QueueData {
  initialQueue: number[];
  operations: QueueOperation[];
}

const initialData: QueueData[] = [
  {
    initialQueue: [1, 2, 3],
    operations: [
      { type: 'enqueue', value: 4 },
      { type: 'enqueue', value: 5 },
      { type: 'dequeue' },
      { type: 'enqueue', value: 6 },
      { type: 'dequeue' },
      { type: 'dequeue' }
    ]
  }
];

function generateQueueSteps(queueData: QueueData): VisualizationStep[] {
  const { initialQueue, operations } = queueData;
  const steps: VisualizationStep[] = [];
  let currentQueue = [...initialQueue];

  // Initial state
  steps.push({
    id: 0,
    type: "init",
    description: `Initial queue with ${currentQueue.length} elements: [${currentQueue.join(', ')}]. Ready to execute ${operations.length} operations. Front: ${currentQueue[0] || 'None'}, Rear: ${currentQueue[currentQueue.length - 1] || 'None'}.`,
    data: {
      queue: [...currentQueue],
      operationIndex: 0,
      highlightFront: false,
      highlightRear: false
    }
  });

  // Execute each operation
  operations.forEach((operation, index) => {
    if (operation.type === 'enqueue') {
      // Show operation about to be executed
      steps.push({
        id: steps.length,
        type: "enqueue-start",
        description: `Operation ${index + 1}: ENQUEUE(${operation.value}). Adding ${operation.value} to the rear of the queue.`,
        data: {
          queue: [...currentQueue],
          operation,
          operationIndex: index,
          highlightFront: false,
          highlightRear: true
        }
      });

      // Execute enqueue
      currentQueue.push(operation.value!);
      
      steps.push({
        id: steps.length,
        type: "enqueue-complete",
        description: `ENQUEUE completed. ${operation.value} added to rear. Queue size: ${currentQueue.length}. Front: ${currentQueue[0]}, Rear: ${currentQueue[currentQueue.length - 1]}.`,
        data: {
          queue: [...currentQueue],
          operation,
          operationIndex: index,
          highlightFront: false,
          highlightRear: true
        }
      });

    } else if (operation.type === 'dequeue') {
      // Show operation about to be executed
      if (currentQueue.length === 0) {
        steps.push({
          id: steps.length,
          type: "dequeue-empty",
          description: `Operation ${index + 1}: DEQUEUE attempted on empty queue. Queue underflow - operation cannot be performed.`,
          data: {
            queue: [...currentQueue],
            operation,
            operationIndex: index,
            highlightFront: false,
            highlightRear: false
          }
        });
      } else {
        const frontValue = currentQueue[0];
        
        steps.push({
          id: steps.length,
          type: "dequeue-start",
          description: `Operation ${index + 1}: DEQUEUE. Removing front element (${frontValue}) from the queue.`,
          data: {
            queue: [...currentQueue],
            operation,
            operationIndex: index,
            highlightFront: true,
            highlightRear: false
          }
        });

        // Execute dequeue
        const dequeuedValue = currentQueue.shift()!;
        
        steps.push({
          id: steps.length,
          type: "dequeue-complete",
          description: `DEQUEUE completed. Removed ${dequeuedValue} from front. Queue size: ${currentQueue.length}. ${currentQueue.length > 0 ? `New front: ${currentQueue[0]}, Rear: ${currentQueue[currentQueue.length - 1]}` : 'Queue is now empty'}.`,
          data: {
            queue: [...currentQueue],
            operation,
            operationIndex: index,
            dequeuedValue,
            highlightFront: currentQueue.length > 0,
            highlightRear: false
          }
        });
      }
    }
  });

  // Final state
  steps.push({
    id: steps.length,
    type: "complete",
    description: `All operations completed. Final queue: [${currentQueue.join(', ')}]. Total operations executed: ${operations.length}. ${currentQueue.length > 0 ? `Front: ${currentQueue[0]}, Rear: ${currentQueue[currentQueue.length - 1]}` : 'Queue is empty'}.`,
    data: {
      queue: [...currentQueue],
      operationIndex: operations.length,
      highlightFront: false,
      highlightRear: false
    }
  });

  return steps;
}

const pseudocode = [
  "class Queue:",
  "  def __init__(self):",
  "    self.items = []",
  "  ",
  "  def enqueue(item):",
  "    self.items.append(item)",
  "    return True",
  "  ",
  "  def dequeue():",
  "    if self.is_empty():",
  "      raise Exception('Queue underflow')",
  "    return self.items.pop(0)",
  "  ",
  "  def front():",
  "    if self.is_empty():",
  "      return None",
  "    return self.items[0]",
  "  ",
  "  def rear():",
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
  { id: 232, title: "Implement Queue using Stacks", slug: "implement-queue-using-stacks", difficulty: "Easy" as const },
  { id: 225, title: "Implement Stack using Queues", slug: "implement-stack-using-queues", difficulty: "Easy" as const },
  { id: 622, title: "Design Circular Queue", slug: "design-circular-queue", difficulty: "Medium" as const },
  { id: 933, title: "Number of Recent Calls", slug: "number-of-recent-calls", difficulty: "Easy" as const },
  { id: 346, title: "Moving Average from Data Stream", slug: "moving-average-from-data-stream", difficulty: "Easy" as const }
];

const codeSamples = {
  javascript: `// Queue implementation using array
class Queue {
  constructor(){ this.items = []; }
  enqueue(x){ this.items.push(x); }
  dequeue(){ if(this.isEmpty()) throw new Error('Underflow'); return this.items.shift(); }
  front(){ return this.isEmpty() ? null : this.items[0]; }
  rear(){ return this.isEmpty() ? null : this.items[this.items.length - 1]; }
  isEmpty(){ return this.items.length === 0; }
  size(){ return this.items.length; }
}

// Usage
const q = new Queue();
q.enqueue(1); q.enqueue(2); q.dequeue();`,

  python: `# Queue implementation using collections.deque
from collections import deque
class Queue:
    def __init__(self):
        self.items = deque()
    def enqueue(self, x):
        self.items.append(x)
    def dequeue(self):
        if self.is_empty():
            raise Exception('Underflow')
        return self.items.popleft()
    def front(self):
        return None if self.is_empty() else self.items[0]
    def rear(self):
        return None if self.is_empty() else self.items[-1]
    def is_empty(self):
        return len(self.items) == 0
    def size(self):
        return len(self.items)

# Usage
q = Queue()
q.enqueue(1); q.enqueue(2); q.dequeue();`,

  java: `// Queue implementation using ArrayDeque
import java.util.*;
class QueueDS {
    private Deque<Integer> queue = new ArrayDeque<>();
    public void enqueue(int x){ queue.addLast(x); }
    public int dequeue(){ if(queue.isEmpty()) throw new RuntimeException("Underflow"); return queue.removeFirst(); }
    public Integer front(){ return queue.peekFirst(); }
    public Integer rear(){ return queue.peekLast(); }
    public boolean isEmpty(){ return queue.isEmpty(); }
    public int size(){ return queue.size(); }
}

// Usage
// QueueDS q = new QueueDS();
// q.enqueue(1); q.enqueue(2); q.dequeue();`
};

export default function QueuePage() {
  return (
    <AlgorithmPageTemplate
      title="Queue Operations (Enqueue/Dequeue)"
      description="Visual demonstration of queue data structure operations. A queue follows FIFO (First In, First Out) principle where elements are added at the rear and removed from the front. Enqueue adds an element to the rear, while Dequeue removes the front element."
      timeComplexity="O(1) per operation"
      spaceComplexity="O(n)"
      visualizationComponent={QueueVisualizerComponent}
      generateSteps={(data) => generateQueueSteps(data[0])}
      initialData={initialData}
      dataInputComponent={QueueInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Data Structures"
      code={codeSamples}
    />
  );
}