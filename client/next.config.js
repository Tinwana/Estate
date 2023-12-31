/** @type {import('next').NextConfig} */
// const nextConfig = {};

module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/:path*",
        destination: "https://estate-backend.onrender.com/api/:path*",
      },
    ];
  };
  async function redirects() {
    return [
      {
        source: "/app/:path*",
        destination: "/src/app/:path*",
        permanent: true,
      },
    ];
  }
  return {
    rewrites,
    redirects,
  };
};
