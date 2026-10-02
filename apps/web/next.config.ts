import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Directs Turbopack to resolve packages from the monorepo root (D:\elimix)
    root: path.join(process.cwd(), '../../'),
  },
};

export default nextConfig;