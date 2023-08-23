<template>
  <p>Se han encontrado {{ totalContracts }} contratos</p>
  <div class="container">
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Codigo</th>
            <th scope="col">Description</th>
            <th scope="col">Licitador</th>
            <th scope="col">Adjudicatario</th>
            <th scope="col">Importe</th>
            <th scope="col">PDF</th>
            <!-- Add more headers as needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contract, index) in contracts" :key="index">
            <td>
              <p>{{ contract.codigo }}</p>
            </td>
            <td>
              <p>{{ contract.descripcion }}</p>
            </td>
            <td v-if="contract.licitadores.length">
              <p v-for="(licitadores, licIndex) in contract.licitadores" :key="licIndex">
                {{ licitadores.dnilic }}
              </p>
            </td>
            <td v-if="contract.adjudicatarios.length">
              <p v-for="(adjudicatario, adjIndex) in contract.adjudicatarios" :key="adjIndex">
                {{ adjudicatario.dniadj }}
              </p>
            </td>
            <td class="text-right table-success">{{ contract.implic | toCurrency }}</td>
            <td v-if="contract.iddocccc">
              <a :href="contract.iddocccc" target="_blank" :title="contract.descripcion">Ver PDF</a>
            </td>
            <!-- Add more cells as needed -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contracts: Array, // Passed from parent component
    totalContracts: Number
  },
  computed: {
    filteredContracts() {
      return this.contracts.filter((contract) => "");
    },
  },
  filters: {
    toCurrency(value) {
      if (typeof value !== "number") {
        return value;
      }
      var formatter = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      });
      return formatter.format(parseInt(value));
    },
  }
};
</script>

<style>/* Add your custom styles here if needed */</style>
