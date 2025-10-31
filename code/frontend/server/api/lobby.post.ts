import { serverSupabaseClient } from "#supabase/server";
import { lobbySchema } from "validationTypes/lobby";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);
  try {
    const validatedLobby = lobbySchema.parse(body);
    const { data } = await client.from("Lobby").insert(validatedLobby).select();

    setResponseStatus(event, 201);
    return JSON.stringify(data);
  } catch (e) {
    console.error(e);
  }

  setResponseStatus(event, 400);
  return {
    message: "Failed to validate schema",
  };
});
