import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/poliledger",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
