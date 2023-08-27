<template>
  <div>
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="bg-primary text-white">
          <tr>
            <th>Codigo</th>
            <th>Description</th>
            <th>Licitador</th>
            <th>Adjudicatario</th>
            <th class="text-right" >Importe Licitado</th>
            <th class="text-right">Importe Adjudicado</th>
            <th>Actas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contract, index) in filteredContracts" :key="index">
            <td>
              <a :href="contract.iddocccc" target="_blank" :title="contract.descripcion">{{ contract.codigo }}</a>
            </td>
            <td>{{ contract.descripcion }}</td>
            <td v-if="contract.licitadores.length > 0">
              <p v-for="(licitador, licIndex) in contract.licitadores" :key="licIndex">
                <p v-if="licitador.dnilic.length > 0"><router-link :to="'/dni/' + licitador.dnilic">{{ licitador.nombrelic }} ({{ licitador.dnilic }})</router-link></p>
                <p v-else>-</p>
              </p>
            </td>
            <td v-else>-</td>
            <td v-if="contract.adjudicatarios.length > 0">
              <p v-for="(adjudicatario, adjIndex) in contract.adjudicatarios" :key="adjIndex">
                <p v-if="adjudicatario.dniadj.length > 0"><router-link :to="'/dni/' + adjudicatario.dniadj">{{ adjudicatario.nombreadj }} ({{ adjudicatario.dniadj }})</router-link></p>
                <p v-else>-</p>
              </p>
            </td>
            <td v-else>-</td>
            <td v-if="contract.implic > 0">
              <p class="text-right table-success">{{ toCurrency(contract.implic) }}</p>
            </td>
            <td v-else>-</td>
            <td v-if="contract.impadj > 0">
              <p class="text-right table-success">{{ toCurrency(contract.impadj) }}</p>
            </td>
            <td v-else>-</td>
            <td v-if="contract.actas.length">
              <p v-for="(acta, actaIndex) in contract.actas" :key="actaIndex">
                <ul><a :href="acta.iddocacta" target="_blank" :title="acta.descripcion">{{ acta.descripcion }}</a></ul>
              </p>
            </td>
            <td v-else>-</td>
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
    numberContractsDisplayed: Number
  },
  data() {
    return {
      sortBy: null,
      sortDescending: true
    };
  },
  computed: {
    filteredContracts() {
      return this.contracts.filter((contract) => true); // Update your filtering logic
    }
  },
  methods: {
    toCurrency(value) {
      if (typeof value === 'string' && !isNaN(value)) {
        value = parseFloat(value);
      }
      return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
};
</script>
<style>
/* Add your custom styles here if needed */
</style>
