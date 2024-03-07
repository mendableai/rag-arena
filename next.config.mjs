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
  };
  
  export default nextConfig;
  