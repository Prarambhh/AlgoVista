"use client";

import React, { useEffect, useState } from "react";
import { Shuffle, Plus, Minus } from "lucide-react";

interface NumericInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function NumericInput({ data, onDataChange }: NumericInputProps) {
  const [inputValue, setInputValue] = useState("");

  // Extract the numeric value from the data array
  const currentValue = Array.isArray(data) && data.length > 0 
    ? (typeof data[0] === 'object' && data[0].n !== undefined ? data[0].n : data[0])
    : 5;

  // Keep local input text in sync with prop value (e.g., when restored from URL)
  useEffect(() => {
    const next = String(currentValue);
    setInputValue((prev) => (prev !== next ? next : prev));
  }, [currentValue]);

  const handleInputChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= 50) {
      // Preserve data structure - wrap in object if needed
      const newData = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object'
        ? [{ ...data[0], n: num }]
        : [num];
      onDataChange(newData);
      setInputValue(value);
    }
  };

  const increment = () => {
    const newValue = Math.min(currentValue + 1, 50);
    const newData = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object'
      ? [{ ...data[0], n: newValue }]
      : [newValue];
    onDataChange(newData);
    setInputValue(newValue.toString());
  };

  const decrement = () => {
    const newValue = Math.max(currentValue - 1, 0);
    const newData = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object'
      ? [{ ...data[0], n: newValue }]
      : [newValue];
    onDataChange(newData);
    setInputValue(newValue.toString());
  };

  const generateRandom = () => {
    const randomValue = Math.floor(Math.random() * 21) + 5; // Random between 5-25
    const newData = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object'
      ? [{ ...data[0], n: randomValue }]
      : [randomValue];
    onDataChange(newData);
    setInputValue(randomValue.toString());
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Number (0-50)
        </label>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={currentValue.toString()}
          min="0"
          max="50"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={generateRandom}
          className="btn btn-sm flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random
        </button>
        <button
          onClick={increment}
          className="btn btn-sm flex items-center gap-2"
          disabled={currentValue >= 50}
        >
          <Plus className="w-4 h-4" />
          +1
        </button>
        <button
          onClick={decrement}
          className="btn btn-sm flex items-center gap-2"
          disabled={currentValue <= 0}
        >
          <Minus className="w-4 h-4" />
          -1
        </button>
      </div>

      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-1">Current Value:</div>
        <div className="text-white font-mono text-lg">
          n = {currentValue}
        </div>
      </div>
    </div>
  );
}