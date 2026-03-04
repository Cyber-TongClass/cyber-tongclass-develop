/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a standalone build output so Docker can copy the standalone server
  // into the final image (creates `.next/standalone`).
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
  // Note: Next.js no longer supports an `eslint` key in `next.config.js`.
  // ESLint should be handled via CI or the `next lint` command.
  typescript: {
    // Ignore TypeScript errors in production builds
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
