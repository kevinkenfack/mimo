import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['mimo-id'],
  serverExternalPackages: ['@resvg/resvg-js'],
};

export default nextConfig;
