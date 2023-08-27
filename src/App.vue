<template>
  <div id="app" class="container">
    <h1 class="mt-4">Open Data</h1>
    <BarChart :contracts="filteredContracts" />
    <SearchBox @search="performSearch" />
    <select v-model="selectedYear" @change="loadContracts">
      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
    </select>
    <ContractTable :contracts="displayedContracts" :numberContractsDisplayed="numberContractsDisplayed" />
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import ContractTable from '../src/components/ContractTable.vue';
import BarChart from '../src/components/BarChart.vue';
import Pagination from '../src/components/Pagination.vue';
import SearchBox from '../src/components/SearchBox.vue';

const itemsPerPage = 10;

export default {
  components: {
    ContractTable,
    Pagination,
    BarChart,
    SearchBox,
  },
  setup() {
    const contracts = ref('');
    const currentPage = ref(1);
    const searchQuery = ref('');
    const selectedYear = ref('2021'); // Default selected year

    const years = ['2021', '2022']; // Add more years as needed

    const loadContracts = async () => {
      try {
        const response = await fetch(`../src/data/contratos/${selectedYear}.json`);
        const jsonData = await response.json();
        contracts.value = jsonData;
      } catch (error) {
        console.error('Error loading contracts:', error);
      }
    };

    const totalPages = computed(() => {
      if (filteredContracts.value.length <= itemsPerPage) {
        return 1;
      }
      return Math.ceil(filteredContracts.value.length / itemsPerPage);
    });

    const filteredContracts = computed(() => {
      if (!searchQuery.value) {
        return contracts.value;
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
      searchQuery.value = query;
      currentPage.value = 1;
      numberContractsDisplayed.value = filteredContracts.value.length;
    };

    const changePage = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages.value) {
        currentPage.value = newPage;
      }
    };

    onMounted(() => {
      loadContracts();
    });

    return {
      numberContractsDisplayed,
      displayedContracts,
      currentPage,
      totalPages,
      filteredContracts,
      searchQuery,
      selectedYear,
      years,
      performSearch,
      changePage,
    };
  },
};
</script>

<style>
/* Add your styles here */
</style>
