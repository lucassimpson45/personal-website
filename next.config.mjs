/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },
  /**
   * Polling avoids EMFILE (“too many open files”) on macOS when native file
   * watchers are exhausted — without this, `next dev` can compile only
   * `/_not-found` and serve 404 for `/`.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 2000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  /**
   * Route-scoped Cache-Control: hashed build assets are immutable; public files get
   * a 24h edge/browser cache; document requests revalidate; API never caches.
   * Order matters — first matching source wins.
   */
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/photography/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/logos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/graphic-design/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
