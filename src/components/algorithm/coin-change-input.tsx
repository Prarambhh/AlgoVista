"use client";

import React, { useEffect, useState } from "react";
import { Shuffle, RotateCcw } from "lucide-react";

interface CoinChangeInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function CoinChangeInput({ data, onDataChange }: CoinChangeInputProps) {
  const initial = (Array.isArray(data) && data[0]) || { coins: [1, 2, 5], amount: 11 };
  const [coinsStr, setCoinsStr] = useState<string>((initial.coins || [1,2,5]).join(", "));
  const [amount, setAmount] = useState<string>(String(initial.amount ?? 11));

  // Sync local state when parent data changes (including hydration from URL)
  useEffect(() => {
    const d0 = (Array.isArray(data) && data[0]) || { coins: [1, 2, 5], amount: 11 };
    const coinsS = (Array.isArray(d0.coins) ? d0.coins : [1,2,5]).join(", ");
    const amtS = String(d0.amount ?? 11);
    setCoinsStr(coinsS);
    setAmount(amtS);
  }, [data]);

  const parseCoins = (s: string): number[] => {
    return s
      .split(/[ ,]+/)
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((x) => Number.isFinite(x) && x > 0)
      .sort((a, b) => a - b);
  };

  const update = (coinsS: string, amtS: string) => {
    setCoinsStr(coinsS);
    setAmount(amtS);
    const parsed = parseCoins(coinsS);
    onDataChange([{ coins: parsed, amount: Number(amtS) || 0 }]);
  };

  const randomize = () => {
    const pool = [1,2,3,4,5,7,10,11,13,15,20,25];
    const k = Math.floor(Math.random() * 4) + 2; // 2..5 coins
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const pick = Array.from(new Set(shuffled.slice(0, k))).sort((a,b)=>a-b);
    const amt = Math.floor(Math.random() * 50) + 1;
    update(pick.join(", "), String(amt));
  };

  const reset = () => {
    update("1, 2, 5", "11");
  };

  const applyPreset = (preset: "classic" | "us" | "unreachable" | "medium") => {
    if (preset === "classic") update("1, 2, 5", "11");
    else if (preset === "us") update("1, 5, 10, 25", "63");
    else if (preset === "unreachable") update("2", "3");
    else if (preset === "medium") update("1, 3, 4", "25");
  };

  const hint = (() => {
    const c = parseCoins(coinsStr);
    const a = Number(amount) || 0;
    if (a === 0) return "Zero amount: 0 coins";
    if (c.length === 0) return "No coins provided";
    const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));
    const g = c.reduce((acc, v) => gcd(acc, v), c[0]);
    if (a % g !== 0) return `Unreachable: amount not multiple of gcd(${c.join(",")})=${g}`;
    return `Try combining coins to reach ${a}`;
  })();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Coin Denominations</label>
        <input
          type="text"
          value={coinsStr}
          onChange={(e) => update(e.target.value, amount)}
          placeholder="e.g., 1, 2, 5"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {parseCoins(coinsStr).map((c, i) => (
            <span key={i} className="px-2 py-1 rounded border border-gray-600 bg-gray-800 text-white text-xs font-mono">{c}</span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Target Amount</label>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => update(coinsStr, e.target.value)}
          placeholder="11"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => applyPreset("classic")} className="btn btn-xs">Preset: 1,2,5 | 11</button>
        <button onClick={() => applyPreset("us")} className="btn btn-xs">Preset: 1,5,10,25 | 63</button>
        <button onClick={() => applyPreset("medium")} className="btn btn-xs">Preset: 1,3,4 | 25</button>
        <button onClick={() => applyPreset("unreachable")} className="btn btn-xs">Preset: 2 | 3 (no solution)</button>
      </div>

      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 text-sm text-gray-300">
        Hint: <span className="text-yellow-300">{hint}</span>
      </div>

      <div className="flex gap-2">
        <button onClick={randomize} className="btn btn-sm flex items-center gap-2">
          <Shuffle className="w-4 h-4" /> Random
        </button>
        <button onClick={reset} className="btn btn-sm flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
}