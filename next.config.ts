import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Every remote image is served by the Shopify CDN, which resizes on the
    // fly — so we let it do the work instead of the Next.js image optimizer.
    loader: "custom",
    loaderFile: "./src/lib/shopify/image-loader.ts",
  },
};

export default nextConfig;
