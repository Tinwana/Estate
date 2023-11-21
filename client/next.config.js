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
  return {
    rewrites,
  };
};
