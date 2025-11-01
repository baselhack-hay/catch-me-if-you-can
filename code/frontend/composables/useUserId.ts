import { useLocalStorage } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";

export function useUserId() {
  // Bleibt auch nach Reload erhalten
  const userId = useLocalStorage("user_id", uuidv4());
  return userId;
}