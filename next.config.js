/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets other devices on your network (e.g. a phone) use the dev server.
  allowedDevOrigins: ["192.168.31.46"],
};

module.exports = nextConfig;
