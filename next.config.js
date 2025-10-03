/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname,
    };
    config.externals = config.externals
      ? [...config.externals, "bcrypt"]
      : ["bcrypt"];
    return config;
  },
};

module.exports = nextConfig;
