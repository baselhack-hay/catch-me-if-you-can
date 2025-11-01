import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function getLobbies() {
  const { data: lobbies, error } = await supabaseClient
    .from("lobbies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching lobbies:", error);
    return [];
  }
  return lobbies;}