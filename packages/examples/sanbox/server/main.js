import express from "express";
import { loadEnv } from "dotenv-local";
import { api } from "./api";
import { site } from "./site";

// ENV
const { SERVER_IP = BUILD.SERVER_IP, SERVER_PORT = BUILD.SERVER_PORT } =
  loadEnv({
    removeEnvPrefix: true,
  });

// APP
const app = express();

// RUN
app.use(BUILD.BASE_API, api);
app.use(BUILD.BASE, site);
app.listen(SERVER_PORT, SERVER_IP, () =>
  console.log(`Server running on port ${SERVER_IP}:${SERVER_PORT}`)
);
