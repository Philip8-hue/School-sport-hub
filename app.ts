import express from "express";
import { configureApp } from "./server/src/app.js";

// Vercel imports this application; the local launcher owns its port listener.
export default configureApp(express());
