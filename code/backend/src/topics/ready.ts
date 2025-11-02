import type { Client } from "aedes";
import { setUserAsReady, allPlayersReady } from "../supabase";
import { JoinLobby } from "../../../types/lobby";
import { playGame } from "../publish/playGame";
import { startLobbyInterval } from "../intervalManager";
import { requestGeolocation } from "../publish/requestGeo";

export const handleReady = async (
  lobbyCode: string,
  client: Client,
  payload: JoinLobby
) => {
  console.log(`[JOIN] ${client.id} joined lobby ${lobbyCode}`);
  console.log("payload:", payload);
  console.log(client.id, payload.username);

  await setUserAsReady(client.id, lobbyCode);

  const allReady = await allPlayersReady(lobbyCode);

  if (allReady) {
    await playGame(lobbyCode);

    startLobbyInterval(lobbyCode, () => requestGeolocation(lobbyCode));
  }
};
