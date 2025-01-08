import { BuilderConfig, BuilderOpts } from "./model";
import merge from "deepmerge";

export function assertBuilderConfig(opts: BuilderOpts): BuilderConfig {
  const base: BuilderConfig = {
    mode: "server-first",
    serverEntry: "server.js",
    serverConfig: {
      external: [],
      noExternal: [],
      output: {
        format: "es",
        entryFileNames: "app.js",
        chunkFileNames: "bin/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
      minify: false,
      target: "esnext",
      outDir: "dist",
      emptyOutDir: true,
      privateDir: "private",
      define: {},
    },
    serverBuild: (config) => config,
    serverPlugins: [],
    clientEntry: {
      main: "index.html",
    },
    clientConfig: {
      external: () => false,
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
      minify: true,
      target: "modules",
      outDir: "dist/public",
      emptyOutDir: true,
      publicDir: "public",
      define: {},
    },
    clientBuild: (config) => config,
    clientPlugins: [],
  };
  return <BuilderConfig>merge(base, opts);
}

export const ENTRY_NONE = "____.html";
