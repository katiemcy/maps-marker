<script setup>
import firebase from './firebase'
import { ref, onMounted } from 'vue'
import { getDatabase, ref as fbRef, set, onValue } from "firebase/database"

import Header from './components/Header.vue'
import SearchBar from './components/SearchBar.vue'
import Map from './components/Map.vue'
import SearchedList from './components/SearchedList.vue'

const searchedPlaces = ref([])
const calledFirebase = ref(false)

const database = getDatabase(firebase)
const dbRef = fbRef(database)

// When a new search is emitted from SearchBar, push object to reactive array and update database
function pushToSearched(obj) {
  searchedPlaces.value.push({ ...obj })
  set(dbRef, [...searchedPlaces.value])
}

onMounted(() => {
  onValue(dbRef, (data) => {
    if(data.exists()) {
      searchedPlaces.value = data.val()
    } else {
      console.log('no data')
    }

    calledFirebase.value = true
  })
})

</script>

<template>
  <header>
    <Header appName="Maps Marker" />
  </header>

  <main>
    <SearchBar @latestSearch="pushToSearched" />
    <Map v-if="calledFirebase" :searchedPlaces="searchedPlaces" />
    <SearchedList :searchedPlaces="searchedPlaces" />
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
