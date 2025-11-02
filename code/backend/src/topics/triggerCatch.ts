import type { Client } from "aedes";
import { Catch } from "../../../types/catch";
import { askClientCatch } from "../publish/askClientCatch";

export const handleTriggerCatch = async (
  lobbyCode: string,
  client: Client,
  payload: Catch
) => {
  console.log(`[TRIGGER_CATCH] ${client.id} triggered catch  ${lobbyCode}`);
  console.log("payload:", payload);

  askClientCatch(lobbyCode, payload);
};
