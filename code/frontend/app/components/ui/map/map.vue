<script setup lang="ts">
import { ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = ref<L.Map | null>(null);

onMounted(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      map.value = L.map("map").setView([latitude, longitude], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map.value as L.Map);

      L.marker([latitude, longitude])
        .addTo(map.value as L.Map)
        .bindPopup("📍 Du bist hier")
        .openPopup();
    },
    () => {
      // 📍 Fallback: Basel
      const baselCoords: [number, number] = [47.5596, 7.5886];
      map.value = L.map("map").setView(baselCoords, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map.value as L.Map);

      L.marker(baselCoords)
        .addTo(map.value as L.Map)
        .bindPopup("📍 Basel (Fallback)")
        .openPopup();
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
}
</style>