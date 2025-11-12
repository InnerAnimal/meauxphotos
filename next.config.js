/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn.meauxbility.org',
      'ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com',
      '*.r2.cloudflarestorage.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.meauxbility.org',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
}

module.exports = nextConfig

