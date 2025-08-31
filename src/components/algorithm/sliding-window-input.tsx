"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, Shuffle, Edit, Maximize2 } from "lucide-react";

interface SlidingWindowData {
  array: number[];
  windowSize: number;
}

interface SlidingWindowInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function SlidingWindowInput({ data, onDataChange }: SlidingWindowInputProps) {
  const [newValue, setNewValue] = useState("5");
  const [windowSizeValue, setWindowSizeValue] = useState("3");

  // Extract data from the data structure
  const slidingWindowData: SlidingWindowData = Array.isArray(data) && data.length > 0 
    ? data[0] as SlidingWindowData
    : { array: [2, 1, 5, 1, 3, 2], windowSize: 3 };

  const { array, windowSize } = slidingWindowData;

  // Keep local input state in sync with props (e.g., when restored from URL)
  useEffect(() => {
    setWindowSizeValue(String(windowSize));
  }, [windowSize]);

  const updateData = (newArray: number[], newWindowSize: number) => {
    onDataChange([{ array: newArray, windowSize: newWindowSize }]);
  };

  const addElement = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      updateData([...array, value], windowSize);
      setNewValue((value + 1).toString());
    }
  };

  const removeElement = (index: number) => {
    const newArray = array.filter((_, i) => i !== index);
    updateData(newArray, windowSize);
  };

  const updateElement = (index: number, value: number) => {
    if (!isNaN(value)) {
      const newArray = [...array];
      newArray[index] = value;
      updateData(newArray, windowSize);
    }
  };

  const updateWindowSize = () => {
    const value = parseInt(windowSizeValue);
    if (!isNaN(value) && value > 0 && value <= array.length) {
      updateData(array, value);
    }
  };

  const generateRandomArray = () => {
    const length = 8 + Math.floor(Math.random() * 5); // 8-12 elements
    const newArray = Array.from({ length }, () => 
      Math.floor(Math.random() * 20) + 1 // Range: 1 to 20
    );
    const newWindowSize = Math.min(3 + Math.floor(Math.random() * 3), length); // 3-5 or array length
    updateData(newArray, newWindowSize);
    setWindowSizeValue(newWindowSize.toString());
  };

  const loadSampleArray = () => {
    const sampleArray = [2, 1, 5, 1, 3, 2];
    const sampleWindowSize = 3;
    updateData(sampleArray, sampleWindowSize);
    setWindowSizeValue(sampleWindowSize.toString());
  };

  const loadLargeWindowExample = () => {
    const largeArray = [1, 4, 2, 9, 8, 3, 5, 7];
    const largeWindow = 5;
    updateData(largeArray, largeWindow);
    setWindowSizeValue(largeWindow.toString());
  };

  const loadSingleElementWindow = () => {
    const singleArray = [3, 1, 8, 2, 9, 4, 6];
    const singleWindow = 1;
    updateData(singleArray, singleWindow);
    setWindowSizeValue(singleWindow.toString());
  };

  // Calculate maximum window sum for preview
  const getMaxWindowSum = () => {
    if (array.length === 0 || windowSize <= 0 || windowSize > array.length) {
      return { maxSum: 0, startIndex: 0 };
    }

    let maxSum = 0;
    let currentSum = 0;
    let maxIndex = 0;

    // Calculate sum of first window
    for (let i = 0; i < windowSize; i++) {
      currentSum += array[i];
    }
    maxSum = currentSum;

    // Slide the window
    for (let i = windowSize; i < array.length; i++) {
      currentSum = currentSum - array[i - windowSize] + array[i];
      if (currentSum > maxSum) {
        maxSum = currentSum;
        maxIndex = i - windowSize + 1;
      }
    }

    return { maxSum, startIndex: maxIndex };
  };

  const { maxSum, startIndex } = getMaxWindowSum();

  return (
    <div className="space-y-4">
      {/* Window Size Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Window Size
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={windowSizeValue}
            onChange={(e) => setWindowSizeValue(e.target.value)}
            placeholder="Window Size"
            min="1"
            max={array.length}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={updateWindowSize}
            className="btn btn-sm flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Maximize2 className="w-4 h-4" />
            Set Size
          </button>
        </div>
        <div className="mt-2 p-2 bg-gray-800 rounded text-center">
          <span className="text-purple-400 font-semibold text-lg">Window Size: {windowSize}</span>
        </div>
      </div>

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
          onClick={loadLargeWindowExample}
          className="btn btn-sm flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Large Window
        </button>
        <button
          onClick={loadSingleElementWindow}
          className="btn btn-sm flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          Size 1
        </button>
      </div>

      {/* Preview */}
      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">
          Array: [{array.join(', ')}]
        </div>
        <div className="text-sm text-gray-400">
          Window Size: <span className="text-purple-400 font-semibold">{windowSize}</span>
          {array.length >= windowSize && windowSize > 0 ? (
            <span className="text-green-400 ml-2">
              ✓ Max Sum: {maxSum} (starting at index {startIndex})
            </span>
          ) : (
            <span className="text-red-400 ml-2">
              ✗ Window size must be ≤ array length ({array.length})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}