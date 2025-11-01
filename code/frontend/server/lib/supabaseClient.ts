import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);

export async function getLobbies() {
  const { data: lobbies, error } = await supabaseClient
    .from("lobbies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching lobbies: ${error.message}`);
  }
  return lobbies;
}