import type { MqttClient } from "mqtt";
import type { LobbyUser } from "types/lobby";
import type { Catch } from "types/catch";
import { TOPICS } from "types/topics";
import { getLobbyById, postLobby } from "~/utils/lobby";

export const LOBBY_KEY = "lobbyStore";

export type LobbyStore = {
  code: string;
  nickname: string;
  client: MqttClient | null;
  users: LobbyUser[];
  uuids: {
    hunter: string;
    bunny: string;
  };
  caughtPlayerCheck: boolean;
};

export const useLobbyStore = defineStore("lobbyStore", {
  state: () =>
    ({
      code: "",
      nickname: "",
      client: null,
      users: [],
      uuids: {
        hunter: "08182765-80e1-45fd-ac2f-201986b30de1",
        bunny: "37ee07b1-1cf8-4efb-aa42-ca03d2681cf8",
      },
    } as LobbyStore),
  actions: {
    async createLobby(lobbyname: string, nickname: string): Promise<void> {
      const result = await postLobby({
        id: lobbyname,
      });

      if (result.id) {
        try {
          const joinResult = await this.joinLobby(result.id, nickname);
          if (joinResult) {
            navigateTo("/lobby/overview");
          }
        } catch (e) {
          console.log(e);
        }
      }
    },

    async joinLobby(lobbyCode: string, nickname: string): Promise<boolean> {
      console.log("client", this.client);
      try {
        const result = await getLobbyById(lobbyCode);
        if (result.exists) {
          this.code = lobbyCode;
          this.nickname = nickname;
          console.log("client", this.client);
          this.client = joinChannel(lobbyCode, nickname);
          this.saveToSessionStorage();
          return Promise.resolve(true);
        } else {
          throw new Error("failed to join lobby");
        }
      } catch (e) {
        console.error(
          "Failed to join lobby, as it does not exist or has already started",
          e
        );
        return Promise.resolve(false);
      }
    },

    async startGame(): Promise<boolean> {
      this.client?.publish(
        TOPICS.LOBBY.START(this.code),
        JSON.stringify({
          message: "starting game...",
        })
      );
      return Promise.resolve(true);
    },

    setReady(): void {
      this.client?.publish(
        TOPICS.LOBBY.READY(this.code),
        JSON.stringify({
          message: "Player ready",
        })
      );
    },

    triggerCatch(bunnyId: string, bunnyName: string): void {
      console.log("trigger catch!");
      const clientId = getPersistentClientId();
      const user = this.users.find((u) => u.id === clientId);
      if (!user) return;

      const payload: Catch = {
        hunterId: user.id,
        hunterName: user.username,
        bunnyId,
        bunnyName,
      };
      console.log("payload", payload);

      this.client?.publish(
        TOPICS.LOBBY.TRIGGER_CATCH(this.code),
        JSON.stringify(payload)
      );
    },

    async handleJoinEvent(user: LobbyUser): Promise<void> {
      console.log("handle join event: ", user);
    },

    async handleUsersEvent(users: LobbyUser[]): Promise<void> {
      console.log("handle users event: ", users);
      this.users = users;
    },

    async handleAskCatched(payload: Catch): Promise<void> {
      console.log("ask catched", payload);
      // console.log("handle users event: ", users);
      // this.users = users;
      const clientId = getPersistentClientId();
      const user = this.users.find((u) => u.id === clientId);
      if (user?.id === payload.bunnyId) {
        this.caughtPlayerCheck = true;
      }
    },

    async handleStartedEvent(): Promise<void> {
      console.log("handle started event... navigating to assign role");
      const clientId = getPersistentClientId();
      console.log("clientId", clientId);
      const user = this.users.find((u) => u.id === clientId);

      console.log("current user", user);
      const role = user?.roleId === this.uuids.hunter ? "hunter" : "bunny";
      console.log("current role", role);

      navigateTo(`/assign-role?role=${role}`);
    },

    handlePlayGameEvent(): void {
      console.log("handle started event... navigating to assign role");
      const clientId = getPersistentClientId();
      console.log("clientId", clientId);
      const user = this.users.find((u) => u.id === clientId);

      console.log("current user", user);
      const role = user?.roleId === this.uuids.hunter ? "hunter" : "bunny";
      console.log("current role", role);

      if (role === "hunter") {
        navigateTo(`/countdown`);
      } else {
        navigateTo(`/game`);
      }
    },

    async leaveLobby(): Promise<void> {
      this.client?.publish(
        TOPICS.LOBBY.LEAVE(this.code),
        JSON.stringify({ lobbyCode: this.code })
      );
      console.log("leave");
      this.client?.unsubscribe(`lobby/${this.code}/#`);
      this.code = "";
      // this.client?.end();
      navigateTo("/");
    },

    async sendGeolocation(): Promise<void> {
      if (!this.code || !this.client) {
        console.warn("Cannot send geolocation without lobby connection");
        return;
      }

      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const geo = pos.coords;
          console.log("📍 Sending Geolocation:", geo.latitude, geo.longitude);
          this.client?.publish(
            TOPICS.LOBBY.GEOLOCATION(this.code),
            JSON.stringify(geo)
          );
        },
        (err) => console.warn("Geolocation-Fehler:", err)
      );
    },

    async catchPlayer(hunter: LobbyUser, bunny: LobbyUser): Promise<boolean> {
      try {
        const bunnyAccepted: boolean = false; // await ...
        return Promise.resolve(bunnyAccepted);
      } catch (e) {
        return Promise.reject(e);
      }
    },

    async onCaughtListener(bunnyName: string): Promise<LobbyUser> {
      const hunter: LobbyUser = {
        id: "",
        username: "",
        roleId: null,
      }; // await ...

      return Promise.resolve(hunter);
    },

    confirmOrDenyCatch(bunny: LobbyUser, confirm: boolean) {},

    async handleError(message: string): Promise<void> {
      console.error("Lobby error:", message);
    },

    async disconnectMqttClient() {
      this.code = "";
      this.nickname = "";
      this.saveToSessionStorage();
      this.client?.end();
    },

    saveToSessionStorage(): void {
      sessionStorage.setItem(
        LOBBY_KEY,
        JSON.stringify({
          code: this.code,
          nickname: this.nickname,
        })
      );
    },

    async retrieveFromSessionStorage(): Promise<void> {
      const json = sessionStorage.getItem(LOBBY_KEY);
      if (json) {
        try {
          const lobbyStore = JSON.parse(json) as LobbyStore;
          console.log(lobbyStore);
          this.code = lobbyStore?.code;
          this.nickname = lobbyStore?.nickname;
          await this.joinLobby(this.code, this.nickname);
        } catch (e) {
          console.error("failed to parse data from local storage: ", e);
        }
      }
    },
  },
});
