import { createApp } from 'vue'
import '../css/style.css'
import App from '../App.vue';
import router from './router.js';

// Define the filter globally
const app = createApp(App);
app.config.globalProperties.$filters = {
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
  },
};
app.use.apply(router)
app.mount('#app');
