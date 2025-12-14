/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["my-proxy.com", ".my-proxy.com"],
      bodySizeLimit: "15mb", // Increased from default 1MB to accommodate file uploads
    },
  },
};

export default nextConfig;