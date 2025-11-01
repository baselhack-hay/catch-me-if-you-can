import { getLobbyById } from "~/utils/lobby-service";

export type LobbyStore = {
  code: string;
};

export const useLobbyStore = defineStore("lobbyStore", {
  state: () =>
    ({
      code: "",
    }) as LobbyStore,
  actions: {
    async joinLobby(lobbyCode: string): Promise<boolean> {
      try {
        const result = await getLobbyById(lobbyCode);
        if (result.exists) {
          this.code = lobbyCode;
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
  },
});
