import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables seamless local development proxying to Django backend
  // Same origin behavior ensures 7-day httpOnly cookies work effortlessly
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
