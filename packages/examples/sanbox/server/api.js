import express from "express";
// API
export const api = express.Router();
api.get("/hello", (req, res) => {
  res.json({ message: "Hello from API" });
});
