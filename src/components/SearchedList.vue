<script setup>
import { ref } from 'vue'

const props = defineProps({
    searchedPlaces: Array
})

const emit = defineEmits(['remaining-places'])

const remainingPlaces = ref([])

function handleDelete(e) {
    const checkboxes = document.querySelectorAll('input[name="select"]')
  
    remainingPlaces.value = Array.from(checkboxes)
        .filter((checkbox) => !checkbox.checked)
        .map((checkbox) => checkbox.value)

    emit('remaining-places', remainingPlaces)                               
}

</script>

<template>
    <section>
        <div class="wrapper">
            <form action="">
                <button type="submit" @click.prevent="handleDelete">Delete selected location</button>
                <ul>
                    <!-- a select box, a number, the address -->
                    <li v-if="props.searchedPlaces.length > 0" 
                        v-for="(place, index) in props.searchedPlaces" 
                        :key="place.place_id"
                    >
                        <label :for="place.place_id + index" class="sr-only">Select {{place.formatted_address}}</label>
                        <input type="checkbox" name="select" :id="place.place_id + index" :value="index">
                        <p>{{ index + 1 }}.</p>
                        <p>{{ place.formatted_address }}</p>
                    </li>
                </ul>
            </form>
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