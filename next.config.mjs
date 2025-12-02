import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Must be unoptimized for Cloudflare Workers compatibility
    // Next.js Image component requires Node.js APIs not available in Workers runtime
    unoptimized: true,
  },
  output: "standalone",
  // Enable MDX pages
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
}

const withMDX = createMDX({
  // MDX options can be added here
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
