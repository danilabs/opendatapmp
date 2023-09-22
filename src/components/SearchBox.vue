<template>
    <div class="search-box">
      <input
        type="text"
        class="form-control"
        v-model="searchQuery"
        @input="updateSearch"
        placeholder="Buscar por CIF o descripcion..."
      />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '', // Holds the search query entered by the user
      };
    },
    methods: {
      updateSearch() {
        this.$emit('search', this.searchQuery); // Emit the search event with the current search query
      },
    },
  };
  </script>
  
  <style>
  .search-box {
    margin-bottom: 20px;
  }
  </style>
  