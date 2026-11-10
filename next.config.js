/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow incomplete type choice in development mode
    // Enable this if you want to forego type checking completely for now.
    // ignoreBuildErrors: true,
  },
  env: {
    // Mock environment variables for prototype - no external APIs required
    NEXT_PUBLIC_API_BASE: "/api",
    NEXT_PUBLIC_SIMULATION_INTERVAL: "1000",
    NEXT_PUBLIC_MAX_DRONES: "12",
  },
}

export default nextConfig