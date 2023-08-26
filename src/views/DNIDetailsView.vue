<template>
    <div>
        <h2>Contract Details {{ id }}</h2>
        <div>
            <h3>Contracts Licitador</h3>
            <ul>
                <li v-for="contract in filteredContractsLicitador" :key="contract.codigo">
                    Codigo ID: {{ contract.codigo }} - Descripcion: {{ contract.descripcion }}
                </li>
            </ul>
            <h3>Contracts Adjudicatario </h3>
            <ul>
                <li v-for="contract in filteredContractsAdjudicatario" :key="contract.codigo">
                    Codigo ID: {{ contract.codigo }} - Descripcion: {{ contract.descripcion }}
                </li>
            </ul>
        </div>
        <router-link to="/">Back to Contracts</router-link>
    </div>
</template>
  
<script>
export default {
    props: {
        id: String, // Passed from parent component or obtained from route params
        contracts: Array, // Passed from parent component or obtained from API
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
  