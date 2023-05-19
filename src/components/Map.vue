<script setup>
import { ref, onMounted, watch } from 'vue'
import { Loader } from "@googlemaps/js-api-loader"

const GOOGLE_MAPS_API_KEY = 'AIzaSyBWEgUDHXalSWiv8zBxDAYO8jAQdYzxkTU'
const mapDiv = ref(null)

const props = defineProps({
    coords: Object
})

watch(props.coords, () => {
    console.log(props.coords)
})

const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY})

let map;
onMounted(() => {
  loader.load().then(async() => {
    const { Map } = await google.maps.importLibrary('maps')

    map = new Map(mapDiv.value, {
      center: { lat: 43.7482617, lng: -79.2916301 },
      zoom: 12,
    })
  })
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