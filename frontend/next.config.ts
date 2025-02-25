import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "socialla.azurewebsites.net",
        pathname: "/Uploads/Users/**",
      },
      {
        protocol: "https",
        hostname: "sociallastorage.blob.core.windows.net",
        pathname: "/**",
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
