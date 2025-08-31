import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use a separate distDir when NEXT_DIST_DIR is provided to avoid .next locking issues
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /* config options here */
};

export default nextConfig;
