"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface LinkedListDeleteOperation {
  type: 'delete';
  position: number;
}

interface LinkedListDeleteData {
  initialList: number[];
  operations: LinkedListDeleteOperation[];
}

interface LinkedListDeleteInputProps {
  onDataChange: (data: LinkedListDeleteData[]) => void;
  initialData?: LinkedListDeleteData[];
}

export default function LinkedListDeleteInput({ onDataChange, initialData }: LinkedListDeleteInputProps) {
  const [initialList, setInitialList] = useState<string>(
    initialData?.[0]?.initialList?.join(', ') || '1, 2, 3, 4, 5'
  );
  const [operations, setOperations] = useState<LinkedListDeleteOperation[]>(
    initialData?.[0]?.operations || [
      { type: 'delete', position: 2 }
    ]
  );

  const handleInitialListChange = (value: string) => {
    setInitialList(value);
    updateData(value, operations);
  };

  const handleOperationChange = (index: number, value: string) => {
    const newOperations = [...operations];
    const numValue = parseInt(value) || 0;
    newOperations[index] = {
      ...newOperations[index],
      position: numValue
    };
    setOperations(newOperations);
    updateData(initialList, newOperations);
  };

  const addOperation = () => {
    const newOperations = [...operations, { type: 'delete' as const, position: 0 }];
    setOperations(newOperations);
    updateData(initialList, newOperations);
  };

  const removeOperation = (index: number) => {
    const newOperations = operations.filter((_, i) => i !== index);
    setOperations(newOperations);
    updateData(initialList, newOperations);
  };

  const updateData = (listStr: string, ops: LinkedListDeleteOperation[]) => {
    try {
      const parsedList = listStr
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));
      
      const data: LinkedListDeleteData = {
        initialList: parsedList,
        operations: ops
      };
      
      onDataChange([data]);
    } catch (error) {
      console.error('Error parsing input:', error);
    }
  };

  const generateRandomData = () => {
    const randomList = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, 
      () => Math.floor(Math.random() * 20) + 1
    );
    const randomOps: LinkedListDeleteOperation[] = [
      {
        type: 'delete',
        position: Math.floor(Math.random() * randomList.length)
      }
    ];
    
    const newListStr = randomList.join(', ');
    setInitialList(newListStr);
    setOperations(randomOps);
    updateData(newListStr, randomOps);
  };

  const getCurrentListLength = () => {
    try {
      return initialList
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n)).length;
    } catch {
      return 0;
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gray-800 rounded-lg">
      <div className="space-y-2">
        <label htmlFor="initial-list" className="block text-sm font-medium text-gray-300">
          Initial Linked List (comma-separated values)
        </label>
        <input
          id="initial-list"
          type="text"
          value={initialList}
          onChange={(e) => handleInitialListChange(e.target.value)}
          placeholder="e.g., 1, 2, 3, 4, 5"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <div className="text-xs text-gray-400">
          Current list length: {getCurrentListLength()}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Delete Operations
          </label>
          <button
            onClick={addOperation}
            className="btn btn-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Operation
          </button>
        </div>

        {operations.map((operation, index) => (
          <div key={index} className="grid grid-cols-2 gap-3 p-3 bg-gray-700 rounded border border-gray-600">
            <div className="space-y-1">
              <label className="block text-xs text-gray-300">Position to Delete</label>
              <input
                type="number"
                value={operation.position}
                onChange={(e) => handleOperationChange(index, e.target.value)}
                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Position"
                min="0"
                max={Math.max(0, getCurrentListLength() - 1)}
              />
              <div className="text-xs text-gray-400">
                Valid range: 0 to {Math.max(0, getCurrentListLength() - 1)}
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => removeOperation(index)}
                className="btn btn-sm bg-red-900/20 border border-red-600 text-red-400 hover:bg-red-900/40 w-full flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={generateRandomData}
          className="btn btn-sm flex items-center gap-2"
        >
          Generate Random Data
        </button>
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <p><strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Position 0 deletes the head node</li>
          <li>Position must be within list bounds (0 to length-1)</li>
          <li>Invalid positions will show error messages</li>
          <li>Use comma-separated values for the initial list</li>
          <li>Operations are performed sequentially, so list length changes after each deletion</li>
        </ul>
      </div>
    </div>
  );
}