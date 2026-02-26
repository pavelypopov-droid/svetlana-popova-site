/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@keystatic/core', '@keystatic/next'],
  },
}

export default nextConfig
