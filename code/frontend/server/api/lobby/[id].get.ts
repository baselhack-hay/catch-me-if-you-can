/* eslint-disable @typescript-eslint/consistent-type-imports */
import { supabaseClient } from "../../lib/supabaseClient";
import { GetLobbyByIdResponse } from "types/lobby";

export default defineEventHandler(async (event): Promise<GetLobbyByIdResponse> => {
  const lobbyId = event.context.params?.id;

  if (!lobbyId) {
    setResponseStatus(event, 400);
    return { exists: false, lobby: null };
  }

  const { data, error } = await supabaseClient
    .from("lobbies")
    .select("*")
    .eq("id", lobbyId)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch lobby ${lobbyId}`, error);
    setResponseStatus(event, 500);
    return { exists: false, lobby: null };
  }

  return {
    exists: Boolean(data),
    lobby: data ?? null,
  };
});
