<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = ref<L.Map | null>(null);
const showGeoError = ref(false); 
let marker: L.Marker | null = null;
let geoInterval: ReturnType<typeof setInterval> | null = null;
let firstUpdate = true;

onMounted(async () => {
  await nextTick();

  const fallback: [number, number] = [47.5596, 7.5886]; 

  map.value = L.map("map").setView(fallback, 13);

  // Darkmode Layer
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> | © OpenStreetMap contributors',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map.value as L.Map);

  const myMarker = L.divIcon({
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
          border-bottom: 20px solid #8B5CF6;
        "></div>
      </div>
    `,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

  async function updatePosition(): Promise<void> {
    if (!navigator.geolocation) {
      console.warn("⚠️ Geolocation API wird nicht unterstützt.");
      showFallbackMarker(fallback);
      showGeoError.value = true;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!map.value) return;
        showGeoError.value = false; 

        const { latitude, longitude } = pos.coords;
        const position: [number, number] = [latitude, longitude];

        if (!marker) {
          marker = L.marker(position, { icon: myMarker })
            .addTo(map.value as L.Map)
            .bindPopup("🟣 Du bist hier");
        } else {
          marker.setLatLng(position);
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
});

function showFallbackMarker(pos: [number, number]) {
  if (!map.value) return;
  if (!marker) {
    marker = L.marker(pos)
      .addTo(map.value as L.Map)
      .bindPopup("📍 Basel (Fallback)")
      .openPopup();
    map.value.setView(pos, 13);
  } else {
    marker.setLatLng(pos);
  }
}

// 🧹 Cleanup
onBeforeUnmount(() => {
  if (geoInterval) clearInterval(geoInterval);
  if (map.value) map.value.remove();
  map.value = null;
  marker = null;
});
</script>

<template>
  <div class="relative w-full h-[100vh]">
    <transition name="fade">
      <div
        v-if="showGeoError"
        class="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg z-[10000]"
      >
        ❌ Standort konnte nicht abgerufen werden. Bitte erlaube den Zugriff auf deinen Standort.
      </div>
    </transition>

    <div id="map" class="w-full h-full" />
  </div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  z-index: 9000;
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