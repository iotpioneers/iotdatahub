/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  transpilePackages: ["mui-one-time-password-input"],
  async headers() {
    return [
      {
        source: "/:paths*",
        headers: [
          {
            key: "referrer-policy",
            value: "no-referrer",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        ws: "commonjs ws",
        cors: "commonjs cors",
        bcrypt: "commonjs bcrypt",
        jsonwebtoken: "commonjs jsonwebtoken",
        nodemailer: "commonjs nodemailer",
        mongodb: "commonjs mongodb",
      });
    } else {
      config.externals = config.externals
        ? [...config.externals, "bcrypt"]
        : ["bcrypt"];
    }
    return config;
  },
};

export default nextConfig;
