<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    searchedPlaces: Array
})

// create a reactive copy of props.searchedPlaces and assign an index property that is the same as the index of the place shown on map
const searchedPlaces = computed(() => 
    props.searchedPlaces.map((place, index) => ({ ...place, mapIndex: index + 1}))
)

// *************** Display 10 places logic
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
// *************** END: display 10 places logic


// *************** Delete places 
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
// *************** END: delete places

</script>

<template>
    <section class="overflow-y-auto">
        <form class="position-relative" action="post">
            <div class="position-sticky fixed-top d-flex justify-content-between align-items-center p-2 bg-white">
                <div>
                    <button class="btn btn-outline-secondary btn-sm"
                            type="button"
                            @click="showPrevTen" 
                            :disabled="currentIndex === searchedPlaces.length">
                        &lt
                    </button>
                    <button class="btn btn-outline-secondary btn-sm"
                            type="button"
                            @click="showNextTen" 
                            :disabled="currentIndex - 10 <= 0">
                        &gt;
                    </button>
                </div>
                <button class="btn btn-outline-secondary btn-sm"
                        type="submit" 
                        @click.prevent="handleDelete">
                    Delete selected location
                </button>
            </div>

            <ul class="list-unstyled list-group d-flex flex-column-reverse">
                <!-- a select box, the map number, the address -->
                <li class="list-group-item list-group-item-light d-flex align-items-center justify-content-between"
                    v-if="props.searchedPlaces.length > 0" 
                    v-for="(place, index) in displayedPlaces" 
                    :key="place.place_id"
                >   
                    <div class="d-flex me-2 align-items-center form-check">
                        <input class="me-2 form-check-input"
                                type="checkbox" 
                                name="select" 
                                :id="place.place_id + index" 
                                :value="place.mapIndex" >
                        <label class="form-check-label"
                                :for="place.place_id + index">
                            {{place.formatted_address}}
                        </label>
                        
                    </div>

                    <div class="mapTag">{{ place.mapIndex }}</div>
                </li>
            </ul>
        </form>
    </section>
</template>

<style scoped>
section {
    height: 75vh;
}
input[type=checkbox] {
    min-width: 15px;
}
.mapTag {
    min-width: 35px;
    min-height: 35px;
    background-color: #f78f1e;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: white;
    border-radius: 15%
}
@media(max-width: 767px) {
    section {
        max-height: 300px;
    }
}
</style>