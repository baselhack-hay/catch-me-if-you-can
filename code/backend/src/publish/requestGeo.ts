import { broker } from "../broker";
import { TOPICS } from "../../../types/topics";

export const requestGeolocation = async (lobbyCode: string) => {
  console.log(`📍 Request GEO locations for lobby ${lobbyCode}`);

  broker.publish(
    {
      cmd: "publish",
      topic: TOPICS.LOBBY.GEOLOCATION_REQUEST(lobbyCode),
      payload: Buffer.from(JSON.stringify({ sendGeo: true })),
      qos: 0,
      retain: false,
      dup: false,
    },
    (err) => {
      if (err) console.error("Publish error:", err);
    }
  );
};
