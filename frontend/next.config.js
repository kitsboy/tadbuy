/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['tools.giveabit.io', 'localhost']
}

module.exports = nextConfig
