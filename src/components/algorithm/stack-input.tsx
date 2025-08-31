"use client";

import React, { useState } from "react";
import { Plus, Minus, Shuffle, Edit, ArrowUp, ArrowDown } from "lucide-react";

interface StackOperation {
  type: 'push' | 'pop';
  value?: number;
}

interface StackData {
  initialStack: number[];
  operations: StackOperation[];
}

interface StackInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function StackInput({ data, onDataChange }: StackInputProps) {
  const [newValue, setNewValue] = useState("5");

  // Extract stack data from the array structure
  const stackData: StackData = Array.isArray(data) && data.length > 0 
    ? data[0] as StackData
    : { initialStack: [1, 2, 3], operations: [] };

  const { initialStack, operations } = stackData;

  const updateData = (newStack: number[], newOperations: StackOperation[]) => {
    onDataChange([{ initialStack: newStack, operations: newOperations }]);
  };

  const addPushOperation = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      const newOp: StackOperation = { type: 'push', value };
      updateData(initialStack, [...operations, newOp]);
      setNewValue((value + 1).toString());
    }
  };

  const addPopOperation = () => {
    const newOp: StackOperation = { type: 'pop' };
    updateData(initialStack, [...operations, newOp]);
  };

  const removeOperation = (index: number) => {
    const newOperations = operations.filter((_, i) => i !== index);
    updateData(initialStack, newOperations);
  };

  const addToInitialStack = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      updateData([...initialStack, value], operations);
      setNewValue((value + 1).toString());
    }
  };

  const removeFromInitialStack = (index: number) => {
    const newStack = initialStack.filter((_, i) => i !== index);
    updateData(newStack, operations);
  };

  const generateRandomOperations = () => {
    const opCount = 5 + Math.floor(Math.random() * 5); // 5-9 operations
    const newOperations: StackOperation[] = [];
    
    for (let i = 0; i < opCount; i++) {
      if (Math.random() > 0.3) { // 70% push, 30% pop
        newOperations.push({
          type: 'push',
          value: Math.floor(Math.random() * 50) + 1
        });
      } else {
        newOperations.push({ type: 'pop' });
      }
    }
    
    const newStack = Array.from({ length: 3 }, (_, i) => i + 1);
    updateData(newStack, newOperations);
  };

  const loadSampleOperations = () => {
    const sampleStack = [10, 20, 30];
    const sampleOperations: StackOperation[] = [
      { type: 'push', value: 40 },
      { type: 'push', value: 50 },
      { type: 'pop' },
      { type: 'push', value: 60 },
      { type: 'pop' },
      { type: 'pop' }
    ];
    updateData(sampleStack, sampleOperations);
  };

  // Calculate final state for preview
  const getFinalStackPreview = () => {
    let stack = [...initialStack];
    for (const op of operations) {
      if (op.type === 'push' && op.value !== undefined) {
        stack.push(op.value);
      } else if (op.type === 'pop' && stack.length > 0) {
        stack.pop();
      }
    }
    return stack;
  };

  return (
    <div className="space-y-4">
      {/* Initial Stack Setup */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Initial Stack (Bottom to Top)
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
            onClick={addToInitialStack}
            className="btn btn-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3">
          {initialStack.length === 0 ? (
            <div className="text-center text-gray-500 py-2">
              Empty stack
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {initialStack.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-700 rounded p-2"
                >
                  <span className="text-white">{value}</span>
                  <button
                    onClick={() => removeFromInitialStack(index)}
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
            placeholder="Value to push"
            min="1"
            max="99"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={addPushOperation}
            className="btn btn-sm flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <ArrowUp className="w-4 h-4" />
            Push
          </button>
          <button
            onClick={addPopOperation}
            className="btn btn-sm flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <ArrowDown className="w-4 h-4" />
            Pop
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
                    op.type === 'push' ? 'bg-green-600/20' : 'bg-red-600/20'
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
          Summary: {initialStack.length} initial items, {operations.length} operations
        </div>
        <div className="text-sm text-gray-400">
          Final stack: [{getFinalStackPreview().join(', ')}]
        </div>
      </div>
    </div>
  );
}