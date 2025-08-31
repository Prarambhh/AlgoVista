"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StackOperation {
  type: 'push' | 'pop';
  value?: number;
}

interface StackVisualizerProps {
  data?: any[];
  step: VisualizationStep;
  onDataChange?: (data: any[]) => void;
}

export default function StackVisualizerComponent({ data, step }: StackVisualizerProps) {
  // Extract stack data
  const stackData = Array.isArray(data) && data.length > 0 
    ? data[0] as { initialStack: number[]; operations: StackOperation[] }
    : { initialStack: [], operations: [] };

  const { initialStack, operations } = stackData;

  // Extract step data with explicit typing to avoid implicit any
  type StackStepData = {
    stack?: number[];
    operation?: StackOperation;
    operationIndex?: number;
    highlightTop?: boolean;
    poppedValue?: number;
  };
  const stepData = (step.data || {}) as StackStepData;
  const currentStack: number[] = stepData.stack || initialStack;
  const currentOperation: StackOperation | undefined = stepData.operation;
  const operationIndex: number = stepData.operationIndex || 0;
  const highlightTop: boolean = stepData.highlightTop || false;
  const poppedValue: number | undefined = stepData.poppedValue;

  // Render the stack as vertical blocks
  const renderStack = () => {
    if (currentStack.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-600 rounded-lg">
          <div className="text-gray-500 text-center">
            <div className="text-lg font-semibold">Empty Stack</div>
            <div className="text-sm">Stack is empty</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col-reverse items-center gap-1 min-h-40">
        {/* Base of stack */}
        <div className="w-32 h-2 bg-gray-600 rounded"></div>
        
        {/* Stack elements */}
        {currentStack.map((value: number, index: number) => {
          const isTop = index === currentStack.length - 1;
          const isHighlighted = highlightTop && isTop;
          
          return (
            <div
              key={`${value}-${index}`}
              className={`
                w-24 h-12 flex items-center justify-center rounded-lg border-2 transition-all duration-300
                ${isHighlighted 
                  ? 'bg-yellow-400/20 border-yellow-400 scale-105' 
                  : 'bg-blue-400/20 border-blue-400'
                }
                ${isTop ? 'font-bold' : ''}
              `}
            >
              <span className="text-white text-lg">{value}</span>
            </div>
          );
        })}
        
        {/* Top indicator */}
        {currentStack.length > 0 && (
          <div className="text-xs text-gray-400 mt-2">
            TOP
          </div>
        )}
      </div>
    );
  };

  // Render operation indicator
  const renderOperationIndicator = () => {
    if (!currentOperation) return null;

    return (
      <div className="flex items-center justify-center gap-4">
        <div
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border
            ${currentOperation.type === 'push' 
              ? 'bg-green-600/20 border-green-600 text-green-300' 
              : 'bg-red-600/20 border-red-600 text-red-300'
            }
          `}
        >
          {currentOperation.type === 'push' ? (
            <>
              <ArrowUp className="w-5 h-5" />
              <span>PUSH({currentOperation.value})</span>
            </>
          ) : (
            <>
              <ArrowDown className="w-5 h-5" />
              <span>POP</span>
              {poppedValue !== undefined && (
                <span className="text-white">→ {poppedValue}</span>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Operation Indicator */}
      <div className="flex justify-center">
        {renderOperationIndicator()}
      </div>

      {/* Stack Visualization */}
      <div className="flex justify-center">
        {renderStack()}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-400/20 border border-blue-400"></div>
          <span>Stack Element</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-400/20 border border-yellow-400"></div>
          <span>Top/Highlighted</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUp className="w-4 h-4 text-green-400" />
          <span>Push Operation</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDown className="w-4 h-4 text-red-400" />
          <span>Pop Operation</span>
        </div>
      </div>
    </div>
  );
}