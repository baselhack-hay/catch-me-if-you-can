export type Lobby = {
  id?: string;
  status: string;
  settings: LobbySettings;
};

export type LobbySettings = {
  id: string;
};

export type JoinLobby = {
  username: string;
};

export type GetLobbyByIdResponse = {
  exists: boolean;
  lobby: Lobby | null;
};

export type SetRole = {
  userId: string;
  roleId: string;
};

export type LobbyUser = {
  id: string;
  username: string;
  roleId: string | null;
};
