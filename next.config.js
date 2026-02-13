/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ["img.icons8.com", "res.cloudinary.com", "flagcdn.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
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
