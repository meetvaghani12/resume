const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Add this line
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.dev.to',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media2.dev.to',
        pathname: '**',
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        dns: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  transpilePackages: [
    'react-fast-marquee',
    'lottie-react',
  ],
}

module.exports = nextConfig