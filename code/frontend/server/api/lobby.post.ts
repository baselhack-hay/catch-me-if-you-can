import { lobbySchema } from "validationTypes/lobby";
import { generateLobbyCode } from "./generateLobbyCode";
import { supabaseClient } from "../../app/lib/supabaseClient";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const lobbyCode = generateLobbyCode({ length: 6, dashed: true });
  try {
    const validatedLobby = lobbySchema.parse(body);

    const { data, error } = await supabaseClient
      .from("lobbies")
      .insert({ ...validatedLobby, id: lobbyCode })
      .select();
    console.log(data, error);
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
