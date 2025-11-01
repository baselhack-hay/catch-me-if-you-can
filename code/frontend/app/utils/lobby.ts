import {
  type GetLobbyByIdResponse,
  type LobbySettings,
  type Lobby,
} from "types/lobby";

export async function postLobby(settings: LobbySettings): Promise<Lobby> {
  const config = useRuntimeConfig();
  const response = await $fetch<Lobby>(`${config.public.apiUrl}/lobby`, {
    method: "POST",
    body: JSON.stringify({ settings: settings }),
  });

  if (response.id) {
    return Promise.resolve(response);
  }

  return Promise.reject();
}

export async function getLobbyById(id: string): Promise<GetLobbyByIdResponse> {
  const config = useRuntimeConfig();
  const response = await $fetch<GetLobbyByIdResponse>(
    `${config.public.apiUrl}/lobby/${id}`,
  );

  if (response) {
    return Promise.resolve(response);
  } else {
    return Promise.reject();
  }
}
