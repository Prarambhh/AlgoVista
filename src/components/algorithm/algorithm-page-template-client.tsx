"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronDown, Play, Pause, SkipForward, RotateCcw, Settings, Share2 } from "lucide-react";
import { VisualizationStep } from "@/lib/visualization-utils";
import { AlgorithmPageTemplateProps } from "./algorithm-page-template";

export default function AlgorithmPageTemplateClient({
  title,
  description,
  timeComplexity,
  spaceComplexity,
  visualizationComponent: VisualizationComponent,
  generateSteps,
  initialData,
  dataInputComponent: DataInputComponent,
  pseudocode,
  relatedProblems,
  category,
  code
}: AlgorithmPageTemplateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<any[]>(initialData);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const hydratedFromUrl = useRef(false);
  const [copied, setCopied] = useState(false);
  const [Prism, setPrism] = useState<any>(null);
  const didFirstUrlSync = useRef(false);

  // Code tab state
  // Language mapping for display names to Prism identifiers
  const langDisplayToPrism: Record<string, string> = {
    'JavaScript': 'javascript',
    'Python': 'python', 
    'Java': 'java',
    'C++': 'cpp',
    'TypeScript': 'typescript'
  };
  
  // Prefer provided languages, fallback to common trio so every page shows tabs
  const providedLangs = Object.keys(code || {});
  const defaultLangs = ["JavaScript", "Python", "Java"];
  
  // Convert lowercase keys to display names for backward compatibility
  const displayLangs = providedLangs.map(lang => {
    const entries = Object.entries(langDisplayToPrism);
    const found = entries.find(([display, prism]) => prism === lang.toLowerCase());
    return found ? found[0] : lang;
  });
  
  const languages = displayLangs.length > 0 ? displayLangs : defaultLangs;
  const preferredOrder = ["JavaScript", "Python", "Java", "C++", "TypeScript"]; // future-friendly
  const defaultLang = languages
    .slice()
    .sort(
      (a, b) =>
        (preferredOrder.indexOf(a) === -1 ? 999 : preferredOrder.indexOf(a)) -
        (preferredOrder.indexOf(b) === -1 ? 999 : preferredOrder.indexOf(b))
    )[0];
  const [selectedLang, setSelectedLang] = useState<string | undefined>(defaultLang);
  useEffect(() => {
    // Reset selected language when available language list changes
    if (languages.length > 0) {
      const nextDefault = languages
        .slice()
        .sort(
          (a, b) =>
            (preferredOrder.indexOf(a) === -1 ? 999 : preferredOrder.indexOf(a)) -
            (preferredOrder.indexOf(b) === -1 ? 999 : preferredOrder.indexOf(b))
        )[0];
      setSelectedLang(nextDefault);
    } else {
      setSelectedLang(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages.join("|")]);  

  // Helper to resolve code text regardless of key casing (e.g., 'JavaScript' vs 'javascript')
  const resolveCodeFor = (lang: string): string | undefined => {
    if (!code) return undefined;
    const prismKey = langDisplayToPrism[lang] || lang.toLowerCase();
    return (
      code[prismKey] ??
      code[lang] ??
      code[lang.toLowerCase()] ??
      (typeof prismKey === 'string' ? code[prismKey.toLowerCase?.()] : undefined)
    );
  };

  useEffect(() => {
    const loadPrism = async () => {
      const prism = await import("prismjs");
      await import("prismjs/components/prism-javascript");
      await import("prismjs/components/prism-python");
      await import("prismjs/components/prism-java");
      await import("prismjs/components/prism-typescript");
      await import("prismjs/components/prism-cpp");
      setPrism(prism);
    };
    loadPrism();
  }, []);

  useEffect(() => {
    if (Prism && codeRef.current && selectedLang) {
      const element = codeRef.current;
      const currentCode = resolveCodeFor(selectedLang) 
        || `// ${selectedLang} implementation coming soon for ${title}.\n// Meanwhile, follow the pseudocode above to implement it in ${selectedLang}.\n`;
      element.innerHTML = '';
      element.textContent = currentCode;
      const langClass = `language-${langDisplayToPrism[selectedLang] || selectedLang.toLowerCase()}`;
      element.className = langClass;
      Prism.highlightElement(element);
    }
  }, [Prism, selectedLang, code, title]);

  // Keep a stable reference to generateSteps to avoid resetting steps on unrelated re-renders
  const generateStepsRef = useRef(generateSteps);
  useEffect(() => {
    generateStepsRef.current = generateSteps;
  }, [generateSteps]);

  // Helper to normalize and compare search params (ignore Next.js internal params like _rsc)
  const normalizeSearchParams = (sp: URLSearchParams) => {
    const entries = Array.from(sp.entries()).filter(([k]) => k !== "_rsc");
    entries.sort(([ak, av], [bk, bv]) => (ak === bk ? av.localeCompare(bv) : ak.localeCompare(bk)));
    return entries.map(([k, v]) => `${k}=${v}`).join("&");
  };

  // Hydrate from URL (once)
  useEffect(() => {
    if (hydratedFromUrl.current) return;
    hydratedFromUrl.current = true;
    try {
      const sp = new URLSearchParams(searchParams?.toString());
      const stepParam = sp.get("step");
      const speedParam = sp.get("speed");
      const playParam = sp.get("play");
      const dataParam = sp.get("data");
      if (speedParam) setSpeed(Math.max(100, Math.min(2000, Number(speedParam) || 600)));
      if (playParam === "1") setIsPlaying(true);
      if (dataParam) {
        let parsed: any = null;
        try {
          parsed = JSON.parse(decodeURIComponent(dataParam));
        } catch (_e1) {
          try {
            parsed = JSON.parse(decodeURIComponent(decodeURIComponent(dataParam)));
          } catch (_e2) {
            parsed = null;
          }
        }
        if (Array.isArray(parsed)) setData(parsed);
      }
      if (stepParam) setCurrentStep(Math.max(0, Number(stepParam) || 0));
    } catch {
      // ignore malformed params
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate steps when data changes (use ref-stable function to avoid resets on every render)
  useEffect(() => {
    const newSteps = generateStepsRef.current(data);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [data]);

  // Auto-play progression
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const id = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
      setIntervalId(id);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || target?.getAttribute("contenteditable") === "true";
      if (isTyping) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setCurrentStep(prev => Math.max(prev - 1, 0));
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStep(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [steps.length]);

  // URL syncing (shallow)
  useEffect(() => {
    // Skip the very first run to avoid an immediate navigation replace right after hydration
    if (!didFirstUrlSync.current) {
      didFirstUrlSync.current = true;
      return;
    }

    const sp = new URLSearchParams(searchParams?.toString());
    sp.set("step", String(currentStep));
    sp.set("speed", String(speed));
    sp.set("play", isPlaying ? "1" : "0");
    try {
      const encoded = encodeURIComponent(JSON.stringify(data));
      sp.set("data", encoded);
    } catch {
      // ignore serialization failure
    }
    // Remove Next.js internal param to avoid noisy navigations
    sp.delete("_rsc");

    const desired = normalizeSearchParams(sp);
    const current = normalizeSearchParams(new URLSearchParams(searchParams?.toString()));

    if (desired !== current) {
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    }
  }, [currentStep, speed, isPlaying, data, pathname, router, searchParams]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const stepForward = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const stepBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleDataChange = (newData: any[]) => {
    setData(newData);
  };

  const currentStepData = steps[currentStep] || { type: "init", description: "Ready to start", data: {} };

  // Result helpers (for Sorting algorithms)
  const isSortingCategory = typeof category === 'string' && category.toLowerCase().includes('sorting');
  const lastStep = steps.length > 0 ? steps[steps.length - 1] : undefined;
  const finalArray = Array.isArray(lastStep?.data)
    ? (lastStep!.data as any[])
    : (lastStep && Array.isArray((lastStep as any).data?.arr))
      ? ((lastStep as any).data.arr as any[])
      : (lastStep && Array.isArray((lastStep as any).data?.array))
        ? ((lastStep as any).data.array as any[])
        : null;
  const currentArray = Array.isArray((currentStepData as any)?.data)
    ? ((currentStepData as any).data as any[])
    : Array.isArray((currentStepData as any)?.data?.arr)
      ? ((currentStepData as any).data.arr as any[])
      : Array.isArray((currentStepData as any)?.data?.array)
        ? ((currentStepData as any).data.array as any[])
        : (Array.isArray(data) ? data : null);
  const isAtEnd = steps.length > 0 && currentStep >= steps.length - 1;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-300 bg-green-500/20 border-green-500/30";
      case "Medium": return "text-orange-300 bg-orange-500/20 border-orange-500/30";
      case "Hard": return "text-red-300 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const [codeCopied, setCodeCopied] = useState(false);
  const [isPseudocodeExpanded, setIsPseudocodeExpanded] = useState(true);
  const [isCodeExpanded, setIsCodeExpanded] = useState(true);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopyCode = async () => {
    if (!selectedLang || !code) return;
    const codeText = resolveCodeFor(selectedLang);
    if (!codeText) return;
    try {
      await navigator.clipboard.writeText(codeText);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-20 h-72 w-72 blur-3xl opacity-40 bg-blob-emerald" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 blur-3xl opacity-40 bg-blob-sky" />
      </div>

      {/* Header */}
      <div className="glass border-b border-[var(--border)]">
        <div className="container-px py-5">
          <div className="flex items-center gap-4">
            <Link 
              href="/catalog"
              className="flex items-center gap-2 text-muted hover:text-[var(--foreground)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Catalog
            </Link>
            <div>
              <h1 className="text-2xl font-bold gradient-text leading-7">{title}</h1>
              <p className="text-muted leading-7">{category}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-px py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Visualization */}
          <div className="lg:col-span-2 space-y-7">
            {/* Algorithm Info */}
            <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
              <p className="text-muted mb-4 leading-7">{description}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-muted">Time:</span>
                  <span className="text-blue-400 font-mono ml-2">{timeComplexity}</span>
                </div>
                <div>
                  <span className="text-muted">Space:</span>
                  <span className="text-blue-400 font-mono ml-2">{spaceComplexity}</span>
                </div>
              </div>
            </div>

            {/* Input Controls */}
            {DataInputComponent && (
              <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 leading-7">Input Data</h3>
                <DataInputComponent data={data} onDataChange={handleDataChange} />
              </div>
            )}

            {/* Visualization */}
            <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--foreground)] leading-7">Visualization</h3>
                <div className="flex items-center gap-2">
                  <button onClick={handleShare} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-[var(--muted)] hover:brightness-95 border border-[var(--border)] text-[var(--foreground)] transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Share"}
                  </button>
                  <Settings className="w-4 h-4 text-muted" />
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="bg-[var(--muted)] text-[var(--foreground)] text-sm rounded px-2 py-1 border border-[var(--border)]"
                  >
                    <option value={200}>Fast</option>
                    <option value={600}>Normal</option>
                    <option value={1000}>Slow</option>
                  </select>
                </div>
              </div>

              <div className="surface p-4 mb-4 transition-colors">
                <VisualizationComponent 
                  step={currentStepData}
                  data={data}
                  onDataChange={handleDataChange}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={isPlaying ? pause : play}
                    className="btn flex items-center gap-2 glow-accent"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    onClick={stepForward}
                    className="btn flex items-center gap-2"
                    disabled={currentStep >= steps.length - 1}
                  >
                    <SkipForward className="w-4 h-4" />
                    Step
                  </button>
                  <button
                    onClick={stepBack}
                    className="btn flex items-center gap-2"
                    disabled={currentStep <= 0}
                  >
                    <RotateCcw className="w-4 h-4 rotate-180" />
                    Back
                  </button>
                  <button
                    onClick={reset}
                    className="btn flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
                <div className="text-sm text-muted">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
            </div>
 
            {/* Always-visible Result for Sorting Algorithms */}
            {isSortingCategory && (
              <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3 leading-7">
                  {isAtEnd ? 'Sorted Array' : 'Current Array'}
                </h3>
                <div className="surface p-3 border border-[var(--border)] rounded">
                  {Array.isArray(currentArray) && currentArray.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentArray.map((val, idx) => (
                        <span key={idx} className="badge border text-[var(--foreground)] bg-[var(--muted)]">
                          {String(val)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted">No array data</div>
                  )}
                </div>
              </div>
            )}

            {/* Pseudocode */}
            <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--foreground)] leading-7">Pseudocode</h3>
                <button
                  onClick={() => setIsPseudocodeExpanded(!isPseudocodeExpanded)}
                  className="flex items-center gap-1 text-sm text-muted hover:text-[var(--foreground)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/20 border border-transparent px-2 py-1 rounded transition-all duration-200"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${isPseudocodeExpanded ? 'rotate-180' : ''}`} />
                  {isPseudocodeExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
              {isPseudocodeExpanded && (
                <div className="text-sm space-y-1.5">
                  {(pseudocode || []).map((line, index) => (
                    <div
                      key={index}
                      className={`flex items-start leading-7 rounded ${index === (currentStepData?.data?.pseudocodeLine ?? -1) ? 'bg-[var(--muted)] px-2 py-0.5' : ''}`}
                    >
                      <span
                        className={`w-6 text-right mr-3 ${index === (currentStepData?.data?.pseudocodeLine ?? -1) ? 'text-[var(--accent)] font-semibold' : 'text-muted'}`}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={`${index === (currentStepData?.data?.pseudocodeLine ?? -1) ? 'text-[var(--foreground)] font-medium' : 'text-[var(--foreground)]'}`}
                      >
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Code Samples (optional) */}
            {selectedLang && (
              <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] leading-7">Code</h3>
                  <div className="flex items-center gap-2">
                    {isCodeExpanded && (
                      <>
                        <div className="flex items-center gap-1 bg-[var(--muted)] p-1 rounded border border-[var(--border)]">
                          {languages.map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setSelectedLang(lang)}
                              className={`text-xs px-2 py-1 rounded transition-colors ${selectedLang === lang ? 'bg-[var(--accent)] text-white' : 'hover:bg-[var(--accent-muted)] text-[var(--foreground)]'}`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                        <button onClick={handleCopyCode} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-[var(--muted)] hover:brightness-95 border border-[var(--border)] text-[var(--foreground)] transition-colors">
                          {codeCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-[var(--muted)] hover:brightness-95 border border-[var(--border)] text-[var(--foreground)] transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isCodeExpanded ? 'rotate-180' : ''}`} />
                      {isCodeExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                </div>

                {isCodeExpanded && (
                  <div className="surface border border-[var(--border)] rounded p-3 overflow-auto">
                    <pre className="text-xs sm:text-sm leading-6 whitespace-pre font-mono text-[var(--foreground)]">
                      <code ref={codeRef} className={`language-${selectedLang ? (langDisplayToPrism[selectedLang] || selectedLang.toLowerCase()) : ''}`}>
{selectedLang ? (resolveCodeFor(selectedLang) || `// ${selectedLang} implementation coming soon for ${title}.\n// Meanwhile, follow the pseudocode above to implement it in ${selectedLang}.`) : ''}
                      </code>
                    </pre>
                  </div>
                )}
               </div>
             )}

            {/* Related LeetCode Problems */}
            <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 leading-7">Related Problems</h3>
              <div className="space-y-3">
                {relatedProblems.map((problem) => (
                  <a
                    key={problem.id}
                    href={`https://leetcode.com/problems/${problem.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 surface border border-[var(--border)] rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)] hover:brightness-100"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[var(--foreground)] text-sm font-medium truncate leading-7">
                          {problem.title}
                        </h4>
                        <p className="text-muted text-xs">#{problem.id}</p>
                      </div>
                      <span className={`badge border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-7">
            {/* Current Step */}
            <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 leading-7">Current Step</h3>
              <p className="text-sm text-muted leading-7">{currentStepData?.description || "Ready to start"}</p>
            </div>

            {/* Progress */}
            <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 leading-7">Progress</h3>
              <div className="w-full bg-[var(--muted)] rounded h-2">
                <div
                  className="h-2 rounded bg-[var(--accent)] transition-all"
                  style={{ width: `${steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0}%` }}
                />
              </div>
              <div className="text-xs text-muted mt-2">{currentStep + 1} / {steps.length}</div>
            </div>
 
             {/* moved to main visualization area */ false && isSortingCategory && isAtEnd && finalArray && (
               <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-shadow)]">
                 <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3 leading-7">Sorted Array</h3>
                 <div className="surface p-3 border border-[var(--border)] rounded">
                   <div className="flex flex-wrap gap-2">
                     {finalArray?.map((val, idx) => (
                       <span key={idx} className="badge border text-[var(--foreground)] bg-[var(--muted)]">
                         {String(val)}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}