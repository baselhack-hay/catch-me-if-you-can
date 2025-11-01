import Aedes from "aedes";
import { registerTopics } from "./topics";

export const broker = new Aedes();
(broker as any).instanceId = Math.random().toString(36).substring(2, 9);

registerTopics(broker);

// Base logging
broker.on("client", (client) => {
  console.log(`👋 Client connected: ${client.id}`);
});

broker.on("clientDisconnect", (client) => {
  console.log(`👋 Client disconnected: ${client?.id}`);
});

broker.on("clientError", (client, err) => {
  console.error(`❌ Client error (${client?.id}):`, err.message);
});

broker.on("publish", (packet, client) => {
  if (client) {
    console.log(
      `📨 ${client.id} → ${packet.topic}: ${packet.payload.toString()}`
    );
  }
});
