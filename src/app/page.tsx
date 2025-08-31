import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[70vh] flex flex-col gap-16">
      <section className="text-center">
        <div className="inline-flex items-center gap-2 badge mb-6">DSA Learning Platform</div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2]">
          Visualize. Understand. Master Algorithms.
        </h1>
        <p className="mt-6 text-gray-400 max-w-2xl mx-auto leading-8 sm:leading-9">
          Interactive, high-quality visualizations for 50+ core DSA algorithms with step-by-step animations,
          custom inputs, pseudocode, code samples, and curated LeetCode practice.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/catalog" className="btn">
            Browse Catalog <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/algorithms/bubble-sort"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          >
            <PlayCircle className="h-4 w-4" /> Try a demo
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
          <h3 className="font-semibold">Step-by-step Visualizations</h3>
          <p className="mt-3 text-sm text-gray-400 leading-7">Play, pause, step, reset controls with speed adjustment for each algorithm.</p>
        </div>
        <div className="card p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
          <h3 className="font-semibold">Code & Pseudocode</h3>
          <p className="mt-3 text-sm text-gray-400 leading-7">Switch between JS, Python, and Java plus universal pseudocode.</p>
        </div>
        <div className="card p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
          <h3 className="font-semibold">Practice Problems</h3>
          <p className="mt-3 text-sm text-gray-400 leading-7">5–6 curated LeetCode problems per algorithm to reinforce learning.</p>
        </div>
      </section>
    </div>
  );
}
