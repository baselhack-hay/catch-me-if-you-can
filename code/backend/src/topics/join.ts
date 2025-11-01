import type { Client } from "aedes";

export const handleJoin = (
  lobbyCode: string,
  client: Client,
  payload?: string
) => {
  console.log(`[JOIN] ${client.id} joined lobby ${lobbyCode}`);
  console.log("payload:", payload);
};
