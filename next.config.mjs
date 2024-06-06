/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // domains: [
    //   "lh3.googleusercontent.com",
    //   "nextjs13-ecommerce-app.s3.amazonaws.com",
    // ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      {
        protocol: "https",
        hostname: "nextjs13-ecommerce-app.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
