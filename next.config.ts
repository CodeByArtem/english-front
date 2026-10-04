import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ['./src/styles', './src'],
  },
};

export default nextConfig;
