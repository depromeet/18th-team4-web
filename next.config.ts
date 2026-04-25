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
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not || []), /url/] },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  output: 'standalone',
};

export default nextConfig;
