<script setup>
import firebase from './firebase'
import { ref, onMounted, toRaw } from 'vue'
import { getDatabase, ref as fbRef, set, onValue } from "firebase/database"

import Header from './components/Header.vue'
import SearchBar from './components/SearchBar.vue'
import Map from './components/Map.vue'
import SearchedList from './components/SearchedList.vue'
import LocalTime from './components/LocalTime.vue'

const searchedPlaces = ref([])
const callMap = ref(false)

const database = getDatabase(firebase)
const dbRef = fbRef(database)

// When a new search is emitted from SearchBar, update database
function addSearch(obj) {
  const copiedArr = [ ...searchedPlaces.value ]
  copiedArr.push({ ...obj })
  set(dbRef, copiedArr)
}

// When user deletes locations, update database
function delSearch(array){
  const newArray = searchedPlaces.value.filter((place, index) => {
      return array.value.includes(String(index));
  })
  set(dbRef, newArray)
}

onMounted(() => {
  onValue(dbRef, (data) => {
    if(data.exists()) {
      searchedPlaces.value = data.val()
      callMap.value = true
    } else {
      console.log('no data')
      callMap.value = true
    }
  })
})

</script>

<template>
  <header>
    <Header appName="Maps Marker" />
  </header>

  <main>
    <SearchBar @latest-search="addSearch" />
    <Map v-if="callMap" :searched-places="searchedPlaces" />
    <LocalTime :searched-places="searchedPlaces "/>
    <SearchedList :searched-places="searchedPlaces" @remaining-places="delSearch"/>
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
