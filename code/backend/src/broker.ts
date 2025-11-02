import Aedes from "aedes";
import { registerLobbyRouter } from "./topics/router";
import { removeUserFromLobby } from "./supabase";

export const broker = new Aedes();
(broker as any).instanceId = Math.random().toString(36).substring(2, 9);

registerLobbyRouter(broker);

// Base logging
broker.on("client", (client) => {
  console.log(`👋 Client connected: ${client.id}`);
});

broker.on("clientDisconnect", (client) => {
  console.log(`👋 Client disconnected: ${client?.id}`);
  // removeUserFromLobby(client.id);
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
