/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hk1k8jms-3000.inc1.devtunnels.ms",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dqvklhqsi/image/upload/**",
      },
    ],
  },
};

module.exports = nextConfig;
