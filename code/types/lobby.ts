export type Lobby = {
  id?: number;
  status: string;
  settings: LobbySettings;
};

export type LobbySettings = {
  id: string;
};
