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

testDummyData();

