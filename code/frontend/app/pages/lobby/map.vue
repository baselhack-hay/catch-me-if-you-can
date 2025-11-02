<!-- eslint-disable vue/no-multiple-template-root -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LobbyUser } from "types/lobby";

// 🌍 MAP + UI STATE
const map = ref<L.Map | null>(null);
const dialogOpen = ref(false);;
const confirmCatchDialogOpen = ref<boolean>(false);
const confirmCatchHunter = ref<LobbyUser | null>(null);
const selectedPlayer = ref<LobbyUser | null>(null);
const showGeoError = ref(false);

// 🧭 MARKER STATES
let selfMarker: L.Marker | null = null;
const userMarkers = new Map<string, L.Marker>();

// 🕓 INTERVALS
let geoInterval: ReturnType<typeof setInterval> | null = null;
let userUpdateInterval: ReturnType<typeof setInterval> | null = null;
let firstUpdate = true;

// 🧩 LOBBY STORE
const lobbyStore = useLobbyStore();
const currentPlayer = computed(() =>
  lobbyStore.users.find((p) => p.username === lobbyStore.nickname)
);

// 🎯 "Catch" Dialog schließen
const catchPlayer = () => {
  selectedPlayer.value = null;
  dialogOpen.value = false;
}

// ✅ SETUP
onMounted(async () => {
  await nextTick();

  const fallback: [number, number] = [47.5596, 7.5886];
  map.value = L.map("map").setView(fallback, 13);

  // 🌙 Darkmode Layer
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> | © OpenStreetMap contributors',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map.value as L.Map);

  // 🚶‍♂️ Eigene Position alle 5s aktualisieren
  await updatePosition();
  geoInterval = setInterval(updatePosition, 5000);

  // 🧍‍♂️ Gegner-Positionen alle 10s aktualisieren
  updateUserMarkers(lobbyStore.users);
  userUpdateInterval = setInterval(() => {
    updateUserMarkers(lobbyStore.users);
  }, 10000);
});

// 🛰️ EIGENE POSITION AKTUALISIEREN
async function updatePosition(): Promise<void> {
  if (!navigator.geolocation) {
    showGeoError.value = true;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (!map.value) return;

      const { latitude, longitude } = pos.coords;
      const position: [number, number] = [latitude, longitude];

      // ✅ Sobald Erfolg -> Fehlermeldung ausblenden
      if (showGeoError.value) showGeoError.value = false;

      const myIcon = getIconForRole("self");

      // 📍 Marker erzeugen oder aktualisieren
      if (!selfMarker) {
        selfMarker = L.marker(position, { icon: myIcon }).addTo(map.value as L.Map);
      } else {
        selfMarker.setLatLng(position);
      }

      // 🧭 Karte beim ersten Mal zentrieren
      if (firstUpdate) {
        map.value.setView(position, 15, { animate: true });
        firstUpdate = false;
      }

      // Optional: an Server senden
      // lobbyStore.sendGeolocation(latitude, longitude);
    },
    (err) => {
      console.warn("⚠️ Geolocation konnte nicht abgerufen werden:", err);
      showGeoError.value = true;
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    }
  );
}

// 🔀 Erzeugt eine zufällige Position innerhalb eines bestimmten Radius (in Metern)
function randomOffsetMeters(lat: number, lon: number, radiusMeters = 300): [number, number] {
  const r = radiusMeters / 111300; // grobe Umrechnung m → Grad
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const newLat = lat + w * Math.cos(t);
  const newLon = lon + w * Math.sin(t) / Math.cos((lat * Math.PI) / 180);
  return [newLat, newLon];
}

// 👥 SPIELER-MARKER AKTUALISIEREN
function updateUserMarkers(users: LobbyUser[]) {
  if (!map.value) return;

  const seen = new Set<string>();

  for (const user of users) {
    if (!user.geo?.latitude || !user.geo?.longitude) continue;
    if (user.username === lobbyStore.nickname) continue; // dich selbst überspringen

    // ⚙️ Position zufällig um ca. 40 m versetzen (aber echte Rolle beibehalten)
    const [lat, lon] = randomOffsetMeters(user.geo.latitude, user.geo.longitude, 40);
    const pos: [number, number] = [lat, lon];

    const icon = getIconForRole(user.roleId);
    seen.add(user.id);

    const existing = userMarkers.get(user.id);

    if (!existing) {
      // 🆕 Neuer Marker
      const marker = L.marker(pos, { icon }).addTo(map.value as L.Map);
      marker.on("click", () => {
        if (currentPlayer.value?.roleId !== lobbyStore.uuids.hunter) return;
        if (user.roleId === lobbyStore.uuids.hunter) return;
        selectedPlayer.value = user;
        dialogOpen.value = true;
      });
      userMarkers.set(user.id, marker);
    } else {
      existing.setLatLng(pos);

      const existingHtml =
        existing.getIcon() instanceof L.DivIcon
          ? (existing.getIcon().options as L.DivIconOptions).html
          : null;
      if (existingHtml !== icon.options.html) {
        existing.setIcon(icon);
      }
    }
  }

  // 🧹 Entferne Spieler, die nicht mehr da sind
  for (const [id, marker] of userMarkers.entries()) {
    if (!seen.has(id)) {
      marker.remove();
      userMarkers.delete(id);
    }
  }
}

// 🎨 MARKER-ICON MIT PULS
function getIconForRole(role: string): L.DivIcon {
  const colors: Record<string, string> = {
    "08182765-80e1-45fd-ac2f-201986b30de1": "#ef4444", // 🔴 Hunter
    "37ee07b1-1cf8-4efb-aa42-ca03d2681cf8": "#22c55e", // 🟢 Bunny
    self: "#8B5CF6", // 🟣 Du selbst
  };
  const color = colors[role] || "#8B5CF6";

  if (role === "self") {
    // 🟣 Eigener Marker (Dreieck)
    return L.divIcon({
      html: `
        <div class="marker-self" style="filter: drop-shadow(0 0 8px ${color});">
          <div class="triangle" style="border-bottom-color: ${color};"></div>
        </div>`,
      className: "leaflet-marker-custom",
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
  }

  // 🔴🟢 Gegner – sichtbarer, weicher Puls
  return L.divIcon({
    html: `
      <div class="marker-enemy" style="--marker-color: ${color};"></div>
    `,
    className: "leaflet-marker-custom",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

// 🧹 CLEANUP
onBeforeUnmount(() => {
  if (geoInterval) clearInterval(geoInterval);
  if (userUpdateInterval) clearInterval(userUpdateInterval);
  userMarkers.forEach((m) => m.remove());
  userMarkers.clear();
  map.value?.remove();
  map.value = null;
  selfMarker = null;
});
</script>

<template>
  <ui-dialog :open="dialogOpen">
    <ui-dialog-content>
      <ui-dialog-header>
        <ui-dialog-title>
          Catch <span class="text-(--color-electric-red)">
            {{ selectedPlayer?.username }}
          </span>?
        </ui-dialog-title>
      </ui-dialog-header>
      <ui-button @click="catchPlayer" :variant="`positive`">Yes</ui-button>
      <ui-button
        @click="dialogOpen = false; selectedPlayer = null;"
        :variant="`negative`"
      >No</ui-button>
    </ui-dialog-content>
  </ui-dialog>


  <ui-dialog :open="confirmCatchDialogOpen">
    <ui-dialog-content>
      <ui-dialog-header>
        <ui-dialog-title>
          Hunter <span class="text-(--color-electric-red)">{{confirmCatchHunter?.username}}</span>
          said they caught you.
        </ui-dialog-title>
      </ui-dialog-header>

      <ui-button @click="confirmCatch" :variant="`positive`">Accept</ui-button>
      <ui-button @click="denyCatch" :variant="`negative`">Deny</ui-button>

    </ui-dialog-content>
  </ui-dialog>
  <div class="relative w-full h-[calc(100vh-16px)]">
    <transition name="fade">
      <div
        v-if="showGeoError"
        class="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg z-[10000]"
      >
        ❌ Standort konnte nicht abgerufen werden.
      </div>
    </transition>
    <div id="map" class="w-full h-full" />
  </div>
</template>

<style scoped>
:deep(.leaflet-marker-custom) {
  background: transparent;
  border: none;
}

:deep(.marker-enemy) {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--marker-color, #ef4444);
  border: 2px solid white;
  box-shadow: 0 0 10px var(--marker-color, #ef4444);
  animation: markerPulse 1.5s ease-in-out infinite;
}

:deep(.marker-self) {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 8px var(--marker-color, #8B5CF6));
}

:deep(.marker-self .triangle) {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid var(--marker-color, #8B5CF6);
}
</style>