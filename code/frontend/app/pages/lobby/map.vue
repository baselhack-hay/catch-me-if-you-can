<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = ref<L.Map | null>(null);

onMounted(async () => {
  await nextTick();

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

      // 📍 Custom Marker-Icons definieren
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

      const triangleRed = L.divIcon({
        html: `
          <div style="
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 24px solid #EF4444;
            border-radius: 2px;
          "></div>
        `,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const circleGreen = L.divIcon({
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: #22C55E;
            border-radius: 50%;
          "></div>
        `,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // ➕ Marker hinzufügen
      L.marker([latitude, longitude], { icon: trianglePurple })
        .addTo(map.value as L.Map)
        .bindPopup("🟣 Du bist hier");

      L.marker([latitude + 0.005, longitude + 0.01], { icon: triangleRed })
        .addTo(map.value as L.Map)
        .bindPopup("🔺 Gegner");

      L.marker([latitude - 0.007, longitude - 0.012], { icon: circleGreen })
        .addTo(map.value as L.Map)
        .bindPopup("🟢 Zielpunkt");
    },
    () => {
      // 📍 Fallback: Basel
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

      // gleiche Marker auch im Fallback
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

      const triangleRed = L.divIcon({
        html: `
          <div style="
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 24px solid #EF4444;
            border-radius: 12px 12px 0 0;
          "></div>
        `,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const circleGreen = L.divIcon({
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: #22C55E;
            border-radius: 50%;
          "></div>
        `,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Marker für Basel-Position
      L.marker(basel, { icon: trianglePurple })
        .addTo(map.value as L.Map)
        .bindPopup("📍 Basel (Fallback)");

      L.marker([47.565, 7.59], { icon: triangleRed })
        .addTo(map.value as L.Map)
        .bindPopup("🔺 Gegner (Fallback)");

      L.marker([47.554, 7.58], { icon: circleGreen })
        .addTo(map.value as L.Map)
        .bindPopup("🟢 Zielpunkt (Fallback)");
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