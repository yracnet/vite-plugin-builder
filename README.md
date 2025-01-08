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

## Documentation

For detailed documentation, please refer to the main [README.md](packages/plugin/README.md) file located in the `plugin` package.

## Example

You can explore a basic usage example by looking at the [basic example](packages/examples/basic) in the `examples` folder.

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
    // Simple Configuration
    builder({
      serverEntry: "server/main.js",
      serverConfig: {
        outDir: "sandbox",
      },
      clientEntry: {
        main: "index.html",
      },
      clientConfig: {
        outDir: "sandbox/spa",
      },
    }),
  ],
});
```

This configuration generates the following structure:

```bash
# Server Out Dir
#/sandbox
/sandbox/app.js
/sandbox/bin/[name]-[hash].js
/sandbox/assets/[name]-[hash].[ext]
# Client Out Dir
#/sandbox/spa
/sandbox/spa/index.html
/sandbox/spa/js/[name]-[hash].js
/sandbox/spa/assets/[name]-[hash].[ext]
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
