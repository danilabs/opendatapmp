<template>
    <div id="app">
        <h1>Open Data</h1>
        <BarChart :contracts="displayedContracts"/>
        <ContractTable :contracts="displayedContracts"  :totalContracts="totalContracts" />
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>
</template>
  
<script>
import { ref, computed, onMounted } from 'vue';
import ContractTable from './components/ContractTable.vue';
import BarChart from './components/BarChart.vue';
import Pagination from './components/Pagination.vue';
import jsonData from './data/386.xml.json';

const itemsPerPage = 10;

export default {
    components: {
        ContractTable,
        Pagination,
        BarChart,
    },
    setup() {
        const contracts = ref(jsonData);
        const currentPage = ref(1);
        const totalContracts = contracts.value.length;

        const totalPages = computed(() => Math.ceil(contracts.value.length / itemsPerPage));

        const displayedContracts = computed(() => {
            const startIndex = (currentPage.value - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return contracts.value.slice(startIndex, endIndex);
        });

        const changePage = (newPage) => {
            if (newPage >= 1 && newPage <= totalPages.value) {
                currentPage.value = newPage;
            }
        };

        return {
            totalContracts,
            displayedContracts,
            currentPage,
            totalPages,
            changePage,
        };
    },
};
</script>
  
<style>
/* Add your styles here */
</style>
  