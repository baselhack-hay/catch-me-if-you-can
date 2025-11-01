import { getLobbies } from "../../app/lib/supabaseClient";
import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
    const lobbies = await getLobbies();
    return lobbies ?? [];
});