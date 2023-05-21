<script setup>
const props = defineProps({
    searchedPlaces: Array
})

function handleDelete(e) {
    console.log(e)
}

</script>

<template>
    <section>
        <div class="wrapper">
            <form action="">
                <button type="button" @click="handleDelete">Delete selected location</button>
                <ul>
                    <!-- a select box, a number, the address -->
                    <li v-if="props.searchedPlaces.length > 0" 
                        v-for="(place, index) in props.searchedPlaces" 
                        :key="place.place_id"
                    >
                        <label for="select" class="sr-only">Select {{place.formatted_address}}</label>
                        <input type="checkbox" name="select" id="select">
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