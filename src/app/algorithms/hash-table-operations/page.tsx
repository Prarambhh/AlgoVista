"use client";

import React from "react";
import AlgorithmPageTemplate from "@/components/algorithm/algorithm-page-template";
import HashTableVisualizer from "@/components/algorithm/hash-table-visualizer";
import HashTableInput from "@/components/algorithm/hash-table-input";
import { VisualizationStep } from "@/lib/visualization-utils";

// Removed metadata export to keep this as a pure client page consistent with others

type Strategy = "chaining" | "linear-probing" | "quadratic-probing";

type Operation = { type: "insert" | "search" | "delete"; key: number };

interface HashInputData {
  strategy: Strategy;
  tableSize: number;
  operations: Operation[];
}

function hash(key: number, m: number) {
  return ((key % m) + m) % m; // ensure non-negative
}

function generateHashTableSteps(inputData: HashInputData): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const { strategy, tableSize, operations } = inputData;

  if (strategy === "chaining") {
    const buckets: number[][] = Array.from({ length: tableSize }, () => []);

    steps.push({
      type: "init",
      description: `Initialize hash table with ${tableSize} buckets using separate chaining.`,
      data: { strategy, tableSize, buckets }
    });

    for (const op of operations) {
      const idx = hash(op.key, tableSize);
      if (op.type === "insert") {
        steps.push({
          type: "compute",
          description: `Compute index = hash(${op.key}) = ${idx}.`,
          data: { strategy, tableSize, buckets, index: idx, action: "insert" },
          highlights: [idx]
        });

        const exists = buckets[idx].includes(op.key);
        if (exists) {
          steps.push({
            type: "noop",
            description: `Key ${op.key} already exists in bucket ${idx}. Skip insertion.`,
            data: { strategy, tableSize, buckets, index: idx, action: "insert" },
            highlights: [idx]
          });
        } else {
          buckets[idx].push(op.key);
          steps.push({
            type: "insert",
            description: `Insert ${op.key} at bucket ${idx} (append to chain).`,
            data: { strategy, tableSize, buckets: buckets.map(b => [...b]), index: idx, activeNodePos: buckets[idx].length - 1, action: "insert" },
            highlights: [idx]
          });
        }
      } else if (op.type === "search") {
        steps.push({
          type: "compute",
          description: `Compute index = hash(${op.key}) = ${idx}. Traverse chain to search key ${op.key}.`,
          data: { strategy, tableSize, buckets, index: idx, action: "search" },
          highlights: [idx]
        });
        const pos = buckets[idx].indexOf(op.key);
        if (pos >= 0) {
          steps.push({
            type: "found",
            description: `Found ${op.key} at bucket ${idx}, position ${pos}.`,
            data: { strategy, tableSize, buckets, index: idx, activeNodePos: pos, action: "search" },
            highlights: [idx]
          });
        } else {
          steps.push({
            type: "notfound",
            description: `Key ${op.key} not found in bucket ${idx}.`,
            data: { strategy, tableSize, buckets, index: idx, action: "search" },
            highlights: [idx]
          });
        }
      } else if (op.type === "delete") {
        steps.push({
          type: "compute",
          description: `Compute index = hash(${op.key}) = ${idx}. Traverse chain to delete key ${op.key}.`,
          data: { strategy, tableSize, buckets, index: idx, action: "delete" },
          highlights: [idx]
        });
        const pos = buckets[idx].indexOf(op.key);
        if (pos >= 0) {
          buckets[idx].splice(pos, 1);
          steps.push({
            type: "delete",
            description: `Delete ${op.key} from bucket ${idx}.`,
            data: { strategy, tableSize, buckets: buckets.map(b => [...b]), index: idx, action: "delete" },
            highlights: [idx]
          });
        } else {
          steps.push({
            type: "notfound",
            description: `Key ${op.key} not found in bucket ${idx}. Nothing to delete.`,
            data: { strategy, tableSize, buckets, index: idx, action: "delete" },
            highlights: [idx]
          });
        }
      }
    }
  } else {
    // Open addressing (linear or quadratic)
    type OAState = "empty" | "occupied" | "deleted";
    const table: Array<{ state: OAState; key?: number }> = Array.from({ length: tableSize }, () => ({ state: "empty" }));

    steps.push({
      type: "init",
      description: `Initialize open addressing table with ${tableSize} slots using ${strategy.replace("-", " ")}.`,
      data: { strategy, tableSize, table: table.map(e => ({ ...e })) }
    });

    const probe = (key: number, i: number) => {
      if (strategy === "linear-probing") return (hash(key, tableSize) + i) % tableSize;
      // quadratic probing: h(k, i) = (h(k) + i^2) mod m
      return (hash(key, tableSize) + i * i) % tableSize;
    };

    for (const op of operations) {
      if (op.type === "insert") {
        let placed = false;
        for (let i = 0; i < tableSize; i++) {
          const idx = probe(op.key, i);
          steps.push({
            type: "probe",
            description: `Probe i=${i}: index ${idx}.`,
            data: { strategy, tableSize, table: table.map(e => ({ ...e })), index: idx, action: "insert" },
            highlights: [idx]
          });
          const entry = table[idx];
          if (entry.state === "empty" || entry.state === "deleted") {
            table[idx] = { state: "occupied", key: op.key };
            steps.push({
              type: "insert",
              description: `Place ${op.key} at index ${idx}.`,
              data: { strategy, tableSize, table: table.map(e => ({ ...e })), index: idx, action: "insert" },
              highlights: [idx]
            });
            placed = true;
            break;
          } else if (entry.state === "occupied" && entry.key === op.key) {
            steps.push({
              type: "noop",
              description: `Key ${op.key} already present at index ${idx}. Skip insertion.`,
              data: { strategy, tableSize, table: table.map(e => ({ ...e })), index: idx, action: "insert" },
              highlights: [idx]
            });
            placed = true;
            break;
          }
        }
        if (!placed) {
          steps.push({
            type: "error",
            description: `Table is full. Couldn't insert ${op.key}.`,
            data: { strategy, tableSize, table: table.map(e => ({ ...e })), action: "insert" }
          });
        }
      } else if (op.type === "search") {
        let found = false;
        for (let i = 0; i < tableSize; i++) {
          const idx = probe(op.key, i);
          steps.push({
            type: "probe",
            description: `Probe i=${i}: index ${idx}.`,
            data: { strategy, tableSize, table: table.map(e => ({ ...e })), index: idx, action: "search" },
            highlights: [idx]
          });
          const entry = table[idx];
          if (entry.state === "empty") {
            steps.push({
              type: "notfound",
              description: `Encountered empty slot at ${idx}. Key ${op.key} not in table.`,
              data: { strategy, tableSize, table: table.map(e => ({ ...e })), index: idx, action: "search" },
              highlights: [idx]
            });
            found = false;
            break;
          }
          if (entry.state === "occupied" && entry.key === op.key) {
            steps.push({
              type: "found",
              description: `Found ${op.key} at index ${idx}.`,
              data: { strategy, tableSize, table: table.map(e => ({ ...e })), index: idx, action: "search" },
              highlights: [idx]
            });
            found = true;
            break;
          }
          // if deleted or occupied with other key, continue probing
        }
        if (!found) {
          // if we finished all probes without early empty, it's not found
          // a notfound step might have been added when encountering empty; otherwise add generic
          const last = steps[steps.length - 1];
          if (!last || last.type !== "notfound") {
            steps.push({
              type: "notfound",
              description: `Key ${op.key} not found after probing entire table.`,
              data: { strategy, tableSize, table: table.map(e => ({ ...e })), action: "search" }
            });
          }
        }
      } else if (op.type === "delete") {
        let deleted = false;
        for (let i = 0; i < tableSize; i++) {
          const idx = probe(op.key, i);
          steps.push({
            type: "probe",
            description: `Probe i=${i}: index ${idx}.`,
            data: { strategy, tableSize, table: table.map(e => ({ ...e })), index: idx, action: "delete" },
            highlights: [idx]
          });
          const entry = table[idx];
          if (entry.state === "empty") {
            steps.push({
              type: "notfound",
              description: `Encountered empty slot at ${idx}. Key ${op.key} not in table.`,
              data: { strategy, tableSize, table: table.map(e => ({ ...e })), index: idx, action: "delete" },
              highlights: [idx]
            });
            deleted = false;
            break;
          }
          if (entry.state === "occupied" && entry.key === op.key) {
            table[idx] = { state: "deleted" };
            steps.push({
              type: "delete",
              description: `Mark index ${idx} as DELETED (tombstone).`,
              data: { strategy, tableSize, table: table.map(e => ({ ...e })), index: idx, action: "delete" },
              highlights: [idx]
            });
            deleted = true;
            break;
          }
        }
        if (!deleted) {
          const last = steps[steps.length - 1];
          if (!last || last.type !== "notfound") {
            steps.push({
              type: "notfound",
              description: `Key ${op.key} not found after probing.`,
              data: { strategy, tableSize, table: table.map(e => ({ ...e })), action: "delete" }
            });
          }
        }
      }
    }
  }

  return steps;
}

const pseudocode: string[] = [
  "HashTable (size m, strategy)",
  "Insert(x):",
  "  if strategy == chaining:",
  "    i = h(x) mod m",
  "    if x not in bucket[i]: append x",
  "  else if strategy == linear or quadratic:",
  "    for i from 0 to m-1:",
  "      j = probe(x, i)",
  "      if table[j] empty or deleted: place x at j; return",
  "    table is full",
  "",
  "Search(x):",
  "  if chaining:",
  "    i = h(x); scan bucket[i]",
  "  else:",
  "    for i from 0 to m-1:",
  "      j = probe(x, i)",
  "      if table[j] empty: return not found",
  "      if table[j] == x: return found",
  "  return not found",
  "",
  "Delete(x):",
  "  if chaining:",
  "    i = h(x); remove x from bucket[i] if present",
  "  else:",
  "    for i from 0 to m-1:",
  "      j = probe(x, i)",
  "      if table[j] empty: return not found",
  "      if table[j] == x: mark deleted"
];

const relatedProblems = [
  { id: 1, title: "Two Sum", slug: "two-sum", difficulty: "Easy" as const },
  { id: 136, title: "Single Number", slug: "single-number", difficulty: "Easy" as const },
  { id: 706, title: "Design HashMap", slug: "design-hashmap", difficulty: "Easy" as const }
];

const codeSamples = {
  javascript: `// Hash Table Implementation with Chaining and Open Addressing
class HashTable {
  constructor(size = 7) {
    this.size = size;
    this.buckets = new Array(size);
    this.strategy = 'chaining'; // or 'linear-probing', 'quadratic-probing'
  }

  // Hash function
  hash(key) {
    return ((key % this.size) + this.size) % this.size;
  }

  // Separate Chaining Implementation
  insertChaining(key) {
    const index = this.hash(key);
    if (!this.buckets[index]) {
      this.buckets[index] = [];
    }
    if (!this.buckets[index].includes(key)) {
      this.buckets[index].push(key);
    }
  }

  searchChaining(key) {
    const index = this.hash(key);
    return this.buckets[index] ? this.buckets[index].includes(key) : false;
  }

  deleteChaining(key) {
    const index = this.hash(key);
    if (this.buckets[index]) {
      this.buckets[index] = this.buckets[index].filter(k => k !== key);
    }
  }

  // Linear Probing Implementation
  insertLinearProbing(key) {
    for (let i = 0; i < this.size; i++) {
      const index = (this.hash(key) + i) % this.size;
      if (!this.buckets[index] || this.buckets[index] === 'DELETED') {
        this.buckets[index] = key;
        return true;
      }
    }
    return false; // Table is full
  }

  searchLinearProbing(key) {
    for (let i = 0; i < this.size; i++) {
      const index = (this.hash(key) + i) % this.size;
      if (this.buckets[index] === undefined) return false;
      if (this.buckets[index] === key) return true;
    }
    return false;
  }

  deleteLinearProbing(key) {
    for (let i = 0; i < this.size; i++) {
      const index = (this.hash(key) + i) % this.size;
      if (this.buckets[index] === undefined) return false;
      if (this.buckets[index] === key) {
        this.buckets[index] = 'DELETED';
        return true;
      }
    }
    return false;
  }

  // Quadratic Probing Implementation
  insertQuadraticProbing(key) {
    for (let i = 0; i < this.size; i++) {
      const index = (this.hash(key) + i * i) % this.size;
      if (!this.buckets[index] || this.buckets[index] === 'DELETED') {
        this.buckets[index] = key;
        return true;
      }
    }
    return false;
  }
}`,

  python: `# Hash Table Implementation with Chaining and Open Addressing
class HashTable:
    def __init__(self, size=7):
        self.size = size
        self.buckets = [None] * size
        self.strategy = 'chaining'  # or 'linear-probing', 'quadratic-probing'
    
    def hash(self, key):
        """Hash function that ensures non-negative result"""
        return ((key % self.size) + self.size) % self.size
    
    # Separate Chaining Implementation
    def insert_chaining(self, key):
        """Insert key using separate chaining"""
        index = self.hash(key)
        if self.buckets[index] is None:
            self.buckets[index] = []
        if key not in self.buckets[index]:
            self.buckets[index].append(key)
    
    def search_chaining(self, key):
        """Search for key using separate chaining"""
        index = self.hash(key)
        return self.buckets[index] is not None and key in self.buckets[index]
    
    def delete_chaining(self, key):
        """Delete key using separate chaining"""
        index = self.hash(key)
        if self.buckets[index] and key in self.buckets[index]:
            self.buckets[index].remove(key)
            return True
        return False
    
    # Linear Probing Implementation
    def insert_linear_probing(self, key):
        """Insert key using linear probing"""
        for i in range(self.size):
            index = (self.hash(key) + i) % self.size
            if self.buckets[index] is None or self.buckets[index] == 'DELETED':
                self.buckets[index] = key
                return True
        return False  # Table is full
    
    def search_linear_probing(self, key):
        """Search for key using linear probing"""
        for i in range(self.size):
            index = (self.hash(key) + i) % self.size
            if self.buckets[index] is None:
                return False
            if self.buckets[index] == key:
                return True
        return False
    
    def delete_linear_probing(self, key):
        """Delete key using linear probing with tombstone"""
        for i in range(self.size):
            index = (self.hash(key) + i) % self.size
            if self.buckets[index] is None:
                return False
            if self.buckets[index] == key:
                self.buckets[index] = 'DELETED'
                return True
        return False
    
    # Quadratic Probing Implementation
    def insert_quadratic_probing(self, key):
        """Insert key using quadratic probing"""
        for i in range(self.size):
            index = (self.hash(key) + i * i) % self.size
            if self.buckets[index] is None or self.buckets[index] == 'DELETED':
                self.buckets[index] = key
                return True
        return False
    
    def search_quadratic_probing(self, key):
        """Search for key using quadratic probing"""
        for i in range(self.size):
            index = (self.hash(key) + i * i) % self.size
            if self.buckets[index] is None:
                return False
            if self.buckets[index] == key:
                return True
        return False
    
    def delete_quadratic_probing(self, key):
        """Delete key using quadratic probing with tombstone"""
        for i in range(self.size):
            index = (self.hash(key) + i * i) % self.size
            if self.buckets[index] is None:
                return False
            if self.buckets[index] == key:
                self.buckets[index] = 'DELETED'
                return True
        return False`,

  java: `// Hash Table Implementation with Chaining and Open Addressing
import java.util.*;

public class HashTable {
    private int size;
    private Object[] buckets;
    private String strategy;
    
    public HashTable(int size) {
        this.size = size;
        this.buckets = new Object[size];
        this.strategy = "chaining"; // or "linear-probing", "quadratic-probing"
    }
    
    // Hash function
    private int hash(int key) {
        return ((key % size) + size) % size;
    }
    
    // Separate Chaining Implementation
    @SuppressWarnings("unchecked")
    public void insertChaining(int key) {
        int index = hash(key);
        if (buckets[index] == null) {
            buckets[index] = new ArrayList<Integer>();
        }
        List<Integer> bucket = (List<Integer>) buckets[index];
        if (!bucket.contains(key)) {
            bucket.add(key);
        }
    }
    
    @SuppressWarnings("unchecked")
    public boolean searchChaining(int key) {
        int index = hash(key);
        if (buckets[index] == null) return false;
        List<Integer> bucket = (List<Integer>) buckets[index];
        return bucket.contains(key);
    }
    
    @SuppressWarnings("unchecked")
    public boolean deleteChaining(int key) {
        int index = hash(key);
        if (buckets[index] == null) return false;
        List<Integer> bucket = (List<Integer>) buckets[index];
        return bucket.remove(Integer.valueOf(key));
    }
    
    // Linear Probing Implementation
    public boolean insertLinearProbing(int key) {
        for (int i = 0; i < size; i++) {
            int index = (hash(key) + i) % size;
            if (buckets[index] == null || buckets[index].equals("DELETED")) {
                buckets[index] = key;
                return true;
            }
        }
        return false; // Table is full
    }
    
    public boolean searchLinearProbing(int key) {
        for (int i = 0; i < size; i++) {
            int index = (hash(key) + i) % size;
            if (buckets[index] == null) return false;
            if (buckets[index].equals(key)) return true;
        }
        return false;
    }
    
    public boolean deleteLinearProbing(int key) {
        for (int i = 0; i < size; i++) {
            int index = (hash(key) + i) % size;
            if (buckets[index] == null) return false;
            if (buckets[index].equals(key)) {
                buckets[index] = "DELETED";
                return true;
            }
        }
        return false;
    }
    
    // Quadratic Probing Implementation
    public boolean insertQuadraticProbing(int key) {
        for (int i = 0; i < size; i++) {
            int index = (hash(key) + i * i) % size;
            if (buckets[index] == null || buckets[index].equals("DELETED")) {
                buckets[index] = key;
                return true;
            }
        }
        return false;
    }
    
    public boolean searchQuadraticProbing(int key) {
        for (int i = 0; i < size; i++) {
            int index = (hash(key) + i * i) % size;
            if (buckets[index] == null) return false;
            if (buckets[index].equals(key)) return true;
        }
        return false;
    }
    
    public boolean deleteQuadraticProbing(int key) {
        for (int i = 0; i < size; i++) {
            int index = (hash(key) + i * i) % size;
            if (buckets[index] == null) return false;
            if (buckets[index].equals(key)) {
                buckets[index] = "DELETED";
                return true;
            }
        }
        return false;
    }
}`
};

export default function HashTableOperationsPage() {
  const defaultData: HashInputData = {
    strategy: "chaining",
    tableSize: 7,
    operations: [
      { type: "insert", key: 10 },
      { type: "insert", key: 3 },
      { type: "insert", key: 17 },
      { type: "search", key: 10 },
      { type: "delete", key: 3 },
      { type: "search", key: 3 }
    ]
  };

  return (
    <AlgorithmPageTemplate
      title="Hash Table Operations (Chaining & Open Addressing)"
      description="Visualize insert, search, and delete operations for a hash table with different collision handling strategies (separate chaining and open addressing with linear/quadratic probing)."
      timeComplexity="O(1) average per op; O(n) worst-case chain; open addressing average constant probes"
      spaceComplexity="O(m + n)"
      visualizationComponent={HashTableVisualizer}
      generateSteps={(data) => generateHashTableSteps((data && data.length > 0 ? data[0] : defaultData) as HashInputData)}
      initialData={[defaultData]}
      dataInputComponent={HashTableInput}
      pseudocode={pseudocode}
      relatedProblems={relatedProblems}
      category="Data Structures"
      code={codeSamples}
    />
  );
}