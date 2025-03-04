import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // 完全关闭构建时 TS 校验
  },
  eslint: {
    ignoreDuringBuilds: true, // 同时关闭 ESLint
  },
};

export default nextConfig;
