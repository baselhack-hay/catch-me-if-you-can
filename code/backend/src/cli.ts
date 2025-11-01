// src/cli.ts
import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";
import {
  addUser,
  createLobby,
  joinLobby,
  addPointsToUserInLobby,
  getUsersWithRolesInLobby,
  testDummyData,
  listLobbies,
  getTopUsers,
  deleteLobby,
  leaveLobby,
} from "./supabase";

const rl = createInterface({ input: stdin, output: stdout });

async function promptNumber(question: string): Promise<number | null> {
  const ans = (await rl.question(question)).trim();
  if (ans === "") return null;
  const n = Number(ans);
  return Number.isNaN(n) ? null : n;
}

async function mainMenu() {
  console.log("\n=== 🎮 Catch Me If You Can — Terminal CLI ===");
  console.log("1) ➕ Create user");
  console.log("2) 🏠 Create lobby");
  console.log("3) 🚪 Join lobby");
  console.log("4) 💰 Add points to user in lobby");
  console.log("5) 👥 List users (with roles) in lobby");
  console.log("6) 🧪 Show all tables (testDummyData)");
  console.log("7) 🏆 Show top users");
  console.log("8) 📜 List lobbies");
  console.log("9) ❌ Leave lobby");
  console.log("10) 🗑️ Delete lobby");
  console.log("0) Exit\n");

  const choice = (await rl.question("Choose an option: ")).trim();

  try {
    switch (choice) {
      case "1": {
        const username = (await rl.question("Username: ")).trim();
        const point = await promptNumber("Starting points (enter to skip): ");
        const res = await addUser(username, "250");
        console.table(res ?? []);
        break;
      }

      case "2": {
        const name = (await rl.question("Lobby name: ")).trim();
        const res = await createLobby(name);
        console.table(res.data ?? []);
        break;
      }

      case "3": {
        const userId = await promptNumber("User ID: ");
        const lobbyId = await promptNumber("Lobby ID: ");
        if (!userId || !lobbyId) {
          console.log("User ID and Lobby ID are required!");
          break;
        }
        const res = await joinLobby(userId, lobbyId);
        console.table(res.data ?? []);
        break;
      }

      case "4": {
        const userId = await promptNumber("User ID: ");
        const lobbyId = await promptNumber("Lobby ID: ");
        const points = await promptNumber("Points to add (use negative to subtract): ");
        if (!userId || !lobbyId || points === null) {
          console.log("User ID, Lobby ID, and points are required!");
          break;
        }
        const res = await addPointsToUserInLobby(userId, lobbyId, points);
        console.log("Lobby points update:", res.userLobby.data ?? []);
        console.log("User total points:", res.user.data ?? []);
        break;
      }

      case "5": {
        const lobbyId = await promptNumber("Lobby ID: ");
        if (!lobbyId) {
          console.log("Lobby ID is required!");
          break;
        }
        const res = await getUsersWithRolesInLobby(lobbyId);
        if (res.error) {
          console.error("Error:", res.error);
        } else {
          console.table(res.data ?? []);
        }
        break;
      }

      case "6": {
        const data = await testDummyData();
        for (const [table, res] of Object.entries(data)) {
          console.log(`\n--- ${table.toUpperCase()} ---`);
          if (res.error) console.error(res.error);
          else console.table(res.data ?? []);
        }
        break;
      }

      case "7": {
        const res = await getTopUsers(10);
        console.table(res.data ?? []);
        break;
      }

      case "8": {
        const res = await listLobbies(20);
        console.table(res.data ?? []);
        break;
      }

      case "9": {
        const userId = await promptNumber("User ID: ");
        const lobbyId = await promptNumber("Lobby ID: ");
        if (!userId || !lobbyId) {
          console.log("User ID and Lobby ID are required!");
          break;
        }
        const res = await leaveLobby(userId, lobbyId);
        console.table(res.data ?? []);
        break;
      }

      case "10": {
        const lobbyId = await promptNumber("Lobby ID: ");
        if (!lobbyId) {
          console.log("Lobby ID is required!");
          break;
        }
        const res = await deleteLobby(lobbyId);
        console.table(res.data ?? []);
        break;
      }

      case "0":
        console.log("👋 Bye!");
        return false;

      default:
        console.log("Unknown option");
    }
  } catch (err: any) {
    console.error("❌ Operation failed:", err?.message ?? err);
  }

  return true;
}

async function run() {
  let keep = true;
  while (keep) {
    keep = await mainMenu();
  }
  rl.close();
}

run().catch((e) => {
  console.error("💥 Fatal error:", e);
  rl.close();
  process.exit(1);
});