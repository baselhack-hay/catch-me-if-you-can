// lobby-code.ts
// Human-friendly alphabet (no I, O, 1, 0)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generate a random lobby code (e.g. K7X-2QM).
 */
export function generateLobbyCode(
  opts: { length?: number; dashed?: boolean } = {}
): string {
  const { length = 6, dashed = true } = opts;

  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);

  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }

  if (!dashed) return code;

  // Group for readability
  if (length % 4 === 0) return code.match(/.{1,4}/g)!.join("-");
  if (length % 3 === 0) return code.match(/.{1,3}/g)!.join("-");
  return code;
}
