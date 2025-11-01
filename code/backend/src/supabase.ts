// src/supabase.ts
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);

export async function testDummyData() {
  const tables = ["users", "lobbies", "lobby_users", "feeds", "maps"];
  const results: Record<string, any> = {};
  for (const table of tables) {
    const res = await supabase.from(table).select("*");
    results[table] = res;
  }
  return results;
}

export async function addUser(username: string, points: number = 0) {
  const res = await supabase
    .from("users")
    .insert([{ username, points }])
    .select();
  return res;
}

export async function createLobby(name: string, hostUserId?: number) {
  const res = await supabase
    .from("lobby")
    .insert([{ name }])
    .select();
  return res;
}

export async function joinLobby(userId: number, lobbyId: number) {
  const res = await supabase
    .from("lobby_user")
    .insert([{ user_id: userId, lobby_id: lobbyId }])
    .select();
  return res;
}

export async function addPointsToUserInLobby(
  userId: number,
  lobbyId: number,
  points: number
) {
  // read existing lobby_user entry
  const existing = await supabase
    .from("lobby_user")
    .select("points")
    .match({ user_id: userId, lobby_id: lobbyId })
    .maybeSingle();

  let userLobbyResult: any = null;

  if (existing.data) {
    const newPoints = (existing.data.points ?? 0) + points;
    const upd = await supabase
      .from("lobby_user")
      .update({ points: newPoints })
      .match({ user_id: userId, lobby_id: lobbyId })
      .select();
    userLobbyResult = upd;
  } else {
    const ins = await supabase
      .from("lobby_user")
      .insert([{ user_id: userId, lobby_id: lobbyId, points }])
      .select();
    userLobbyResult = ins;
  }

  // update total points on users table
  const userRow = await supabase.from("users").select("points").eq("id", userId).maybeSingle();
  const current = userRow.data?.points ?? 0;
  const updatedTotal = current + points;
  const userUpd = await supabase
    .from("users")
    .update({ points: updatedTotal })
    .eq("id", userId)
    .select();

  return {
    userLobby: userLobbyResult,
    user: userUpd,
  };
}

export async function getUsersInLobby(lobbyId: number) {
  const res = await supabase
    .from("lobby_user")
    .select("user_id, User (id, username, points)")
    .eq("lobby_id", lobbyId);
  return res;
}

