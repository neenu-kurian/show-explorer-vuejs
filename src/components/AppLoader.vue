<template>
  <div role="status" class="flex flex-col items-center justify-center mt-24">
    <div
      aria-hidden="true"
      class="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"
    ></div>
    <p class="text-center mt-4">{{ message || "Loading..." }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>();
</script>
