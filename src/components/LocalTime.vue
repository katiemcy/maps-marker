<script setup>
import axios from 'axios';
import { toRef, reactive, onMounted, watch, ref,  onUnmounted } from 'vue'

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
            location: `${lat},${lng}`
        }
    }).then(res => {
        if(res.data.status === "OK") {
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

function calcTime() {
    const currentTime = new Date();
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);

    const timeZoneOffsetMinutes = rawOffset.value + dstOffset.value
    const newDate = new Date(utc + (1000*timeZoneOffsetMinutes));

    localTime.value = newDate.toLocaleTimeString() 
    localDate.value = newDate.toLocaleDateString()
}

watch(searchedPlaces, () => {
// when user searches a new place, assign coords with the latest search and get local timezone info
    if (props.searchedPlaces.length > 0) {
        latestSearchedCoords.lat = searchedPlaces.value[searchedPlaces.value.length - 1].lat
        latestSearchedCoords.lng = searchedPlaces.value[searchedPlaces.value.length - 1].lng
    
        getTime(latestSearchedCoords.lat, latestSearchedCoords.lng)
    } else {
        clearInterval(intervalId)
    }
})

watch([rawOffset, dstOffset], () => {
// after getting timezone info from axios, run clock
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
    <div>
        <p class="fw-bold">Local time of latest search: {{ localDate }}, {{ localTime }}({{ timeZone }})</p>
    </div>
</template>

<style lang="">
    
</style>