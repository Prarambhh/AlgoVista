"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";
import { ArrowLeftRight } from "lucide-react";

interface TwoPointersVisualizerProps {
  step: VisualizationStep;
}

export default function TwoPointersVisualizerComponent({ step }: TwoPointersVisualizerProps) {
  const {
    array = [],
    left = 0,
    right = 0,
    target = 0,
    sum = 0,
    found = false,
  } = step.data as {
    array: number[];
    left: number;
    right: number;
    target: number;
    sum: number;
    found: boolean;
  };

  return (
    <div className="space-y-6">
      {/* Array with Pointers */}
      <div className="space-y-3">
        <div className="text-sm text-gray-400">Sorted Array</div>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-700 rounded-lg bg-gray-900">
          {array.map((value, index) => (
            <div key={index} className="relative">
              <div
                className={`
                  w-12 h-12 rounded border-2 flex items-center justify-center font-semibold text-sm
                  transition-all duration-300 text-white
                  ${index === left
                    ? 'border-blue-500 bg-blue-900/40 text-blue-300 scale-110'
                    : index === right
                    ? 'border-purple-500 bg-purple-900/40 text-purple-300 scale-110'
                    : 'border-gray-600 bg-gray-800'
                  }
                `}
              >
                {value}
              </div>
              {index === left && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-blue-400">Left</div>
              )}
              {index === right && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-purple-400">Right</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Target</div>
          <div className="text-lg font-semibold text-orange-400">{target}</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Current Sum</div>
          <div className={`text-lg font-semibold ${sum === target ? 'text-green-400' : sum < target ? 'text-blue-400' : 'text-red-400'}`}>{sum}</div>
        </div>
      </div>

      {/* Explanation */}
      {step.description && (
        <div className="p-3 bg-gray-800 rounded-lg text-gray-300 text-sm">
          {step.description}
        </div>
      )}

      {/* Result */}
      {found && (
        <div className="p-3 bg-green-900/30 border border-green-700 rounded text-green-300 text-sm flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4" />
          Found a pair that sums to target: {array[left]} + {array[right]} = {target}
        </div>
      )}
    </div>
  );
}