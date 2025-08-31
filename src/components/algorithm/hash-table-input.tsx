"use client";

import React, { useMemo, useState } from "react";
import { Plus, Shuffle, Trash2 } from "lucide-react";

type Strategy = "chaining" | "linear-probing" | "quadratic-probing";

type Operation = { type: "insert" | "search" | "delete"; key: number };

interface HashInputData {
  strategy: Strategy;
  tableSize: number;
  operations: Operation[];
}

interface HashTableInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function HashTableInput({ data, onDataChange }: HashTableInputProps) {
  const initial: HashInputData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) return data[0] as HashInputData;
    return {
      strategy: "chaining",
      tableSize: 7,
      operations: [
        { type: "insert", key: 10 },
        { type: "insert", key: 3 },
        { type: "insert", key: 17 },
        { type: "search", key: 10 },
        { type: "delete", key: 3 },
        { type: "search", key: 3 }
      ]
    };
  }, [data]);

  const [keyValue, setKeyValue] = useState("15");

  const updateData = (payload: Partial<HashInputData>) => {
    const merged: HashInputData = { ...initial, ...payload };
    onDataChange([merged]);
  };

  const addOperation = (type: Operation["type"]) => {
    const k = parseInt(keyValue);
    if (Number.isNaN(k)) return;
    updateData({ operations: [...initial.operations, { type, key: k }] });
    setKeyValue((k + 1).toString());
  };

  const removeOperation = (index: number) => {
    const ops = initial.operations.filter((_, i) => i !== index);
    updateData({ operations: ops });
  };

  const randomize = () => {
    const strategies: Strategy[] = ["chaining", "linear-probing", "quadratic-probing"];
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const tableSize = [5, 7, 8, 11, 13][Math.floor(Math.random() * 5)];
    const opTypes: Operation["type"][] = ["insert", "search", "delete"];
    const operations: Operation[] = Array.from({ length: 6 }, () => ({
      type: opTypes[Math.floor(Math.random() * opTypes.length)],
      key: Math.floor(Math.random() * 50)
    }));
    updateData({ strategy, tableSize, operations });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-sm text-muted">Collision Strategy</label>
          <select
            className="input w-full"
            value={initial.strategy}
            onChange={(e) => updateData({ strategy: e.target.value as Strategy })}
          >
            <option value="chaining">Chaining (Separate Lists)</option>
            <option value="linear-probing">Open Addressing: Linear Probing</option>
            <option value="quadratic-probing">Open Addressing: Quadratic</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted">Table Size</label>
          <input
            type="number"
            className="input w-full"
            value={initial.tableSize}
            min={3}
            max={23}
            onChange={(e) => updateData({ tableSize: Math.max(3, Math.min(23, parseInt(e.target.value) || 7)) })}
          />
        </div>
        <div className="flex items-end">
          <button onClick={randomize} className="btn w-full flex items-center gap-2"><Shuffle className="w-4 h-4" />Randomize</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="number"
          className="input"
          value={keyValue}
          onChange={(e) => setKeyValue(e.target.value)}
          placeholder="Key"
        />
        <button onClick={() => addOperation("insert")} className="btn bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"><Plus className="w-4 h-4" />Insert</button>
        <button onClick={() => addOperation("search")} className="btn bg-blue-600 hover:bg-blue-700">Search</button>
        <button onClick={() => addOperation("delete")} className="btn bg-red-600 hover:bg-red-700">Delete</button>
      </div>

      <div className="bg-gray-800 rounded-lg p-3">
        {initial.operations.length === 0 ? (
          <div className="text-center text-gray-500 py-2">No operations yet</div>
        ) : (
          <div className="space-y-2">
            {initial.operations.map((op, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-900 rounded p-2">
                <div className="text-sm text-gray-300">
                  <span className="uppercase font-semibold">{op.type}</span>
                  <span className="ml-2 font-mono">{op.key}</span>
                </div>
                <button onClick={() => removeOperation(idx)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}