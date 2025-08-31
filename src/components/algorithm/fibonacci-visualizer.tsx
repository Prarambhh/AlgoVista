"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";

interface FibonacciVisualizerProps {
  data?: any[];
  step: VisualizationStep;
  onDataChange?: (data: any[]) => void;
}

export default function FibonacciVisualizerComponent({ data, step }: FibonacciVisualizerProps) {
  // Extract n from data
  const n = Array.isArray(data) && data.length > 0 
    ? (typeof data[0] === 'object' && data[0].n !== undefined ? data[0].n : data[0])
    : 5;

  // Extract step data
  const stepData = (step.data ?? {}) as { memo?: Record<number, number>; current?: number; result?: number; sequence?: number[]; calculations?: number; cacheHits?: number };
  const memo: Record<number, number> = stepData.memo ?? {};
  const current: number = stepData.current ?? 0;
  const result: number | undefined = stepData.result;
  const sequence: number[] = stepData.sequence ?? [];

  // Generate sequence display (0 to n)
  const renderSequence = () => {
    const items = [];
    for (let i = 0; i <= Math.min(n, 15); i++) {
      const value = memo[i];
      const isActive = i === current;
      const isComputed = value !== undefined;
      
      items.push(
        <div
          key={i}
          className={`
            w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300
            ${isActive 
              ? 'border-yellow-400 bg-yellow-400/20 scale-110' 
              : isComputed 
                ? 'border-green-400 bg-green-400/20' 
                : 'border-gray-600 bg-gray-800'
            }
          `}
        >
          <div className="text-xs text-gray-400">F({i})</div>
          <div className={`text-sm font-mono ${isComputed ? 'text-white' : 'text-gray-500'}`}>
            {isComputed ? value : '?'}
          </div>
        </div>
      );
    }
    return items;
  };

  // Render memoization table
  const renderMemoTable = () => {
    const entries = Object.entries(memo as unknown as Record<string, number>)
      .map(([key, value]) => ({ key: parseInt(key), value }))
      .sort((a, b) => a.key - b.key);

    if (entries.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">
          Memoization table will appear here
        </div>
      );
    }

    return (
      <div className="grid grid-cols-8 gap-2">
        {entries.map(({ key, value }) => (
          <div
            key={key}
            className={`
              p-2 rounded border text-center transition-all duration-300
              ${key === current 
                ? 'border-yellow-400 bg-yellow-400/20' 
                : 'border-gray-600 bg-gray-800'
              }
            `}
          >
            <div className="text-xs text-gray-400">F({key})</div>
            <div className="text-sm font-mono text-white">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Target and Result */}
      <div className="flex justify-center items-center gap-8">
        <div className="text-center">
          <div className="text-sm text-gray-400">Computing</div>
          <div className="text-2xl font-bold text-blue-400">F({n})</div>
        </div>
        {result !== undefined && (
          <>
            <div className="text-2xl text-gray-400">=</div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Result</div>
              <div className="text-2xl font-bold text-green-400">{result}</div>
            </div>
          </>
        )}
      </div>

      {/* Fibonacci Sequence Visualization */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Fibonacci Sequence</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {renderSequence()}
        </div>
        {n > 15 && (
          <div className="text-center text-gray-500 text-xs mt-2">
            ... showing first 16 values
          </div>
        )}
      </div>

      {/* Memoization Table */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          Memoization Table ({Object.keys(memo).length} entries)
        </h4>
        <div className="bg-gray-900 rounded-lg p-4">
          {renderMemoTable()}
        </div>
      </div>

      {/* Current Step Info */}
      {step.description && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="text-blue-300 text-sm">{step.description}</div>
        </div>
      )}

      {/* Performance Stats */}
      {stepData.calculations !== undefined && (
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-400">Calculations</div>
            <div className="text-lg font-mono text-yellow-400">{stepData.calculations}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-400">Cache Hits</div>
            <div className="text-lg font-mono text-green-400">{stepData.cacheHits || 0}</div>
          </div>
        </div>
      )}
    </div>
  );
}