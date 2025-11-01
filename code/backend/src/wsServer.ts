import { createServer as createHttpServer } from "node:http";
import { WebSocketServer, createWebSocketStream } from "ws";
import { broker } from "./broker";

const WS_PORT = 8888;

export const startWsServer = () => {
  const httpServer = createHttpServer();
  const wsServer = new WebSocketServer({ server: httpServer });

  wsServer.on("connection", (socket) => {
    const stream = createWebSocketStream(socket);
    broker.handle(stream);
  });

  httpServer.listen(WS_PORT, () => {
    console.log(`🌐 MQTT WebSocket broker running on port ${WS_PORT}`);
  });
};
