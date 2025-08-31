"use client";

import React, { useMemo, useState } from "react";
import { VisualizationStep } from "@/lib/visualization-utils";

interface EditDistanceVisualizerProps {
  step: VisualizationStep;
}

export default function EditDistanceVisualizer({ step }: EditDistanceVisualizerProps) {
  const {
    string1 = "",
    string2 = "",
    dpTable = [],
    currentRow = -1,
    currentCol = -1,
    phase = "building",
    operation = "",
    backtrackPath = [],
    edits = [],
    editsSoFar = [],
    editCounts
  } = (step.data || {}) as any;

  const [showOptimalOnly, setShowOptimalOnly] = useState(false);
  const hasPath = (backtrackPath || []).length > 0;

  const isInBacktrackPath = (row: number, col: number) => {
    return (backtrackPath || []).some((c: any) => c.row === row && c.col === col);
  };

  const getCellStyle = (row: number, col: number) => {
    const isCurrent = row === currentRow && col === currentCol;
    const isInPath = isInBacktrackPath(row, col);

    // If toggled, dim all cells not on the optimal path (except current cell to keep animation visible)
    if (showOptimalOnly && hasPath && !isCurrent && !isInPath && phase !== "building") {
      return "bg-gray-800 text-gray-600 border-gray-700";
    }

    if (isCurrent) return "bg-yellow-500 text-black border-yellow-400 scale-110";
    if (isInPath) return "bg-green-500 text-white border-green-400";
    return "bg-gray-700 text-gray-300 border-gray-600";
  };

  // Whether a cell's value is computed at this step
  const isCellComputed = (r: number, c: number) => {
    if (!dpTable || dpTable.length === 0) return false;
    if (r === 0 || c === 0) return true; // base cases always known
    if (phase !== "building") return true; // after building, all are computed
    if (currentRow < 0 || currentCol < 0) return false;
    if (r < currentRow) return true;
    if (r === currentRow && c <= currentCol) return true;
    return false;
  };

  // Tooltip content for each cell explaining the decision
  const renderTooltip = (r: number, c: number) => {
    const safeVal = dpTable?.[r]?.[c];

    if (!isCellComputed(r, c)) {
      return (
        <div className="text-xs text-gray-300">
          <div className="font-semibold">dp[{r}][{c}]</div>
          <div className="text-gray-400">Not computed yet at this step</div>
        </div>
      );
    }

    // Base cases
    if (r === 0 && c === 0) {
      return (
        <div className="text-xs text-gray-300">
          <div className="font-semibold">dp[0][0] = 0</div>
          <div className="text-gray-400">Empty to empty requires 0 edits</div>
        </div>
      );
    }

    if (r === 0) {
      return (
        <div className="text-xs text-gray-300">
          <div className="font-semibold">dp[0][{c}] = {c}</div>
          <div className="text-gray-400">Insert first {c} characters of target</div>
          <div className="text-gray-500">Target prefix: '{string2.slice(0, c)}'</div>
        </div>
      );
    }

    if (c === 0) {
      return (
        <div className="text-xs text-gray-300">
          <div className="font-semibold">dp[{r}][0] = {r}</div>
          <div className="text-gray-400">Delete first {r} characters of source</div>
          <div className="text-gray-500">Source prefix: '{string1.slice(0, r)}'</div>
        </div>
      );
    }

    const ch1 = string1[r - 1];
    const ch2 = string2[c - 1];

    const up = (dpTable?.[r - 1]?.[c] ?? 0) + 1; // delete
    const left = (dpTable?.[r]?.[c - 1] ?? 0) + 1; // insert
    const diag = (dpTable?.[r - 1]?.[c - 1] ?? 0) + (ch1 === ch2 ? 0 : 1); // replace if mismatch

    const options: { key: "delete" | "insert" | "replace" | "match"; label: string; value: number }[] = [];

    if (ch1 === ch2) {
      options.push({ key: "match", label: `match: dp[${r - 1}][${c - 1}]`, value: dpTable?.[r - 1]?.[c - 1] ?? 0 });
    } else {
      options.push({ key: "delete", label: `delete: dp[${r - 1}][${c}] + 1`, value: up });
      options.push({ key: "insert", label: `insert: dp[${r}][${c - 1}] + 1`, value: left });
      options.push({ key: "replace", label: `replace: dp[${r - 1}][${c - 1}] + 1`, value: diag });
    }

    const chosenVal = safeVal;
    const chosenKeys = options
      .filter(o => o.value === chosenVal)
      .map(o => o.key);

    return (
      <div className="text-xs text-gray-300 space-y-1">
        <div className="font-semibold">dp[{r}][{c}] = {safeVal}</div>
        <div className="text-gray-400">
          {r > 0 && c > 0 ? (
            ch1 === ch2 ? (
              <span>
                '{ch1}' = '{ch2}' → take diagonal
              </span>
            ) : (
              <span>'{ch1}' ≠ '{ch2}' → 1 + min(delete, insert, replace)</span>
            )
          ) : null}
        </div>
        {options.map((opt) => (
          <div key={opt.key} className={`flex justify-between ${chosenKeys.includes(opt.key) ? "text-green-300" : "text-gray-400"}`}>
            <span>{opt.label}</span>
            <span className="font-mono">{opt.value}</span>
          </div>
        ))}
        {chosenKeys.length > 0 && (
          <div className="text-[10px] text-gray-400">
            Chosen: {chosenKeys.join(", ")} {chosenKeys.length > 1 ? "(tie)" : ""}
          </div>
        )}
      </div>
    );
  };

  // Compute chosen directions for a cell to render mini arrows (diag/up/left)
  // diag: from dp[r-1][c-1] (match or replace), up: delete from s1, left: insert into s1
  const getChosenDirs = (r: number, c: number): Array<"diag" | "up" | "left"> => {
    if (!isCellComputed(r, c)) return [];
    if (r === 0 && c === 0) return [];
    if (r === 0) return ["left"]; // building target by inserting
    if (c === 0) return ["up"];   // reducing source by deleting
  
    const ch1 = string1[r - 1];
    const ch2 = string2[c - 1];
    const up = (dpTable?.[r - 1]?.[c] ?? 0) + 1;
    const left = (dpTable?.[r]?.[c - 1] ?? 0) + 1;
    const diag = (dpTable?.[r - 1]?.[c - 1] ?? 0) + (ch1 === ch2 ? 0 : 1);
    const cur = dpTable?.[r]?.[c];
  
    const dirs: Array<"diag" | "up" | "left"> = [];
    if (ch1 === ch2) {
      if (cur === (dpTable?.[r - 1]?.[c - 1] ?? 0)) dirs.push("diag");
      return dirs;
    }
    if (cur === up) dirs.push("up");
    if (cur === left) dirs.push("left");
    if (cur === diag) dirs.push("diag");
    return dirs;
  };

  // Determine edits to display (prefer full edits if available, otherwise show partial during backtracking)
  const displayedEdits = useMemo(() => {
    if (Array.isArray(edits) && edits.length > 0) return edits;
    if (Array.isArray(editsSoFar) && editsSoFar.length > 0) return editsSoFar;
    return [] as any[];
  }, [edits, editsSoFar]);

  const counts = useMemo(() => {
    if (editCounts) return editCounts;
    const c = { insert: 0, delete: 0, replace: 0 } as Record<string, number>;
    displayedEdits.forEach((e: any) => {
      if (e.type === "insert") c.insert++;
      else if (e.type === "delete") c.delete++;
      else if (e.type === "replace") c.replace++;
    });
    return c;
  }, [displayedEdits, editCounts]);

  const renderEditBadge = (type: "insert" | "delete" | "replace") => {
    const colors: Record<string, string> = {
      insert: "green",
      delete: "red",
      replace: "yellow",
    };
    const color = colors[type];
    const count = (counts as any)[type] || 0;
    const tooltip = (
      <div className="text-xs text-gray-300 space-y-0.5">
        {type === "insert" && (
          <>
            <div className="font-semibold">Insert (cost +1)</div>
            <div className="text-gray-400">Take from left: dp[r][c-1] + 1</div>
            <div className="text-gray-500">Adds a character to match target</div>
          </>
        )}
        {type === "delete" && (
          <>
            <div className="font-semibold">Delete (cost +1)</div>
            <div className="text-gray-400">Take from up: dp[r-1][c] + 1</div>
            <div className="text-gray-500">Removes a character from source</div>
          </>
        )}
        {type === "replace" && (
          <>
            <div className="font-semibold">Replace/Match (cost +1 / +0)</div>
            <div className="text-gray-400">Take from diagonal: dp[r-1][c-1] + cost</div>
            <div className="text-gray-500">0 if equal chars, else 1</div>
          </>
        )}
      </div>
    );
    return (
      <div className="relative group">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full border bg-${color}-600/20 border-${color}-600 text-${color}-300 text-xs`}
          title={`${type} operations count`}>
          <span className="capitalize">{type}</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-900 text-gray-200">{count}</span>
        </div>
        {/* Tooltip */}
        <div className="pointer-events-none absolute z-50 top-full mt-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded p-2 shadow-lg whitespace-nowrap">
          {tooltip}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            id="toggle-optimal"
            type="checkbox"
            className="h-4 w-4 accent-blue-500"
            checked={showOptimalOnly}
            onChange={(e) => setShowOptimalOnly(e.target.checked)}
          />
          <label htmlFor="toggle-optimal" className="text-sm text-gray-300">
            Show only optimal path
          </label>
          {showOptimalOnly && phase === "building" && (
            <span className="text-xs text-gray-500">(Path appears after building completes)</span>
          )}
        </div>

        {/* Operation badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {renderEditBadge("insert")}
          {renderEditBadge("delete")}
          {renderEditBadge("replace")}
        </div>
      </div>

      {/* Strings */}
      <div className="space-y-3">
        <div>
          <div className="text-sm text-gray-400">Source (rows):</div>
          <div className="flex gap-1">
            {string1.split("").map((ch: string, i: number) => (
              <div key={i} className="w-8 h-8 border border-blue-500 bg-blue-900/40 text-blue-300 rounded flex items-center justify-center text-sm font-mono">
                {ch}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Target (columns):</div>
          <div className="flex gap-1">
            {string2.split("").map((ch: string, i: number) => (
              <div key={i} className="w-8 h-8 border border-green-500 bg-green-900/40 text-green-300 rounded flex items-center justify-center text-sm font-mono">
                {ch}
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
                <th className="w-8 h-8 text-xs text-gray-400">
                  <div className="relative group flex items-center justify-center w-8 h-8">
                    
                    {/* Empty prefix marker */}
                    ∅
                    <div className="pointer-events-none absolute z-50 top-full mt-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded p-2 shadow-lg whitespace-nowrap">
                      <div className="text-xs text-gray-300">Empty prefix (column 0)</div>
                    </div>
                  </div>
                </th>
                {string2.split("").map((char: string, index: number) => (
                  <th key={index} className="w-8 h-8 text-xs text-green-400 font-mono">
                    <div className="relative group flex items-center justify-center w-8 h-8">
                      {char}
                      <div className="pointer-events-none absolute z-50 top-full mt-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded p-2 shadow-lg whitespace-nowrap">
                        <div className="text-xs text-gray-300">s2[{index}] = '{char}'</div>
                        <div className="text-[10px] text-gray-500">Column {index + 1}</div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: (dpTable?.length || 0) }).map((_, r) => (
                <tr key={r}>
                  <td className="w-8 h-8 text-xs text-gray-400">
                    <div className="relative group flex items-center justify-center w-8 h-8">
                      {r === 0 ? "∅" : string1[r - 1]}
                      <div className="pointer-events-none absolute z-50 left-full ml-1 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded p-2 shadow-lg whitespace-nowrap">
                        {r === 0 ? (
                          <div className="text-xs text-gray-300">Empty prefix (row 0)</div>
                        ) : (
                          <div className="text-xs text-gray-300">
                            s1[{r - 1}] = '{string1[r - 1]}'
                            <div className="text-[10px] text-gray-500">Row {r}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {dpTable[r]?.map((value: number, c: number) => (
                    <td key={c}>
                      <div className="relative group">
                        <div className={`w-8 h-8 border rounded flex items-center justify-center text-xs font-semibold transition-all duration-300 ${getCellStyle(r, c)}`}>
                          {value}
                          {/* Mini cost badges for transitions (shown on hover) */}
                          {isCellComputed(r, c) && r > 0 && c > 0 && (
                            <div className="absolute inset-0 pointer-events-none hidden group-hover:flex items-start justify-end p-0.5">
                              <div className="text-[6px] bg-gray-900/80 text-gray-300 rounded px-0.5 py-0.25 border border-gray-600">
                                {(() => {
                                  const ch1 = string1[r - 1];
                                  const ch2 = string2[c - 1];
                                  if (ch1 === ch2) return "0";
                                  const up = (dpTable?.[r - 1]?.[c] ?? 0) + 1;
                                  const left = (dpTable?.[r]?.[c - 1] ?? 0) + 1;
                                  const diag = (dpTable?.[r - 1]?.[c - 1] ?? 0) + 1;
                                  return `${Math.min(up, left, diag)}`;
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Mini arrows overlay (shown on hover) */}
                        <div className="pointer-events-none absolute inset-0 hidden group-hover:flex items-center justify-center">
                          <div className="flex gap-1 text-[10px]">
                            <span className={`${getChosenDirs(r, c).includes("diag") ? "text-blue-300 opacity-100" : "text-gray-500 opacity-30"}`}>↖</span>
                            <span className={`${getChosenDirs(r, c).includes("up") ? "text-red-300 opacity-100" : "text-gray-500 opacity-30"}`}>↑</span>
                            <span className={`${getChosenDirs(r, c).includes("left") ? "text-green-300 opacity-100" : "text-gray-500 opacity-30"}`}>←</span>
                          </div>
                        </div>
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute z-50 left-9 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded p-2 shadow-lg w-64">
                          {renderTooltip(r, c)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Current Operation */}
      <div className="p-3 bg-gray-800 rounded">
        <div className="text-sm text-gray-400">Current Operation</div>
        <div className="text-lg font-mono text-yellow-300">{operation || ""}</div>
      </div>

      {/* Reconstructed Edits (compact) */}
      {displayedEdits.length > 0 && (
        <div className="p-3 bg-gray-800 rounded">
          <div className="text-sm text-gray-400 mb-2">Reconstructed Edits</div>
          <div className="space-y-1">
            {displayedEdits.map((e: any, idx: number) => {
              const color = e.type === "insert" ? "green" : e.type === "delete" ? "red" : "yellow";
              const tooltip = (
                <div className="text-xs text-gray-300 space-y-0.5">
                  <div className="font-semibold capitalize">{e.type} (cost +1)</div>
                  {e.type === "insert" && (
                    <div>
                      Insert '{e.toChar}' at target index {e.toIndex} (1-based {e.toIndex + 1})
                    </div>
                  )}
                  {e.type === "delete" && (
                    <div>
                      Delete '{e.fromChar}' at source index {e.fromIndex} (1-based {e.fromIndex + 1})
                    </div>
                  )}
                  {e.type === "replace" && (
                    <div>
                      Replace s1[{e.fromIndex}] '{e.fromChar}' → s2[{e.toIndex}] '{e.toChar}'
                    </div>
                  )}
                </div>
              );
              return (
                <div key={idx} className="relative group flex items-center gap-2 text-sm">
                  <span className={`px-2 py-0.5 rounded-full border bg-${color}-600/20 border-${color}-600 text-${color}-300 capitalize`}>{e.type}</span>
                  {e.type === "insert" && (
                    <span className="text-gray-200">Insert '{e.toChar}' at position {e.toIndex + 1}</span>
                  )}
                  {e.type === "delete" && (
                    <span className="text-gray-200">Delete '{e.fromChar}' at position {e.fromIndex + 1}</span>
                  )}
                  {e.type === "replace" && (
                    <span className="text-gray-200">Replace '{e.fromChar}' → '{e.toChar}' at position {e.fromIndex + 1}</span>
                  )}
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute z-50 left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded p-2 shadow-lg">
                    {tooltip}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase */}
      <div className="p-3 bg-gray-800 rounded">
        <div className="text-sm text-gray-400">Current Phase</div>
        <div className="text-lg font-semibold">
          {phase === "building" && <span className="text-yellow-400">Building DP Table</span>}
          {phase === "backtracking" && <span className="text-green-400">Backtracking Edits</span>}
          {phase === "complete" && <span className="text-blue-400">Algorithm Complete</span>}
        </div>
      </div>

      {/* Description */}
      {step.description && (
        <div className="p-3 bg-gray-800 rounded-lg text-gray-300 text-sm">{step.description}</div>
      )}
    </div>
  );
}