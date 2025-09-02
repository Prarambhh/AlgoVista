"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";
import { ArrowRight, Plus, AlertCircle, Trash2 } from "lucide-react";

interface LinkedListVisualizerProps {
  step: VisualizationStep;
}

export default function LinkedListVisualizerComponent({ step }: LinkedListVisualizerProps) {
  const {
    list = [],
    insertValue,
    insertPosition,
    deletePosition,
    deleteValue,
    error = false,
    newNode = false,
    deletedNode = false
  } = step.data as {
    list: number[];
    insertValue?: number;
    insertPosition?: number;
    deletePosition?: number;
    deleteValue?: number;
    error?: boolean;
    newNode?: boolean;
    deletedNode?: boolean;
  };

  const renderLinkedList = () => {
    if (list.length === 0) {
      return (
        <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-600 rounded-lg">
          <div className="text-gray-500 text-center">
            <div className="text-lg font-semibold">Empty List</div>
            <div className="text-sm">No nodes in the linked list</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-4">
        {list.map((value, index) => {
          const isHighlighted = step.highlights && step.highlights.includes(index);
          const isInsertPosition = insertPosition === index;
          const isDeletePosition = deletePosition === index;
          
          return (
            <React.Fragment key={index}>
              <div
                className={`
                  relative flex items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-300
                  ${isHighlighted 
                    ? 'bg-yellow-400/20 border-yellow-400 scale-110' 
                    : isInsertPosition
                    ? 'bg-green-400/20 border-green-400 scale-105'
                    : isDeletePosition
                    ? 'bg-red-400/20 border-red-400 scale-105'
                    : 'bg-blue-400/20 border-blue-400'
                  }
                `}
              >
                <span className="text-white text-lg font-semibold">{value}</span>
                {newNode && isHighlighted && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <Plus className="w-4 h-4 text-green-400" />
                  </div>
                )}
                {isDeletePosition && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <span className="text-red-400 text-xs font-bold">DEL</span>
                  </div>
                )}
              </div>
              
              {index < list.length - 1 && (
                <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
        
        {/* Null terminator */}
        <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
        <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-gray-600 bg-gray-800">
          <span className="text-gray-400 text-sm font-mono">null</span>
        </div>
      </div>
    );
  };

  const renderOperationIndicator = () => {
    if (insertValue !== undefined && insertPosition !== undefined && !error) {
      return (
        <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
          <div className="flex items-center gap-2 text-blue-300">
            <Plus className="w-4 h-4" />
            <span className="text-sm">
              Inserting value <span className="font-semibold">{insertValue}</span> at position <span className="font-semibold">{insertPosition}</span>
            </span>
          </div>
        </div>
      );
    }
    
    if (deletePosition !== undefined && !error) {
      return (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
          <div className="flex items-center gap-2 text-red-300">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">
              Deleting node at position <span className="font-semibold">{deletePosition}</span>
              {deleteValue !== undefined && (
                <span> (value: <span className="font-semibold">{deleteValue}</span>)</span>
              )}
            </span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderErrorIndicator = () => {
    if (error) {
      return (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
          <div className="flex items-center gap-2 text-red-300">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Operation Failed</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Operation Indicators */}
      {renderOperationIndicator()}
      {renderErrorIndicator()}

      {/* Linked List Visualization */}
      <div className="space-y-3">
        <div className="text-sm text-gray-400">Linked List Structure</div>
        <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
          {renderLinkedList()}
        </div>
      </div>

      {/* List Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">List Length</div>
          <div className="text-lg font-semibold text-blue-400">{list.length}</div>
        </div>
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400">Head Value</div>
          <div className="text-lg font-semibold text-green-400">
            {list.length > 0 ? list[0] : 'null'}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400/20 border border-blue-400 rounded"></div>
            <span className="text-gray-300">List Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400/20 border border-yellow-400 rounded"></div>
            <span className="text-gray-300">Highlighted Node</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400/20 border border-green-400 rounded"></div>
            <span className="text-gray-300">Insert Position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400/20 border border-red-400 rounded"></div>
            <span className="text-gray-300">Delete Position</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">Next Pointer</span>
          </div>
        </div>
      </div>

      {/* Step Description */}
      {step.description && (
        <div className="p-3 bg-gray-800 rounded-lg text-gray-300 text-sm">
          {step.description}
        </div>
      )}
    </div>
  );
}