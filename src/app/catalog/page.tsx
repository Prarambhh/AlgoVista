import algorithmsData from "@/data/algorithms.json";
import Link from "next/link";

// Raw JSON uses lowercase/slugs for categories; map them to human-friendly section titles
const categoryDisplayMap: Record<string, string> = {
  arrays: "Arrays",
  strings: "Strings",
  sorting: "Sorting",
  searching: "Searching",
  "linked-list": "Linked List",
  "stacks-queues": "Stacks & Queues",
  tree: "Trees",
  graph: "Graphs",
  "dynamic-programming": "Dynamic Programming",
  backtracking: "Backtracking",
  greedy: "Greedy",
  math: "Math",
  "data-structures": "Data Structures",
};

function toTitleFromSlug(slug: string): string {
  return slug
    .split(/[-_/]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function getDisplayCategory(raw: string): string {
  return categoryDisplayMap[raw] || toTitleFromSlug(raw);
}

// Order sections in a sensible way
const sectionOrder = [
  "Sorting",
  "Searching",
  "Graphs",
  "Trees",
  "Arrays",
  "Data Structures",
  "Dynamic Programming",
  "Strings",
  "Linked List",
  "Stacks & Queues",
  "Backtracking",
  "Greedy",
  "Math",
];

const difficultyColorMap: Record<"Easy" | "Medium" | "Hard", string> = {
  Easy: "bg-green-500/20 text-green-300 border-green-500/30",
  Medium: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Hard: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function CatalogPage() {
  const data = algorithmsData as Array<{
    id: string;
    title: string;
    category: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
  }>;

  // Group algorithms by display category
  const grouped: Record<string, typeof data> = {} as any;
  data.forEach((alg) => {
    const group = getDisplayCategory(alg.category);
    if (!grouped[group]) grouped[group] = [] as any;
    grouped[group].push(alg);
  });

  // Determine rendering order: known order first, then any additional categories alphabetically
  const presentGroups = Object.keys(grouped);
  const sortedGroups = [
    ...sectionOrder.filter((g) => presentGroups.includes(g)),
    ...presentGroups.filter((g) => !sectionOrder.includes(g)).sort(),
  ];

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Algorithm Catalog</h1>
        <p className="text-gray-400 leading-7">Browse algorithms by category and difficulty.</p>
      </div>

      {sortedGroups.map((group) => (
        <details key={group} className="rounded-lg border border-[var(--border)] overflow-hidden transition-all">
          <summary className="cursor-pointer list-none p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-2 hover:bg-[var(--glass)]">
            <h2 className="text-lg font-semibold text-center sm:text-left">{group}</h2>
            <span className="text-gray-400 text-sm">{grouped[group].length} items</span>
          </summary>
          <div className="px-3 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {grouped[group].map((alg) => (
                <Link
                  key={alg.id}
                  href={`/algorithms/${alg.id}`}
                  className="card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)] hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))]"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-center sm:text-left w-full">{alg.title}</h3>
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border ${difficultyColorMap[alg.difficulty]}`}
                    >
                      {alg.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 leading-7 line-clamp-2 text-center sm:text-left">{alg.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}