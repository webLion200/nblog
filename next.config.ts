import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // 完全关闭构建时 TS 校验
  },
  eslint: {
    ignoreDuringBuilds: true, // 同时关闭 ESLint
  },
  experimental: {
    useCache: true,
    dynamicIO: true,
    cacheLife: {
      blog: {
        stale: 1800, // 30分钟客户端缓存
        revalidate: 60, // 1分钟服务端重验证
        expire: 3600, // 24小时强制过期
      },
      default: {
        // 默认策略
        stale: 300,
        revalidate: 15,
        expire: 3600,
      },
    },
  },
};

export default nextConfig;
