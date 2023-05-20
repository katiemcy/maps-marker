<script setup>
import { reactive, ref } from 'vue'

import Header from './components/Header.vue'
import Searchbar from './components/SearchBar.vue'
import Map from './components/Map.vue'
import SearchedList from './components/SearchedList.vue'

const coords = reactive({
  lat: null,
  lng: null
})

const searchedPlaces = ref([])

function displayData (data) {
  console.log('displayData')
  coords.lat = data.lat
  coords.lng = data.lng
}

function pushToSearched(obj) {
  console.log(obj)
  searchedPlaces.value.push({...obj})
}
</script>

<template>
  <header>
    <Header appName="Maps Marker" />
  </header>

  <main>
      <Searchbar @coords="displayData" @latestSearch="pushToSearched" />
      <Map :coords="{...coords}" />
      <SearchedList />
  </main>
</template>

<style>
header {
  width: 100%;
}
.wrapper {
  width: 85%;
  max-width: 1350px;
  margin: 0 auto;
}
</style>
