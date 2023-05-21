<script setup>
import { ref, onMounted, watch, reactive, toRef } from 'vue'
import { Loader } from "@googlemaps/js-api-loader"
// import { onValue } from 

const GOOGLE_MAPS_API_KEY = 'AIzaSyDoPIW9YStF6_qxlmrmkdgQh0V28Y4yC94'

const mapDiv = ref(null)
const latestSearchedCoords = reactive({
    lat: null,
    lng: null
})

const props = defineProps({
    searchedPlaces: Array
})
const searchedPlaces = toRef(props, 'searchedPlaces')

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
    if (props.searchedPlaces.length > 0) {
        latestSearchedCoords.lat = props.searchedPlaces[props.searchedPlaces.length - 1].lat
        latestSearchedCoords.lng = props.searchedPlaces[props.searchedPlaces.length - 1].lng

        loadMap(latestSearchedCoords.lat, latestSearchedCoords.lng)
    } else {
        loadMap(43.7482617, -79.2916301)
    }
})

watch(searchedPlaces, () => {
    latestSearchedCoords.lat = searchedPlaces.value[searchedPlaces.value.length - 1].lat
    latestSearchedCoords.lng = searchedPlaces.value[searchedPlaces.value.length - 1].lng

    loadMap(latestSearchedCoords.lat, latestSearchedCoords.lng)
})

</script>

<template>
    <section>
        <div class="wrapper">
            <div ref="mapDiv" class="map"></div>
        </div>
    </section>
</template>

<style>
    .map {
        width: 100%; 
        height: 80vh;
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
</style>