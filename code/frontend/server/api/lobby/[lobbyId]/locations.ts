/* eslint-disable @typescript-eslint/consistent-type-imports */
import { supabaseClient } from "../../../../app/lib/supabaseClient";

export default defineEventHandler(async (event) => {
  const lobbyId = event.context.params?.lobbyId;

  if (!lobbyId) {
    console.error("❌ Keine Lobby-ID übergeben!");
    setResponseStatus(event, 400);
    return [];
  }

  console.log("📡 Lade Spieler für Lobby:", lobbyId);

  // 1️⃣ Alle Einträge aus lobby_users
  const { data: lobbyUsers, error: lobbyError } = await supabaseClient
    .from("lobby_users")
    .select("user_id, role_id, lobby_id")
    .eq("lobby_id", lobbyId)
    .select("*");

  if (lobbyError) {
    console.error("❌ Fehler beim Abrufen aus lobby_users:", lobbyError);
    setResponseStatus(event, 500);
    return [];
  }

  if (!lobbyUsers || lobbyUsers.length === 0) {
    console.warn("⚠️ Keine Spieler für diese Lobby gefunden.");
    return [];
  }

  const userIds = lobbyUsers.map((r) => r.user_id);
  const roleIds = lobbyUsers.map((r) => r.role_id);

  // 2️⃣ Alle User abrufen
  const { data: users, error: usersError } = await supabaseClient
    .from("users")
    .select("id, username, geolocation")
    .in("id", userIds);

  if (usersError) {
    console.error("❌ Fehler beim Abrufen der User:", usersError);
    setResponseStatus(event, 500);
    return [];
  }

  // 3️⃣ Rollen abrufen
  const { data: roles, error: rolesError } = await supabaseClient
    .from("roles")
    .select("id, name")
    .in("id", roleIds);

  if (rolesError) {
    console.error("❌ Fehler beim Abrufen der Rollen:", rolesError);
    setResponseStatus(event, 500);
    return [];
  }

  // 4️⃣ Daten zusammenführen
  const merged = lobbyUsers.map((lu) => {
    const user = users.find((u) => u.id === lu.user_id);
    const role = roles.find((r) => r.id === lu.role_id);

    let latitude: number | null = null;
    let longitude: number | null = null;

    // 💡 GeoJSON-Feld in einfache Koordinaten umwandeln
    if (user?.geolocation && Array.isArray(user.geolocation.coordinates)) {
      [longitude, latitude] = user.geolocation.coordinates;
    }

    return {
      id: user?.id ?? lu.user_id,
      username: user?.username ?? "Unbekannt",
      role: role?.name ?? "Unbekannt",
      geolocation: {
        latitude,
        longitude,
      },
    };
  });

  // 5️⃣ Nur gültige Positionen behalten
  const result = merged.filter(
    (u) =>
      typeof u.geolocation.latitude === "number" &&
      typeof u.geolocation.longitude === "number"
  );

  console.log("✅ Gefundene Spieler:", result);
  return result;
});