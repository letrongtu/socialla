import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5096", // Include the port used by your backend
        pathname: "/Uploads/Users/**", // Allow images from this specific path
      },
    ],
  },
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
