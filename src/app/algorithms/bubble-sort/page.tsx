"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import Link from "next/link";
import leetcode from "@/data/leetcode.json";

const DEFAULT_ARRAY = [5, 1, 4, 2, 8];

type Step = {
  type: "compare" | "swap" | "done";
  i?: number;
  j?: number;
};

function bubbleSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = arr.slice();
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ type: "compare", i: j, j: j + 1 });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ type: "swap", i: j, j: j + 1 });
      }
    }
  }
  steps.push({ type: "done" });
  return steps;
}

export default function BubbleSortPage() {
  const [input, setInput] = useState<string>(DEFAULT_ARRAY.join(", "));
  const [speed, setSpeed] = useState<number>(600);
  const [running, setRunning] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const values = useMemo(() => {
    const nums = input
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    return nums.length ? nums : DEFAULT_ARRAY;
  }, [input]);

  const steps = useMemo(() => bubbleSortSteps(values), [values]);

  useEffect(() => {
    let timer: any;
    if (running && stepIndex < steps.length - 1) {
      timer = setTimeout(() => setStepIndex((s) => s + 1), speed);
    }
    return () => clearTimeout(timer);
  }, [running, stepIndex, steps.length, speed]);

  useEffect(() => {
    const width = 640;
    const height = 280;

    const svg = d3
      .select("#visual")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    svg.selectAll("*").remove();

    const x = d3
      .scaleBand()
      .domain(d3.range(values.length).map(String))
      .range([40, width - 20])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(values) ?? 10])
      .range([height - 30, 30]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - 30})`)
      .call(d3.axisBottom(x).tickFormat((d) => String(Number(d) + 1)))
      .selectAll("text")
      .style("fill", "#9CA3AF");

    const bars = svg
      .append("g")
      .selectAll("rect")
      .data(values)
      .join("rect")
      .attr("x", (_, i) => x(String(i))!)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d))
      .attr("height", (d) => y(0) - y(d))
      .attr("rx", 6)
      .style("fill", (_, i) => {
        const s = steps[stepIndex];
        if (s.type !== "done" && (i === s.i || i === s.j)) return "#10b981";
        return "#374151";
      });

    svg
      .append("text")
      .attr("x", 20)
      .attr("y", 20)
      .text(() => {
        const s = steps[stepIndex];
        if (s.type === "compare") return `Comparing index ${s.i} and ${s.j}`;
        if (s.type === "swap") return `Swapping index ${s.i} and ${s.j}`;
        return "Done";
      })
      .style("fill", "#D1D5DB")
      .style("font-size", "12px");
  }, [values, stepIndex, steps]);

  const lc = (leetcode as any)["bubble-sort"] as Array<{
    id: number;
    title: string;
    slug: string;
    difficulty: string;
  }>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bubble Sort</h1>
          <p className="text-gray-400">Visualize how Bubble Sort compares and swaps adjacent elements.</p>
        </div>
        <Link href="/catalog" className="text-sm text-emerald-400 hover:underline">Back to Catalog</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-4 lg:col-span-2">
          <svg id="visual" className="w-full h-[300px]" />
        </div>
        <div className="card p-4 space-y-3">
          <label className="text-sm font-medium">Input (comma or space-separated)</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/10 outline-none"
            placeholder="e.g. 5, 1, 4, 2, 8"
          />

          <label className="text-sm font-medium">Speed: {speed}ms</label>
          <input
            type="range"
            min={100}
            max={1200}
            step={50}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />

          <div className="flex items-center gap-2">
            <button className="btn" onClick={() => setRunning(true)}>Play</button>
            <button className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5" onClick={() => setRunning(false)}>Pause</button>
            <button className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5" onClick={() => setStepIndex((s) => Math.min(s + 1, steps.length - 1))}>Step</button>
            <button className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5" onClick={() => { setRunning(false); setStepIndex(0); }}>Reset</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-4 lg:col-span-2">
          <h2 className="font-semibold">Pseudocode</h2>
          <pre className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">
{`for i from 0 to n-2:
  for j from 0 to n-i-2:
    if a[j] > a[j+1]:
      swap a[j], a[j+1]`}
          </pre>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold">LeetCode Suggestions</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {lc.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <a
                  href={`https://leetcode.com/problems/${p.slug}/`}
                  target="_blank"
                  className="hover:underline"
                >
                  {p.title}
                </a>
                <span className="badge">{p.difficulty}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}