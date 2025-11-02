<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LobbyUser } from "types/lobby";

const map = ref<L.Map | null>(null);
const dialogOpen = ref(false);
const confirmCatchDialogOpen = ref<boolean>(false);
const confirmCatchHunter = ref<LobbyUser | null>(null);
const selectedPlayer = ref<LobbyUser | null>(null);
const showGeoError = ref(false);
const userMarkers = new Map<string, L.Marker>();
const lobbyStore = useLobbyStore();
const currentPlayer = computed(() =>
  lobbyStore.users.find((p) => p.username === lobbyStore.nickname)
);

let selfMarker: L.Marker | null = null;
let geoInterval: ReturnType<typeof setInterval> | null = null;
let userUpdateInterval: ReturnType<typeof setInterval> | null = null;
let firstUpdate = true;

const catchPlayer = () => {
  selectedPlayer.value = null;
  dialogOpen.value = false;
}
onMounted(async () => {
  await nextTick();

  const fallback: [number, number] = [47.5596, 7.5886];
  map.value = L.map("map").setView(fallback, 13);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> | © OpenStreetMap contributors',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map.value as L.Map);

  await updatePosition();
  geoInterval = setInterval(updatePosition, 5000);

  updateUserMarkers(lobbyStore.users);
  userUpdateInterval = setInterval(() => {
    updateUserMarkers(lobbyStore.users);
  }, 10000);
});

// 🛰️ Eigene Position
async function updatePosition(): Promise<void> {
  if (!navigator.geolocation) {
    showGeoError.value = true;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      if (!map.value) return;
      const position: [number, number] = [latitude, longitude];
      showGeoError.value = false;

      const myIcon = getIconForRole("self");
      if (!selfMarker) {
        selfMarker = L.marker(position, { icon: myIcon }).addTo(map.value as L.Map);
      } else {
        selfMarker.setLatLng(position);
      }

      if (firstUpdate) {
        map.value.setView(position, 15, { animate: true });
        firstUpdate = false;
      }
    },
    () => {
      showGeoError.value = true;
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
  );
}

function randomOffsetMeters(lat: number, lon: number, radiusMeters = 300): [number, number] {
  const r = radiusMeters / 111300;
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const newLat = lat + w * Math.cos(t);
  const newLon = lon + w * Math.sin(t) / Math.cos((lat * Math.PI) / 180);
  return [newLat, newLon];
}

function updateUserMarkers(users: LobbyUser[]) {
  if (!map.value) return;
  const seen = new Set<string>();

  users.forEach(user => {
    if (!user.geo?.latitude || !user.geo?.longitude) return;
    if (user.username === lobbyStore.nickname) return;

    seen.add(user.id);
    const pos: [number, number] = randomOffsetMeters(user.geo.latitude, user.geo.longitude, 1000);
    const icon = getIconForRole(user.roleId);

    let marker = userMarkers.get(user.id);
    if (!marker) {
      marker = L.marker(pos, { icon }).addTo(map.value as L.Map);
      marker.on("click", () => {
        if (currentPlayer.value?.roleId !== lobbyStore.uuids.hunter) return;
        if (user.roleId === lobbyStore.uuids.hunter) return;
        selectedPlayer.value = user;
        dialogOpen.value = true;
      });
      userMarkers.set(user.id, marker);
    } else {
      marker.setLatLng(pos);
      marker.setIcon(icon);
    }
  });

  [...userMarkers.entries()].forEach(([id, marker]) => {
    if (!seen.has(id)) {
      marker.remove();
      userMarkers.delete(id);
    }
  });
}

function getIconForRole(role: string): L.DivIcon {
  const colors: Record<string, string> = {
    "08182765-80e1-45fd-ac2f-201986b30de1": "#ef4444", 
    "37ee07b1-1cf8-4efb-aa42-ca03d2681cf8": "#22c55e", 
    self: "#8B5CF6", 
  };
  const color = colors[role] || "#8B5CF6";

  if (role === "self") {
    return L.divIcon({
      html: `
        <div class="marker-self" style="--marker-color:${color};">
          <div class="triangle"></div>
        </div>`,
      className: "leaflet-marker-custom",
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
  }

  return L.divIcon({
    html: `<div class="marker-enemy" style="--marker-color:${color};"></div>`,
    className: "leaflet-marker-custom",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

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
          Catch <span class="text-(--color-avocado)">
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
        ❌ Location could not be retrieved. Please allow access to your location.
      </div>
    </transition>
    <div id="map" class="w-full h-full" />
  </div>
</template>

<style>
/* Marker global sichtbar machen */
.leaflet-marker-custom {
  background: transparent;
  border: none;
}

/* 🟣 eigener Marker */
.marker-self {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.marker-self .triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid var(--marker-color, #8B5CF6);
}

/* 🔴🟢 Gegner – pulsierend */
.marker-enemy {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--marker-color, #ef4444);
  border: 2px solid var(--color-cookies-and-cream);
  box-shadow: 0 0 10px var(--marker-color, #ef4444);
  animation: markerPulse 1.6s ease-in-out infinite;
}
@keyframes markerPulse {
  0% { transform: scale(1); opacity: 1; box-shadow: 0 0 8px var(--marker-color); }
  50% { transform: scale(1.6); opacity: 0.6; box-shadow: 0 0 20px var(--marker-color); }
  100% { transform: scale(1); opacity: 1; box-shadow: 0 0 8px var(--marker-color); }
}

/* Fade für Fehlermeldung */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>