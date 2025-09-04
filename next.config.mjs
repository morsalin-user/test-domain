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
      bodySizeLimit: '100mb', // Set to your desired limit (e.g., '10mb', '50mb', '100mb')
    },
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark native modules as externals so webpack ignores bundling them
      config.externals.push({
        '@napi-rs/snappy-linux-x64-musl': 'commonjs @napi-rs/snappy-linux-x64-musl',
        'snappy': 'commonjs snappy',
      });
    }

    // Ignore .node native files during build
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    });

    return config;
  },
}

export default nextConfig
