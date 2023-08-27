<template>
  <div id="app" class="container">
    <h1 class="mt-4">Open Data</h1>
    <div class="row mb-3">
      <div class="col-md-6">
        <SearchBox @search="performSearch" />
      </div>
      <div class="col-md-6">
        <YearSelector v-model:selectedYear="selectedYear" :yearUrlArray="yearUrlArray" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <!--<BarChart :contracts="filteredContracts" />-->
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="btn-group me-2" role="group" aria-label="Sorting buttons">
          <button class="btn btn-secondary" @click="sortByImpadj">
            <i class="fas fa-sort-amount-up"></i> Import Adjudicado
          </button>
          <button class="btn btn-secondary" @click="sortByImplic">
            <i class="fas fa-sort-amount-up"></i> Importe Licitado
          </button>
        </div>
        <p class="mb-3">Se han encontrado <strong>{{ numberContractsDisplayed }}</strong> contratos || Total Importe
          Licitado: <strong>{{
            calculateTotalImplic() }}</strong> || Total Importe Adjudicado: <strong>{{ calculateTotalImpadj() }}</strong>
        </p>
        <ContractTable :contracts="displayedContracts" :numberContractsDisplayed="numberContractsDisplayed" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import ContractTable from '../src/components/ContractTable.vue';
import BarChart from '../src/components/BarChart.vue';
import Pagination from '../src/components/Pagination.vue';
import SearchBox from '../src/components/SearchBox.vue';
import YearSelector from '../src/components/YearSelector.vue'; // Import the YearSelector component


const itemsPerPage = 10;

export default {
  components: {
    ContractTable,
    Pagination,
    BarChart,
    SearchBox,
    YearSelector,
  },
  setup() {
    const contracts = ref([]);
    const currentPage = ref(1);
    const searchQuery = ref('');

    const selectedYear = ref('2023'); // Default selected year
    const yearUrlArray = [
      { year: '2023', url: 'http://167.86.102.106/opendata/contratos/2023.json' },
      { year: '2022', url: 'http://167.86.102.106/opendata/contratos/2022.json' },
      { year: '2021', url: 'http://167.86.102.106/opendata/contratos/2021.json' },
      // Add more years and URLs as needed
    ];

    const loadContracts = async () => {
      try {
        // Find the selected year object in the yearUrlArray
        const selectedYearObj = yearUrlArray.find(obj => obj.year === selectedYear.value);
        if (!selectedYearObj) {
          selectedYearObj.value = '2023';
        }

        // Fetch data using the selected year's URL
        const response = await fetch(selectedYearObj.url);
        const jsonData = await response.json();
        contracts.value = jsonData;

        // Update the filtered contracts based on new data
        searchQuery.value = ''; // Reset search query
        currentPage.value = 1; // Reset current page
        numberContractsDisplayed.value = jsonData.length; // Update number of displayed contracts
      } catch (error) {
        console.error('Error loading contracts:', error);
      }
    };

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
      ).sort((a, b) => {
        if (typeof b.impadj === 'string' && !isNaN(b.impadj)) {
          b.impadj = parseFloat(b.impadj);
        }
        if (typeof a.impadj === 'string' && !isNaN(a.impadj)) {
          a.impadj = parseFloat(a.impadj);
        }
        // Sort by impadj in descending order
        return b.impadj - a.impadj;
      });
    });

    const sortByImpadj = () => {
      filteredContracts.value.sort((a, b) => {
        const impadjA = a.impadj;
        const impadjB = typeof b.impadj === 'string' ? parseFloat(b.impadj) : b.impadj;
        return impadjB - impadjA;
      });
    };

    const sortByImplic = () => {
      filteredContracts.value.sort((a, b) => {
        const implicA = a.implic;
        const implicB = typeof b.implic === 'string' ? parseFloat(b.implic) : b.implic;
        return implicB - implicA;
      });
    };

    const calculateTotalImplic = () => {
      let total = 0;
      filteredContracts.value.forEach(contract => {
        total += parseFloat(contract.implic) || 0; // Convert to number, handle NaN cases
      });
      return toCurrency(total);
    };

    const calculateTotalImpadj = () => {
      let total = 0;
      filteredContracts.value.forEach(contract => {
        total += parseFloat(contract.impadj) || 0; // Convert to number, handle NaN cases
      });
      return toCurrency(total);
    };

    const toCurrency = (value) => {
      if (typeof value === 'string' && !isNaN(value)) {
        value = parseFloat(value);
      }
      return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Watch for changes to selectedYear and update contracts data
    watch(selectedYear, () => {
      loadContracts();
    });

    const totalPages = computed(() => {
      if (filteredContracts.value.length <= itemsPerPage) {
        return 1; // Show only 1 page if contracts are not more than itemsPerPage
      }
      return Math.ceil(filteredContracts.value.length / itemsPerPage);
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
      yearUrlArray,
      performSearch,
      changePage,
      sortByImpadj,
      sortByImplic,
      calculateTotalImplic,
      calculateTotalImpadj
    };
  },
};
</script>

<style>
/* Add your styles here */
</style>
