<template>
  <div class="p-5 md:flex gap-6">
    <div
      class="relative md:max-w-80 aspect-poster rounded-xl overflow-hidden shadow-lg mx-auto shrink-0"
    >
      <ShowPoster :src="show.image?.original" :alt="show.name || 'Show Poster'" loading="eager">
        <template #fallback>
          <PhotoIcon class="w-1/3 h-1/3" role="img" aria-label="No Image Available" />
        </template>
      </ShowPoster>
      <ShowRating
        v-if="show.rating.average"
        :score="show.rating.average"
        class="top-3 left-2 bg-black/80 px-2.5 py-1.5 rounded-badge"
      />
    </div>
    <div class="flex-1">
      <h1 v-if="show.name" class="text-display text-black mb-3">{{ show.name }}</h1>
      <div class="flex gap-2 mb-4 flex-wrap">
        <InfoChip v-if="show.premiered" label="Year" :value="premieredYear" />
        <InfoChip v-if="show.runtime" label="Duration" :value="`${show.runtime}m`" />
        <InfoChip label="Status" :value="show.status" />
      </div>
      <div v-if="show.genres.length" class="flex gap-2 mb-4 flex-wrap">
        <InfoChip v-for="genre in show.genres" :key="genre" :label="genre" />
      </div>
      <div class="mb-8 leading-relaxed text-black whitespace-pre-line">{{ summaryText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShowPoster from "@/components/ShowPoster.vue";
import InfoChip from "@/components/InfoChip.vue";
import ShowRating from "@/components/ShowRating.vue";
import type { Show } from "@/types/show";
import { computed } from "vue";
import { PhotoIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  show: Show;
}>();

const summaryText = computed(() => props.show.summary ?? "No description available");
const premieredYear = computed(() =>
  props.show.premiered ? new Date(props.show.premiered).getFullYear().toString() : null,
);
</script>
