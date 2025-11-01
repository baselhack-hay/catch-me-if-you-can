import { startTcpServer } from "./tcpServer";
import { startWsServer } from "./wsServer";

// --- 1️⃣ Raw TCP broker (for MQTT Explorer, CLI clients, etc.) ---
startTcpServer();
// --- 2️⃣ WebSocket broker (for browsers / React clients) ---
startWsServer();
