# **Using `vite-plugin-builder` to Set Up an SSR and CSR Project in Vite**

In this tutorial, I will show you how to create a project from scratch with **Vite**, configure it to build both **Server-Side Rendering (SSR)** and **Client-Side Rendering (CSR)** using the **`vite-plugin-builder`** plugin, which simplifies the whole process with a single command.

### **What is `vite-plugin-builder`?**

**`vite-plugin-builder`** is a plugin for **Vite** that simplifies the setup and compilation of applications requiring both **SSR** and **CSR** in a single project (dual build). With it, you can easily manage both server and client entry points, which is ideal for modern applications that need to process content both on the server and on the client.

---

### **Steps to Create the Project and Set Up the Plugin**

Below, I'll walk you through setting up **Vite** and **vite-plugin-builder** from scratch.

#### **1. Create the Project with Vite**

First, create a new Vite project using the following command. We will use **React** as an example, but you can choose any other framework if you prefer.

```bash
# Follow the steps to create a React project with TS or JS.
yarn create vite my-app
cd my-app
```

#### **2. Install the Required Dependencies**

Now, install **`vite-plugin-builder`** as a development dependency:

```bash
yarn add -D vite-plugin-builder
```

#### **3. Configure the `vite.config.ts` File**

Open the `vite.config.ts` file and configure the **`vite-plugin-builder`** plugin to handle both the server and client. Here’s a basic example:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import builder from "vite-plugin-builder";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    builder({
      // Server entry point
      serverEntry: "server/main.js",
      // Client entry point (optional as it inherits Vite's config)
      clientEntry: {
        main: "index.html",
      },
    }),
  ],
});
```

#### **4. Create the `server/main.js` File**

The next step is to create the `server/main.js` file, which will serve as the entry point for your server (SSR). This file will represent your backend entry. Here’s a basic example of what it could contain:

```ts
console.log("Server is running...");
// You can create an Express server or configure another server depending on your app stack
// Server-side logic for SSR
```

> You can check out a full example at https://github.com/yracnet/vite-plugin-builder/tree/main/packages/examples

#### **5. Build the Project for Production**

Finally, to compile the project and prepare it for production, use:

```bash
yarn build
```

This will generate two directories: one for the client and one for the server.

The expected structure will look like this:

```bash
# Server Output
/dist/app.js
/dist/bin/[name]-[hash].[ext]
/dist/assets/[name]-[hash].[ext]

# Client Output
/dist/public/index.html
/dist/public/assets/[name]-[hash].[ext]
/dist/public/chunks/[name]-[hash].[ext]
```

#### **6. Customizing the Project**

According to the plugin documentation, you can customize various aspects, such as the output directories for the server and client, which can be different based on your needs.

Here’s an example of how to customize it:

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
        outDir: "app-sanbox/server", // Server output directory
        privateDir: "private-files", // Directory with private files to copy
        // Define variables for server-side compilation
        define: {
          "BUILD.BASE": '"/"',
          "BUILD.BASE_API": '"/api"',
          // Change to output client directory
          "BUILD.STATIC_DIR": '"../client"',
          "BUILD.SERVER_IP": '"0.0.0.0"',
          "BUILD.SERVER_PORT": "3001",
        },
      },
      // Client configuration
      clientConfig: {
        outDir: "app-sanbox/client",
      },
    }),
  ],
});
```

This way, the server will use these variables during the final compilation:

```js
import express from "express";
import { api } from "./api";
import { site } from "./site";

// ENV
const { SERVER_IP = BUILD.SERVER_IP, SERVER_PORT = BUILD.SERVER_PORT } =
  process.env;

// APP
const app = express();

// RUN
app.use(BUILD.BASE_API, api);
app.use(BUILD.BASE, site);
app.listen(SERVER_PORT, SERVER_IP, () =>
  console.log(`Server running on port ${SERVER_IP}:${SERVER_PORT}`)
);
```

You can also configure the copying of static files inside the server directory using the `serverConfig.privateDir` variable, which will copy files from the `private-files` folder to `/app-sanbox/server`.

The `private-files` directory might include files such as:

```bash
# Private directory
/private-files/package.json
/private-files/.env
```

The expected output for this configuration will look like this:

```bash
# Server Output
/app-sanbox/server/app.js
/app-sanbox/server/bin/[name]-[hash].[ext]
/app-sanbox/server/assets/[name]-[hash].[ext]
/app-sanbox/server/package.json
/app-sanbox/server/.env

# Client Output
/app-sanbox/client/index.html
/app-sanbox/client/assets/[name]-[hash].[ext]
/app-sanbox/client/chunks/[name]-[hash].[ext]
```

---

### **Conclusion**

With **`vite-plugin-builder`**, you can easily set up a project that supports both **SSR** and **CSR** in Vite. The plugin simplifies the configuration and build process, allowing you to focus on developing your application without additional complications.

For more details or more complex examples, you can check out the official documentation on [GitHub](https://github.com/yracnet/vite-plugin-builder).

That’s it! Now you have a hybrid project with both SSR and CSR running in Vite.
