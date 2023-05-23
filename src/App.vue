<script setup>
import firebase from './firebase'
import { ref, onMounted, toRaw } from 'vue'
import { getDatabase, ref as fbRef, set, onValue, remove } from "firebase/database"

import Header from './components/Header.vue'
import SearchBar from './components/SearchBar.vue'
import Map from './components/Map.vue'
import SearchedList from './components/SearchedList.vue'
import LocalTime from './components/LocalTime.vue'

const searchedPlaces = ref([])

const database = getDatabase(firebase)
const dbRef = fbRef(database)

// When a new search is emitted from SearchBar, update database
function addSearch(obj) {
  const copiedArr = [ ...searchedPlaces.value ]
  copiedArr.push({ ...obj })
  set(dbRef, copiedArr)
}

// When user deletes locations, update database
function delSearch(delArray){
  // creates a newArray based on searchedPlaces, but filter out deleted places
  const newHistory = searchedPlaces.value.filter((place, index) => {
      return !delArray.value.includes(String(index + 1));
  })

  set(dbRef, newHistory)
}

onMounted(() => {
  searchedPlaces.value = []
  onValue(dbRef, (data) => {
    if(data.exists()) {
      searchedPlaces.value = data.val()
    } else {
      console.log('no data')
      searchedPlaces.value = []
    }
  })
})

</script>

<template>
  <header>
    <Header appName="Maps Marker" />
  </header>

  <main class="container-fluid mb-4">
    <SearchBar @latest-search="addSearch" />

    <div class="container-fluid d-md-flex">
      <div class="w-100">
        <Map :searched-places="searchedPlaces" />
        <LocalTime v-show="searchedPlaces.length > 0" :searched-places="searchedPlaces "/>
      </div>
      <SearchedList :searched-places="searchedPlaces" @delete-places="delSearch"/>
    </div>

  </main>
</template>

<style>
header {
  background-color: #89d6dd;
}
</style>
