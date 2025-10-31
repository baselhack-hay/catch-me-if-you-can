import aedes from "aedes";
import { createServer as createHttpServer } from "node:http";
import { createServer as createTcpServer } from "node:net";
import { WebSocketServer, createWebSocketStream } from "ws";

const broker = new aedes();

// --- 1️⃣ Raw TCP broker (for MQTT Explorer, CLI clients, etc.) ---
const tcpServer = createTcpServer(broker.handle);
const MQTT_PORT = 1883;
tcpServer.listen(MQTT_PORT, () =>
  console.log(`🐝 MQTT TCP broker running on port ${MQTT_PORT}`)
);

// --- 2️⃣ WebSocket broker (for browsers / React clients) ---
const WS_PORT = 8888;
const httpServer = createHttpServer();
const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on("connection", (socket) => {
  const stream = createWebSocketStream(socket);
  broker.handle(stream);
});

httpServer.listen(WS_PORT, () =>
  console.log(`🌐 MQTT WebSocket broker running on port ${WS_PORT}`)
);

// --- 👀 Log when a client connects/disconnects ---
broker.on("client", (client) => {
  console.log(`👋 Client connected: ${client.id}`);

  // send a demo message when a client connects
  broker.publish(
    {
      topic: "server/demo",
      payload: Buffer.from(`Welcome ${client.id}! This is a test message.`),
      qos: 0,
    },
    (err) => {
      if (err) console.error("Publish error:", err);
    }
  );
});

broker.on("clientDisconnect", (client) => {
  console.log(`👋 Client disconnected: ${client?.id}`);
});

// --- (optional) Log published messages ---
broker.on("publish", (packet, client) => {
  if (client) {
    console.log(
      `📨 ${client.id} → ${packet.topic}: ${packet.payload.toString()}`
    );
  }
});
