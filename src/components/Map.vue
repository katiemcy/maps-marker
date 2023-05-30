<script setup>
import { ref, onMounted, watch, reactive, toRef } from 'vue'
import { Loader } from "@googlemaps/js-api-loader"

const props = defineProps({
    searchedPlaces: Array
})

const mapDiv = ref(null)
const latestSearchedCoords = reactive({
    lat: null,
    lng: null
})
const searchedPlaces = toRef(props, 'searchedPlaces')

const GOOGLE_MAPS_API_KEY = 'AIzaSyA8MWK9wVIUrGRdhibzPyeLiyVMfFfqCMA'

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

        if (map && props.searchedPlaces.length > 0) {
            props.searchedPlaces.forEach((place, index) => {
                const tag = document.createElement('div');
                tag.className = 'tag'
                tag.textContent = `${index + 1}`

                const marker = new AdvancedMarkerElement({
                    map,
                    position: { lat: place.lat, lng: place.lng },
                    title: toString(place.formatted_address),
                    content: tag
                });
            });
        }
    })
}

onMounted(() => {
// if there's no search history, center map with Accuenergy coords
    if (props.searchedPlaces.length === 0) {
        loadMap(43.7482617, -79.2916301)
    } 
})

watch(searchedPlaces, () => {
// when user searches/ delete a  place, assign coords with the latest search and reload map
    if (props.searchedPlaces.length > 0) {
    latestSearchedCoords.lat = searchedPlaces.value[searchedPlaces.value.length - 1].lat
    latestSearchedCoords.lng = searchedPlaces.value[searchedPlaces.value.length - 1].lng

    loadMap(latestSearchedCoords.lat, latestSearchedCoords.lng)
    } else {
        loadMap(43.7482617, -79.2916301)
    }
})

</script>

<template>
    <section class="w-100">
        <div ref="mapDiv" class="map w-100"></div>
    </section>
</template>

<style>
.map {
    height: 75vh;
}
.tag {
    width: 40px;
    height: 40px;
    background-color: #f78f1e;
    display: flex;
    justify-content: center;
    align-items: center;
    shape-outside: circle();
    clip-path: circle();
    font-size: 20px;
    color: white;
}

@media(max-width: 768px) {
    .map {
        height: 45vh;
    }
}
</style>