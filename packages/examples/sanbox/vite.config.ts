import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import builder from "vite-plugin-builder";
// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    builder({
      serverEntry: "server/main.js",
      serverConfig: {
        outDir: "dist-sanbox",
        noExternal: ["dotenv-local", "dotenv"],
        output: {
          manualChunks: (id) => {
            if (id.includes("server/") && !id.includes("main.js")) {
              return "api";
            }
            if (id.includes("node_modules/dotenv")) {
              return "dotenv";
            }
            if (
              id.includes("?commonjs-external") ||
              id.includes("commonjsHelpers")
            ) {
              return "helpers";
            }
          },
        },
        define: {
          "BUILD.BASE": '"/"',
          "BUILD.BASE_API": '"/api"',
          "BUILD.STATIC_DIR": '"spa"',
          "BUILD.SERVER_IP": '"0.0.0.0"',
          "BUILD.SERVER_PORT": "3001",
        },
      },
      clientEntry: {
        main: "index.html",
      },
      clientConfig: {
        outDir: "dist-sanbox/spa",
        output: {
          manualChunks: (id) => {
            if (id.includes("/src/") && !id.includes("main.tsx")) {
              return path.basename(id);
            }
            if (id.includes("node_modules/react")) {
              return "react";
            }
            if (
              id.includes("modulepreload") ||
              id.includes("commonjsHelpers")
            ) {
              return "commonjs";
            }
          },
        },
      },
    }),
  ],
});
