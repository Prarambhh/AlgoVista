"use client";

import React, { useEffect, useRef, useState } from "react";
import { Shuffle, Plus, Minus } from "lucide-react";

interface ArrayInputProps {
  data: number[];
  onDataChange: (data: number[]) => void;
}

export default function ArrayInput({ data, onDataChange }: ArrayInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync local text field with prop data so restored URL state reflects in the UI
  // but avoid clobbering the user's in-progress typing while the input is focused.
  useEffect(() => {
    const derived = Array.isArray(data) ? data.join(", ") : "";
    const isFocused = typeof document !== "undefined" && inputRef.current === document.activeElement;
    if (!isFocused && inputValue !== derived) {
      setInputValue(derived);
    }
  }, [data]);

  const generateRandomArray = (size: number = 8) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
    onDataChange(newArray);
  };

  const handleInputChange = (value: string) => {
    try {
      const numbers = value
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "")
        .map(s => parseInt(s))
        .filter(n => !isNaN(n));

      // Always reflect the parsed numbers in parent state, including when cleared.
      if (value.trim() === "") {
        onDataChange([]);
      } else {
        onDataChange(numbers);
      }
    } catch (error) {
      console.error("Invalid input");
    }
  };

  const addElement = () => {
    const newValue = Math.floor(Math.random() * 50) + 1;
    onDataChange([...data, newValue]);
  };

  const removeElement = () => {
    if (data.length > 1) {
      onDataChange(data.slice(0, -1));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Custom Array (comma-separated)
        </label>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            setInputValue(val);
            handleInputChange(val);
          }}
          placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => generateRandomArray(6)}
          className="btn btn-sm flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random (6)
        </button>
        <button
          onClick={() => generateRandomArray(10)}
          className="btn btn-sm flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random (10)
        </button>
        <button
          onClick={() => generateRandomArray(15)}
          className="btn btn-sm flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random (15)
        </button>
        <button
          onClick={addElement}
          className="btn btn-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
        <button
          onClick={removeElement}
          className="btn btn-sm flex items-center gap-2"
          disabled={data.length <= 1}
        >
          <Minus className="w-4 h-4" />
          Remove
        </button>
      </div>

      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-1">Current Array:</div>
        <div className="text-white font-mono">
          [{data.join(", ")}]
        </div>
      </div>
    </div>
  );
}