<script setup>
defineProps({
  appName: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="wrapper">
    <h1>{{ appName }}</h1>
  </div>
</template>

<style scoped>

</style>
