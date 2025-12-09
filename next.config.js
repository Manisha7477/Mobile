const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
  // ✅ Add rewrites to catch all undefined routes
  rewrites: async () => {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/',
        },
      ],
    }
  },
});