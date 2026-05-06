<template>
  <div class="inline-flex gap-2 items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
    <span>{{ label }}</span>
    <span class="font-bold">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | null;
}>();
</script>
