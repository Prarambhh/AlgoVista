import Link from "next/link";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-center">
      <h1 className="text-3xl font-bold">Linked List Insert</h1>
      <p className="text-gray-400 leading-7">This visualization is under construction. In the meantime, explore related topics in the catalog.</p>
      <div className="flex justify-center gap-3">
        <Link href="/catalog" className="btn">Browse Catalog</Link>
        <Link href="/" className="btn surface">Go Home</Link>
      </div>
      <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
        <p className="text-muted">If you need this prioritized, let me know and I’ll implement it next.</p>
      </div>
    </div>
  );
}