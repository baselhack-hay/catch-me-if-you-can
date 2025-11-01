import type { Client } from "aedes";
import { setGeolocation } from "../supabase";
import { GeoLocation } from "../../../types/map";
import { publishUsersInLobby } from "../publish/usersInLobby";

export const handleGeolocation = async (
  lobbyCode: string,
  client: Client,
  payload: GeoLocation
) => {
  console.log(`[GEO] ${client.id} sent geolocation`);
  console.log("payload:", payload);

  await setGeolocation(client.id, payload);

  publishUsersInLobby(lobbyCode);
};
