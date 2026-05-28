<template>
  <div class="relative inline-flex items-center bg-gray-100 rounded-lg px-3 md:min-w-dropdown">
    <select
      :value="modelValue"
      aria-label="Sort shows by"
      id="sort-select"
      @change="onChange"
      class="appearance-none bg-transparent border-none py-2.5 pr-6 text-sm text-gray-900 w-full cursor-pointer font-medium focus-ring"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <ChevronDownIcon
      aria-hidden="true"
      class="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none shrink-0"
    />
  </div>
</template>

<script setup lang="ts">
import type { SortOption } from "@/types/components";
import type { SortBy } from "@/types/show";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

withDefaults(
  defineProps<{
    modelValue?: SortBy;
    options: SortOption[];
  }>(),
  {
    modelValue: "rating-desc",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: SortBy];
}>();

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as SortBy;
  emit("update:modelValue", value);
}
</script>

<style scoped>
select:focus {
  box-shadow: none;
}
</style>
