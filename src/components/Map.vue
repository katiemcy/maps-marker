<script setup>
import { ref, onMounted, watch, toRef, onUnmounted } from 'vue'
import { Loader } from "@googlemaps/js-api-loader"

const GOOGLE_MAPS_API_KEY = 'AIzaSyBWEgUDHXalSWiv8zBxDAYO8jAQdYzxkTU'
const mapDiv = ref(null)

const props = defineProps({
    coords: Object
})
const coordsRef = toRef(props, 'coords')

const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY})

let map;
function loadMap(lati, long) {
    loader.load().then(async() => {
        const { Map } = await google.maps.importLibrary('maps')
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        map = new Map(mapDiv.value, {
        center: { lat: lati, lng: long },
        zoom: 12,
        mapId: 'd664dcc4d6b0ba67'
        });

        if (map && coordsRef.value.lat !== null && coordsRef.value.lng !== null) {
            const marker = new AdvancedMarkerElement({
                map,
                position: { lat: lati, lng: long },
            });
        }
    })
}

// lat: 43.7482617, lng: -79.2916301

onMounted(() => {
    loadMap(43.7482617, -79.2916301)
})

// onUnmounted(() => {
//     map = null
// })

watch(coordsRef, () => {
    console.log('refresh map')
    console.log(coordsRef.value.lat, coordsRef.value.lng)
    loadMap(coordsRef.value.lat, coordsRef.value.lng)
})

</script>

<template>
    <section>
        <div class="wrapper">
            <div ref="mapDiv" style="width: 100%; height: 80vh"></div>
        </div>
    </section>
</template>

<style lang="">
    
</style>