import { InlineConfig, PluginOption } from "vite";
import { ExternalOption, InputOption, OutputOptions } from "rollup";
import { TransformOptions as esbuild_TransformOptions } from "esbuild";

type Target =
  | "modules"
  | "esnext"
  | "es2015"
  | "es2020"
  | esbuild_TransformOptions["target"]
  | false;

type Mode = "server-first" | "client-first" | "parallel" | "skip";

export type ServerConfig = {
  external: string[] | true;
  noExternal: string | RegExp | (string | RegExp)[] | true;
  output: OutputOptions;
  minify: boolean | "terser" | "esbuild";
  target: Target;
  outDir: string;
  emptyOutDir: boolean;
  privateDir: string;
  define: Record<string, any>;
};

export type ClientConfig = {
  external: ExternalOption;
  output: OutputOptions | OutputOptions[];
  minify: boolean | "terser" | "esbuild";
  target: Target;
  outDir: string;
  emptyOutDir: boolean;
  publicDir: string;
  define: Record<string, any>;
};

export type BuilderConfig = {
  mode: Mode;
  serverEntry: string;
  serverConfig: ServerConfig;
  serverBuild: (config: InlineConfig) => InlineConfig;
  serverPlugins: PluginOption[];
  clientEntry: InputOption;
  clientConfig: ClientConfig;
  clientBuild: (config: InlineConfig) => InlineConfig;
  clientPlugins: PluginOption[];
};

export type BuilderOpts = {
  mode?: Mode;
  serverEntry: string;
  serverConfig?: Partial<ServerConfig>;
  serverBuild?: (config: InlineConfig) => InlineConfig;
  serverPlugins?: PluginOption[];
  clientEntry?: InputOption;
  clientConfig?: Partial<ClientConfig>;
  clientBuild?: (config: InlineConfig) => InlineConfig;
  clientPlugins?: PluginOption[];
};
