import type { Configuration as WebpackConfig } from 'webpack';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config: WebpackConfig) => {
    if (!Array.isArray(config.externals)) {
      config.externals = [];
    }
    config.externals.push({ canvas: 'canvas' });
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;