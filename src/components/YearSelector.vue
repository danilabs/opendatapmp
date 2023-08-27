<template>
    <select class="form-select" v-model="selectedYear" @change="updateSelectedYear">
        <option v-for="yearObj in yearUrlArray" :key="yearObj.year" :value="yearObj.year">{{ yearObj.year }}</option>
    </select>
</template>

<script>
import { ref } from 'vue';

export default {
    props: {
        value: String, // The selected year passed as a prop
        yearUrlArray: Array, // The array containing year and URL objects
    },
    emits: ['update:selectedYear'], // Emit the selected year to the parent component

    setup(props, { emit }) {
        const selectedYear = ref(props.value || '2023'); // Initialize with the selected year from prop or "2023"

        const updateSelectedYear = (event) => {
            const newYear = event.target.value;
            selectedYear.value = newYear; // Update the selected year in the component
            emit('update:selectedYear', newYear); // Emit the selected year to the parent component
        };

        return {
            selectedYear,
            updateSelectedYear,
        };
    },
};
</script>
