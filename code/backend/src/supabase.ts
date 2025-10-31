// src/supabase.ts
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);

async function testDummyData() {
  console.log("🧠 Testing dummy data in all tables...");

  const tables = ["User", "Lobby", "User_Lobby", "Feed", "Map"];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`❌ Error in table ${table}:`, error.message);
    } else {
      console.log(`✅ ${table}: ${data.length} rows`);
      console.table(data);
    }
  }
}

export async function addUser(username: string, points: number = 0) {
  if (!username || username.trim().length === 0) {
    throw new Error("username is required");
  }

  const { data, error } = await supabase
    .from("User")
    .insert([{ username: username.trim(), points }])
    .select();

  if (error) {
    console.error("❌ Fehler beim Hinzufügen des Users:", error.message);
    return { error };
  }

  console.log("✅ Neuer User angelegt:", data);
  return { data };
}

export async function createLobby(
  name: string,
  hostUserId?: number
) {
  if (!name || name.trim().length === 0) {
    throw new Error("lobby name is required");
  }

  const { data, error } = await supabase
    .from("Lobby")
    .insert([{ name: name.trim() }])
    .select();

  if (error) {
    console.error("❌ Fehler beim Anlegen der Lobby:", error.message);
    return { error };
  }

  const lobby = data?.[0];
  console.log("✅ Lobby angelegt:", lobby);

  // Optional: Host automatisch der Lobby hinzufügen (wenn hostUserId gesetzt)
  if (hostUserId && lobby && lobby.id) {
    const joinRes = await joinLobby(hostUserId, lobby.id);
    if (joinRes.error) {
      console.warn("⚠️ Lobby angelegt, aber Host konnte nicht hinzugefügt werden:", joinRes.error.message);
    } else {
      console.log("✅ Host dem Lobby-Teilnehmer hinzugefügt:", joinRes.data);
    }
  }

  return { data: lobby };
}

export async function joinLobby(userId: number, lobbyId: number) {
  if (!userId || !lobbyId) {
    throw new Error("userId and lobbyId are required");
  }

  const { data, error } = await supabase
    .from("User_Lobby")
    .insert([{ user_id: userId, lobby_id: lobbyId }])
    .select();

  if (error) {
    console.error("❌ Fehler beim Joinen der Lobby:", error.message);
    return { error };
  }

  console.log("✅ User in Lobby eingetragen:", data);
  return { data };
}

// NEU: Punkte für User in einer Lobby hinzufügen (und Gesamtpunkte im User aktualisieren)
export async function addPointsToUserInLobby(
  userId: number,
  lobbyId: number,
  points: number
) {
  if (!userId || !lobbyId) {
    throw new Error("userId and lobbyId are required");
  }
  if (typeof points !== "number" || points === 0) {
    throw new Error("points must be a non-zero number");
  }

  // 1) Versuche vorhandenen User_Lobby-Eintrag zu lesen (falls vorhanden)
  const { data: existingUL, error: selErr } = await supabase
    .from("User_Lobby")
    .select("points")
    .match({ user_id: userId, lobby_id: lobbyId })
    .maybeSingle();

  if (selErr) {
    console.error("❌ Fehler beim Lesen von User_Lobby:", selErr.message);
    return { error: selErr };
  }

  // 2) Falls vorhanden: Punkte erhöhen, sonst neuen Eintrag mit Punkten anlegen
  let userLobbyResult: any = null;
  if (existingUL) {
    const newPoints = (existingUL.points ?? 0) + points;
    const { data: updData, error: updErr } = await supabase
      .from("User_Lobby")
      .update({ points: newPoints })
      .match({ user_id: userId, lobby_id: lobbyId })
      .select();

    if (updErr) {
      console.error("❌ Fehler beim Aktualisieren von User_Lobby:", updErr.message);
      return { error: updErr };
    }
    userLobbyResult = updData?.[0] ?? updData;
  } else {
    const { data: insData, error: insErr } = await supabase
      .from("User_Lobby")
      .insert([{ user_id: userId, lobby_id: lobbyId, points }])
      .select();

    if (insErr) {
      console.error("❌ Fehler beim Anlegen von User_Lobby:", insErr.message);
      return { error: insErr };
    }
    userLobbyResult = insData?.[0] ?? insData;
  }

  // 3) Gesamtpunkte im User-Record erhöhen
  const { data: userRow, error: userSelErr } = await supabase
    .from("User")
    .select("points")
    .eq("id", userId)
    .maybeSingle();

  if (userSelErr) {
    console.error("❌ Fehler beim Lesen des Users:", userSelErr.message);
    return { error: userSelErr };
  }

  const currentUserPoints = userRow?.points ?? 0;
  const updatedTotal = currentUserPoints + points;

  const { data: userUpdData, error: userUpdErr } = await supabase
    .from("User")
    .update({ points: updatedTotal })
    .eq("id", userId)
    .select();

  if (userUpdErr) {
    console.error("❌ Fehler beim Aktualisieren des Users:", userUpdErr.message);
    return { error: userUpdErr };
  }

  console.log(
    `✅ Punkte hinzugefügt: user_id=${userId}, lobby_id=${lobbyId}, +${points}`
  );

  return {
    userLobby: userLobbyResult,
    user: userUpdData?.[0] ?? userUpdData,
  };
}

// export test function but do not run automatically
export { testDummyData };

