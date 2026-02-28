/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "better-sqlite3",
      "pdf-parse",
      "mammoth",
      "cheerio",
    ],
  },
};

export default nextConfig;
