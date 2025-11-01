import type { MqttClient } from "mqtt";
import type { LobbyUser } from "types/lobby";
import { TOPICS } from "types/topics";
import { getLobbyById } from "~/utils/lobby";

export type LobbyStore = {
  code: string;
  client: MqttClient | null;
  users: LobbyUser[];
};

export const useLobbyStore = defineStore("lobbyStore", {
  state: () =>
    ({
      code: "",
      client: null,
      users: [],
    }) as LobbyStore,
  actions: {
    async joinLobby(lobbyCode: string, nickname: string): Promise<boolean> {
      try {
        const result = await getLobbyById(lobbyCode);
        if (result.exists) {
          this.code = lobbyCode;
          this.client = joinChannel(lobbyCode, nickname);
          return Promise.resolve(true);
        } else {
          throw new Error("failed to join lobby");
        }
      } catch (e) {
        console.error(
          "Failed to join lobby, as it does not exist or has already started",
        );
        return Promise.resolve(false);
      }
    },

    async startGame(): Promise<boolean> {
      this.client?.publish(
        TOPICS.LOBBY.START(this.code),
        JSON.stringify({
          message: "starting game...",
        }),
      );
      return Promise.resolve(true);
    },

    async handleJoinEvent(user: LobbyUser): Promise<void> {
      console.log("handle join event: ", user);
    },

    async handleLeaveEvent(): Promise<void> {},

    async handleUsersEvent(users: LobbyUser[]): Promise<void> {
      console.log("handle users event: ", users);
      this.users = users;
    },

    async handleStartEvent(): Promise<void> {},

    async handleStartedEvent(): Promise<void> {
      console.log("handle started event... navigating to map");
      navigateTo("/game");
    },

    async sendGeolocation(geo: Geolocation): Promise<void> {
      if (!this.code || !this.client) {
        console.warn("Cannot send geolocation without lobby connection");
        return;
      }

      this.client.publish(
        TOPICS.LOBBY.GEOLOCATION(this.code),
        JSON.stringify(geo),
      );
    },
  },
});


