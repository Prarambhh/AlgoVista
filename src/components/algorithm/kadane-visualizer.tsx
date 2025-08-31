"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";

interface KadaneVisualizerProps {
  step: VisualizationStep;
}

export default function KadaneVisualizerComponent({ step }: KadaneVisualizerProps) {
  const {
    array = [],
    currentIndex = 0,
    currentSum = 0,
    maxSum = 0,
    bestStart = 0,
    bestEnd = 0,
    tempStart = 0,
  } = step.data as {
    array: number[];
    currentIndex: number;
    currentSum: number;
    maxSum: number;
    bestStart: number;
    bestEnd: number;
    tempStart: number;
  };

  const isBest = (i: number) => i >= bestStart && i <= bestEnd;

  return (
    <div className="space-y-6">
      {/* Array Visualization */}
      <div className="space-y-3">
        <div className="text-sm text-gray-400">Array</div>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-700 rounded-lg bg-gray-900">
          {array.map((value, index) => (
            <div key={index} className="relative">
              <div
                className={`
                  w-12 h-12 rounded border-2 flex items-center justify-center font-semibold text-sm
                  transition-all duration-300 text-white
                  ${index === currentIndex
                    ? 'border-blue-500 bg-blue-900/40 text-blue-300 scale-110'
                    : isBest(index)
                    ? 'border-green-500 bg-green-900/40 text-green-300'
                    : 'border-gray-600 bg-gray-800'
                  }
                `}
              >
                {value}
              </div>
              {index === tempStart && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-purple-400">Start</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Current Sum</div>
          <div className="text-lg font-semibold text-white">{currentSum}</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Max Sum</div>
          <div className="text-lg font-semibold text-green-400">{maxSum}</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Best Range</div>
          <div className="text-lg font-semibold text-white">[{bestStart}, {bestEnd}]</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Index</div>
          <div className="text-lg font-semibold text-white">{currentIndex}</div>
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