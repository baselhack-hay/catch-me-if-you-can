<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = ref<L.Map | null>(null);
const lobbyStore = useLobbyStore();
let geoInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  await nextTick();

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      // 🌍 Karte initialisieren
      map.value = L.map("map").setView([latitude, longitude], 13);

      // 🌙 Darkmode Tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://carto.com/attributions">CARTO</a> | © OpenStreetMap contributors',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map.value as L.Map);

      // 📍 Custom Marker
      const trianglePurple = L.divIcon({
        html: `
          <div style="
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 24px solid #8B5CF6;
            border-radius: 2px;
          "></div>
        `,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      L.marker([latitude, longitude], { icon: trianglePurple })
        .addTo(map.value as L.Map)
        .bindPopup("🟣 Du bist hier")
        .openPopup();

      // ⏱️ Alle 1 Sekunden automatisch senden
      geoInterval = setInterval(sendGeolocation, 1_000);
      sendGeolocation(); // einmal sofort triggern
    },
    () => {
      // 📍 Fallback Basel
      const basel: [number, number] = [47.5596, 7.5886];
      map.value = L.map("map").setView(basel, 13);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://carto.com/attributions">CARTO</a> | © OpenStreetMap contributors',
          subdomains: "abcd",
        }
      ).addTo(map.value as L.Map);
      L.marker(basel)
        .addTo(map.value as L.Map)
        .bindPopup("📍 Basel (Fallback)");
    }
  );
});

onBeforeUnmount(() => {
  if (geoInterval) clearInterval(geoInterval);
});

async function sendGeolocation(): Promise<void> {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      console.log("📍 Sende Geolocation:", latitude, longitude);
      lobbyStore.sendGeolocation({ latitude, longitude });
    },
    (err) => console.warn("Geolocation-Fehler:", err),
  );
}
</script>

<template>
  <div id="map" class="w-full h-[100vh]"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
  z-index: 9000;
}
</style>