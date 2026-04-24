/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
