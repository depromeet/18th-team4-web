import type { NextConfig } from 'next';

const API_PROXY_TARGET = process.env.API_PROXY_TARGET;

if (!API_PROXY_TARGET) {
  throw new Error('API_PROXY_TARGET is not set');
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_PROXY_TARGET}/api/:path*`,
      },
    ];
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.tsx',
      },
    },
  },

  images: { unoptimized: true },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  output: 'standalone',
};

export default nextConfig;
