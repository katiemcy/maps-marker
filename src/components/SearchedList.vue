<script setup>
import { ref, toRef, computed, onMounted } from 'vue'

const props = defineProps({
    searchedPlaces: Array
})

const emit = defineEmits(['remaining-places'])

const remainingPlaces = ref([])
const searchedPlaces = toRef(props, 'searchedPlaces')
const currentIndex = computed(() => searchedPlaces.value.length);

const displayedPlaces = computed(() => {
  const startIndex = Math.max(currentIndex.value - 10, 0);
  return searchedPlaces.value.slice(startIndex, currentIndex.value);
});

function showPrevTen() {
  currentIndex.value = Math.min(currentIndex.value + 10, currentIndex.value);
}

function showNextTen() {
  currentIndex.value = Math.max(currentIndex.value - 10, 0);
}

function handleDelete(e) {
    const checkboxes = document.querySelectorAll('input[name="select"]')
  
    remainingPlaces.value = Array.from(checkboxes)
        .filter((checkbox) => !checkbox.checked)
        .map((checkbox) => checkbox.value)

    emit('remaining-places', remainingPlaces)                               
}

onMounted(() => {
    console.log(displayedPlaces.value)
})

</script>

<template>
    <section>
        <div class="wrapper">
            <form action="">
                <button type="submit" @click.prevent="handleDelete">Delete selected location</button>
                <ul>
                    <!-- a select box, a number, the address -->
                    <li v-if="props.searchedPlaces.length > 0" 
                        v-for="(place, index) in displayedPlaces" 
                        :key="place.place_id"
                    >
                        <label :for="place.place_id + index" class="sr-only">Select {{place.formatted_address}}</label>
                        <input type="checkbox" name="select" :id="place.place_id + index" :value="index">
                        <p>{{ index + 1 }}.</p>
                        <p>{{ place.formatted_address }}</p>
                    </li>
                </ul>
            </form>

            <div>
                <button @click="">&lt;</button>
                <button @click="">&gt;</button>
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