import { broker } from "../broker";
import { TOPICS } from "../../../types/topics";
import { Catch } from "../../../types/catch";

export const askClientCatch = async (
  lobbyCode: string,
  catchPayload: Catch
) => {
  console.log(` Ask if catched ${catchPayload}`);

  broker.publish(
    {
      cmd: "publish",
      topic: TOPICS.LOBBY.ASK_CLIENT_CATCH(lobbyCode),
      payload: Buffer.from(JSON.stringify(catchPayload)),
      qos: 0,
      retain: false,
      dup: false,
    },
    (err) => {
      if (err) console.error("Publish error:", err);
    }
  );
};
