<template>
  <ShowInfo :show="show" />
  <CastInfo :cast="cast" :castError="castError" :castLoading="castLoading" />
</template>

<script setup lang="ts">
import type { CastMember } from "@/types/cast";
import type { Show } from "@/types/show";
import CastInfo from "./CastInfo.vue";
import ShowInfo from "./ShowInfo.vue";

defineProps<{
  show: Show;
  cast: CastMember[];
  castError: string | null;
  castLoading: boolean;
}>();
</script>
