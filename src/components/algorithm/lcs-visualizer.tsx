"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";

interface LCSVisualizerProps {
  step: VisualizationStep;
}

export default function LCSVisualizerComponent({ step }: LCSVisualizerProps) {
  const {
    string1 = "",
    string2 = "",
    dpTable = [],
    currentRow = -1,
    currentCol = -1,
    lcsLength = 0,
    lcsString = "",
    phase = "building",
    backtrackPath = []
  } = step.data as {
    string1: string;
    string2: string;
    dpTable: number[][];
    currentRow: number;
    currentCol: number;
    lcsLength: number;
    lcsString: string;
    phase: "building" | "backtracking" | "complete";
    backtrackPath: Array<{row: number; col: number}>;
  };

  const isInBacktrackPath = (row: number, col: number) => {
    return backtrackPath.some(cell => cell.row === row && cell.col === col);
  };

  const getCellStyle = (row: number, col: number, value: number) => {
    const isCurrent = row === currentRow && col === currentCol;
    const isInPath = isInBacktrackPath(row, col);
    
    if (isCurrent) {
      return 'bg-yellow-500 text-black border-yellow-400 scale-110';
    } else if (isInPath) {
      return 'bg-green-500 text-white border-green-400';
    } else if (value > 0) {
      return 'bg-blue-500 text-white border-blue-400';
    } else {
      return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getCharStyle = (char: string, index: number, isString1: boolean) => {
    const currentIndex = isString1 ? currentCol - 1 : currentRow - 1;
    const isCurrent = index === currentIndex && phase === "building";
    
    if (isCurrent) {
      return 'border-yellow-500 bg-yellow-900/40 text-yellow-300 scale-110';
    } else if (lcsString.includes(char)) {
      return 'border-green-500 bg-green-900/40 text-green-300';
    } else {
      return 'border-gray-600 bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Strings Display */}
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">String 1:</div>
          <div className="flex gap-1">
            {string1.split('').map((char, index) => (
              <div
                key={index}
                className={`
                  w-8 h-8 border-2 rounded flex items-center justify-center text-sm font-mono
                  transition-all duration-300
                  ${getCharStyle(char, index, true)}
                `}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-400">String 2:</div>
          <div className="flex gap-1">
            {string2.split('').map((char, index) => (
              <div
                key={index}
                className={`
                  w-8 h-8 border-2 rounded flex items-center justify-center text-sm font-mono
                  transition-all duration-300
                  ${getCharStyle(char, index, false)}
                `}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DP Table */}
      <div className="space-y-3">
        <div className="text-sm text-gray-400">
          DP Table {phase === "building" ? "(Building)" : phase === "backtracking" ? "(Backtracking)" : "(Complete)"}
        </div>
        <div className="overflow-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="w-8 h-8 text-xs text-gray-400"></th>
                <th className="w-8 h-8 text-xs text-gray-400">∅</th>
                {string1.split('').map((char, index) => (
                  <th key={index} className="w-8 h-8 text-xs text-blue-400 font-mono">
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="w-8 h-8 text-xs text-gray-400">∅</td>
                {dpTable[0]?.map((value, colIndex) => (
                  <td key={colIndex}>
                    <div
                      className={`
                        w-8 h-8 border rounded flex items-center justify-center text-xs font-semibold
                        transition-all duration-300
                        ${getCellStyle(0, colIndex, value)}
                      `}
                    >
                      {value}
                    </div>
                  </td>
                ))}
              </tr>
              {string2.split('').map((char, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="w-8 h-8 text-xs text-green-400 font-mono">
                    {char}
                  </td>
                  {dpTable[rowIndex + 1]?.map((value, colIndex) => (
                    <td key={colIndex}>
                      <div
                        className={`
                          w-8 h-8 border rounded flex items-center justify-center text-xs font-semibold
                          transition-all duration-300
                          ${getCellStyle(rowIndex + 1, colIndex, value)}
                        `}
                      >
                        {value}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">LCS Length</div>
          <div className="text-2xl font-semibold text-blue-400">{lcsLength}</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">LCS String</div>
          <div className="text-lg font-mono text-green-400">
            {lcsString || "..."}
          </div>
        </div>
      </div>

      {/* Phase Indicator */}
      <div className="p-3 bg-gray-800 rounded">
        <div className="text-sm text-gray-400">Current Phase</div>
        <div className="text-lg font-semibold">
          {phase === "building" && <span className="text-yellow-400">Building DP Table</span>}
          {phase === "backtracking" && <span className="text-green-400">Backtracking LCS</span>}
          {phase === "complete" && <span className="text-blue-400">Algorithm Complete</span>}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 border border-yellow-400 rounded"></div>
            <span className="text-gray-300">Current Cell</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 border border-green-400 rounded"></div>
            <span className="text-gray-300">LCS Path</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border border-blue-400 rounded"></div>
            <span className="text-gray-300">Non-zero Value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 border border-gray-600 rounded"></div>
            <span className="text-gray-300">Zero Value</span>
          </div>
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