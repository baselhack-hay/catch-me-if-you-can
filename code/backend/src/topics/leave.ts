import type Aedes from "aedes";
import { TOPICS } from "../../../types/topics";

export const handleLeave = (broker: Aedes) => {
  broker.on("publish", (packet, client) => {
    if (!client) return;
    if (packet.topic === TOPICS.LOBBY.LEAVE) {
      console.log(`[LEAVE] ${client.id} joined`);
    }
  });
};
