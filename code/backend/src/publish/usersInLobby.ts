import { broker } from "../broker";
import { TOPICS } from "../../../types/topics";
import { getUsersInLobby } from "../supabase";
import { LobbyUser } from "../../../types/lobby";

export const publishUsersInLobby = async (lobbyCode: string) => {
  const usersInLobby = await getUsersInLobby(lobbyCode);
  const users: LobbyUser[] = usersInLobby?.map((userInLobby: any) => ({
    id: userInLobby.users.id,
    username: userInLobby.users.username,
    roleId: userInLobby.role_id,
  }));

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
