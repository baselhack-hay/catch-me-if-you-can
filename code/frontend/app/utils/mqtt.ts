import mqtt from "mqtt";
import type { LobbyUser } from "types/lobby";
import { TOPICS } from "types/topics";

export function joinChannel(lobbyCode: string): mqtt.MqttClient | null {
  const config = useRuntimeConfig();
  const lobbyStore = useLobbyStore();

  try {
    const client = mqtt.connect(config.public.mqttUrl, {
      clientId: "hello-client",
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
                  JSON.parse(payload.toString()) as unknown as LobbyUser,
                );
              case "leave":
                lobbyStore.handleLeaveEvent();
              case "users":
                lobbyStore.handleUsersEvent(
                  JSON.parse(payload.toString()) as unknown as LobbyUser[],
                );
              case "start":
                lobbyStore.handleStartEvent();
              case "started":
                lobbyStore.handleStartedEvent();
              default:
                break;
            }
          }
        });
      client.publish(
        TOPICS.LOBBY.JOIN(lobbyCode),
        JSON.stringify({
          username: "tung tung tung sahur",
        }),
      );
    });

    return client;
  } catch (e) {
    console.log("failed to open mqtt connection: ", e);
  }

  return null;
}
