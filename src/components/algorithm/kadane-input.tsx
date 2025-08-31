"use client";

import React, { useState } from "react";
import { Plus, Minus, Shuffle, Edit } from "lucide-react";

interface KadaneData {
  array: number[];
}

interface KadaneInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function KadaneInput({ data, onDataChange }: KadaneInputProps) {
  const [newValue, setNewValue] = useState("5");

  // Extract array data from the data structure
  const kadaneData: KadaneData = Array.isArray(data) && data.length > 0 
    ? data[0] as KadaneData
    : { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4] };

  const { array } = kadaneData;

  const updateData = (newArray: number[]) => {
    onDataChange([{ array: newArray }]);
  };

  const addElement = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      updateData([...array, value]);
      setNewValue((value + 1).toString());
    }
  };

  const removeElement = (index: number) => {
    const newArray = array.filter((_, i) => i !== index);
    updateData(newArray);
  };

  const updateElement = (index: number, value: number) => {
    if (!isNaN(value)) {
      const newArray = [...array];
      newArray[index] = value;
      updateData(newArray);
    }
  };

  const generateRandomArray = () => {
    const length = 8 + Math.floor(Math.random() * 5); // 8-12 elements
    const newArray = Array.from({ length }, () => 
      Math.floor(Math.random() * 21) - 10 // Range: -10 to 10
    );
    updateData(newArray);
  };

  const loadSampleArray = () => {
    // Classic example with known maximum subarray
    const sampleArray = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    updateData(sampleArray);
  };

  const loadMixedExample = () => {
    // Example with all negatives and mixed values
    const mixedArray = [-1, -2, 3, -1, 2, -4, 1, -3];
    updateData(mixedArray);
  };

  const loadAllNegativeExample = () => {
    // Example with all negative numbers
    const negativeArray = [-5, -2, -8, -1, -4];
    updateData(negativeArray);
  };

  // Calculate maximum subarray for preview
  const getMaxSubarrayInfo = () => {
    if (array.length === 0) return { sum: 0, start: 0, end: 0 };
    
    let maxSum = array[0];
    let currentSum = array[0];
    let start = 0;
    let end = 0;
    let tempStart = 0;

    for (let i = 1; i < array.length; i++) {
      if (currentSum < 0) {
        currentSum = array[i];
        tempStart = i;
      } else {
        currentSum += array[i];
      }

      if (currentSum > maxSum) {
        maxSum = currentSum;
        start = tempStart;
        end = i;
      }
    }

    return { sum: maxSum, start, end };
  };

  const { sum: maxSum, start: maxStart, end: maxEnd } = getMaxSubarrayInfo();

  return (
    <div className="space-y-4">
      {/* Array Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Array Elements
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            min="-100"
            max="100"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={addElement}
            className="btn btn-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3">
          {array.length === 0 ? (
            <div className="text-center text-gray-500 py-2">
              Empty array
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {array.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-700 rounded p-2"
                >
                  <span className="text-xs text-gray-400">{index}:</span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateElement(index, parseInt(e.target.value))}
                    className="w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    min="-100"
                    max="100"
                  />
                  <button
                    onClick={() => removeElement(index)}
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

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={generateRandomArray}
          className="btn btn-sm flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random
        </button>
        <button
          onClick={loadSampleArray}
          className="btn btn-sm flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Classic
        </button>
        <button
          onClick={loadMixedExample}
          className="btn btn-sm flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Mixed
        </button>
        <button
          onClick={loadAllNegativeExample}
          className="btn btn-sm flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          All Negative
        </button>
      </div>

      {/* Preview */}
      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">
          Array: [{array.join(', ')}]
        </div>
        {array.length > 0 && (
          <div className="text-sm text-gray-400">
            Maximum Subarray Sum: <span className="text-green-400 font-semibold">{maxSum}</span>
            {maxStart !== undefined && maxEnd !== undefined && (
              <span> (indices {maxStart} to {maxEnd})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}