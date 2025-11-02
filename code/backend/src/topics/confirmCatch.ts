import type { Client } from "aedes";
import { removeUserFromLobby, setUserAsReady } from "../supabase";
import { JoinLobby } from "../../../types/lobby";
import { publishUsersInLobby } from "../publish/usersInLobby";

export const handleConfirmCatch = async (
  lobbyCode: string,
  client: Client,
  payload: JoinLobby
) => {
  console.log(`[CONFIRM_CATCH] ${client.id} confirmed catch in ${lobbyCode}`);
  console.log("payload:", payload);
  console.log(client.id, payload.username);

  await removeUserFromLobby(client.id);

  publishUsersInLobby(lobbyCode);
};
