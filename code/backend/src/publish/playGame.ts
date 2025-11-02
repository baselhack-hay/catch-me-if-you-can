import { broker } from "../broker";
import { TOPICS } from "../../../types/topics";

export const playGame = async (lobbyCode: string) => {
  console.log(`▶️ Start game for lobby ${lobbyCode}`);

  broker.publish(
    {
      cmd: "publish",
      topic: TOPICS.LOBBY.PLAY_GAME(lobbyCode),
      payload: Buffer.from(JSON.stringify({ playGame: true })),
      qos: 0,
      retain: false,
      dup: false,
    },
    (err) => {
      if (err) console.error("Publish error:", err);
    }
  );
};
