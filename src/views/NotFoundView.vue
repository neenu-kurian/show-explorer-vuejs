<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white px-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
    <p class="text-gray-700 mb-6">
      Oops! The page you are trying to view doesn't exist or has been moved.
    </p>
    <RouterLink
      to="/"
      class="inline-block bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-gray-300 focus-ring"
    >
      Go Back to Home
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
