<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="/">Open Data PMP</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link">About</router-link>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>


<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter from Vue Router


export default {
  components: {
  },
  setup() {
    const router = useRouter(); // Use useRouter to access the router
    onMounted(() => {
      console.log('Current Route:', router.currentRoute.value.path);
    });

    return;
  },
};
</script>

<style>
/* Add your styles here */
</style>
