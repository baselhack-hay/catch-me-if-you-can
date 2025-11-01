import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";
import {
  addUser,
  createLobby,
  joinLobby,
  addPointsToUserInLobby,
  getUsersInLobby,
  testDummyData,
} from "./supabase";

const rl = createInterface({ input: stdin, output: stdout });

async function promptNumber(question: string): Promise<number | null> {
  const ans = (await rl.question(question)).trim();
  if (ans === "") return null;
  const n = Number(ans);
  return Number.isNaN(n) ? null : n;
}

async function mainMenu() {
  console.log("\n=== Catch Me If You Can — Terminal Game CLI ===");
  console.log("1) Create user");
  console.log("2) Create lobby");
  console.log("3) Join lobby");
  console.log("4) Add points to user in lobby");
  console.log("5) List users in lobby");
  console.log("6) Test dummy data (show all tables)");
  console.log("0) Exit");

  const choice = (await rl.question("Choose an option: ")).trim();

  try {
    switch (choice) {
      case "1": {
        const username = (await rl.question("Username: ")).trim();
        const pts = await promptNumber("Starting points (enter to skip): ");
        const res = await addUser(username, pts ?? 0);
        console.log("Result:", res);
        break;
      }
      case "2": {
        const name = (await rl.question("Lobby name: ")).trim();
        const hostId = await promptNumber("Host user id (enter to skip): ");
        const res = await createLobby(name, hostId ?? undefined);
        console.log("Result:", res);
        break;
      }
      case "3": {
        const userId = await promptNumber("User id: ");
        const lobbyId = await promptNumber("Lobby id: ");
        if (!userId || !lobbyId) {
          console.log("user id and lobby id are required");
          break;
        }
        const res = await joinLobby(userId, lobbyId);
        console.log("Result:", res);
        break;
      }
      case "4": {
        const userId = await promptNumber("User id: ");
        const lobbyId = await promptNumber("Lobby id: ");
        const points = await promptNumber("Points to add (use negative to subtract): ");
        if (!userId || !lobbyId || points === null) {
          console.log("user id, lobby id and points are required");
          break;
        }
        const res = await addPointsToUserInLobby(userId, lobbyId, points);
        console.log("Result:", res);
        break;
      }
      case "5": {
        const lobbyId = await promptNumber("Lobby id: ");
        if (!lobbyId) {
          console.log("lobby id is required");
          break;
        }
        const res = await getUsersInLobby(lobbyId);
        if (res.error) {
          console.error("Error:", res.error);
        } else {
          console.table(res.data);
        }
        break;
      }
      case "6": {
        await testDummyData();
        break;
      }
      case "0":
        console.log("Bye");
        return false;
      default:
        console.log("Unknown option");
    }
  } catch (err: any) {
    console.error("Operation failed:", err?.message ?? err);
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
  console.error("Fatal error:", e);
  rl.close();
  process.exit(1);
});
