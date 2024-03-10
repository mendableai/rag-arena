// Import the NextConfig type for better IntelliSense support if you're using an editor like VSCode.
/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*',
        },
      ],
    },
    // async rewrites() {
    //   return [
    //     {
    //       source: '/python-api/:path*',
    //       destination: 'http://127.0.0.1:5328/:path*', // Proxy to Backend
    //     },
    //   ]
    // },
  };
  
  export default nextConfig;
  