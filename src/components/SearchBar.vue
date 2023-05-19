<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'

const GOOGLE_MAPS_API_KEY = 'AIzaSyBWEgUDHXalSWiv8zBxDAYO8jAQdYzxkTU'

const deniedAccess = ref(false)
const address = ref('')
const coords = reactive({
    lat: null,
    lng: null
})

const emit = defineEmits(['coords'])

// let autocomplete
// onMounted(() => {
//     axios({
//         method: 'get',
//         url: "https://maps.googleapis.com/maps/api/js",
//         params: {
//             key: GOOGLE_MAPS_API_KEY,
//             libraries: 'places',
//             callback: 'initMap'
//         }
//     })
//     .then(res => {
//         autocomplete = new google.maps.places.autocomplete(
//             search.value
//         )
//     })
//     .catch(error => console.log(error))
// })

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
            address.value = res.data.results[0].formatted_address
        }
    })
    .catch(error => {
        console.log(error.message)
    })
}

</script>

<template>
    <section>
        <div class="wrapper">
            <p v-if="deniedAccess">Locator is unable to find your address, please enter location manually</p>
            <form action="">
                <label for="location">City, neighbourhood or address</label>
                <input type="text" name="location" id="location" v-model="address" placeholder="City, neighbourhood or address">
        
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