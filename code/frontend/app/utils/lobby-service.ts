import type { GetLobbyByIdResponse } from "types/lobby";

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
