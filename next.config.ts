import type { NextConfig } from "next";

// The site is a single static page, so it is exported to plain files in /out
// and can be hosted anywhere (Vercel, Netlify, Cloudflare Pages, any web host).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
