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
   * Avoid intermediate caches serving stale HTML (e.g. Vercel x-vercel-cache: STALE).
   * Browsers and CDNs should revalidate; use no-store for strongest freshness.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
