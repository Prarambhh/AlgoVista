"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";

interface KnapsackItem {
  weight: number;
  value: number;
  name: string;
}

interface KnapsackVisualizerProps {
  data?: any[];
  step: VisualizationStep;
  onDataChange?: (data: any[]) => void;
}

export default function KnapsackVisualizerComponent({ data, step }: KnapsackVisualizerProps) {
  // Extract knapsack data
  const knapsackData = Array.isArray(data) && data.length > 0 
    ? data[0] as { items: KnapsackItem[]; capacity: number }
    : { items: [], capacity: 10 };

  const { items, capacity } = knapsackData;

  // Extract step data with explicit typing to avoid implicit any
  type KnapsackStepData = {
    dp?: number[][];
    currentItem?: number;
    currentWeight?: number;
    solution?: number[];
    maxValue?: number;
  };
  const stepData = (step.data || {}) as KnapsackStepData;
  const dp: number[][] = stepData.dp || [];
  const currentItem: number = stepData.currentItem || 0;
  const currentWeight: number = stepData.currentWeight || 0;
  const solution: number[] = stepData.solution || [];
  const maxValue: number = stepData.maxValue || 0;

  // Render items table
  const renderItems = () => {
    if (items.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">
          No items to display
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-2 text-gray-300">Item</th>
              <th className="text-center p-2 text-gray-300">Weight</th>
              <th className="text-center p-2 text-gray-300">Value</th>
              <th className="text-center p-2 text-gray-300">Ratio</th>
              <th className="text-center p-2 text-gray-300">Selected</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const isActive = index === currentItem - 1;
              const isSelected = solution.includes(index);
              
              return (
                <tr
                  key={index}
                  className={`
                    border-b border-gray-700 transition-all duration-300
                    ${isActive 
                      ? 'bg-yellow-400/20 border-yellow-400' 
                      : isSelected 
                        ? 'bg-green-400/20' 
                        : ''
                    }
                  `}
                >
                  <td className="p-2 text-white">{item.name}</td>
                  <td className="p-2 text-center text-gray-300">{item.weight}</td>
                  <td className="p-2 text-center text-gray-300">{item.value}</td>
                  <td className="p-2 text-center text-gray-400 text-sm">
                    {(item.value / item.weight).toFixed(2)}
                  </td>
                  <td className="p-2 text-center">
                    {isSelected && (
                      <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Render DP table
  const renderDPTable = () => {
    if (!dp || dp.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">
          DP table will appear here
        </div>
      );
    }

    const rows = dp.length;
    const cols = dp[0] ? dp[0].length : 0;

    return (
      <div className="overflow-x-auto">
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-gray-600 p-1 bg-gray-800 text-gray-300 min-w-[40px]">
                Item\\Cap
              </th>
              {Array.from({ length: cols }, (_, w: number) => (
                <th
                  key={w}
                  className={`
                    border border-gray-600 p-1 bg-gray-800 text-gray-300 min-w-[40px]
                    ${w === currentWeight ? 'bg-yellow-400/30' : ''}
                  `}
                >
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row: number[], i: number) => (
              <tr key={i}>
                <td
                  className={`
                    border border-gray-600 p-1 bg-gray-800 text-gray-300 text-center font-medium
                    ${i === currentItem ? 'bg-yellow-400/30' : ''}
                  `}
                >
                  {i}
                </td>
                {row.map((cell: number, w: number) => {
                  const isActive = i === currentItem && w === currentWeight;
                  const isComputed = cell !== undefined && cell !== null;
                  
                  return (
                    <td
                      key={w}
                      className={`
                        border border-gray-600 p-1 text-center transition-all duration-300 min-w-[40px]
                        ${isActive 
                          ? 'bg-yellow-400/40 text-white font-bold' 
                          : isComputed 
                            ? 'bg-blue-400/20 text-white' 
                            : 'bg-gray-800 text-gray-500'
                        }
                      `}
                    >
                      {isComputed ? cell : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Problem Summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-sm text-gray-400">Capacity</div>
          <div className="text-xl font-bold text-blue-400">{capacity}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-sm text-gray-400">Items</div>
          <div className="text-xl font-bold text-white">{items.length}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-sm text-gray-400">Max Value</div>
          <div className="text-xl font-bold text-green-400">{maxValue}</div>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Items</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          {renderItems()}
        </div>
      </div>

      {/* DP Table */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          Dynamic Programming Table
        </h4>
        <div className="bg-gray-900 rounded-lg p-4">
          {renderDPTable()}
        </div>
      </div>

      {/* Current Solution */}
      {solution.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            Optimal Solution
          </h4>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="text-white">
                Selected items: {solution.map((i: number) => items[i]?.name).join(", ")}
              </div>
              <div className="text-gray-400 text-sm">
                Total weight: {solution.reduce((sum: number, i: number) => sum + (items[i]?.weight || 0), 0)} / {capacity}
              </div>
              <div className="text-gray-400 text-sm">
                Total value: {solution.reduce((sum: number, i: number) => sum + (items[i]?.value || 0), 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Step Info */}
      {step.description && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="text-blue-300 text-sm">{step.description}</div>
        </div>
      )}
    </div>
  );
}