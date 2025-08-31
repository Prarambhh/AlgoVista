import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use a separate distDir when NEXT_DIST_DIR is provided to avoid .next locking issues
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Allow Vercel builds to succeed even if ESLint or TS finds issues.
  // CI (GitHub Actions) will still enforce lint/type-check strictly.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
