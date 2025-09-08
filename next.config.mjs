/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Add this line
  images: {
    unoptimized: true, // Add this line
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;