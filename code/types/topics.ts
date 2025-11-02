export const TOPICS = {
  LOBBY: {
    JOIN: (code: string) => `lobby/${code}/join`,
    LEAVE: (code: string) => `lobby/${code}/leave`,
    USERS: (code: string) => `lobby/${code}/users`,
    START: (code: string) => `lobby/${code}/start`,
    STARTED: (code: string) => `lobby/${code}/started`,
    READY: (code: string) => `lobby/${code}/ready`,
    PLAY_GAME: (code: string) => `lobby/${code}/play-game`,
    GEOLOCATION: (code: string) => `lobby/${code}/geo`,
    GEOLOCATION_REQUEST: (code: string) => `lobby/${code}/geo-request`,
    TRIGGER_CATCH: (code: string) => `lobby/${code}/trigger-catch`,
    ASK_CLIENT_CATCH: (code: string) => `lobby/${code}/ask-client-catch`,
    CONFIRM_CATCH: (code: string) => `lobby/${code}/confirm-catch`,
  },
} as const;
