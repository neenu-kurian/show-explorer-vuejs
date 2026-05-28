<template>
  <AppLoader v-if="loading" message="Loading shows..." />
  <p v-else-if="error" role="alert">{{ error }}</p>
  <template v-else-if="catalogData">
    <p v-if="isEmpty">No shows found</p>
    <template v-else>
      <section v-for="(showsByGenre, genre) in catalogData" :key="genre" :aria-labelledby="`genre-${genre}`">
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-heading text-gray-900" :id="`genre-${genre}`">{{ genre }}</h2>
          <ArrowRightIcon class="w-5 h-5 text-gray-600" />
        </div>
        <ul tabindex="0" class="flex gap-5 overflow-x-auto scroll-smooth pb-4 w-full list-none p-0 m-0">
          <li v-for="show in showsByGenre" :key="show.id">
            <ShowCard :show="show" />
          </li>
        </ul>
      </section>
    </template>
  </template>
</template>

<script setup lang="ts">
import AppLoader from "@/components/AppLoader.vue";
import ShowCard from "@/components/ShowCard.vue";
import { useCatalog } from "@/composables/useCatalog";
import { ArrowRightIcon } from "@heroicons/vue/24/outline";

const { error, loading, catalogData, isEmpty } = useCatalog();
</script>
