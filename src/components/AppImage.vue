<template>
  <img
    v-if="src && !failed"
    :src="src"
    :alt="alt"
    :loading="loading ?? 'lazy'"
    @error="failed = true"
    class="w-full h-full object-cover"
  />
  <div v-else>
    <slot name="fallback">
      <span>{{ "No Image Available" }}</span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  src?: string;
  alt: string;
  loading?: "lazy" | "eager";
}>();

const failed = ref(false);
watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);
</script>
