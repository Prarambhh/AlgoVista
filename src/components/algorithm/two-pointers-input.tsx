"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, Shuffle, Edit, ArrowRight, RefreshCcw } from "lucide-react";

interface TwoPointersData {
  array: number[];
  target: number;
}

interface TwoPointersInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function TwoPointersInput({ data, onDataChange }: TwoPointersInputProps) {
  const [newValue, setNewValue] = useState("5");
  const [targetValue, setTargetValue] = useState("10");

  // Extract data from the data structure
  const twoPointersData: TwoPointersData = Array.isArray(data) && data.length > 0
    ? data[0] as TwoPointersData
    : { array: [2, 7, 11, 15], target: 9 };

  const { array, target } = twoPointersData;

  // Keep local input state in sync with props (e.g., when restored from URL)
  useEffect(() => {
    setTargetValue(String(target));
  }, [target]);

  const updateData = (newArray: number[], newTarget: number) => {
    onDataChange([{ array: newArray, target: newTarget }]);
  };

  const addElement = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      updateData([...array, value], target);
      setNewValue((value + 1).toString());
    }
  };

  const removeElement = (index: number) => {
    const newArray = array.filter((_, i) => i !== index);
    updateData(newArray, target);
  };

  const updateElement = (index: number, value: number) => {
    if (!isNaN(value)) {
      const newArray = [...array];
      newArray[index] = value;
      updateData(newArray, target);
    }
  };

  const updateTarget = () => {
    const value = parseInt(targetValue);
    if (!isNaN(value)) {
      updateData(array, value);
    }
  };

  const generateRandomArray = () => {
    const length = 6 + Math.floor(Math.random() * 5); // 6-10 elements
    const newArray = Array.from({ length }, () => 
      Math.floor(Math.random() * 20) + 1 // Range: 1 to 20
    ).sort((a, b) => a - b);
    const newTarget = Math.floor(Math.random() * 30) + 5; // 5 to 35
    updateData(newArray, newTarget);
    setTargetValue(newTarget.toString());
  };

  const loadSampleArray = () => {
    const sampleArray = [2, 7, 11, 15];
    const sampleTarget = 9;
    updateData(sampleArray, sampleTarget);
    setTargetValue(sampleTarget.toString());
  };

  // Calculate two-sum solution using two pointers for preview
  const getTwoSumPreview = () => {
    let left = 0;
    let right = array.length - 1;

    while (left < right) {
      const sum = array[left] + array[right];
      if (sum === target) {
        return { found: true, pair: [array[left], array[right]] };
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }

    return { found: false, pair: [] as number[] };
  };

  const { found, pair } = getTwoSumPreview();

  return (
    <div className="space-y-4">
      {/* Target Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Sum
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="Target"
            min="1"
            max="200"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={updateTarget}
            className="btn btn-sm flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <ArrowRight className="w-4 h-4" />
            Set Target
          </button>
        </div>
        <div className="mt-2 p-2 bg-gray-800 rounded text-center">
          <span className="text-purple-400 font-semibold text-lg">Target: {target}</span>
        </div>
      </div>

      {/* Array Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Sorted Array Elements (ascending)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            min="1"
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
                    min="1"
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
          Sample
        </button>
        <button
          onClick={() => updateData([], 0)}
          className="btn btn-sm flex items-center gap-2 bg-gray-700 hover:bg-gray-600"
        >
          <RefreshCcw className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Preview */}
      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">
          Sorted Array: [{array.join(', ')}]
        </div>
        <div className="text-sm text-gray-400">
          Target: <span className="text-purple-400 font-semibold">{target}</span>
          {found ? (
            <span className="text-green-400 ml-2">
              ✓ Found pair: {pair[0]} + {pair[1]} = {target}
            </span>
          ) : (
            <span className="text-red-400 ml-2">
              ✗ No pair sums to target
            </span>
          )}
        </div>
      </div>
    </div>
  );
}