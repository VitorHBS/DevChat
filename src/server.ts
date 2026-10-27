import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { initializeSocket } from "./sockets/socket";
dotenv.config()

export const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

const server = createServer(app);
initializeSocket(server);

server.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta: ${process.env.PORT}`)
});

