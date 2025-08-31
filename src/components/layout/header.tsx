"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-[var(--border)]">
      <div className="container-px max-w-7xl mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2">
            {/* Light theme logo */}
            <Image
              src="/logo-light.svg"
              alt="AlgoVista logo"
              width={32}
              height={32}
              priority
              className="logo-light h-8 w-8 rounded-md transition-transform duration-300 ease-out group-hover:rotate-[8deg] group-hover:scale-[1.06] will-change-transform shadow-sm group-hover:shadow-[0_6px_18px_var(--accent-shadow)]"
            />
            {/* Dark theme logo */}
            <Image
              src="/logo-dark.svg"
              alt="AlgoVista logo"
              width={32}
              height={32}
              priority
              className="logo-dark h-8 w-8 rounded-md transition-transform duration-300 ease-out group-hover:rotate-[8deg] group-hover:scale-[1.06] will-change-transform shadow-sm group-hover:shadow-[0_6px_18px_var(--accent-shadow)]"
            />
            <span className="font-semibold tracking-tight gradient-text">AlgoVista</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted">
            <Link href="/catalog" className="hover:text-[var(--foreground)]">Catalog</Link>
            <Link href="/about" className="hover:text-[var(--foreground)]">About</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="px-2.5 py-2 rounded-md hover:bg-[var(--glass)] text-muted"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}