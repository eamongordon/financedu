import type { NextConfig } from "next";

if (!process.env.BLOB_HOSTNAME) {
  throw new Error('BLOB_HOSTNAME environment variable is required');
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.BLOB_HOSTNAME,
      },
    ],
  },
};

export default nextConfig;
