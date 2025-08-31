"use client";

import React, { useState } from "react";
import { Edit, Trash2, Plus, Shuffle, Play } from "lucide-react";

interface DutchFlagInputProps {
  onDataChange: (data: { array: number[] }) => void;
  onVisualize: () => void;
}

export default function DutchFlagInput({ onDataChange, onVisualize }: DutchFlagInputProps) {
  const [array, setArray] = useState<number[]>([2, 0, 1, 2, 1, 0, 1]);
  const [newValue, setNewValue] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [editValue, setEditValue] = useState<string>("");

  const updateData = (newArray: number[]) => {
    setArray(newArray);
    onDataChange({ array: newArray });
  };

  const addElement = () => {
    const val = parseInt(newValue);
    if (isNaN(val) || val < 0 || val > 2) {
      alert("Please enter a valid number (0, 1, or 2)");
      return;
    }
    updateData([...array, val]);
    setNewValue("");
  };

  const removeElement = (index: number) => {
    updateData(array.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(array[index].toString());
  };

  const saveEdit = () => {
    const val = parseInt(editValue);
    if (isNaN(val) || val < 0 || val > 2) {
      alert("Please enter a valid number (0, 1, or 2)");
      return;
    }
    const newArray = [...array];
    newArray[editIndex] = val;
    updateData(newArray);
    setEditIndex(-1);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditIndex(-1);
    setEditValue("");
  };

  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 8) + 5;
    const newArray = Array.from({ length }, () => Math.floor(Math.random() * 3));
    updateData(newArray);
  };

  const loadSample = (sample: number[]) => {
    updateData(sample);
  };

  const sampleArrays = [
    { name: "Basic", array: [2, 0, 1, 2, 1, 0, 1] },
    { name: "Already Sorted", array: [0, 0, 1, 1, 2, 2] },
    { name: "Reverse Sorted", array: [2, 2, 1, 1, 0, 0] },
    { name: "Single Color", array: [1, 1, 1, 1, 1] },
    { name: "Mixed Heavy", array: [2, 0, 2, 1, 0, 2, 1, 0, 1, 2] }
  ];

  // Initialize data on mount
  React.useEffect(() => {
    onDataChange({ array });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Array Configuration</h3>
        <p className="text-gray-400 text-sm">
          Configure an array with values 0, 1, and 2 to sort using Dutch National Flag algorithm.
        </p>
      </div>

      {/* Array Display */}
      <div className="space-y-3">
        <div className="text-sm text-gray-400">Current Array:</div>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-700 rounded-lg bg-gray-900">
          {array.length === 0 ? (
            <div className="text-gray-500 text-sm">Array is empty</div>
          ) : (
            array.map((value, index) => (
              <div key={index} className="relative">
                {editIndex === index ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="2"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-12 h-8 text-center text-xs bg-gray-800 border border-blue-500 rounded text-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="p-1 text-green-400 hover:text-green-300"
                      title="Save"
                    >
                      ✓
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Cancel"
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <div
                    className={`
                      w-12 h-12 rounded border-2 flex items-center justify-center font-semibold text-sm
                      transition-all duration-200 group cursor-pointer
                      ${value === 0 
                        ? 'border-red-500 bg-red-900/40 text-red-300'
                        : value === 1
                        ? 'border-white bg-gray-800 text-white'
                        : 'border-blue-500 bg-blue-900/40 text-blue-300'
                      }
                    `}
                    onClick={() => startEdit(index)}
                    title="Click to edit"
                  >
                    {value}
                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(index);
                        }}
                        className="p-1 bg-blue-500 rounded text-white text-xs"
                        title="Edit"
                      >
                        <Edit size={8} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeElement(index);
                        }}
                        className="p-1 bg-red-500 rounded text-white text-xs ml-1"
                        title="Remove"
                      >
                        <Trash2 size={8} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Element */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Add Element (0, 1, or 2):</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            max="2"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter 0, 1, or 2"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") addElement();
            }}
          />
          <button
            onClick={addElement}
            disabled={!newValue}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Quick Actions:</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={generateRandomArray}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2 text-sm"
          >
            <Shuffle size={14} />
            Random
          </button>
          <button
            onClick={() => updateData([])}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Sample Arrays */}
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Sample Arrays:</div>
        <div className="grid grid-cols-1 gap-2">
          {sampleArrays.map((sample, index) => (
            <button
              key={index}
              onClick={() => loadSample(sample.array)}
              className="p-2 bg-gray-800 border border-gray-700 rounded hover:border-gray-600 text-left"
            >
              <div className="text-sm text-white font-medium">{sample.name}</div>
              <div className="text-xs text-gray-400">[{sample.array.join(', ')}]</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Legend */}
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Color Legend:</div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-red-500 bg-red-900/40 rounded"></div>
            <span className="text-red-300">0 (Red)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white bg-gray-800 rounded"></div>
            <span className="text-white">1 (White)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 bg-blue-900/40 rounded"></div>
            <span className="text-blue-300">2 (Blue)</span>
          </div>
        </div>
      </div>

      {/* Visualize Button */}
      <button
        onClick={onVisualize}
        disabled={array.length === 0}
        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
      >
        <Play size={16} />
        Visualize Dutch National Flag
      </button>
    </div>
  );
}