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
        outDir: "dist",
        define: {
          "BUILD.BASE": '"/"',
          "BUILD.BASE_API": '"/api"',
          "BUILD.STATIC_DIR": '"public"',
          "BUILD.SERVER_IP": '"0.0.0.0"',
          "BUILD.SERVER_PORT": "3001",
        },
        output: {
          manualChunks: (id) => {
            if (id.endsWith("main.js")) {
              return "app";
            }
            return path.basename(id).replace(path.extname(id), "");
          },
        },
      },
      serverBuild: (viteConfig) => {
        //change the default viteConfig for Server Build
        return viteConfig;
      },
      clientEntry: {
        main: "index.html",
      },
      clientConfig: {
        outDir: "dist/public",
      },
      clientBuild: (viteConfig) => {
        //change the default viteConfig for Client Build
        return viteConfig;
      },
    }),
  ],
});
