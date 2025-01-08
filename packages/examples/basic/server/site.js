import express from "express";
import path from "path";

// SITE
export const site = express.Router();
site.use(express.static(BUILD.STATIC_DIR));
site.get("*", (req, res) => {
  res.sendFile(path.join(BUILD.STATIC_DIR, "index.html"));
});
