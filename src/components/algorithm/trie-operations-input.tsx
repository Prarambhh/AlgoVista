"use client";

import React, { useMemo, useState } from "react";

export type TrieOperation = {
  type: "insert" | "search";
  word: string;
};

export interface TrieOpsData {
  initialWords: string[];
  operations: TrieOperation[];
}

export default function TrieOperationsInput({
  data,
  onDataChange,
}: {
  data: any[];
  onDataChange: (data: any[]) => void;
}) {
  const parsed: TrieOpsData = useMemo(() => {
    const obj = Array.isArray(data) && data.length > 0 ? (data[0] as TrieOpsData) : { initialWords: [], operations: [] };
    const initialWords = Array.isArray(obj.initialWords) ? obj.initialWords : [];
    const operations = Array.isArray(obj.operations) ? obj.operations.filter(op => op && typeof op.word === "string" && (op.type === "insert" || op.type === "search")) : [];
    return { initialWords, operations };
  }, [data]);

  const [initialWordsText, setInitialWordsText] = useState<string>(parsed.initialWords.join(", "));
  const [opType, setOpType] = useState<"insert" | "search">("insert");
  const [opWord, setOpWord] = useState<string>("");

  const applyInitialWords = (text: string) => {
    const words = text
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    onDataChange([{ initialWords: words, operations: parsed.operations }]);
  };

  const addOperation = () => {
    const w = opWord.trim();
    if (!w) return;
    const newOps = [...parsed.operations, { type: opType, word: w } as TrieOperation];
    onDataChange([{ initialWords: parsed.initialWords, operations: newOps }]);
    setOpWord("");
  };

  const removeOperation = (idx: number) => {
    const newOps = parsed.operations.filter((_, i) => i !== idx);
    onDataChange([{ initialWords: parsed.initialWords, operations: newOps }]);
  };

  const clearOperations = () => {
    onDataChange([{ initialWords: parsed.initialWords, operations: [] }]);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm text-muted">Initial dictionary words (comma-separated)</label>
        <input
          className="input w-full"
          value={initialWordsText}
          onChange={(e) => {
            setInitialWordsText(e.target.value);
            applyInitialWords(e.target.value);
          }}
          placeholder="e.g., trie, tree, algo"
        />
        <div className="text-xs text-gray-400">These words will be inserted into the trie before executing the operations below.</div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted">Add operation</label>
        <div className="flex gap-2">
          <select
            className="input w-36"
            value={opType}
            onChange={(e) => setOpType(e.target.value as "insert" | "search")}
          >
            <option value="insert">insert</option>
            <option value="search">search</option>
          </select>
          <input
            className="input flex-1"
            value={opWord}
            onChange={(e) => setOpWord(e.target.value)}
            placeholder={opType === "insert" ? "word to insert" : "word to search"}
            onKeyDown={(e) => {
              if (e.key === "Enter") addOperation();
            }}
          />
          <button className="btn" onClick={addOperation}>Add</button>
          <button className="btn btn-secondary" onClick={clearOperations}>Clear</button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted">Operation sequence</label>
        {parsed.operations.length === 0 ? (
          <div className="text-sm text-gray-400">No operations added.</div>
        ) : (
          <ul className="space-y-2">
            {parsed.operations.map((op, idx) => (
              <li key={idx} className="flex items-center justify-between p-2 rounded border border-gray-700 bg-gray-900">
                <div className="text-sm text-white">
                  <span className="px-2 py-0.5 rounded bg-gray-800 mr-2 text-gray-300">{idx + 1}</span>
                  <span className={op.type === "insert" ? "text-emerald-300" : "text-sky-300"}>{op.type.toUpperCase()}</span>
                  <span className="text-gray-400 ml-2">"{op.word}"</span>
                </div>
                <button className="btn btn-danger" onClick={() => removeOperation(idx)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 bg-gray-800 rounded-lg text-sm text-gray-300">
        Summary: {parsed.initialWords.length} initial words, {parsed.operations.length} operations
      </div>
    </div>
  );
}