<template>
  <div class="chart-container mt-4">
    <canvas ref="barChart"></canvas>
  </div>
</template>
  
<script>
import { ref, onMounted, watch } from 'vue';
import { Chart } from 'chart.js/auto';

export default {
  props: {
    contracts: Array,
  },
  setup(props) {
    const barChart = ref(null);

    onMounted(() => {
      if (barChart.value) {
        const ctx = barChart.value.getContext('2d');

        const dniadj = {};
        props.contracts.forEach((contract) => {
          const dniadjValue = contract.adjudicatarios[0].dniadj;
          const impadj = parseFloat(contract.impadj);

          if (dniadjValue && (isNaN(dniadj[dniadjValue]) || impadj > dniadj[dniadjValue])) {
            dniadj[dniadjValue] = impadj;
          }
        });


        // Sort the dniadj values based on max impadj in descending order
        const sortedKeys = Object.keys(dniadj).sort(
          (a, b) => dniadj[b] - dniadj[a]
        );

        const labels = sortedKeys;
        const data = sortedKeys.map((key) => dniadj[key]);

        new Chart(ctx, {
          type: 'bar', // Changed to horizontalBar
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
            tooltips: {
              mode: 'index',
            },
            scales: {
              x: {
                beginAtZero: false,
                ticks: {
                  callback: function (value) {
                    if (typeof value === 'string' && !isNaN(value)) {
                      value = parseFloat(value);
                    }
                    return value.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  },
                },
              },
              y: {
                ticks: {
                  autoSkip: true,
                },
              },
            },
            elements: {
              bar: {
                borderWidth: 2,
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              title: {
                display: true,
                text: 'Horizontal Bar Chart', // Update the chart title
              },
            },
            indexAxis: 'y', // Use y-axis for index
            responsive: true,
          },
        });
      }
    });


    return {
      barChart,
    };
  },
};
</script>
  
<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  max-width: 100%;
}
</style>
