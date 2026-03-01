/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add empty turbopack config to acknowledge we're using it
  turbopack: {},
  
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
}

module.exports = nextConfig