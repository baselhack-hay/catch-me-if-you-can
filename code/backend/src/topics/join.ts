import type Aedes from "aedes";
import { TOPICS } from "../../../types/topics";

export const handleJoin = (broker: Aedes) => {
  broker.on("publish", (packet, client) => {
    if (!client) return;
    if (packet.topic === TOPICS.LOBBY.JOIN) {
      console.log(`[JOIN] ${client.id} joined`);
    }
  });
};
