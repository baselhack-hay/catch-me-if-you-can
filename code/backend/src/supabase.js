// src/supabase.ts
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);

async function testConnection() {
  console.log("🔌 Testing Supabase connection...");
          
  const { data, error } = await supabase.from("test").select("*").limit(1);

  if (error) {
    console.error("❌ Connection or query failed:", error.message);
  } else {
    console.log("✅ Connection successful! Example data:", data);
  }
}

testConnection();