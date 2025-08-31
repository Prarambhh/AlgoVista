"use client";

import React from "react";
import { ArrowLeft, ArrowRight, ArrowDown } from "lucide-react";
import { VisualizationStep } from "@/lib/visualization-utils";

interface QueueOperation {
  type: 'enqueue' | 'dequeue';
  value?: number;
}

interface QueueVisualizerProps {
  step: VisualizationStep;
}

export default function QueueVisualizerComponent({ step }: QueueVisualizerProps) {
  const {
    queue = [],
    operation,
    operationIndex = 0,
    highlightFront = false,
    highlightRear = false,
    dequeuedValue
  } = step.data as {
    queue: number[];
    operation?: QueueOperation;
    operationIndex: number;
    highlightFront?: boolean;
    highlightRear?: boolean;
    dequeuedValue?: number;
  };

  const isEmpty = queue.length === 0;
  const front = isEmpty ? null : queue[0];
  const rear = isEmpty ? null : queue[queue.length - 1];

  const Badge = ({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: "default" | "destructive" | "secondary" | "outline", className?: string }) => {
    const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
    const styles: Record<string, string> = {
      default: "bg-blue-600/15 text-blue-400 border border-blue-600/30",
      destructive: "bg-red-600/15 text-red-400 border border-red-600/30",
      secondary: "bg-gray-600/15 text-gray-300 border border-gray-600/30",
      outline: "border border-gray-500 text-gray-300",
    };
    return <span className={`${base} ${styles[variant]} ${className}`}>{children}</span>;
  };

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="border border-gray-700 rounded-lg bg-gray-800/60">{children}</div>
  );
  const CardHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-4 border-b border-gray-700 ${className}`}>{children}</div>
  );
  const CardTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <h3 className={`text-white font-semibold ${className}`}>{children}</h3>
  );
  const CardDescription = ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm text-gray-400 mt-1">{children}</p>
  );
  const CardContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-4 ${className}`}>{children}</div>
  );

  return (
    <div className="space-y-6">
      {/* Operation Status */}
      {operation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              Current Operation
              {operation.type === 'enqueue' && <ArrowLeft className="h-5 w-5 text-green-600" />}
              {operation.type === 'dequeue' && <ArrowRight className="h-5 w-5 text-red-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge 
                  variant={operation.type === 'enqueue' ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {operation.type.toUpperCase()}
                  {operation.value && ` (${operation.value})`}
                </Badge>
                <p className="text-sm text-gray-400 mt-1">
                  Operation {operationIndex + 1}
                </p>
              </div>
              {dequeuedValue !== undefined && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Removed:</p>
                  <Badge variant="outline" className="text-lg">
                    {dequeuedValue}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Queue State</CardTitle>
          <CardDescription>
            FIFO (First In, First Out) - Elements enter at rear, exit from front
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Labels */}
            <div className="flex justify-between items-center text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span>Front (Dequeue)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Rear (Enqueue)</span>
                <ArrowLeft className="h-4 w-4" />
              </div>
            </div>

            {/* Queue Elements */}
            <div className="relative">
              {isEmpty ? (
                <div className="h-16 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Empty Queue</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 p-3 border border-gray-700 rounded-lg bg-gray-900">
                  {queue.map((element, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`
                          w-12 h-12 rounded border-2 flex items-center justify-center font-semibold text-sm
                          transition-all duration-300 text-white
                          ${index === 0 && highlightFront 
                            ? 'border-red-500 bg-red-900/40 text-red-300 scale-110' 
                            : index === queue.length - 1 && highlightRear
                            ? 'border-green-500 bg-green-900/40 text-green-300 scale-110'
                            : 'border-gray-600 bg-gray-800'
                          }
                        `}
                      >
                        {element}
                      </div>
                      
                      {/* Front indicator */}
                      {index === 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          <div className="flex flex-col items-center">
                            <ArrowDown className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-400 font-medium">Front</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Rear indicator */}
                      {index === queue.length - 1 && queue.length > 1 && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-green-400 font-medium">Rear</span>
                            <ArrowDown className="h-3 w-3 text-green-500 rotate-180" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direction Indicators */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-red-400">
                <ArrowRight className="h-3 w-3" />
                <span>Elements exit here</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <span>Elements enter here</span>
                <ArrowLeft className="h-3 w-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Queue Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Size:</span>
                <Badge variant="outline">{queue.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Front Element:</span>
                <Badge variant={front !== null ? "secondary" : "outline"}>
                  {front !== null ? front : "None"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Is Empty:</span>
                <Badge variant={isEmpty ? "destructive" : "default"}>
                  {isEmpty ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Rear Element:</span>
                <Badge variant={rear !== null ? "secondary" : "outline"}>
                  {rear !== null ? rear : "None"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operation Progress */}
      {operation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Operation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-300">
              {operation.type === 'enqueue' && (
                <div className="space-y-1">
                  <p><strong>Enqueue Operation:</strong></p>
                  <p>• Adding element {operation.value} to the rear of the queue</p>
                  <p>• New rear element will be {operation.value}</p>
                  <p>• Queue size will become {queue.length}</p>
                </div>
              )}
              {operation.type === 'dequeue' && (
                <div className="space-y-1">
                  <p><strong>Dequeue Operation:</strong></p>
                  {queue.length > 0 ? (
                    <>
                      <p>• Removing element {queue[0]} from the front of the queue</p>
                      <p>• New front element will be {queue.length > 1 ? queue[1] : "None (empty)"}</p>
                      <p>• Queue size will become {queue.length - 1}</p>
                    </>
                  ) : (
                    <p className="text-red-400">• Cannot dequeue from empty queue (underflow)</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}