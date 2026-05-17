import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    ...(mode === "development" ? [componentTagger()] : []),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-32.png", "apple-touch-icon.png", "robots.txt", "pwa-192.png", "pwa-512.png"],
      manifest: {
        name: "BUSY STRONG 90",
        short_name: "BS90",
        description:
          "90-day training system for busy people 35+. Three sessions per week, gym or home. By Coach Milos.",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        lang: "en",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // Avoid precaching large bundled images; they still load normally when visited.
        // Precache app shell only — lazy route chunks load on demand (faster first paint, less SW bandwidth).
        globPatterns: ["**/*.{html,ico,png,svg,webp,woff2}", "**/index-*.js", "**/index-*.css", "registerSW.js", "manifest.webmanifest", "robots.txt"],
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/(rest|auth|realtime)\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              networkTimeoutSeconds: 12,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("@radix-ui")) return "radix-ui";
          return "vendor";
        },
      },
    },
  },
}));
