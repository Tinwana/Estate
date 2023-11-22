/** @type {import('next').NextConfig} */
// const nextConfig = {};

module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
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
