<template>
  <div class="chart-container mt-4">
    <canvas ref="barChart"></canvas>
  </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto'; // Import only the necessary parts

export default {
  props: {
    contracts: Array,
  },
  setup(props) {
    const barChart = ref(null);

    onMounted(() => {
      // Create a bar chart using Chart.js
      if (barChart.value) {
        const ctx = barChart.value.getContext('2d');

        // Extract unique dnilic values and corresponding max implic values
        const dnilicValues = {};
        props.contracts.forEach((contract) => {
          const dnilic = contract.licitadores[0].dnilic;
          const implic = parseFloat(contract.implic);
          if (!dnilicValues[dnilic] || implic > dnilicValues[dnilic]) {
            dnilicValues[dnilic] = implic;
          }
        });

        const labels = Object.keys(dnilicValues);
        const data = Object.values(dnilicValues);

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Importe Licitacion',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                ticks: {
                  autoSkip: false,
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return value.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          },
        });
      }
    });

    return {
      barChart
    };
  },
};
</script>
  
<style>
/* Add your custom styles here if needed */
</style>
