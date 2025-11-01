import type { Client } from "aedes";
import { removeUserFromLobby } from "../supabase";

export const handleLeave = async (
  lobbyCode: string,
  client: Client,
  payload?: string
) => {
  console.log(`[LEAVE] ${client.id} joined lobby ${lobbyCode}`);
  console.log("payload:", payload);

  await removeUserFromLobby(client.id);
};
