"use client";

import React from "react";
import { VisualizationStep } from "@/lib/visualization-utils";
import { Search, PlusCircle, Trash2, Hash, CircleSlash } from "lucide-react";

interface HashTableVisualizerProps {
  step: VisualizationStep;
  data?: any[];
  onDataChange?: (data: any[]) => void;
}

type Strategy = "chaining" | "linear-probing" | "quadratic-probing";

type OAState = "empty" | "occupied" | "deleted";

export default function HashTableVisualizer({ step }: HashTableVisualizerProps) {
  const data = (step?.data || {}) as any;
  const strategy: Strategy = data.strategy || "chaining";
  const tableSize: number = data.tableSize || 7;

  const renderHeader = () => {
    const op = data.action as string | undefined;
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted">
          <Hash className="w-4 h-4" />
          <span className="text-sm">Strategy:</span>
          <span className="font-medium text-white text-sm capitalize">{strategy.replace("-", " ")}</span>
        </div>
        <div className="text-sm text-muted">
          {op ? <span>Operation: <span className="text-white font-medium uppercase">{op}</span></span> : null}
        </div>
      </div>
    );
  };

  const isActiveIndex = (i: number) => {
    return data.index === i || data.activeIndex === i || (Array.isArray(step?.highlights) && step.highlights.includes(i));
  };

  const renderChaining = () => {
    const buckets: number[][] = data.buckets || Array.from({ length: tableSize }, () => []);
    const activeNodePos: number | undefined = data.activeNodePos;

    return (
      <div className="space-y-3">
        <div className="grid gap-2" style={{ gridTemplateColumns: "auto 1fr" }}>
          {Array.from({ length: tableSize }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="text-xs text-gray-400 px-1 flex items-center justify-end">{i}</div>
              <div className={`flex items-center gap-2 p-2 rounded border transition-all duration-300 ${isActiveIndex(i) ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 bg-gray-900'}`}>
                <div className={`w-2 h-2 rounded-full ${isActiveIndex(i) ? 'bg-yellow-400' : 'bg-gray-600'}`} />
                <div className="flex flex-wrap gap-2">
                  {buckets[i].length === 0 ? (
                    <span className="text-xs text-gray-500">empty</span>
                  ) : (
                    buckets[i].map((key: number, pos: number) => {
                      const active = isActiveIndex(i) && activeNodePos === pos;
                      return (
                        <div
                          key={`${i}-${pos}-${key}`}
                          className={`px-2 py-1 rounded border text-xs font-mono transition-all duration-300 ${active ? 'border-blue-400 bg-blue-400/10 text-blue-200 scale-105' : 'border-gray-600 bg-gray-800 text-gray-200'}`}
                        >
                          {key}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <Legend strategy={strategy} />
      </div>
    );
  };

  const renderOpenAddressing = () => {
    const table: Array<{ state: OAState; key?: number }> = data.table || Array.from({ length: tableSize }, () => ({ state: "empty" as OAState }));

    return (
      <div className="space-y-3">
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {Array.from({ length: tableSize }).map((_, i) => {
            const entry = table[i] || { state: "empty" as OAState };
            const active = isActiveIndex(i) || data.index === i;
            const stateStyles = entry.state === "empty"
              ? "border-gray-700 bg-gray-900 text-gray-500"
              : entry.state === "deleted"
                ? "border-red-400 bg-red-400/10 text-red-300"
                : "border-emerald-400 bg-emerald-400/10 text-emerald-300";
            return (
              <div key={i} className={`p-3 rounded border text-center transition-all duration-300 ${active ? 'ring-1 ring-yellow-400' : ''} ${stateStyles}`}>
                <div className="text-[10px] text-gray-400">{i}</div>
                <div className="text-sm font-mono h-5 flex items-center justify-center">
                  {entry.state === "empty" ? "∅" : entry.state === "deleted" ? <CircleSlash className="w-4 h-4" /> : entry.key}
                </div>
              </div>
            );
          })}
        </div>

        <Legend strategy={strategy} />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderHeader()}
      <div className="card p-4">
        <p className="text-sm text-gray-300 mb-3">{step?.description || ""}</p>
        {strategy === "chaining" ? renderChaining() : renderOpenAddressing()}
      </div>
    </div>
  );
}

function Legend({ strategy }: { strategy: Strategy }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-300">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gray-800 border border-gray-600" />
        <span>Bucket/Slot</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-yellow-400/20 border border-yellow-400" />
        <span>Active Index</span>
      </div>
      {strategy === "chaining" ? (
        <div className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Insert Node</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-400/20 border border-emerald-400" />
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400/20 border border-red-400" />
            <span>Deleted Tombstone</span>
          </div>
        </>
      )}
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-blue-400" />
        <span>Probe/Traverse</span>
      </div>
      <div className="flex items-center gap-2">
        <Trash2 className="w-4 h-4 text-red-400" />
        <span>Delete</span>
      </div>
    </div>
  );
}