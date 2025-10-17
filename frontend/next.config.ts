import type { NextConfig } from "next";

const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || '6767', 10);
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || `http://localhost:${BACKEND_PORT}`;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
      {
        source: "/ai/:path*",
        destination: `${BACKEND_ORIGIN}/ai/:path*`,
      },
    ];
  },
};

export default nextConfig;
