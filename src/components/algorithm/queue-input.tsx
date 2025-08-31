"use client";

import React, { useState } from "react";
import { Plus, Minus, Shuffle, Edit, ArrowLeft, ArrowRight } from "lucide-react";

interface QueueOperation {
  type: 'enqueue' | 'dequeue';
  value?: number;
}

interface QueueData {
  initialQueue: number[];
  operations: QueueOperation[];
}

interface QueueInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function QueueInput({ data, onDataChange }: QueueInputProps) {
  const [newValue, setNewValue] = useState("5");

  // Extract queue data from the array structure
  const queueData: QueueData = Array.isArray(data) && data.length > 0 
    ? data[0] as QueueData
    : { initialQueue: [1, 2, 3], operations: [] };

  const { initialQueue, operations } = queueData;

  const updateData = (newQueue: number[], newOperations: QueueOperation[]) => {
    onDataChange([{ initialQueue: newQueue, operations: newOperations }]);
  };

  const addEnqueueOperation = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      const newOp: QueueOperation = { type: 'enqueue', value };
      updateData(initialQueue, [...operations, newOp]);
      setNewValue((value + 1).toString());
    }
  };

  const addDequeueOperation = () => {
    const newOp: QueueOperation = { type: 'dequeue' };
    updateData(initialQueue, [...operations, newOp]);
  };

  const removeOperation = (index: number) => {
    const newOperations = operations.filter((_, i) => i !== index);
    updateData(initialQueue, newOperations);
  };

  const addToInitialQueue = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      updateData([...initialQueue, value], operations);
      setNewValue((value + 1).toString());
    }
  };

  const removeFromInitialQueue = (index: number) => {
    const newQueue = initialQueue.filter((_, i) => i !== index);
    updateData(newQueue, operations);
  };

  const generateRandomOperations = () => {
    const opCount = 5 + Math.floor(Math.random() * 5); // 5-9 operations
    const newOperations: QueueOperation[] = [];
    
    for (let i = 0; i < opCount; i++) {
      if (Math.random() > 0.3) { // 70% enqueue, 30% dequeue
        newOperations.push({
          type: 'enqueue',
          value: Math.floor(Math.random() * 50) + 1
        });
      } else {
        newOperations.push({ type: 'dequeue' });
      }
    }
    
    const newQueue = Array.from({ length: 3 }, (_, i) => (i + 1) * 10);
    updateData(newQueue, newOperations);
  };

  const loadSampleOperations = () => {
    const sampleQueue = [10, 20, 30];
    const sampleOperations: QueueOperation[] = [
      { type: 'enqueue', value: 40 },
      { type: 'enqueue', value: 50 },
      { type: 'dequeue' },
      { type: 'enqueue', value: 60 },
      { type: 'dequeue' },
      { type: 'dequeue' }
    ];
    updateData(sampleQueue, sampleOperations);
  };

  // Calculate final state for preview
  const getFinalQueuePreview = () => {
    let queue = [...initialQueue];
    for (const op of operations) {
      if (op.type === 'enqueue' && op.value !== undefined) {
        queue.push(op.value);
      } else if (op.type === 'dequeue' && queue.length > 0) {
        queue.shift();
      }
    }
    return queue;
  };

  return (
    <div className="space-y-4">
      {/* Initial Queue Setup */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Initial Queue (Front to Rear)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            min="1"
            max="99"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={addToInitialQueue}
            className="btn btn-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3">
          {initialQueue.length === 0 ? (
            <div className="text-center text-gray-500 py-2">
              Empty queue
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {initialQueue.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-700 rounded p-2"
                >
                  <span className="text-white">{value}</span>
                  <button
                    onClick={() => removeFromInitialQueue(index)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Operations */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Operations Sequence
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value to enqueue"
            min="1"
            max="99"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={addEnqueueOperation}
            className="btn btn-sm flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Enqueue
          </button>
          <button
            onClick={addDequeueOperation}
            className="btn btn-sm flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <ArrowRight className="w-4 h-4" />
            Dequeue
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          {operations.length === 0 ? (
            <div className="text-center text-gray-500 py-2">
              No operations added yet
            </div>
          ) : (
            <div className="space-y-2">
              {operations.map((op, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded p-2 ${
                    op.type === 'enqueue' ? 'bg-green-600/20' : 'bg-red-600/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">
                      {index + 1}. {op.type.toUpperCase()}
                    </span>
                    {op.value !== undefined && (
                      <span className="text-gray-300">({op.value})</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeOperation(index)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={generateRandomOperations}
          className="btn btn-sm flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random
        </button>
        <button
          onClick={loadSampleOperations}
          className="btn btn-sm flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Sample
        </button>
      </div>

      {/* Summary */}
      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">
          Summary: {initialQueue.length} initial items, {operations.length} operations
        </div>
        <div className="text-sm text-gray-400">
          Final queue: [{getFinalQueuePreview().join(', ')}]
        </div>
      </div>
    </div>
  );
}