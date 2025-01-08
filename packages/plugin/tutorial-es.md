# **Usando `vite-plugin-builder` para Configurar un Proyecto con SSR y CSR en Vite**

En este tutorial, te mostraré cómo crear un proyecto desde cero con **Vite**, configurarlo para compilar tanto **Server-Side Rendering (SSR)** como **Client-Side Rendering (CSR)** utilizando el plugin **`vite-plugin-builder`**, que nos facilita todo el proceso en un solo comando.

### **¿Qué es `vite-plugin-builder`?**

**`vite-plugin-builder`** es un plugin para **Vite** que simplifica la configuración y compilación de aplicaciones que requieren tanto **SSR** como **CSR** en un mismo proyecto (compilación dual). Con él, puedes gestionar ambos puntos de entrada (servidor y cliente) de manera sencilla, lo que es ideal para aplicaciones modernas que necesitan procesar contenido tanto en el servidor como en el cliente.

---

### **Pasos para Crear el Proyecto y Configurar el Plugin**

A continuación te muestro cómo empezar con **Vite** y **vite-plugin-builder** desde cero.

#### **1. Crear el Proyecto con Vite**

Primero, crea un nuevo proyecto de Vite usando el siguiente comando. Vamos a usar **React** como ejemplo, pero puedes elegir otro framework si lo prefieres.

```bash
# Sigue los pasos para crear un proyecto con React, TS o JS.
yarn create vite my-app
cd my-app
```

#### **2. Instalar las Dependencias Necesarias**

Ahora, instala **`vite-plugin-builder`** como una dependencia de desarrollo:

```bash
yarn add -D vite-plugin-builder
```

#### **3. Configurar el Archivo `vite.config.ts`**

Abre el archivo `vite.config.ts` y configura el plugin **`vite-plugin-builder`** para que maneje tanto el servidor como el cliente. Aquí tienes un ejemplo básico:

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
      // Entrada del servidor
      serverEntry: "server/main.js",
      // Entrada del cliente (es opcional, ya que hereda la configuración de Vite)
      clientEntry: {
        main: "index.html",
      },
    }),
  ],
});
```

#### **4. Crear el Archivo `server/main.js`**

El siguiente paso es crear el archivo `server/main.js`, que será la entrada para tu servidor (SSR). Este archivo representará tu punto de entrada en el backend. Aquí tienes un ejemplo básico de lo que podría contener:

```ts
console.log("Servidor funcionando...");
// Podemos crear un servidor Express, o configurar otro servidor según el stack de tu aplicación
// Lógica del servidor para SSR
```

> Puedes ver un ejemplo completo en https://github.com/yracnet/vite-plugin-builder/tree/main/packages/examples

#### **5. Ejecutar el Proyecto en Modo Desarrollo**

Ya tienes todo configurado, ahora ejecuta el proyecto en modo desarrollo con:

```
yarn dev
```

Esto arrancará el servidor de desarrollo de Vite, y podrás ver la aplicación tanto en el servidor como en el cliente.

#### **6. Construir el Proyecto para Producción**

Finalmente, para compilar el proyecto y prepararlo para producción, utiliza:

```
yarn build
```

Esto generará dos carpetas: una para el cliente y otra para el servidor.

La estructura esperada será similar a esta:

```bash
# Salida del servidor
/dist/app.js
/dist/bin/[name]-[hash].[ext]
/dist/assets/[name]-[hash].[ext]

# Salida del cliente
/dist/public/index.html
/dist/public/assets/[name]-[hash].[ext]
/dist/public/chunks/[name]-[hash].[ext]
```

#### **7. Personalización del Proyecto**

Según la documentación del plugin, puedes personalizar varios aspectos, como los directorios de salida para el servidor y el cliente, que pueden ser diferentes según tus necesidades.

Aquí te dejo un ejemplo de cómo personalizarlo:

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
      // (opcional) Configuración para la compilación del servidor
      serverConfig: {
        outDir: "app-sanbox/server", // Directorio de salida del servidor
        privateDir: "private-files", // Directorio con archivos privados a copiar
        // Definimos variables para la compilación del Server
        define: {
          "BUILD.BASE": '"/"',
          "BUILD.BASE_API": '"/api"',
          "BUILD.STATIC_DIR": '"../client"',
          "BUILD.SERVER_IP": '"0.0.0.0"',
          "BUILD.SERVER_PORT": "3001",
        },
      },
      // Configuración del cliente
      clientConfig: {
        outDir: "app-sanbox/client",
      },
    }),
  ],
});
```

De esta manera, el servidor tomará estas variables durante la compilación final:

```js
console.log("Servidor funcionando...");
console.log("Directorio SPA:", BUILD.STATIC_DIR);
```

También puedes configurar la copia de archivos estáticos dentro del directorio del servidor mediante la variable `serverConfig.privateDir`, que copiará los archivos de la carpeta `private-files` a `/app-sanbox/server`.

El contenido del directorio `private-files` puede incluir archivos como:

```bash
# Directorio de archivos privados
/private-files/package.json
/private-files/.env
```

La estructura de salida para esta configuración será la siguiente:

```bash
# Salida del servidor
/app-sanbox/server/app.js
/app-sanbox/server/bin/[name]-[hash].[ext]
/app-sanbox/server/assets/[name]-[hash].[ext]
/app-sanbox/server/package.json
/app-sanbox/server/.env

# Salida del cliente
/app-sanbox/client/index.html
/app-sanbox/client/assets/[name]-[hash].[ext]
/app-sanbox/client/chunks/[name]-[hash].[ext]
```

---

### **Conclusión**

Con **`vite-plugin-builder`**, puedes configurar fácilmente un proyecto que soporte tanto **SSR** como **CSR** en Vite. El plugin simplifica el proceso de configuración y compilación, permitiéndote centrarte en el desarrollo de tu aplicación sin complicaciones adicionales.

Si quieres más detalles o ejemplos más complejos, puedes consultar la documentación oficial en [GitHub](https://github.com/yracnet/vite-plugin-builder).

¡Listo! Ahora tienes un proyecto híbrido con SSR y CSR funcionando en Vite.
