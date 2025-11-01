<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = ref<L.Map | null>(null);

onMounted(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

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

      L.marker([latitude, longitude])
        .addTo(map.value as L.Map)
        .bindPopup("📍 Du bist hier")
        .openPopup();
    },
    () => {
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
      L.marker(basel).addTo(map.value as L.Map).bindPopup("📍 Basel (Fallback)");
    }
  );
});
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