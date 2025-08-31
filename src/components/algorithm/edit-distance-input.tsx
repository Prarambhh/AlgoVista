"use client";

import React, { useState, useEffect } from "react";
import { Shuffle } from "lucide-react";

interface EditDistanceInputProps {
  data: { string1: string; string2: string }[];
  onDataChange: (data: { string1: string; string2: string }[]) => void;
}

export default function EditDistanceInput({ data, onDataChange }: EditDistanceInputProps) {
  const [string1, setString1] = useState<string>("kitten");
  const [string2, setString2] = useState<string>("sitting");

  // Derive current data from props (AlgorithmPageTemplate passes an array)
  const current = Array.isArray(data) && data.length > 0 ? data[0] : { string1: "kitten", string2: "sitting" };

  // Keep local inputs in sync with prop data (e.g., when restored from URL)
  useEffect(() => {
    setString1(current.string1 ?? "");
    setString2(current.string2 ?? "");
  }, [current.string1, current.string2]);

  const updateData = (newString1: string, newString2: string) => {
    setString1(newString1);
    setString2(newString2);
    onDataChange([{ string1: newString1, string2: newString2 }]);
  };

  const generateRandomStrings = () => {
    const words = [
      "cat", "bat", "rat", "hat", "sat", "mat",
      "dog", "log", "fog", "hog", "jog", "bog",
      "run", "fun", "sun", "gun", "bun", "nun",
      "car", "bar", "far", "jar", "tar", "war",
      "pen", "ten", "men", "hen", "den", "zen"
    ];
    
    const word1 = words[Math.floor(Math.random() * words.length)];
    let word2 = words[Math.floor(Math.random() * words.length)];
    
    // Ensure different words
    while (word2 === word1) {
      word2 = words[Math.floor(Math.random() * words.length)];
    }
    
    updateData(word1, word2);
  };

  const loadSample = (sample1: string, sample2: string) => {
    updateData(sample1, sample2);
  };

  const samplePairs = [
    { name: "Classic Example", string1: "kitten", string2: "sitting", distance: 3 },
    { name: "Similar Words", string1: "saturday", string2: "sunday", distance: 3 },
    { name: "Programming", string1: "algorithm", string2: "logarithm", distance: 3 },
    { name: "Short Words", string1: "cat", string2: "dog", distance: 3 },
    { name: "One Empty", string1: "hello", string2: "", distance: 5 },
    { name: "Identical", string1: "test", string2: "test", distance: 0 },
    { name: "Reverse", string1: "abc", string2: "cba", distance: 2 },
    { name: "Insert Only", string1: "abc", string2: "aabbcc", distance: 3 }
  ];

  const getOperationHint = (s1: string, s2: string) => {
    if (s1 === s2) return "No operations needed";
    if (s1 === "") return `${s2.length} insertions`;
    if (s2 === "") return `${s1.length} deletions`;
    
    const lengthDiff = Math.abs(s1.length - s2.length);
    if (s1.length === s2.length) {
      return "Substitutions only";
    } else if (s1.length < s2.length) {
      return `Insertions and substitutions (${lengthDiff} min insertions)`;
    } else {
      return `Deletions and substitutions (${lengthDiff} min deletions)`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">String Configuration</h3>
        <p className="text-gray-400 text-sm">
          Configure two strings to find the minimum edit distance (Levenshtein distance) between them.
        </p>
      </div>

      {/* String Inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Source String:</label>
          <div className="relative">
            <input
              type="text"
              value={string1}
              onChange={(e) => updateData(e.target.value.toLowerCase(), string2)}
              placeholder="Enter source string (e.g., kitten)"
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
          <label className="text-sm text-gray-400">Target String:</label>
          <div className="relative">
            <input
              type="text"
              value={string2}
              onChange={(e) => updateData(string1, e.target.value.toLowerCase())}
              placeholder="Enter target string (e.g., sitting)"
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

      {/* Operation Hint */}
      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
        <div className="text-sm text-gray-400 mb-1">Expected Operations:</div>
        <div className="text-sm text-yellow-400">{getOperationHint(string1, string2)}</div>
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
                "{sample.string1}" → "{sample.string2}"
              </div>
              <div className="text-xs text-yellow-400">
                Edit Distance: {sample.distance}
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
          <div>• Operations: Insert, Delete, Replace (each costs 1)</div>
          <div>• Also known as Levenshtein Distance</div>
        </div>
      </div>
    </div>
  );
}