/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // لا نوقف البناء بسبب ESLint (نفحص الأنواع فقط)
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
