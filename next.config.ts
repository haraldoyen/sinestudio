import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // «Polet» er Vinmonopolets varemerke. Gamle lenker sendes videre.
  redirects() {
    return [{ source: "/polet", destination: "/i-butikken", permanent: true }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
