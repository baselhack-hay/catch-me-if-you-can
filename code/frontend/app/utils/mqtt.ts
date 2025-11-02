import mqtt from "mqtt";
import type { LobbyUser } from "types/lobby";
import { TOPICS } from "types/topics";
import { getMqttClient } from "./mqttClient";

export function joinChannel(
  lobbyCode: string,
  nickname: string
): mqtt.MqttClient | null {
  const config = useRuntimeConfig();
  const lobbyStore = useLobbyStore();
  console.log("lobbyCode", lobbyCode);

  try {
    console.log("trigger connect");
    const client = getMqttClient(config.public.mqttUrl);

    if (!client) return null;

    client.on("connect", () => {
      client
        .subscribe(`lobby/${lobbyCode}/#`)
        .on("message", (fullTopic, payload) => {
          const topic = fullTopic.split("/").pop();
          if (topic) {
            switch (topic) {
              case "join":
                lobbyStore.handleJoinEvent(
                  JSON.parse(payload.toString()) as unknown as LobbyUser
                );
                break;
              case "users":
                lobbyStore.handleUsersEvent(
                  JSON.parse(payload.toString()) as unknown as LobbyUser[]
                );
                break;
              case "started":
                lobbyStore.handleStartedEvent();
                break;
              case "geo-request":
                lobbyStore.sendGeolocation();
                break;
              default:
                break;
            }
          }
        });
      client.publish(
        TOPICS.LOBBY.JOIN(lobbyCode),
        JSON.stringify({
          username: nickname,
        }),
        { qos: 2 }
      );
    });

    return client;
  } catch (e) {
    console.log("failed to open mqtt connection: ", e);
  }

  return null;
}
