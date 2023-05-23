<script setup>
import { onMounted, reactive, ref, toRaw } from 'vue'
import axios from 'axios'

const GOOGLE_MAPS_API_KEY = 'AIzaSyDoPIW9YStF6_qxlmrmkdgQh0V28Y4yC94'

const addressInput = ref('')
const latestSearch = reactive({
    place_id: '',
    formatted_address: '',
    lat: null,
    lng: null
})

const deniedAccess = ref(false)
const invalidAddr = ref(false)

const loadingGeo = ref(false)

const emit = defineEmits(['latest-search'])

// *************** Autocomplete functions
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
// *************** END: Autocomplete functions


// *************** Get user's location functions
function getGeolocation() {
    loadingGeo.value = true
    const isSupported = 'navigator' in window && 'geolocation' in navigator

    if (isSupported){
        navigator.geolocation.getCurrentPosition(
            position => {
                getAddress(position.coords.latitude, position.coords.longitude)
            },
            error => {
                loadingGeo.value = false
                deniedAccess.value = true
                console.log(error.message)
            }
        )
    } else {
        console.log ("Your browser does not support geolocation API")
        loadingGeo.value = false
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

        loadingGeo.value = false
    })
    .catch(error => {
        console.log(error.message)
        loadingGeo.value = false
    })
}
// *************** END: get user's location functions

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
            invalidAddr.value = false
            deniedAccess.value = false

            const result = res.data.results[0]
            latestSearch.place_id = result.place_id
            latestSearch.formatted_address = result.formatted_address
            latestSearch.lat = result.geometry.location.lat
            latestSearch.lng = result.geometry.location.lng

            emit('latest-search', latestSearch)
        } else {
            console.log('invalid address')
            invalidAddr.value = true
        }
    })
    .catch(error => {
        invalidAddr.value = true
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
    <section class="py-3">
        <div class="container-fluid">
            <p v-if="deniedAccess">Locator is unable to find your address, please enter location manually</p>
            <p v-if="invalidAddr">Invalid address</p>
            <form action="d-flex w-75 align-items-center">
                <label for="location" class="visually-hidden">City, neighbourhood or address</label>
                <input class="h-100 w-75 ms-2" type="text" name="location" id="location" v-model="addressInput" placeholder="City, neighbourhood or address">
        
                <button class="" type="button" @click="getGeolocation">
                    <font-awesome-icon v-if="!loadingGeo" icon="fa-solid fa-location-crosshairs" />
                    <div v-if="loadingGeo" class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
                <button class="" type="submit" @click.prevent="handleSubmit">
                    <font-awesome-icon v-if="!loadingAddr" icon="fa-solid fa-magnifying-glass" />
                </button>
            </form>
        </div>
    </section>
</template>

<style scoped>
p {
    color: rgb(224, 69, 69);
    margin-bottom: 5px;
    padding-left: 10px;
}
button {
    width: 40px;
    height: 100%;
    background-color: white;
    border: 1px solid #89d6dd;
    color: #89d6dd
}
input {
    padding: 0 10px;
}
</style>