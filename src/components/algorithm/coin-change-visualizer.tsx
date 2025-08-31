"use client";

import React, { useMemo, useState } from "react";
import { VisualizationStep } from "@/lib/visualization-utils";
import { AnimatePresence, motion } from "framer-motion";

interface CoinChangeVisualizerProps {
  step: VisualizationStep;
}

export default function CoinChangeVisualizer({ step }: CoinChangeVisualizerProps) {
  const data = step?.data || {};
  const coins: number[] = data.coins || [];
  const amount: number = data.amount ?? 0;
  const dp: number[][] = data.dp || [];
  const currentI: number = data.currentI ?? 0; // row (number of coins considered)
  const currentA: number = data.currentA ?? 0; // column (amount)
  const phase: "building" | "backtracking" | "complete" = data.phase || "building";
  const chosenCoins: number[] = data.chosenCoins || [];
  const minCoins: number = data.minCoins ?? (Number.isFinite(dp?.[coins.length]?.[amount]) ? dp[coins.length][amount] : Infinity);
  const solutionExists: boolean = data.solutionExists ?? Number.isFinite(minCoins);

  const rows = dp.length;
  const cols = rows > 0 ? dp[0].length : 0;

  const [showBadgesAlways, setShowBadgesAlways] = useState(false);

  const chosenSummary = useMemo(() => {
    const map = new Map<number, number>();
    for (const c of chosenCoins) map.set(c, (map.get(c) || 0) + 1);
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [chosenCoins]);

  const isCellComputed = (i: number, a: number) => dp?.[i]?.[a] !== undefined;

  const renderValue = (v: number | undefined) => {
    if (v === undefined || v === null) return "-";
    if (!Number.isFinite(v)) return "∞";
    return v;
  };

  const miniCostFor = (i: number, a: number) => {
    if (!isCellComputed(i, a)) return undefined;
    if (i === 0 && a === 0) return 0;
    if (a === 0) return dp[i][a];
    if (i === 0) return dp[i][a];
    const without = dp[i - 1]?.[a] ?? Infinity;
    const coin = coins[i - 1];
    const take = a - coin >= 0 ? ((dp[i]?.[a - coin] ?? Infinity) + 1) : Infinity;
    return Math.min(without, take);
  };

  // Determine chosen directions for this cell (↑ skip, ← take)
  const getChosenDirs = (i: number, a: number): Array<"up" | "left"> => {
    if (!isCellComputed(i, a)) return [];
    if (i === 0 && a === 0) return [];
    if (a === 0) return []; // base column
    if (i === 0) return []; // cannot form positive amount with 0 coins
    const cur = dp[i][a];
    const without = dp[i - 1]?.[a] ?? Infinity;
    const coin = coins[i - 1];
    const take = a - coin >= 0 ? ((dp[i]?.[a - coin] ?? Infinity) + 1) : Infinity;
    const dirs: Array<"up" | "left"> = [];
    if (cur === without) dirs.push("up");
    if (cur === take) dirs.push("left");
    return dirs;
  };

  const isOnBacktrackPath = (i: number, a: number): boolean => {
    const bt: Array<{ row: number; col: number }> = data.backtrackPath || [];
    return bt.some((p) => p.row === i && p.col === a);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="text-gray-300">Coins: {coins.join(", ") || "-"}</div>
        <div className="text-gray-300">Amount: {amount}</div>
        <div className="text-gray-300">Rows: {rows}, Cols: {cols}</div>
        {Number.isFinite(minCoins) && (
          <div className="text-green-300 font-medium">Min Coins: {minCoins}</div>
        )}
        {!solutionExists && phase === "complete" && (
          <div className="text-red-300">No solution</div>
        )}
        <label className="ml-auto inline-flex items-center gap-2 text-gray-300 cursor-pointer select-none">
          <input type="checkbox" checked={showBadgesAlways} onChange={(e) => setShowBadgesAlways(e.target.checked)} />
          <span>Show mini-cost badges</span>
        </label>
      </div>

      {/* Legend */}
      <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-400 flex flex-wrap gap-4">
        <div>
          <span className="inline-block w-3 h-3 rounded bg-blue-500/30 border border-blue-500/40 align-middle mr-2" />
          Current cell being computed
        </div>
        <div>
          <span className="inline-block w-3 h-3 rounded bg-green-500/20 border border-green-600 align-middle mr-2" />
          On optimal backtrack path
        </div>
        <div>
          <span className="inline-block w-3 h-3 rounded bg-gray-700 border border-gray-600 align-middle mr-2" />
          Base cases (i=0 or a=0)
        </div>
        <div>
          <span className="inline-block w-3 h-3 rounded bg-gray-800 border border-gray-700 align-middle mr-2" />
          Other computed cells
        </div>
        <div>
          Hover a cell to see mini-cost badge and arrows (↑ skip, ← take)
        </div>
      </div>

      {/* DP Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {rows === 0 || cols === 0 ? (
            <div className="text-gray-400">No DP table to display.</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-gray-400">i \ a</th>
                  {Array.from({ length: cols }).map((_, a) => (
                    <th key={a} className="p-2 text-center text-gray-400 font-mono">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-2 text-gray-400 font-mono">{i}</td>
                    {Array.from({ length: cols }).map((_, a) => (
                      <td key={a} className="p-1 align-top">
                        <div
                          className={[
                            "relative group rounded-lg border p-2 text-center font-mono transition-colors",
                            i === 0 || a === 0 ? "bg-gray-700 border-gray-600" : "bg-gray-800 border-gray-700",
                            i === currentI && a === currentA && phase === "building" ? "ring-2 ring-blue-500/50 bg-blue-500/10" : "",
                            isOnBacktrackPath(i, a) ? "border-green-600 bg-green-600/10" : "",
                          ].join(" ")}
                        >
                          <div className="text-white select-none">{renderValue(dp?.[i]?.[a])}</div>
                          {(showBadgesAlways || (typeof window !== "undefined" && (document?.activeElement?.tagName?.toLowerCase?.() !== "input"))) && (
                            <div className="pointer-events-none absolute inset-0 flex items-start justify-start p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="text-[10px] leading-none text-gray-300 bg-gray-900/70 border border-gray-700 rounded px-1 py-0.5 flex items-center gap-1">
                                <span className="text-gray-500">min(</span>
                                <span className="text-blue-300">{(() => {
                                  const w = dp[i - 1]?.[a];
                                  return Number.isFinite(w) ? w : "∞";
                                })()}</span>
                                <span className="text-gray-500">,</span>
                                <span className="text-emerald-300">{(() => {
                                  const coin = coins[i - 1];
                                  const t = a - coin >= 0 ? ((dp[i]?.[a - coin] ?? Infinity) + 1) : Infinity;
                                  return Number.isFinite(t) ? t : "∞";
                                })()}</span>
                                <span className="text-gray-500">)</span>
                                <span className="ml-1 text-gray-500">=
                                  <span className="ml-1 text-white">{miniCostFor(i, a)}</span>
                                </span>
                              </div>
                              <div className="ml-auto text-[10px] leading-none flex flex-col items-end gap-0.5">
                                <span className={`${getChosenDirs(i, a).includes("up") ? "text-blue-300 opacity-100" : "text-gray-500 opacity-30"}`}>↑</span>
                                <span className={`${getChosenDirs(i, a).includes("left") ? "text-green-300 opacity-100" : "text-gray-500 opacity-30"}`}>←</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Current Step Info (animated) */}
      <AnimatePresence mode="wait">
        {step?.description ? (
          <motion.div
            key={step.description}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"
          >
            <div className="text-blue-300 text-sm">{step.description}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Chosen Coins (during/after backtracking) */}
      {chosenCoins && chosenCoins.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Chosen Coins</h4>
          <div className="bg-gray-900 rounded-lg p-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              {chosenCoins.map((c: number, idx: number) => (
                <span key={`${c}-${idx}`} className="px-2 py-1 rounded border border-green-600 bg-green-600/20 text-green-300 text-sm font-mono">{c}</span>
              ))}
            </div>
            <div className="text-gray-400 text-sm">
              Summary: {chosenSummary.length === 0 ? "-" : chosenSummary.map(([c, cnt]) => `${cnt}×${c}`).join(", ")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}