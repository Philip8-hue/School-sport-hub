import app from "../../app.js";
import { prisma } from "./lib/prisma.js";
const port = Number(process.env.PORT ?? 5000);
const host = process.env.HOST ?? "127.0.0.1";
const server = app.listen(port, host, () => { console.log(`School Sports Hub running at http://${host}:${port}`); });
const shutdown = async () => { server.close(); await prisma.$disconnect(); };
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
