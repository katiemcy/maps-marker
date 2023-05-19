<script setup>
import { reactive } from 'vue'

import Header from './components/Header.vue'
import Searchbar from './components/SearchBar.vue'
import Map from './components/Map.vue'

const coords = reactive({})

function displayData (data) {
  coords.value = { ...data }
}
</script>

<template>
  <header>
    <Header appName="Maps Marker" />
  </header>

  <main>
      <Searchbar @coords="displayData"  />
      <Map :coords="coords" />

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
