/** @type {import('next').NextConfig} */
const nextConfig = {
  // 워크스페이스 루트 경고 해결
  outputFileTracingRoot: undefined,
  
  // 이미지 최적화 (Vercel CDN)
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // 프로덕션 최적화
  reactStrictMode: true,
  
  // 번들 크기 분석 (개발용)
  // webpack: (config, { dev }) => {
  //   if (!dev) {
  //     config.optimization.minimize = true
  //   }
  //   return config
  // },
}

export default nextConfig
