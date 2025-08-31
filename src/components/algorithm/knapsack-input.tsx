"use client";

import React, { useEffect, useState } from "react";
import { Shuffle, Plus, Minus, Edit } from "lucide-react";

interface KnapsackItem {
  weight: number;
  value: number;
  name: string;
}

interface KnapsackData {
  items: KnapsackItem[];
  capacity: number;
}

interface KnapsackInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function KnapsackInput({ data, onDataChange }: KnapsackInputProps) {
  const [newWeight, setNewWeight] = useState("1");
  const [newValue, setNewValue] = useState("1");
  const [newCapacity, setNewCapacity] = useState("");

  // Extract knapsack data from the array structure
  const knapsackData: KnapsackData = Array.isArray(data) && data.length > 0 
    ? data[0] as KnapsackData
    : { items: [], capacity: 10 };

  const { items, capacity } = knapsackData;

  // Sync capacity input with prop capacity for URL-restore safety
  useEffect(() => {
    const capStr = capacity != null ? String(capacity) : "";
    setNewCapacity((prev) => (prev !== capStr ? capStr : prev));
  }, [capacity]);

  const updateData = (newItems: KnapsackItem[], newCapacityVal: number) => {
    onDataChange([{ items: newItems, capacity: newCapacityVal }]);
  };

  const addItem = () => {
    const weight = parseInt(newWeight);
    const value = parseInt(newValue);
    
    if (!isNaN(weight) && !isNaN(value) && weight > 0 && value > 0) {
      const newItem: KnapsackItem = {
        weight,
        value,
        name: `Item ${items.length + 1}`
      };
      updateData([...items, newItem], capacity);
      setNewWeight("1");
      setNewValue("1");
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateData(newItems, capacity);
  };

  const updateCapacity = (newCap: string) => {
    const cap = parseInt(newCap);
    if (!isNaN(cap) && cap > 0) {
      updateData(items, cap);
    }
  };

  const generateRandomItems = () => {
    const itemCount = 5 + Math.floor(Math.random() * 3); // 5-7 items
    const newItems: KnapsackItem[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      newItems.push({
        weight: Math.floor(Math.random() * 8) + 1, // 1-8
        value: Math.floor(Math.random() * 15) + 1, // 1-15
        name: `Item ${i + 1}`
      });
    }
    
    const newCapacityVal = Math.floor(Math.random() * 10) + 15; // 15-24
    updateData(newItems, newCapacityVal);
  };

  const loadSampleData = () => {
    const sampleItems: KnapsackItem[] = [
      { weight: 2, value: 3, name: "Item 1" },
      { weight: 3, value: 4, name: "Item 2" },
      { weight: 4, value: 5, name: "Item 3" },
      { weight: 5, value: 6, name: "Item 4" },
      { weight: 1, value: 2, name: "Item 5" }
    ];
    updateData(sampleItems, 8);
  };

  return (
    <div className="space-y-4">
      {/* Capacity Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Knapsack Capacity
        </label>
        <input
          type="number"
          value={newCapacity}
          onChange={(e) => {
            setNewCapacity(e.target.value);
            updateCapacity(e.target.value);
          }}
          placeholder={capacity.toString()}
          min="1"
          max="50"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Add New Item */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Add New Item
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Weight"
            min="1"
            max="20"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            min="1"
            max="50"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={addItem}
            className="btn btn-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={generateRandomItems}
          className="btn btn-sm flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random
        </button>
        <button
          onClick={loadSampleData}
          className="btn btn-sm flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Sample
        </button>
      </div>

      {/* Current Items */}
      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">
          Current Setup: Capacity = {capacity}, Items = {items.length}
        </div>
        
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-2">
            No items added yet
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 rounded p-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-gray-300 text-sm">
                    W: {item.weight}, V: {item.value}
                  </span>
                  <span className="text-gray-400 text-xs">
                    (Ratio: {(item.value / item.weight).toFixed(2)})
                  </span>
                </div>
                <button
                  onClick={() => removeItem(index)}
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
  );
}