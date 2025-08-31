/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: (config) => {
    config.externals = config.externals
      ? [...config.externals, "bcrypt"]
      : ["bcrypt"];
    return config;
  },
};

module.exports = nextConfig;
