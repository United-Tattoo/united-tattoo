import createMDX from "@next/mdx"
import { withPayload } from "@payloadcms/next/withPayload"

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
  // Payload requires experimental features
  experimental: {
    reactCompiler: false,
  },
  // Webpack config for Cloudflare Workers compatibility (from official Payload D1 template)
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
}

const withMDX = createMDX({
  // MDX options can be added here
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

// Compose the plugins: MDX first, then Payload
// devBundleServerPackages: false is required for Cloudflare Workers compatibility
export default withPayload(withMDX(nextConfig), { devBundleServerPackages: false })
