<template>
  <div
    class="flex gap-1 items-center text-white absolute"
    :aria-label="`Rating: ${score.toFixed(1)} out of 10`"
  >
    <StarIcon class="h-4 w-4 text-yellow-400 inline" />
    <span>{{ score.toFixed(1) }}/10</span>
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from "@heroicons/vue/24/solid";

defineProps<{
  score: number;
}>();
</script>
