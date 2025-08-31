"use client";

import React, { useState } from "react";
import { Shuffle } from "lucide-react";

interface LCSInputProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function LCSInput({ data, onDataChange }: LCSInputProps) {
  const [string1, setString1] = useState<string>("ABCDGH");
  const [string2, setString2] = useState<string>("AEDFHR");

  // Resolve strings from provided data shape (AlgorithmPageTemplate passes an array)
  const lcsData: { string1: string; string2: string } = Array.isArray(data) && data.length > 0
    ? (data[0] as { string1: string; string2: string })
    : { string1: "ABCDGH", string2: "AEDFHR" };

  // Keep local input state in sync with props (e.g., when restored from URL)
  React.useEffect(() => {
    setString1(lcsData.string1 || "");
    setString2(lcsData.string2 || "");
  }, [lcsData.string1, lcsData.string2]);

  const updateData = (newString1: string, newString2: string) => {
    setString1(newString1);
    setString2(newString2);
    onDataChange([{ string1: newString1, string2: newString2 }]);
  };

  const generateRandomStrings = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length1 = Math.floor(Math.random() * 6) + 4; // 4-9 chars
    const length2 = Math.floor(Math.random() * 6) + 4; // 4-9 chars
    
    const newString1 = Array.from({ length: length1 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    
    const newString2 = Array.from({ length: length2 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    
    updateData(newString1, newString2);
  };

  const loadSample = (sample1: string, sample2: string) => {
    updateData(sample1, sample2);
  };

  const samplePairs = [
    { name: "Basic Example", string1: "ABCDGH", string2: "AEDFHR", lcs: "ADH" },
    { name: "DNA Sequences", string1: "AGGTAB", string2: "GXTXAYB", lcs: "GTAB" },
    { name: "Common Words", string1: "PROGRAMMING", string2: "ALGORITHM", lcs: "RGRM" },
    { name: "No Common", string1: "ABC", string2: "DEF", lcs: "" },
    { name: "Identical", string1: "HELLO", string2: "HELLO", lcs: "HELLO" },
    { name: "One Empty", string1: "TEST", string2: "", lcs: "" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">String Configuration</h3>
        <p className="text-gray-400 text-sm">
          Configure two strings to find their Longest Common Subsequence (LCS).
        </p>
      </div>

      {/* String Inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">First String:</label>
          <div className="relative">
            <input
              type="text"
              value={string1}
              onChange={(e) => updateData(e.target.value.toUpperCase(), string2)}
              placeholder="Enter first string (e.g., ABCDGH)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none font-mono"
            />
            <div className="absolute right-2 top-2 text-xs text-gray-500">
              Length: {string1.length}
            </div>
          </div>
          {string1 && (
            <div className="flex flex-wrap gap-1 p-2 bg-gray-900 rounded border border-gray-700">
              {string1.split('').map((char, index) => (
                <div
                  key={index}
                  className="w-8 h-8 border border-blue-500 bg-blue-900/40 text-blue-300 rounded flex items-center justify-center text-sm font-mono"
                >
                  {char}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Second String:</label>
          <div className="relative">
            <input
              type="text"
              value={string2}
              onChange={(e) => updateData(string1, e.target.value.toUpperCase())}
              placeholder="Enter second string (e.g., AEDFHR)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none font-mono"
            />
            <div className="absolute right-2 top-2 text-xs text-gray-500">
              Length: {string2.length}
            </div>
          </div>
          {string2 && (
            <div className="flex flex-wrap gap-1 p-2 bg-gray-900 rounded border border-gray-700">
              {string2.split('').map((char, index) => (
                <div
                  key={index}
                  className="w-8 h-8 border border-green-500 bg-green-900/40 text-green-300 rounded flex items-center justify-center text-sm font-mono"
                >
                  {char}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Quick Actions:</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={generateRandomStrings}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2 text-sm"
          >
            <Shuffle size={14} />
            Random
          </button>
          <button
            onClick={() => updateData("", "")}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Clear
          </button>
          <button
            onClick={() => updateData(string2, string1)}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Swap
          </button>
        </div>
      </div>

      {/* Sample Pairs */}
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Sample String Pairs:</div>
        <div className="grid grid-cols-1 gap-2">
          {samplePairs.map((sample, index) => (
            <button
              key={index}
              onClick={() => loadSample(sample.string1, sample.string2)}
              className="p-3 bg-gray-800 border border-gray-700 rounded hover:border-gray-600 text-left"
            >
              <div className="text-sm text-white font-medium">{sample.name}</div>
              <div className="text-xs text-gray-400 font-mono">
                "{sample.string1}" vs "{sample.string2}"
              </div>
              <div className="text-xs text-yellow-400 font-mono">
                LCS: "{sample.lcs}" (length: {sample.lcs.length})
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
        <div className="text-sm text-gray-400 mb-1">Algorithm Info:</div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>• Time Complexity: O(m × n) where m, n are string lengths</div>
          <div>• Space Complexity: O(m × n) for the DP table</div>
          <div>• Finds longest subsequence (not substring) common to both strings</div>
        </div>
      </div>
    </div>
  );
}