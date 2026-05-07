import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "bupyeong-renaissance-center.vercel.app",
          },
        ],
        destination: "https://bupyeong-renaissance.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
