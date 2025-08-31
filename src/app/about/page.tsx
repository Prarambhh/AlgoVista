import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 badge mb-4">About</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">About AlgoVista</h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-400 leading-8 sm:leading-9">
          AlgoVista is a learning companion for mastering core Data Structures & Algorithms
          through interactive, step-by-step visualizations. Explore algorithms, tweak inputs,
          follow pseudocode, and reinforce concepts with curated practice problems.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
          <h2 className="text-xl font-semibold">Our Mission</h2>
          <p className="mt-3 text-sm text-gray-400 leading-7">
            Make DSA approachable and engaging with clean visuals, clear explanations,
            and smooth controls so you can focus on building intuition.
          </p>
        </div>
        <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
          <h2 className="text-xl font-semibold">What you'll find</h2>
          <ul className="mt-3 text-sm text-gray-400 leading-7 list-disc pl-5 space-y-1.5">
            <li>Step-by-step animations with play/pause/step controls and speed settings</li>
            <li>Pseudocode and code samples to bridge the gap from idea to implementation</li>
            <li>Curated practice links to reinforce and test understanding</li>
          </ul>
        </div>
        <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
          <h2 className="text-xl font-semibold">Tech Stack</h2>
          <p className="mt-3 text-sm text-gray-400 leading-7">
            Built with Next.js, TypeScript, and Tailwind CSS. Visualizations leverage modern React
            patterns and a canvas-based background for smooth performance.
          </p>
        </div>
        <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
          <h2 className="text-xl font-semibold">Get Involved</h2>
          <p className="mt-3 text-sm text-gray-400 leading-7">
            Feedback and contributions are welcome. Found a bug or have an idea? Open an issue or
            reach out. We'd love to hear from you.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              View on GitHub
            </a>
            <Link href="/catalog" className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}