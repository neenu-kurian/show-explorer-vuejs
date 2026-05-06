<template>
  <div class="flex flex-col gap-2 mb-5">
    <RouterLink
      :to="{ name: 'show-detail', params: { id: show.id } }"
      class="rounded-xl focus-ring"
    >
      <article>
        <div
          class="w-64 h-96 bg-white rounded-xl hover:-translate-y-1 overflow-hidden relative shadow-xl flex flex-col transition duration-200 ease-in-out"
        >
          <AppImage
            :src="show.image?.medium"
            :alt="show.name || 'Show Poster'"
            class="w-full h-full object-cover"
          >
            <template #fallback>
              <div role="img" :aria-label="'No poster available for ' + show.name" class="h-full">
                <PhotoIcon />
              </div>
            </template>
          </AppImage>
          <ShowRating
            v-if="show.rating.average"
            :score="show.rating.average"
            class="top-3 right-3 bg-black/80 text-white px-2.5 py-1.5 rounded-badge text-sm"
          />
        </div>
      </article>
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
import AppImage from "./AppImage.vue";
import ShowRating from "./ShowRating.vue";

defineProps<{
  show: Show;
}>();
</script>
