<template>
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          Licitador
        </div>
        <div class="card-body">
          <h5 class="card-title">Licitador</h5>
          <p class="card-text">
            <strong>DNI:</strong> {{ id }}<br>
            <strong>Nombre:</strong> 
          </p>
        </div>
      </div>
      <div class="card mt-4">
        <div class="card-header">
          Adjudicatario
        </div>
        <div class="card-body">
          <h5 class="card-title">Adjudicatario</h5>
          <p class="card-text">
            <strong>DNI:</strong> <br>
            <strong>Nombre:</strong> 
          </p>
        </div>
      </div>
    </div>
  </template>

<script>
export default {
    props: {
        id: String, // Passed from parent component or obtained from route params
        contracts: Object, 
    },
    computed: {
        filteredContractsLicitador() {
            return this.contracts.filter(contract => contract.licitadores.some(licitadores =>
                licitadores.dnilic.toLowerCase() === this.cif.toLowerCase()))
        },
        filteredContractsAdjudicatario() {
            return this.contracts.filter(contract => contract.adjudicatarios.some(adjudicatarios =>
                adjudicatarios.dniadj.toLowerCase() === this.cif.toLowerCase()))
        }
    }
};
</script>
  
<style>
/* Add your styles here */
</style>
  