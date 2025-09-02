"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import ArrayVisualizerComponent from "@/components/algorithm/array-visualizer";
import ArrayInput from "@/components/algorithm/array-input";
import { VisualizationStep } from "@/lib/visualization-utils";
import leetcodeProblems from "@/data/leetcode.json";

function generateHeapExtractSteps(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  if (arr.length === 0) {
    return [{ type: "init", description: "Provide a non-empty max-heap array to visualize Extract-Max" }];
  }

  const a = [...arr];
  steps.push({ type: "init", description: "Start with a max-heap represented as an array", data: [...a] });

  const n = a.length;
  const swap = (i: number, j: number) => {
    steps.push({ type: "swap", description: `Swap index ${i} and ${j}`, data: [...a], swaps: [i, j], highlights: [i, j] });
    [a[i], a[j]] = [a[j], a[i]];
  };
  const left = (i: number) => 2 * i + 1;
  const right = (i: number) => 2 * i + 2;

  // Extract max: move last element to root
  steps.push({ type: "extract", description: `Extract max ${a[0]} from root`, data: [...a], highlights: [0], pointer: 0 });
  swap(0, n - 1);
  const max = a[n - 1];
  a.length = n - 1;
  steps.push({ type: "remove", description: `Remove last element (former max ${max})`, data: [...a] });

  // Heapify down
  let i = 0;
  while (true) {
    let largest = i;
    const l = left(i);
    const r = right(i);
    if (l < a.length) {
      steps.push({ type: "compare", description: `Compare parent ${i} with left child ${l}`, data: [...a], compares: [i, l], pointers: [i, l] });
      if (a[l] > a[largest]) largest = l;
    }
    if (r < a.length) {
      steps.push({ type: "compare", description: `Compare current largest ${largest} with right child ${r}`, data: [...a], compares: [largest, r], pointers: [largest, r] });
      if (a[r] > a[largest]) largest = r;
    }
    if (largest !== i) {
      swap(i, largest);
      i = largest;
    } else {
      break;
    }
  }

  steps.push({ type: "complete", description: `Heap after extract-max; extracted value: ${max}` , data: [...a] });
  return steps;
}

const pseudocode: string[] = [
  "max = heap[0]",
  "swap heap[0] with heap[n-1]",
  "remove last element",
  "i = 0",
  "while i has a child larger than heap[i]:",
  "  swap heap[i] with its largest child",
  "  i = index of that child",
  "return max"
];

const relatedProblems = (leetcodeProblems["heap-extract"] || []) as Array<{
  id: number; title: string; slug: string; difficulty: string;
}>;

const codeSamples = {
  javascript: `// Max-Heap with extractMax (sift down)
class MaxHeap {
  constructor(arr = []) { this.heap = []; arr.forEach(x => this.insert(x)); }
  parent(i){ return Math.floor((i - 1) / 2); }
  left(i){ return 2 * i + 1; }
  right(i){ return 2 * i + 2; }
  insert(val){ this.heap.push(val); this.siftUp(this.heap.length - 1); }
  siftUp(i){ while(i>0 && this.heap[this.parent(i)] < this.heap[i]){ const p=this.parent(i); [this.heap[i],this.heap[p]]=[this.heap[p],this.heap[i]]; i=p; } }
  extractMax(){ if(this.heap.length===0) return null; const max=this.heap[0]; const last=this.heap.pop(); if(this.heap.length>0){ this.heap[0]=last; this.heapify(0); } return max; }
  heapify(i){ while(true){ let largest=i; const l=this.left(i), r=this.right(i); if(l<this.heap.length && this.heap[l]>this.heap[largest]) largest=l; if(r<this.heap.length && this.heap[r]>this.heap[largest]) largest=r; if(largest!==i){ [this.heap[i],this.heap[largest]]=[this.heap[largest],this.heap[i]]; i=largest; } else break; } }
}

// Usage
const h = new MaxHeap([9,5,6,2,3,4]);
const max = h.extractMax();`,

  python: `# Max-Heap with extract_max (sift down)
class MaxHeap:
    def __init__(self, arr=None):
        self.heap = []
        if arr:
            for x in arr: self.insert(x)
    def _parent(self, i): return (i - 1) // 2
    def _left(self, i): return 2 * i + 1
    def _right(self, i): return 2 * i + 2
    def insert(self, val):
        self.heap.append(val)
        self._sift_up(len(self.heap) - 1)
    def _sift_up(self, i):
        while i > 0 and self.heap[self._parent(i)] < self.heap[i]:
            p = self._parent(i)
            self.heap[i], self.heap[p] = self.heap[p], self.heap[i]
            i = p
    def extract_max(self):
        if not self.heap: return None
        maxv = self.heap[0]
        last = self.heap.pop()
        if self.heap:
            self.heap[0] = last
            self._heapify(0)
        return maxv
    def _heapify(self, i):
        n = len(self.heap)
        while True:
            largest = i
            l, r = self._left(i), self._right(i)
            if l < n and self.heap[l] > self.heap[largest]: largest = l
            if r < n and self.heap[r] > self.heap[largest]: largest = r
            if largest != i:
                self.heap[i], self.heap[largest] = self.heap[largest], self.heap[i]
                i = largest
            else:
                break

# Usage
h = MaxHeap([9,5,6,2,3,4])
maxv = h.extract_max()`,

  java: `// Max-Heap with extractMax (sift down)
import java.util.*;
class MaxHeap {
    private List<Integer> heap = new ArrayList<>();
    public MaxHeap() {}
    public MaxHeap(int[] arr){ for(int x: arr) insert(x); }
    private int parent(int i){ return (i - 1) / 2; }
    private int left(int i){ return 2*i + 1; }
    private int right(int i){ return 2*i + 2; }
    public void insert(int val){ heap.add(val); siftUp(heap.size()-1); }
    private void siftUp(int i){ while(i>0 && heap.get(parent(i)) < heap.get(i)){ int p=parent(i); Collections.swap(heap, i, p); i=p; } }
    public Integer extractMax(){ if(heap.isEmpty()) return null; int max = heap.get(0); int last = heap.remove(heap.size()-1); if(!heap.isEmpty()){ heap.set(0, last); heapify(0); } return max; }
    private void heapify(int i){ while(true){ int largest = i; int l=left(i), r=right(i); if(l<heap.size() && heap.get(l) > heap.get(largest)) largest=l; if(r<heap.size() && heap.get(r) > heap.get(largest)) largest=r; if(largest!=i){ Collections.swap(heap, i, largest); i=largest; } else break; } }
}

// Usage
// MaxHeap h = new MaxHeap(new int[]{9,5,6,2,3,4});
// Integer max = h.extractMax();`
};

export default function HeapExtractPage() {
  return (
    <AlgorithmPageTemplate
      title="Heap Extract-Max"
      description="Remove the maximum element from a max-heap, then heapify-down to restore the heap property."
      timeComplexity="O(log n)"
      spaceComplexity="O(1) auxiliary"
      visualizationComponent={ArrayVisualizerComponent}
      generateSteps={generateHeapExtractSteps}
      initialData={[9, 5, 6, 2, 3, 4]}
      dataInputComponent={ArrayInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Data Structures"
      code={codeSamples}
    />
  );
}