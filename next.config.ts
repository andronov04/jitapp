import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  rewrites: async () => {
    return [
      {
        source: '/@:username',
        destination: '/user/:username',
      },
    ];
  },
};

export default nextConfig;
