<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'

const GOOGLE_MAPS_API_KEY = 'AIzaSyBWEgUDHXalSWiv8zBxDAYO8jAQdYzxkTU'

const deniedAccess = ref(false)
const addressInput = ref('')
const coords = reactive({
    lat: null,
    lng: null
})
const latestSearch = reactive({
    place_id: '',
    formatted_address: '',
    geometry: {
        lat: null,
        lng: null
    }
})

const emit = defineEmits(['coords'])

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
    autocompleteObj.setFields(["place_id", "geometry.location", "formatted_address"])
    autocompleteObj.addListener('place_changed', handleChange)
}

// handle data when user selects a location: set relavant data to reactive components
function handleChange() {
    const place = autocompleteObj.getPlace()
    console.log(place)
    addressInput.value = place.formatted_address

    coords.lat = place.geometry.location.lat()
    coords.lng = place.geometry.location.lng()

    const { place_id, formatted_address, geometry } = place
    latestSearch.place_id = place_id
    latestSearch.formatted_address = formatted_address
    latestSearch.geometry.lat = geometry.location.lat()
    latestSearch.geometry.lng = geometry.location.lng()

}
// END: Autocomplete functions


// Get user's location functions
function getGeolocation() {
    const isSupported = 'navigator' in window && 'geolocation' in navigator

    if (isSupported){
        navigator.geolocation.getCurrentPosition(
            position => {
                getAddress(position.coords.latitude, position.coords.longitude)
                coords.lat = position.coords.latitude
                coords.lng = position.coords.longitude
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

onMounted(() => {
    autocomplete()
})

</script>

<template>
    <section>
        <div class="wrapper">
            <p v-if="deniedAccess">Locator is unable to find your address, please enter location manually</p>
            <form action="">
                <label for="location">City, neighbourhood or address</label>
                <input type="text" name="location" id="location" v-model="addressInput" placeholder="City, neighbourhood or address">
        
                <button type="button" @click="getGeolocation">
                    <font-awesome-icon icon="fa-solid fa-location-crosshairs" />
                </button>
                <button type="submit" @click.prevent="emit('coords', { ...coords })">
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