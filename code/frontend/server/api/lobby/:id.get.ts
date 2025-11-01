import { supabaseClient } from "../../lib/supabaseClient";

export default defineEventHandler(async (event) => {
  const lobbyId = event.context.params?.id;

  if (!lobbyId) {
    setResponseStatus(event, 400);
    return { message: "Missing lobby id" };
  }

  const { data, error } = await supabaseClient
    .from("lobbies")
    .select("*")
    .eq("id", lobbyId)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch lobby ${lobbyId}`, error);
    setResponseStatus(event, 500);
    return { message: "Failed to fetch lobby" };
  }

  return {
    exists: Boolean(data),
    lobby: data ?? null,
  };
});
