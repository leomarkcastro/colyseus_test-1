// Colyseus + Express
import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import { Game01 } from "./rooms/Game01";
import { Game02 } from "./rooms/Game02";
import { Game03 } from "./rooms/Game03";
const port = Number(process.env.port) || 2567;

const app = express();
app.use(express.json());

const gameServer = new Server({
  server: createServer(app),
});

gameServer.define("game01", Game01);
gameServer.define("game02", Game02);
gameServer.define("game03", Game03);

gameServer.listen(port);
