import mqtt from "mqtt";
import type { MqttClient } from "mqtt";

function getPersistentClientId() {
  if (typeof window === "undefined") return "user_" + Math.random();

  const key = "mqtt_client_id";
  let id = localStorage.getItem(key);

  if (!id) {
    id = "user_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem(key, id);
  }

  return id;
}

export function getMqttClient(url: string): MqttClient | null {
  // ✅ SSR safety
  if (typeof window === "undefined") return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;

  // ✅ already created? → reuse
  if (w.__mqttClient) {
    return w.__mqttClient;
  }

  const clientId = getPersistentClientId();

  console.log("🔌 Creating MQTT client singleton…");

  const client = mqtt.connect(url, {
    // clean: false,
    // reconnectPeriod: 2000,
    clientId,
  });

  client.on("connect", () => {
    console.log("✅ MQTT connected");
  });

  client.on("reconnect", () => {
    console.log("♻ MQTT reconnecting…");
  });

  client.on("close", () => {
    console.log("❌ MQTT closed");
  });

  // ✅ store in window → singleton
  w.__mqttClient = client;

  return client;
}
