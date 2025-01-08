# vite-plugin-builder

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/yracnet/vite-plugin-builder.svg?branch=main)](https://travis-ci.org/yracnet/vite-plugin-builder)

`vite-plugin-builder` is a Vite plugin designed to simplify the setup of dual compilation for Server-Side Rendering (SSR) and Client-Side Rendering (CSR) in Vite projects. It allows you to build both server and client entry points in a single Vite project, streamlining the development of modern web applications that require both SSR and CSR functionality.

## Features

- **Dual Compilation**: Supports compiling both SSR and CSR in a single project.
- **Vite Integration**: Designed to work seamlessly with Vite, leveraging its fast build system and hot module replacement.
- **SPA (Single-Page Application) Support**: Makes it easier to manage the SSR and CSR workflows for modern SPAs.
- **TypeScript Support**: Written in TypeScript, providing full type safety and better developer experience.
- **Minimal Setup**: Easy to integrate with minimal configuration required.

## Installation

To install `vite-plugin-builder` in your Vite project, you can use npm or yarn:

```bash
npm install vite-plugin-builder --save-dev
```

or

```bash
yarn add vite-plugin-builder --dev
```

## Usage

### Basic Setup

1. Install the plugin as a dev dependency (as shown above).
2. Import and configure the plugin in your `vite.config.ts` file.

```ts
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import builder from "vite-plugin-builder";
// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    //Simple Configuration
    builder({
      serverEntry: "server/main.js",
      clientEntry: {
        main: "index.html",
      },
    }),
  ],
});
```

This configuration genrate this structures

```bash
# Server Out
/dist/app.js
/dist/bin/[name]-[hash].[ext]
/dist/assets/[name]-[hash].[ext]
# Client Out
/dist/public/index.html
/dist/public/assets/[name]-[hash].[ext]
/dist/public/chunks/[name]-[hash].[ext]
```

### Plugin Server Options

The plugin accepts the following options for serverEntry:

```ts
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
      // Path to the server entry file
      serverEntry: "server/main.js",
      // (optional) Configuration for the server build
      serverConfig: {
        define: {
          "BUILD.BASE": '"/"',
          "BUILD.BASE_API": '"/api"',
          "BUILD.STATIC_DIR": '"public"',
          "BUILD.SERVER_IP": '"0.0.0.0"',
          "BUILD.SERVER_PORT": "3001",
        },
      },
      // (optional) Function to modify the server build config
      serverBuild: (viteConfig) => {
        return viteConfig;
      },
    }),
  ],
});
```

### Server Configuration Options

#### `serverEntry: string`

- **Description**: The path to the server entry file, which is the main entry point for your server-side application. This is typically a JavaScript or TypeScript file (e.g., `server/main.js`).
- **Example**: `"server/main.js"`

#### `serverConfig`

This is an optional configuration object for the server build. It contains detailed options for how the server should be built, including external dependencies, output options, minification, and more.

##### `serverConfig.external`

- **Description**: A list of external dependencies that should be excluded from the bundle. These dependencies will not be bundled into the server output but will be treated as external to the application.
- **Example**: `["express", "react"]` or `true` (to externalize all dependencies).

##### `serverConfig.noExternal`

- **Description**: A list of dependencies that should **not** be externalized and should be bundled into the server build. You can specify dependencies using strings, regular expressions, or arrays of them.
- **Example**: `["lodash", /^react/], true`

##### `serverConfig.output`

- **Description**: Rollup's output configuration that determines how the build is emitted. This includes options such as the output format, file names, and more.
- **Example**:
  ```javascript
  output: {
    format: "esm",
    entryFileNames: "server.js",
    chunkFileNames: "chunks/[name]-[hash].js",
    assetFileNames: "assets/[name].[ext]",
  }
  ```

##### `serverConfig.minify`

- **Description**: Specifies whether the server build should be minified. You can choose between `true` (to minify), `"terser"` (to use the Terser minifier), or `"esbuild"` (to use the esbuild minifier).
- **Example**: `true`, `"terser"`, or `"esbuild"`

##### `serverConfig.target`

- **Description**: Specifies the target environment for the server build. Possible values include `"esnext"`, `"es2015"`, `"es2020"`, or any other valid target value from the esbuild configuration.
- **Example**: `"esnext"`

##### `serverConfig.outDir`

- **Description**: The output directory where the server build will be placed. All built files, including entry files and assets, will be written here.
- **Example**: `"dist/server"`

##### `serverConfig.emptyOutDir: boolean`

- **Description**: If set to `true`, this option will clean the output directory before building the server.
- **Example**: `true`

##### `serverConfig.privateDir`

- **Description**: Directory for private assets that are not served publicly by the server. This can be used to store internal files or configurations.
- **Example**: `"private"`

##### `serverConfig.define`

- **Description**: A list of global constants or environment variables to define during the build process. These can be used to customize configurations based on build environments.
- **Example**:
  ```javascript
  define: {
    "BUILD_ENV": '"production"',
    "API_URL": '"https://api.example.com"',
  }
  ```

#### `serverBuild`

- **Description**: An optional function that allows you to modify the server build configuration before the build starts. This can be used to adjust or extend the configuration dynamically.
- **Example**:
  ```javascript
  serverBuild: (config: InlineConfig) => {
    config.plugins.push(someCustomPlugin());
    return config;
  };
  ```

### Plugin Client Options

The plugin accepts the following options for clientEntry:

```ts
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
      // (optional) Path to the client entry file
      clientEntry: {
        main: "index.html",
      },
      // (optional) Configuration for the client build
      clientConfig: {
        outDir: "dist/public",
      },
      // (optional) Function to modify the client build config
      clientBuild: (viteConfig) => {
        return viteConfig;
      },
    }),
  ],
});
```

### Client Configuration Options

#### `clientEntry`

- **Description**: The entry point for the client application. This can be an HTML file or JavaScript entry file that starts the client-side bundle.
- **Example**:
  ```javascript
  clientEntry: "index.html";
  ```

#### `clientConfig`

This is an optional configuration object for the client-side build. It contains detailed options for how the client should be built, including external dependencies, output options, and more.

##### `clientConfig.externa`

- **Description**: A list of external dependencies that should be excluded from the client bundle. These dependencies will not be bundled and will be treated as external to the application.
- **Example**: `["react", "react-dom"]` or a function that returns `true` or `false`.

##### `clientConfig.output`

- **Description**: Rollup's output configuration that determines how the client build is emitted. This includes options such as the output format, file names, chunk splitting, etc.
- **Example**:
  ```javascript
  output: {
    format: "esm",
    entryFileNames: "js/[name]-[hash].js",
    chunkFileNames: "chunks/[name]-[hash].js",
    assetFileNames: "assets/[name].[ext]",
  }
  ```

##### `clientConfig.minify`

- **Description**: Specifies whether the client build should be minified. You can choose between `true` (to minify), `"terser"` (to use the Terser minifier), or `"esbuild"` (to use the esbuild minifier).
- **Example**: `true`, `"terser"`, or `"esbuild"`

##### `clientConfig.target`

- **Description**: Specifies the target environment for the client build. Possible values include `"esnext"`, `"es2015"`, `"es2020"`, or any other valid target value from the esbuild configuration.
- **Example**: `"esnext"`

##### `clientConfig.outDir`

- **Description**: The output directory where the client build will be placed. All built files, including entry files, chunks, and assets, will be written here.
- **Example**: `"dist/client"`

##### `clientConfig.emptyOutDir`

- **Description**: If set to `true`, this option will clean the output directory before building the client.
- **Example**: `true`

#### `clientBuild`

- **Description**: An optional function that allows you to modify the client build configuration before the build starts. This can be used to adjust or extend the configuration dynamically.
- **Example**:
  ```javascript
  clientBuild: (config: InlineConfig) => {
    config.plugins.push(someCustomPlugin());
    return config;
  };
  ```

## Mode Options

The plugin supports several modes that determine how the server and client builds are executed. These modes are configured via the `mode` option and include:

- `"server-first"`: This mode first builds the server and then the client. It is useful for SSR setups where the server needs to be built before the client.
- `"client-first"`: This mode first builds the client and then the server. It is useful when the client-side application must be prioritized before SSR.
- `"parallel"`: This mode builds both the server and client in parallel. It provides faster builds by running the processes concurrently.
- `"skip"`: This mode skips the server build entirely, which is useful when you only want to build the client-side assets.

### Example:

```ts
mode: "parallel";
```
