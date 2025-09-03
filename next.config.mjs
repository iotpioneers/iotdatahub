/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'ws': 'commonjs ws',
        'cors': 'commonjs cors',
        'bcrypt': 'commonjs bcrypt',
        'jsonwebtoken': 'commonjs jsonwebtoken',
        'nodemailer': 'commonjs nodemailer',
        'mongodb': 'commonjs mongodb',
      });
    }
    return config;
  },
}

export default nextConfig
