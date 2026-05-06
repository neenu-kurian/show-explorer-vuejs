<template>
  <div class="px-5 py-10">
    <div v-if="loading">
      <AppLoader message="Searching..." />
    </div>
    <div v-else-if="searchError" role="alert">{{ searchError }}</div>
    <div class="text-center" v-else-if="hasSearched && shows.length === 0">
      No shows found matching "{{ searchQuery }}"
    </div>
    <ul v-else class="flex gap-3 flex-wrap list-none p-0 m-0">
      <li v-for="show in shows" :key="show.id">
        <ShowCard :show="show" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { SearchResultProps } from "@/types/search";
import AppLoader from "./AppLoader.vue";
import ShowCard from "./ShowCard.vue";

defineProps<SearchResultProps>();
</script>
