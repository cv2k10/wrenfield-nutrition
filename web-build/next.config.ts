import type { NextConfig } from "next";

// Static export: Cloudflare serves out/ as assets and the Worker (worker/index.ts) handles /api.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
