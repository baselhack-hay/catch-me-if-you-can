export const TOPICS = {
  LOBBY: {
    JOIN: (code: string) => `lobby/${code}/join`,
    LEAVE: (code: string) => `lobby/${code}/leave`,
    START: (code: string) => `lobby/${code}/start`,
    STARTED: (code: string) => `lobby/${code}/started`,
  },
} as const;
