<template>
  <form
    role="search"
    @submit.prevent="emit('enter')"
    class="flex items-center gap-6 rounded-md px-4 py-2 w-full md:w-search bg-gray-100 outline-none"
  >
    <slot name="icon">
      <MagnifyingGlassIcon class="w-8 h-8 flex-none" />
    </slot>
    <input
      :value="modelValue"
      name="search-input"
      type="search"
      maxlength="80"
      autocomplete="off"
      aria-label="Search shows"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      class="w-full bg-transparent text-base text-gray-900 p-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 appearance-none"
    />
  </form>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
  }>(),
  {
    modelValue: "",
    placeholder: "Search for TV shows...",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  enter: [];
}>();
</script>

<style scoped>
input:focus,
form:focus-within {
  box-shadow: none;
}
</style>
