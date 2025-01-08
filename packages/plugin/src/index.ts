import { BuilderConfig, BuilderOpts } from "./model";
import { assertBuilderConfig, ENTRY_NONE } from "./utils";
import { PluginOption, build } from "vite";

const doBuildServer = async (buildConfig: BuilderConfig) => {
  const {
    serverEntry,
    serverBuild,
    serverConfig: {
      privateDir,
      define,
      outDir,
      minify,
      emptyOutDir,
      target,
      external,
      noExternal,
      output,
    },
    serverPlugins,
  } = buildConfig;
  const viteServer = await serverBuild({
    publicDir: privateDir,
    define,
    ssr: {
      external,
      noExternal,
    },
    build: {
      outDir,
      ssr: serverEntry,
      write: true,
      minify,
      target,
      emptyOutDir,
      rollupOptions: {
        output,
      },
    },
    plugins: serverPlugins,
  });
  await build(viteServer);
};
const doBuildClient = async (buildConfig: BuilderConfig) => {
  const {
    clientEntry,
    clientBuild,
    clientConfig: {
      publicDir,
      define,
      outDir,
      minify,
      emptyOutDir,
      target,
      external,
      output,
    },
    clientPlugins,
  } = buildConfig;
  const viteClient = await clientBuild({
    define,
    publicDir,
    build: {
      outDir,
      write: true,
      minify,
      emptyOutDir,
      target,
      rollupOptions: {
        input: clientEntry,
        external,
        output,
      },
    },
    plugins: clientPlugins,
  });
  await build(viteClient);
};

/**
 * Builder function to configure the server-side and client-side build process.
 * It takes in an options object that can override the default configuration.
 *
 * Default configuration:
 * ```typescript
 * {
 *   mode: "server-first",
 *   serverEntry: <<Value is Required>>,
 *   serverConfig: {
 *     external: [],
 *     noExternal: [],
 *     output: {
 *       format: "es",
 *       entryFileNames: "app.js",
 *       chunkFileNames: "bin/[name]-[hash].js",
 *       assetFileNames: "assets/[name]-[hash].[ext]",
 *     },
 *     minify: false,
 *     target: "esnext",
 *     outDir: "dist",
 *     emptyOutDir: true,
 *     privateDir: "private",
 *     define: {},
 *   },
 *   serverBuild: (config) => config,
 *   serverPlugins: [],
 *   clientEntry: { main: "index.html" },
 *   clientConfig: {
 *     external: () => false,
 *     output: {
 *       entryFileNames: "assets/[name]-[hash].js",
 *       chunkFileNames: "chunks/[name]-[hash].js",
 *       assetFileNames: "assets/[name]-[hash].[ext]",
 *     },
 *     minify: true,
 *     target: "modules",
 *     outDir: "dist/public",
 *     emptyOutDir: true,
 *     publicDir: "public",
 *     define: {},
 *   },
 *   clientBuild: (config) => config,
 *   clientPlugins: [],
 * }
 * ```
 */
export const builder = (opts: BuilderOpts): PluginOption => {
  const buildConfig = assertBuilderConfig(opts);
  const isSkip = buildConfig.mode === "skip";
  return [
    {
      name: "vite-plugin-builder:skip",
      enforce: "pre",
      apply: "build",
      config: () => {
        if (process.env.IS_BUILDER || isSkip) return {};
        return {
          build: {
            copyPublicDir: false,
            write: false,
            rollupOptions: {
              input: {
                main: ENTRY_NONE,
              },
            },
          },
        };
      },
      resolveId: (id) => {
        if (id === ENTRY_NONE) {
          return id;
        }
        return null;
      },
      load: (id) => {
        if (id === ENTRY_NONE) {
          return "";
        }
        return null;
      },
    },
    {
      name: "vite-plugin-builder",
      enforce: "pre",
      apply: "build",
      buildStart: async () => {
        if (isSkip || process.env.IS_BUILDER) return;
        process.env.IS_BUILDER = "true";
        const { mode } = buildConfig;
        if (mode === "server-first") {
          await doBuildServer(buildConfig);
          await doBuildClient(buildConfig);
        } else if (mode === "client-first") {
          await doBuildClient(buildConfig);
          await doBuildServer(buildConfig);
        } else if (mode === "parallel") {
          await Promise.all([
            doBuildServer(buildConfig),
            doBuildClient(buildConfig),
          ]);
        }
      },
    },
  ];
};

export const pluginBuilder = builder;

export default builder;
