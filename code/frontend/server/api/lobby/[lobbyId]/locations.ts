/* eslint-disable @typescript-eslint/consistent-type-imports */
import { supabaseClient } from "../../../../app/lib/supabaseClient";

export default defineEventHandler(async (event) => {
  const lobbyId = event.context.params?.lobbyId;

  if (!lobbyId) {
    setResponseStatus(event, 400);
    return [];
  }

  // 👇 Alle User + Rolle + Geo
  const { data, error } = await supabaseClient
    .from("lobby_users")
    .select(`
      user_id,
      users ( username, geolocation ),
      roles ( name )
    `)
    .eq("lobby_id", lobbyId);

  if (error) {
    console.error("❌ Supabase error:", error);
    setResponseStatus(event, 500);
    return [];
  }

  // 👉 Koordinaten aus GeoJSON umwandeln
  return data
    .filter((entry) => entry.users?.geolocation)
    .map((entry) => {
      const { latitude, longitude } = entry.users.geolocation;
      const position: [number, number] = [latitude, longitude];

// TODO: Handle empty geoloc

      return {
        id: entry.user_id,
        username: entry.users?.username ?? "Unbekannt",
        role: entry.roles?.name ?? "Unbekannt",
        geolocation: position,
      };
    });
});