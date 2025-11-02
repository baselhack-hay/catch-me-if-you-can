import type Aedes from "aedes";
import { handleJoin } from "./join";
import { handleLeave } from "./leave";
import { handleStart } from "./start";
import { handleRole } from "./role";
import { handleGeolocation } from "./geolocation";
import { handleReady } from "./ready";
import { handleConfirmCatch } from "./confirmCatch";
import { handleTriggerCatch } from "./triggerCatch";

// Matches: lobby/{code}/{action}
const LOBBY_REGEX = /^lobby\/([^/]+)\/([^/]+)$/;

export const registerLobbyRouter = (broker: Aedes) => {
  broker.on("publish", (packet, client) => {
    if (!client) return;

    const topic = packet.topic;
    let payload: any = null;

    try {
      payload = JSON.parse(packet?.payload?.toString());
    } catch (error) {
      packet.payload?.toString();
    }

    const match = topic.match(LOBBY_REGEX);
    if (!match) return;

    const [, lobbyCode, action] = match;

    switch (action) {
      case "join":
        handleJoin(lobbyCode, client, payload);
        break;

      case "role":
        handleRole(lobbyCode, client, payload);
        break;

      case "leave":
        handleLeave(lobbyCode, client, payload);
        break;

      case "start":
        handleStart(lobbyCode, client, payload);
        break;

      case "geo":
        handleGeolocation(lobbyCode, client, payload);
        break;

      case "ready":
        handleReady(lobbyCode, client, payload);
        break;

      case "trigger-catch":
        handleTriggerCatch(lobbyCode, client, payload);
        break;

      case "confirm-catch":
        handleConfirmCatch(lobbyCode, client, payload);
        break;

      default:
        console.error(`❌ Unhandled lobby action: ${action}`);
    }
  });
};
