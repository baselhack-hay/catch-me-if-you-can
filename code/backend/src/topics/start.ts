import type { Client } from "aedes";
import { broker } from "../broker";
import { TOPICS } from "../../../types/topics";

export const handleStart = (
  lobbyCode: string,
  client: Client,
  payload?: string
) => {
  console.log(`[START] ${client.id} is starting lobby ${lobbyCode}`);
  console.log("payload:", payload);

  broker.publish(
    {
      cmd: "publish",
      topic: TOPICS.LOBBY.STARTED(lobbyCode),
      payload: Buffer.from(`Lobby ${lobbyCode}! started`),
      qos: 0,
      retain: false,
      dup: false,
    },
    (err) => {
      if (err) console.error("Publish error:", err);
    }
  );
};
