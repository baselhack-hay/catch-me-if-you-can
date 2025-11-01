import type { Client } from "aedes";
import { addUser } from "../supabase";

export const handleJoin = async (
  lobbyCode: string,
  client: Client,
  payload?: string
) => {
  console.log(`[JOIN] ${client.id} joined lobby ${lobbyCode}`);
  console.log("payload:", payload);

  await addUser(client.id, "Yves");
};
