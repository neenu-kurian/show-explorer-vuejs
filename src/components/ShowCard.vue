<template>
  <div class="flex flex-col gap-2 mb-5">
    <RouterLink
      :to="{ name: 'show-detail', params: { id: show.id } }"
      :aria-label="`View details for ${show.name}`"
      class="rounded-xl focus-ring"
    >
        <div
          class="w-64 h-96 bg-white rounded-xl hover:-translate-y-1 overflow-hidden relative shadow-xl flex flex-col transition duration-200 ease-in-out"
        >
          <ShowPoster
            :src="show.image?.medium"
            :alt="show.name || 'Show Poster'"
            class="w-full h-full object-cover"
          >
            <template #fallback>
              <PhotoIcon class="w-1/3 h-1/3" role="img" aria-label="No Image Available" />
            </template>
          </ShowPoster>
          <ShowRating
            v-if="show.rating.average"
            :score="show.rating.average"
            class="top-3 right-3 bg-black/80 text-white px-2.5 py-1.5 rounded-badge text-sm"
          />
        </div>
    </RouterLink>
    <h3 class="text-base font-medium mt-2 mb-0 text-gray-800 text-left px-2 overflow-hidden">
      {{ show.name }}
    </h3>
  </div>
</template>

<script setup lang="ts">
import type { Show } from "@/types/show";
import { PhotoIcon } from "@heroicons/vue/24/outline";
import { RouterLink } from "vue-router";
import ShowPoster from "./ShowPoster.vue";
import ShowRating from "./ShowRating.vue";

defineProps<{
  show: Show;
}>();
</script>
