export const TOPICS = {
  LOBBY: {
    JOIN: (code: string) => `lobby/${code}/join`,
    LEAVE: (code: string) => `lobby/${code}/leave`,
    USERS: (code: string) => `lobby/${code}/users`,
    START: (code: string) => `lobby/${code}/start`,
    STARTED: (code: string) => `lobby/${code}/started`,
    GEOLOCATION: (code: string) => `lobby/${code}/geo`,
  },
} as const;
