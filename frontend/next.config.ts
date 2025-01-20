import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/dashboard/:path*",
        has: [
          {
            type: "cookie",
            key: "token", // Check if the cookie exists
          },
        ],
        destination: "/login", // Redirect to login if the token is not present
      },
    ];
  },
};

module.exports = nextConfig;
