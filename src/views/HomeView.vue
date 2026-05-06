<template>
  <header class="sticky top-0 bg-white py-6 mb-8 flex flex-col gap-4 shadow-md z-10">
    <h1 class="text-3xl font-bold text-gray-900 md:text-left md:ml-5 text-center">TV Maze</h1>
    <div class="md:flex items-center gap-16 w-full px-5">
      <SearchInput v-model="searchQuery" @enter="handleSearch" @update:modelValue="handleSearch" />
      <SortDropdown v-model="sortBy" :options="sortOptions" class="mt-5 md:mt-0" />
    </div>
  </header>

  <div class="pl-10 mt-14">
    <template v-if="searchLoading || hasSearched || searchQuery">
      <SearchResults
        :search-query="searchQuery"
        :shows="shows"
        :search-error="searchError"
        :loading="searchLoading"
        :hasSearched="hasSearched"
      />
    </template>
    <template v-else>
      <ShowCatalog />
    </template>
  </div>
</template>

<script setup lang="ts">
import SearchInput from "@/components/SearchInput.vue";
import SearchResults from "@/components/SearchResults.vue";
import ShowCatalog from "@/components/ShowCatalog.vue";
import SortDropdown from "@/components/SortDropdown.vue";
import { useCatalogStore } from "@/stores/catalog";
import { useDebouncedSearch } from "@/composables/useDebouncedSearch";
import { sortOptions } from "@/constants";
import { storeToRefs } from "pinia";

const { sortBy } = storeToRefs(useCatalogStore());
const { searchQuery, shows, searchError, searchLoading, hasSearched, handleSearch } =
  useDebouncedSearch();
</script>
