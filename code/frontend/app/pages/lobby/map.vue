<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed, openBlock } from "vue";
import { useRoute } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LobbyUser } from "types/lobby";

// 🧭 Lobby-ID dynamisch aus der URL
const route = useRoute();
const lobbyId = computed(() => route.params.id as string);

const map = ref<L.Map | null>(null);
const dialogOpen = ref<boolean>(false);
const confirmCatchDialogOpen = ref<boolean>(false);
const confirmCatchHunter = ref<LobbyUser | null>(null);
const selectedPlayer = ref<LobbyUser | null>(null);
const showGeoError = ref(false);
let selfMarker: L.Marker | null = null;
let geoInterval: ReturnType<typeof setInterval> | null = null;
let userInterval: ReturnType<typeof setInterval> | null = null;
let firstUpdate = true;
const userMarkers = new Map<string, L.Marker>();

const lobbyStore = useLobbyStore();
const currentPlayer = lobbyStore.users.filter(p => p.username == lobbyStore.nickname)[0];

const catchPlayer = () => {
  // TODO: Anfrage ans Backend, um spieler `selectedPlayer` zu fangen. Check, dass dieser Spieler ein Bunny ist wurde bereits gemacht.
  selectedPlayer.value = null;
  dialogOpen.value = false;
}

// TODO: Aufrufen, wenn aktueller Spieler gefangen wurde.
const onCaught = (hunter: LobbyUser) => {
  confirmCatchHunter.value = hunter;
  confirmCatchDialogOpen.value = true;
}

const confirmCatch = () => {
  // TODO: Call ans Backend, dass Spieler gefangen wurde
  // Aktueller spieler in Variable `currentPlayer`
  // Hunter in variable `confirmCatchHunter`

  confirmCatchDialogOpen.value = false;
}

const denyCatch = () => {
  // TODO: Call ans Backend, dass Spieler ablehnt, gefangen worden zu sein
  // Aktueller spieler in Variable `currentPlayer`
  // Hunter in variable `confirmCatchHunter`

  confirmCatchHunter.value = null;
  confirmCatchDialogOpen.value = false;
}


onMounted(async () => {
  await nextTick();

  const fallback: [number, number] = [47.5596, 7.5886]; // Basel (Fallback)
  map.value = L.map("map").setView(fallback, 13);

  // 🌙 Darkmode Layer
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> | © OpenStreetMap contributors',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map.value as L.Map);

  const myMarkerIcon = getIconForRole("self");

  async function updatePosition(): Promise<void> {
    if (!navigator.geolocation) {
      showFallbackMarker(fallback);
      showGeoError.value = true;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!map.value) return;
        showGeoError.value = false;

        const { latitude, longitude } = pos.coords;
        const position: [number, number] = [latitude, longitude];

        if (!selfMarker) {
          selfMarker = L.marker(position, { icon: myMarkerIcon })
            .addTo(map.value as L.Map)
            .bindPopup("🟣 Du bist hier");
        } else {
          selfMarker.setLatLng(position);
        }

        if (firstUpdate) {
          map.value.setView(position, 14);
          firstUpdate = false;
        }

      },
      (err) => {
        console.error("❌ Fehler beim Abrufen der Geolocation:", err);
        showFallbackMarker(fallback);
        showGeoError.value = true;
      },
      { enableHighAccuracy: true }
    );
  }

  await updatePosition();
  geoInterval = setInterval(updatePosition, 5000);

  await fetchUserLocations();
  userInterval = setInterval(fetchUserLocations, 1000);
});

//TODO: multiple players for different roles
async function fetchUserLocations() {
  if (!lobbyId.value) return;

  try {
    const res = await fetch(`/api/lobby/${lobbyId.value}/locations`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`❌ Fehlerhafte Server-Antwort: ${res.status}`);
      return;
    }

    const users = await res.json();

    console.log("👥 Empfange Spieler:", users);
    if (!Array.isArray(users) || users.length === 0) {
      console.warn("⚠️ Keine Spieler in dieser Lobby gefunden.");
      return;
    }

    users.forEach((user) => {
      if (!map.value || !user.geolocation) return;

      let latitude, longitude;

      if (Array.isArray(user.geolocation?.coordinates)) {
        [longitude, latitude] = user.geolocation.coordinates;
      } else {
        latitude = user.geolocation.latitude;
        longitude = user.geolocation.longitude;
      }

      if (!latitude || !longitude) return;

      const pos: [number, number] = [latitude, longitude];
      const icon = getIconForRole(user.role);

      // Optional: dich selbst ausblenden
      // if (user.id === currentUserId.value) return;

      if (!userMarkers.has(user.id)) {
        const marker = L.marker(pos, { icon })
          .addTo(map.value as L.Map)
          .addEventListener("click", () => {
            if (currentPlayer?.roleId != lobbyStore.uuids.hunter) return;
            if (user.role == lobbyStore.uuids.hunter) return;
            selectedPlayer.value = user;
            dialogOpen.value = true;
          });
        userMarkers.set(user.id, marker);
      } else {
        userMarkers.get(user.id)?.setLatLng(pos);
      }
    });
  } catch (err) {
    console.error("❌ Fehler beim Laden der User-Locations:", err);
  }
}

// 📍 Fallback-Marker
function showFallbackMarker(pos: [number, number]) {
  if (!map.value) return;
  if (!selfMarker) {
    selfMarker = L.marker(pos)
      .addTo(map.value as L.Map)
      .bindPopup("📍 Basel (Fallback)")
      .openPopup();
    map.value.setView(pos, 13);
  } else {
    selfMarker.setLatLng(pos);
  }
}

// 🎨 Marker je nach Rolle (Dreieck für dich, Kreise für Gegner)
function getIconForRole(role: string): L.DivIcon {
  const colors: Record<string, string> = {
    Hunter: "#ef4444", // rot
    Bunny: "#22c55e",  // grün
    self: "#8B5CF6",   // violett (eigener Spieler)
  };
  const color = colors[role] || "#8B5CF6";

  // 🟣 Dreieck nur für dich selbst
  if (role === "self") {
    return L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 20px solid ${color};
            filter: drop-shadow(0 0 2px white);
          "></div>
        </div>
      `,
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
  }

  // 🔴🟢 Kreis für Gegner (Hunter / Bunny)
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0,0,0,0.4);
      "></div>
    `,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// 🧹 Aufräumen
onBeforeUnmount(() => {
  if (geoInterval) clearInterval(geoInterval);
  if (userInterval) clearInterval(userInterval);

  userMarkers.forEach((m) => m.remove());
  userMarkers.clear();

  if (map.value) {
    map.value.remove();
    map.value = null;
  }

  selfMarker = null;
});
</script>

<template>
  <ui-dialog :open="dialogOpen">
    <ui-dialog-content>
      <ui-dialog-header>
        <ui-dialog-title>
          Catch <span class="text-(--color-electric-red)">{{selectedPlayer?.username}}</span>?
        </ui-dialog-title>
      </ui-dialog-header>

      <ui-button @click="catchPlayer" :variant="`positive`">Yes</ui-button>
      <ui-button @click="dialogOpen = false; selectedPlayer = null;" :variant="`negative`">No</ui-button>

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
    <!-- Fehleranzeige -->
    <transition name="fade">
      <div
        v-if="showGeoError"
        class="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg z-[10000]"
      >
        ❌ Standort konnte nicht abgerufen werden. Bitte erlaube den Zugriff auf deinen Standort.
      </div>
    </transition>

    <!-- Karte -->
    <div id="map" class="w-full h-full" />
  </div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  z-index: 10;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>