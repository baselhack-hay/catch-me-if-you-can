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

export async function addUser(id: string, username: string) {
  if (!username || username.trim().length === 0) {
    throw new Error("username is required");
  }

  const { data, error } = await supabase
    .from("users")
    .upsert([{ id, username: username.trim() }])
    .select()
    .single();

  return data;
}

export async function createLobby(name: string, hostUserId?: number) {
  const res = await supabase.from("lobby").insert([{ name }]).select();
  return res;
}

export async function joinLobby(userId: string, lobbyId: string) {
  const { data, error } = await supabase
    .from("lobby_users")
    .upsert([{ user_id: userId, lobby_id: lobbyId }], {
      onConflict: "lobby_id,user_id",
    })
    .select();
  return data;
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
  const userRow = await supabase
    .from("users")
    .select("points")
    .eq("id", userId)
    .maybeSingle();
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

export async function createMap(lobbyId: number, name: string, data: any) {
  const res = await supabase
    .from("maps")
    .insert([{ lobby_id: lobbyId, name, data }])
    .select();
  return res;
}

export async function getMapsForLobby(lobbyId: number) {
  const res = await supabase
    .from("maps")
    .select("*")
    .eq("lobby_id", lobbyId)
    .order("id", { ascending: true });
  return res;
}

export async function updateMap(mapId: number, updates: Record<string, any>) {
  const res = await supabase
    .from("maps")
    .update(updates)
    .eq("id", mapId)
    .select();
  return res;
}

export async function deleteMap(mapId: number) {
  const res = await supabase.from("maps").delete().eq("id", mapId).select();
  return res;
}

export async function addFeed(
  lobbyId: number,
  userId: number,
  content: string
) {
  const res = await supabase
    .from("feeds")
    .insert([{ lobby_id: lobbyId, user_id: userId, content }])
    .select();
  return res;
}

export async function getFeedsForLobby(lobbyId: number, limit: number = 50) {
  const res = await supabase
    .from("feeds")
    .select("*")
    .eq("lobby_id", lobbyId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return res;
}

export async function setLobbySettings(
  lobbyId: number,
  settings: Record<string, any>
) {
  // upsert settings row keyed by lobby_id
  const res = await supabase
    .from("settings")
    .upsert([{ lobby_id: lobbyId, settings }], { onConflict: "lobby_id" })
    .select();
  return res;
}

export async function getLobbySettings(lobbyId: number) {
  const res = await supabase
    .from("settings")
    .select("settings")
    .eq("lobby_id", lobbyId)
    .maybeSingle();
  return res;
}

export async function setRoleForUserInLobby(
  userId: number,
  lobbyId: number,
  role: string
) {
  // find the lobby_user row first
  const lu = await supabase
    .from("lobby_user")
    .select("id")
    .match({ user_id: userId, lobby_id: lobbyId })
    .maybeSingle();

  if (!lu.data) {
    return { error: "lobby_user not found", status: 404 };
  }

  const res = await supabase
    .from("roles")
    .upsert([{ lobby_user_id: lu.data.id, role }], {
      onConflict: "lobby_user_id",
    })
    .select();
  return res;
}

export async function getRoleForUserInLobby(userId: number, lobbyId: number) {
  const lu = await supabase
    .from("lobby_user")
    .select("id")
    .match({ user_id: userId, lobby_id: lobbyId })
    .maybeSingle();

  if (!lu.data) {
    return { data: null };
  }

  const res = await supabase
    .from("roles")
    .select("role")
    .eq("lobby_user_id", lu.data.id)
    .maybeSingle();
  return res;
}

export async function getUsersWithRolesInLobby(lobbyId: number) {
  // returns lobby_user rows with embedded User and Roles if relationships are set up
  const res = await supabase
    .from("lobby_user")
    .select("user_id, User (id, username, points), Roles (role)")
    .eq("lobby_id", lobbyId);
  return res;
}

export async function getLobbyById(lobbyId: number) {
  return await supabase
    .from("lobby")
    .select("*")
    .eq("id", lobbyId)
    .maybeSingle();
}

export async function getUserById(userId: number) {
  return await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
}

export async function listLobbies(
  limit: number = 50,
  offset: number = 0,
  ascending: boolean = true
) {
  // uses range for pagination
  const start = offset;
  const end = offset + limit - 1;
  return await supabase
    .from("lobby")
    .select("*")
    .order("id", { ascending })
    .range(start, end);
}

export async function leaveLobby(userId: number, lobbyId: number) {
  return await supabase
    .from("lobby_user")
    .delete()
    .match({ user_id: userId, lobby_id: lobbyId })
    .select();
}

export async function deleteLobby(lobbyId: number) {
  // Deletes the lobby row; dependent rows require DB cascade or separate deletes
  return await supabase.from("lobby").delete().eq("id", lobbyId).select();
}

export async function getTopUsers(limit: number = 10) {
  return await supabase
    .from("users")
    .select("*")
    .order("points", { ascending: false })
    .limit(limit);
}

export async function searchUsersByUsername(query: string, limit: number = 20) {
  return await supabase
    .from("users")
    .select("*")
    .ilike("username", `%${query}%`)
    .limit(limit);
}

export async function transferPointsBetweenUsers(
  fromUserId: number,
  toUserId: number,
  amount: number
) {
  if (amount <= 0) return { error: "amount must be positive" };

  const fromRow = await supabase
    .from("users")
    .select("points")
    .eq("id", fromUserId)
    .maybeSingle();
  const toRow = await supabase
    .from("users")
    .select("points")
    .eq("id", toUserId)
    .maybeSingle();

  const fromPoints = fromRow.data?.points ?? 0;
  const toPoints = toRow.data?.points ?? 0;

  if (fromPoints < amount) return { error: "insufficient points", status: 400 };

  const updFrom = await supabase
    .from("users")
    .update({ points: fromPoints - amount })
    .eq("id", fromUserId)
    .select();

  const updTo = await supabase
    .from("users")
    .update({ points: toPoints + amount })
    .eq("id", toUserId)
    .select();

  return { from: updFrom, to: updTo };
}

export async function removeRoleForUserInLobby(
  userId: number,
  lobbyId: number
) {
  const lu = await supabase
    .from("lobby_user")
    .select("id")
    .match({ user_id: userId, lobby_id: lobbyId })
    .maybeSingle();

  if (!lu.data) return { error: "lobby_user not found", status: 404 };

  return await supabase
    .from("roles")
    .delete()
    .eq("lobby_user_id", lu.data.id)
    .select();
}

export async function getMapById(mapId: number) {
  return await supabase.from("maps").select("*").eq("id", mapId).maybeSingle();
}

export async function getFeedsByUser(userId: number, limit: number = 50) {
  return await supabase
    .from("feeds")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
}

export async function clearFeedsForLobby(lobbyId: number) {
  return await supabase.from("feeds").delete().eq("lobby_id", lobbyId).select();
}

export async function updateUserName(userId: number, username: string) {
  return await supabase
    .from("users")
    .update({ username })
    .eq("id", userId)
    .select();
}

export async function getLobbyMemberCount(lobbyId: number) {
  const res: any = await supabase
    .from("lobby_user")
    .select("id", { count: "exact", head: false })
    .eq("lobby_id", lobbyId);
  // res.count contains the exact count when available
  return { count: res.count ?? null, result: res };
}
