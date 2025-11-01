import type { Client } from "aedes";
import { setRoleInLobby } from "../supabase";
import { SetRole } from "../../../types/lobby";
import { publishUsersInLobby } from "../publish/usersInLobby";

export const handleRole = async (
  lobbyCode: string,
  _: Client,
  payload: SetRole
) => {
  console.log(`[Role] Set role for user in ${lobbyCode}`);
  console.log("payload:", payload);

  await setRoleInLobby(payload.userId, lobbyCode, payload.roleId);

  publishUsersInLobby(lobbyCode);
};
