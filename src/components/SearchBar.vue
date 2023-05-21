<script setup>
import { onMounted, reactive, ref, toRaw } from 'vue'
import axios from 'axios'

const GOOGLE_MAPS_API_KEY = 'AIzaSyDoPIW9YStF6_qxlmrmkdgQh0V28Y4yC94'

const deniedAccess = ref(false)
const addressInput = ref('')
const latestSearch = reactive({
    place_id: '',
    formatted_address: '',
    lat: null,
    lng: null
})

const emit = defineEmits(['latest-search'])

// Autocomplete functions
let autocompleteObj;
// initialize autocomplete functions
function autocomplete() {
    autocompleteObj = new google.maps.places.Autocomplete(
        document.getElementById('location')
    )

    // shows results biased to Accuenergy
    const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(43.7482617, -79.2916301)
    )
    autocompleteObj.setBounds(bounds)
    autocompleteObj.setFields(["place_id", "geometry.location", "formatted_address", "name"])
    autocompleteObj.addListener('place_changed', handleChange)
}

// when user selects an autocompleted address, assign it to the reactive addressInput 
function handleChange() {
    const place = autocompleteObj.getPlace()
    addressInput.value = place.formatted_address
}
// END: Autocomplete functions


// Get user's location functions
function getGeolocation() {
    const isSupported = 'navigator' in window && 'geolocation' in navigator

    if (isSupported){
        navigator.geolocation.getCurrentPosition(
            position => {
                getAddress(position.coords.latitude, position.coords.longitude)
            },
            error => {
                deniedAccess.value = true
                console.log(error.message)
            }
        )
    } else {
        console.log ("Your browser does not support geolocation API")
    }
}

function getAddress(lat, lng) {
    axios({
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: {
            key: GOOGLE_MAPS_API_KEY,
            latlng: `${lat},${lng}`
        }
    })
    .then(res => {
        if(res.data.error_message) {
            console.log(res.data.error_message)
        } else {
            addressInput.value = res.data.results[0].formatted_address
        }
    })
    .catch(error => {
        console.log(error.message)
    })
}
// END: get user's location functions

function validateAddress(addr){
    axios({
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: {
            key: GOOGLE_MAPS_API_KEY,
            address: addr
        }
    })
    .then(res => {
        if(res.data.status === 'OK' ) {
            const result = res.data.results[0]
            latestSearch.place_id = result.place_id
            latestSearch.formatted_address = result.formatted_address
            latestSearch.lat = result.geometry.location.lat
            latestSearch.lng = result.geometry.location.lng

            emit('latestSearch', latestSearch)
        } else {
            console.log('invalid address')
        }
    })
    .catch(error => {
        console.log(error.message)
    })
}

function handleSubmit () {
    validateAddress(addressInput.value)
}

onMounted(() => {
    autocomplete()
})

</script>

<template>
    <section>
        <div class="wrapper">
            <p v-if="deniedAccess">Locator is unable to find your address, please enter location manually</p>
            <form action="">
                <label for="location" class="sr-only">City, neighbourhood or address</label>
                <input type="text" name="location" id="location" v-model="addressInput" placeholder="City, neighbourhood or address">
        
                <button type="button" @click="getGeolocation">
                    <font-awesome-icon icon="fa-solid fa-location-crosshairs" />
                </button>
                <button type="submit" @click.prevent="handleSubmit">
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                </button>
            </form>
        </div>
    </section>
</template>

<style scoped>
button {
    width: 20px;
    height: 20px;
}

input {
    width: 100%;
}
</style>