<script setup>
import axios from 'axios';
import { toRef, reactive, onMounted, watch, ref, watchEffect, onUnmounted } from 'vue'

const props = defineProps({
    searchedPlaces: Array
})

const searchedPlaces = toRef(props, 'searchedPlaces')
const latestSearchedCoords = reactive({
    lat: null,
    lng: null
})

const localDate = ref('')
const localTime = ref('')
const timeZone = ref('')

const rawOffset = ref(null)
const dstOffset = ref(null)

let intervalId = null

const GOOGLE_MAPS_API_KEY = 'AIzaSyDoPIW9YStF6_qxlmrmkdgQh0V28Y4yC94'

function getTime(lat, lng) {
    axios({
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/timezone/json',
        params: {
            key: GOOGLE_MAPS_API_KEY,
            timestamp: Math.floor(Date.now() / 1000),
            // timestamp: 1331161200,
            location: `${lat},${lng}`
        }
    }).then(res => {
        console.log(res.data)
        if(res.data.status === "OK") {
            console.log(res.data)
            rawOffset.value = res.data.rawOffset
            dstOffset.value = res.data.dstOffset
            timeZone.value = res.data.timeZoneName
        } else {
            console.log("error")
        }
    })
    .catch(error => {
        console.log(error.message)
    })
}

function updateClock() {
    const currentTime = new Date();

    // Adjust current time based on time zone offset
    const timeZoneOffsetMinutes = rawOffset.value + dstOffset.value
    currentTime.setMinutes(currentTime.getMinutes() + timeZoneOffsetMinutes)

    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds();

    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    localTime.value = formattedTime
    console.log(timeZoneOffsetMinutes)
}

function calcTime() {
    const currentTime = new Date();
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);

    const timeZoneOffsetMinutes = rawOffset.value + dstOffset.value
    const newDate = new Date(utc + (1000*timeZoneOffsetMinutes));

    localTime.value = newDate.toLocaleTimeString() 
    localDate.value = newDate.toLocaleDateString()
}

onMounted(() => {
// if there is searchedPlaces, assign values to latestSearchedCoords and call axios to get local time
    if (props.searchedPlaces.length > 0) {
        latestSearchedCoords.lat = props.searchedPlaces[props.searchedPlaces.length - 1].lat
        latestSearchedCoords.lng = props.searchedPlaces[props.searchedPlaces.length - 1].lng

        getTime(latestSearchedCoords.lat, latestSearchedCoords.lng)
    } else {
        // if there's no search history, get local time with Accuenergy coords
        getTime(43.7482617, -79.2916301)
    }
})

watch(searchedPlaces, () => {
// when user searches a new place, assign coords with the latest search and get local time again
    latestSearchedCoords.lat = searchedPlaces.value[searchedPlaces.value.length - 1].lat
    latestSearchedCoords.lng = searchedPlaces.value[searchedPlaces.value.length - 1].lng

    getTime(latestSearchedCoords.lat, latestSearchedCoords.lng)
})

watch([rawOffset, dstOffset], () => {
  if (rawOffset.value !== null && dstOffset.value !== null) {
    clearInterval(intervalId)
    intervalId = setInterval(calcTime, 1000)
  }
})

onUnmounted(() => {
    clearInterval(intervalId)
})
</script>

<template>
    <div class="wrapper">
        <p>Local time of latest search: {{ localDate }}, {{ localTime }}({{ timeZone }})</p>
    </div>
</template>

<style lang="">
    
</style>