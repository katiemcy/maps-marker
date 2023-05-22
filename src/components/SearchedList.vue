<script setup>
import { ref, toRef, computed, onMounted, watch } from 'vue'

const props = defineProps({
    searchedPlaces: Array
})

// create a reactive copy of props.searchedPlaces and assign an index property that is the same as the index of the place shown on map
const searchedPlaces = computed(() => 
    props.searchedPlaces.map((place, index) => ({ ...place, mapIndex: index + 1}))
)

// Display 10 places logic
// currentIndex describes the index of the latest place on the display list
const currentIndex = ref(searchedPlaces.value.length)

// When user searches a new place, update currentIndex to the latest search
watch(
    () => searchedPlaces.value.length,
    (newLength) => {
        currentIndex.value = newLength
})

// compute an array of the 10 displaying places 
const displayedPlaces = computed(() => {
  const startIndex = Math.max(currentIndex.value - 10, 0);
  return searchedPlaces.value.slice(startIndex, currentIndex.value);
})

function showPrevTen() {
  currentIndex.value = Math.min(currentIndex.value + 10, props.searchedPlaces.length);
}

function showNextTen() {
  currentIndex.value = Math.max(0, currentIndex.value - 10);
}
// END: display 10 places logic


// Delete places 
const deletePlaces = ref([])
const emit = defineEmits(['delete-places'])

function handleDelete(e) {
    const checkboxes = document.querySelectorAll('input[name="select"]')

// create an array of deleting places that consists mapIndex (which is index + 1 of searchedPlaces array)
    deletePlaces.value = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value)

    emit('delete-places', deletePlaces)                               
}
// END: delete places

onMounted(() => {
    console.log(searchedPlaces.value)
    console.log(displayedPlaces.value)
})

</script>

<template>
    <section>
        <div class="wrapper">
            <form action="">
                <button type="submit" @click.prevent="handleDelete">Delete selected location</button>
                <ul>
                    <!-- a select box, the map number, the address -->
                    <li v-if="props.searchedPlaces.length > 0" 
                        v-for="(place, index) in displayedPlaces" 
                        :key="place.place_id"
                    >
                        <label :for="place.place_id + index" class="sr-only">Select {{place.formatted_address}}</label>
                        <input type="checkbox" name="select" :id="place.place_id + index" :value="place.mapIndex">
                        <p>{{ place.mapIndex }}.</p>
                        <p>{{ place.formatted_address }}</p>
                    </li>
                </ul>
            </form>

            <div>
                <button @click="showPrevTen" 
                        :disabled="currentIndex === searchedPlaces.length">&lt;</button>
                <button @click="showNextTen" :disabled="currentIndex - 10 <= 0">&gt;</button>
            </div>
        </div>
    </section>
</template>

<style scoped>
    ul {
        display: flex;
        flex-direction: column-reverse;
    }
    li {
        display: flex;
        list-style-type: none;
    }
</style>