<script setup>
defineProps({
  appName: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="py-3 px-4 container-fluid">
    <h1 class="text-white fw-bolder">{{ appName }}</h1>
  </div>
</template>

<style scoped>

</style>
