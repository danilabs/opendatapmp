<template>
    <div id="app" class="container">
        <h1 class="mt-4">Open Data</h1>
        <BarChart :contracts="filteredContracts" />
        <SearchBox @search="performSearch" />
        <ContractTable :contracts="displayedContracts" :numberContractsDisplayed="numberContractsDisplayed" />
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>
</template>
  
<script>
import { ref, computed } from 'vue';
import ContractTable from '../components/ContractTable.vue';
import BarChart from '../components/BarChart.vue';
import Pagination from '../components/Pagination.vue';
import SearchBox from '../components/SearchBox.vue';
import jsonData from '../data/386.xml.json';

const itemsPerPage = 10;

export default {
    components: {
        ContractTable,
        Pagination,
        BarChart,
        SearchBox, // Import the SearchBox component
    },
    setup() {
        const contracts = ref(jsonData);
        const currentPage = ref(1);
        const searchQuery = ref(''); // Add a new ref for search query

        const totalPages = computed(() => {
            if (filteredContracts.value.length <= itemsPerPage) {
                return 1; // Show only 1 page if contracts are not more than itemsPerPage
            }
            return Math.ceil(filteredContracts.value.length / itemsPerPage);
        });

        const filteredContracts = computed(() => {
            if (!searchQuery.value) {
                return contracts.value; // Return all contracts if search query is empty
            }
            return contracts.value.filter((contract) =>
                contract.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                contract.licitadores.some(licitadores =>
                    licitadores.dnilic.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    licitadores.nombrelic.toLowerCase().includes(searchQuery.value.toLowerCase())
                ) ||
                contract.adjudicatarios.some(adjudicatario =>
                    adjudicatario.dniadj.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    adjudicatario.nombreadj.toLowerCase().includes(searchQuery.value.toLowerCase())
                )
            );
        });

        const displayedContracts = computed(() => {
            const startIndex = (currentPage.value - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filteredContracts.value.slice(startIndex, endIndex);
        });

        const numberContractsDisplayed = ref(filteredContracts.value.length);

        const performSearch = (query) => {
            searchQuery.value = query; // Update the search query
            currentPage.value = 1; // Reset current page when performing a search
            numberContractsDisplayed.value = filteredContracts.value.length; // Update the value using .value
        };

        const changePage = (newPage) => {
            if (newPage >= 1 && newPage <= totalPages.value) {
                currentPage.value = newPage;
            }
        };

        return {
            numberContractsDisplayed,
            displayedContracts,
            currentPage,
            totalPages,
            filteredContracts,
            searchQuery,
            performSearch,
            changePage,
        };
    },
};
</script>
  
<style>
/* Add your styles here */
</style>
  