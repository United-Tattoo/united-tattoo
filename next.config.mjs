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
}

export default nextConfig
