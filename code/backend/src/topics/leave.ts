import type Aedes from "aedes";
import type { Client } from "aedes";

export const handleLeave = (
  lobbyCode: string,
  client: Client,
  payload?: string
) => {
  console.log(`[LEAVE] ${client.id} joined lobby ${lobbyCode}`);
  console.log("payload:", payload);
};
