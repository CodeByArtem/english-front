import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ['./src/styles', './src'],
  },
  // Проксирование запросов /api/* на бэкенд (Render).
  // Это делает cookie first-party: браузер видит только домен Vercel
  // и не блокирует cookie в режиме инкогнито или при strict third-party policy.
  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
