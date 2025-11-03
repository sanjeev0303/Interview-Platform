import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Ensure assets are built with correct paths
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          clerk: ['@clerk/clerk-react'],
          stream: ['@stream-io/video-react-sdk', 'stream-chat-react'],
        },
      },
    },
  },
});
