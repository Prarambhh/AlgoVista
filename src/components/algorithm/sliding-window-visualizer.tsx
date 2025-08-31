"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";

interface SlidingWindowVisualizerProps {
  step: VisualizationStep;
}

export default function SlidingWindowVisualizerComponent({ step }: SlidingWindowVisualizerProps) {
  const {
    array = [],
    windowSize = 0,
    windowStart = 0,
    windowEnd = 0,
    currentSum = 0,
    maxSum = 0,
    bestStart = 0,
  } = step.data as {
    array: number[];
    windowSize: number;
    windowStart: number;
    windowEnd: number;
    currentSum: number;
    maxSum: number;
    bestStart: number;
  };

  return (
    <div className="space-y-6">
      {/* Array with Window */}
      <div className="space-y-3">
        <div className="text-sm text-gray-400">Array</div>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-700 rounded-lg bg-gray-900">
          {array.map((value, index) => {
            const inWindow = index >= windowStart && index <= windowEnd;
            const inBest = index >= bestStart && index < bestStart + windowSize;
            return (
              <div
                key={index}
                className={`
                  w-12 h-12 rounded border-2 flex items-center justify-center font-semibold text-sm
                  transition-all duration-300 text-white
                  ${inWindow
                    ? 'border-blue-500 bg-blue-900/40 text-blue-300 scale-110'
                    : inBest
                    ? 'border-green-500 bg-green-900/40 text-green-300'
                    : 'border-gray-600 bg-gray-800'
                  }
                `}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Window Size</div>
          <div className="text-lg font-semibold text-purple-400">{windowSize}</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Current Sum</div>
          <div className="text-lg font-semibold text-white">{currentSum}</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Max Sum</div>
          <div className="text-lg font-semibold text-green-400">{maxSum}</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Window Range</div>
          <div className="text-lg font-semibold text-white">[{windowStart}, {windowEnd}]</div>
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