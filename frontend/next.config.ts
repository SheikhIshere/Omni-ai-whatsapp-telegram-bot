/**
 * Next.js Framework Configuration
 * ===============================
 * WHY: Controls the build-time and runtime behavior of the frontend.
 * WHAT: Standard Next.js configuration object.
 * HOW: Exports a typed 'NextConfig' with specific optimizations for the Omni-AI project.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 
     Optimization: Enable the new React Compiler (experimental in some versions)
     to automatically memoize components and reduce unnecessary re-renders. 
  */
  reactCompiler: true,
  allowedDevOrigins: ['172.21.0.3', 'localhost:3011'],
};

export default nextConfig;
