import mqtt from "mqtt";
import type { LobbyUser } from "types/lobby";
import { TOPICS } from "types/topics";

export function joinChannel(
  lobbyCode: string,
  nickname: string
): mqtt.MqttClient | null {
  const config = useRuntimeConfig();
  const lobbyStore = useLobbyStore();

  try {
    const client = mqtt.connect(config.public.mqttUrl, {
      clientId: nickname,
    });
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
