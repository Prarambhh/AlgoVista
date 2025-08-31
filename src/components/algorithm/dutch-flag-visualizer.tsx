"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";

interface DutchFlagVisualizerProps {
  step: VisualizationStep;
}

export default function DutchFlagVisualizerComponent({ step }: DutchFlagVisualizerProps) {
  const {
    array = [],
    low = 0,
    mid = 0,
    high = 0,
    completed = false,
    swappedIndices = []
  } = step.data as {
    array: number[];
    low: number;
    mid: number;
    high: number;
    completed: boolean;
    swappedIndices: number[];
  };

  const getElementColor = (value: number, index: number, swappedIndices: number[]) => {
    const isSwapped = swappedIndices.includes(index);
    
    if (isSwapped) {
      return 'border-yellow-500 bg-yellow-900/40 text-yellow-300 scale-110';
    }
    
    if (value === 0) {
      return 'border-red-500 bg-red-900/40 text-red-300';
    } else if (value === 1) {
      return 'border-white bg-gray-800 text-white';
    } else {
      return 'border-blue-500 bg-blue-900/40 text-blue-300';
    }
  };

  const getPointerStyle = (position: number, type: 'low' | 'mid' | 'high') => {
    const colors = {
      low: 'text-red-400',
      mid: 'text-yellow-400',
      high: 'text-blue-400'
    };
    
    return `absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold ${colors[type]}`;
  };

  return (
    <div className="space-y-6">
      {/* Array with Pointers */}
      <div className="space-y-3">
        <div className="text-sm text-gray-400">Array</div>
        <div className="relative">
          <div className="flex flex-wrap gap-2 p-3 border border-gray-700 rounded-lg bg-gray-900">
            {array.map((value, index) => (
              <div key={index} className="relative">
                <div
                  className={`
                    w-12 h-12 rounded border-2 flex items-center justify-center font-semibold text-sm
                    transition-all duration-300
                    ${getElementColor(value, index, swappedIndices)}
                  `}
                >
                  {value}
                </div>
                
                {/* Pointers */}
                {index === low && (
                  <div className={getPointerStyle(index, 'low')}>
                    L
                  </div>
                )}
                {index === mid && (
                  <div className={getPointerStyle(index, 'mid')}>
                    M
                  </div>
                )}
                {index === high && (
                  <div className={getPointerStyle(index, 'high')}>
                    H
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pointer Legend */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Low Pointer</div>
          <div className="text-lg font-semibold text-red-400">{low}</div>
          <div className="text-xs text-gray-500">Next 0 position</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Mid Pointer</div>
          <div className="text-lg font-semibold text-yellow-400">{mid}</div>
          <div className="text-xs text-gray-500">Current element</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">High Pointer</div>
          <div className="text-lg font-semibold text-blue-400">{high}</div>
          <div className="text-xs text-gray-500">Next 2 position</div>
        </div>
      </div>

      {/* Regions */}
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Array Regions</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-red-900/20 border border-red-500/30 rounded text-center">
            <div className="text-red-300 font-semibold">0s Region</div>
            <div className="text-gray-400">[0, {low - 1}]</div>
          </div>
          <div className="p-2 bg-gray-800 border border-white/30 rounded text-center">
            <div className="text-white font-semibold">1s Region</div>
            <div className="text-gray-400">[{low}, {mid - 1}]</div>
          </div>
          <div className="p-2 bg-blue-900/20 border border-blue-500/30 rounded text-center">
            <div className="text-blue-300 font-semibold">2s Region</div>
            <div className="text-gray-400">[{high + 1}, {array.length - 1}]</div>
          </div>
        </div>
        <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-center text-xs">
          <div className="text-yellow-300 font-semibold">Unknown Region</div>
          <div className="text-gray-400">[{mid}, {high}]</div>
        </div>
      </div>

      {/* Status */}
      <div className="p-3 bg-gray-800 rounded">
        <div className="text-sm text-gray-400">Status</div>
        <div className={`text-lg font-semibold ${completed ? 'text-green-400' : 'text-white'}`}>
          {completed ? 'Sorting Complete!' : 'In Progress...'}
        </div>
      </div>

      {/* Explanation */}
      {step.description && (
        <div className="p-3 bg-gray-800 rounded-lg text-gray-300 text-sm">
          {step.description}
        </div>
      )}
    </div>
  );
}