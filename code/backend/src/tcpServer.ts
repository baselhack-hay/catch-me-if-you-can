import { createServer as createTcpServer } from "node:net";
import { broker } from "./broker";

const MQTT_PORT = 1883;

export const startTcpServer = () => {
  const server = createTcpServer(broker.handle);

  server.listen(MQTT_PORT, () => {
    console.log(`🐝 MQTT TCP broker running on port ${MQTT_PORT}`);
  });
};
