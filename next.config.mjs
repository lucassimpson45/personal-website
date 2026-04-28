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
};

export default nextConfig;
