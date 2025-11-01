const lobbyIntervals = new Map();

/**
 * Start interval for lobby
 */
export function startLobbyInterval(
  lobbyCode: string,
  fn: () => Promise<void>,
  ms = 5_000
) {
  // prevent duplicates
  if (lobbyIntervals.has(lobbyCode)) return;

  const interval = setInterval(fn, ms);
  lobbyIntervals.set(lobbyCode, interval);
}

/**
 * Stop interval for lobby
 */
export function stopLobbyInterval(lobbyCode: string) {
  const interval = lobbyIntervals.get(lobbyCode);
  if (!interval) return;

  clearInterval(interval);
  lobbyIntervals.delete(lobbyCode);
}
