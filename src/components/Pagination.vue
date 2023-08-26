<template>
    <div class="pagination justify-content-center my-4">
      <button @click="goToPage(1)" :disabled="currentPage === 1" class="btn btn-secondary me-2" aria-label="First Page">
        <i class="fas fa-angle-double-left text-white"></i>
      </button>
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-secondary me-2" aria-label="Previous Page">
        <i class="fas fa-angle-left text-white"></i>
      </button>
      <span class="mx-3">Pagina {{ currentPage }} de {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-secondary me-2" aria-label="Next Page">
        <i class="fas fa-angle-right text-white"></i>
      </button>
      <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="btn btn-secondary me-2" aria-label="Last Page">
        <i class="fas fa-angle-double-right text-white"></i>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: Number,
      totalPages: Number,
    },
    methods: {
      goToPage(page) {
        this.$emit('page-change', page);
      },
    },
  };
  </script>
  
  <style>
  /* Add your custom styles here if needed */
  </style>
  