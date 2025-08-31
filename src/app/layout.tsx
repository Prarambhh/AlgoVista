import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Starfield } from "@/components/effects/starfield";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlgoVista — DSA Algorithms Visualizer",
  description:
    "Interactive, high-quality visualizations for 50+ DSA algorithms with step-by-step animations and learning resources.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Starfield />
          <Header />
          <main className="container-px max-w-7xl mx-auto py-8">{children}</main>
          <footer className="container-px max-w-7xl mx-auto py-10 text-sm text-gray-400">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
              <p>© {new Date().getFullYear()} AlgoVista. Built with Next.js.</p>
              <div className="flex items-center gap-4">
                <Link className="hover:underline" href="/">Home</Link>
                <Link className="hover:underline" href="/catalog">Catalog</Link>
                <a className="hover:underline" href="https://vercel.com" target="_blank">Deploy</a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
