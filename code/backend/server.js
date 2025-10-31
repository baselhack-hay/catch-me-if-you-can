// server.js
import aedes from "aedes";
import { createServer as createHttpServer } from "node:http";
import { WebSocketServer, createWebSocketStream } from "ws";

const broker = aedes();

// --- WebSocket for browser/React clients ---
const httpServer = createHttpServer();
const wsServer = new WebSocketServer({ server: httpServer });
httpServer.listen(8888, () => console.log("🌐 MQTT WS broker on port 8888"));

wsServer.on("connection", (socket) => {
  const stream = createWebSocketStream(socket);
  broker.handle(stream);
});
