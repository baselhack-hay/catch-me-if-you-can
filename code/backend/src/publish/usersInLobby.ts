import { broker } from "../broker";
import { TOPICS } from "../../../types/topics";
import { getUsersInLobby } from "../supabase";
import { LobbyUser } from "../../../types/lobby";
import wkx, { Point } from "wkx";

export const publishUsersInLobby = async (lobbyCode: string) => {
  const usersInLobby = await getUsersInLobby(lobbyCode);
  const users: LobbyUser[] = usersInLobby?.map((userInLobby: any) => ({
    id: userInLobby.users.id,
    username: userInLobby.users.username,
    roleId: userInLobby.role_id,
    geo: parseWkbPoint(userInLobby.users.geolocation),
  }));

  console.log("PUBLISH USERS", users);

  broker.publish(
    {
      cmd: "publish",
      topic: TOPICS.LOBBY.USERS(lobbyCode),
      payload: Buffer.from(JSON.stringify(users)),
      qos: 0,
      retain: false,
      dup: false,
    },
    (err) => {
      if (err) console.error("Publish error:", err);
    }
  );
};

export function parseWkbPoint(hex?: string | null) {
  if (!hex) return null;

  const buf = Buffer.from(hex, "hex");
  const geom = wkx.Geometry.parse(buf);

  if (geom instanceof Point) {
    return {
      longitude: geom.x,
      latitude: geom.y,
    };
  }

  return null;
}
