<template>
  <AppLoader v-if="castLoading" message="Loading cast..." />
  <div v-else-if="castError" class="text-center" role="alert">
    {{ castError }}
  </div>
  <div v-else-if="cast.length === 0" class="text-center text-gray-500">No cast available</div>
  <div v-else class="px-5 mb-10">
    <h2 class="text-title mt-5">Top Cast</h2>
    <div class="grid grid-cast gap-6 mt-5">
      <CastMemberComponent
        v-for="member in castToDisplay"
        :key="member.person.id"
        :member="member"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CastMemberComponent from "@/components/CastMember.vue";
import { MAX_CAST_MEMBERS_TO_DISPLAY } from "@/constants";
import type { CastMember } from "@/types/cast";
import { computed } from "vue";
import AppLoader from "./AppLoader.vue";

const props = defineProps<{
  cast: CastMember[];
  castError: string | null;
  castLoading: boolean;
}>();

const castToDisplay = computed(() => props.cast.slice(0, MAX_CAST_MEMBERS_TO_DISPLAY));
</script>
