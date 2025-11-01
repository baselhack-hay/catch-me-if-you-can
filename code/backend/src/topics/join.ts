import type { Client } from "aedes";
import { addUser, joinLobby } from "../supabase";
import { JoinLobby } from "../../../types/lobby";
import { publishUsersInLobby } from "../publish/usersInLobby";

export const handleJoin = async (
  lobbyCode: string,
  client: Client,
  payload: JoinLobby
) => {
  console.log(`[JOIN] ${client.id} joined lobby ${lobbyCode}`);
  console.log("payload:", payload);
  console.log(client.id, payload.username);

  const user = await addUser(client.id, payload.username);
  await joinLobby(user.id, lobbyCode);

  publishUsersInLobby(lobbyCode);
};
