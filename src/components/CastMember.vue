<template>
  <article class="flex items-center flex-col text-center gap-1 p-1">
    <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-sm">
      <ShowPoster :src="member.person.image?.medium" :alt="member.person.name">
        <template #fallback>
          <UserIcon aria-hidden="true" />
        </template>
      </ShowPoster>
    </div>
    <div>
      {{ member.person.name }}
      <div class="text-caption" v-if="member.character.name">
        {{ member.character.name }}
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { CastMember } from "@/types/cast";
import { UserIcon } from "@heroicons/vue/24/outline";
import ShowPoster from "./ShowPoster.vue";

defineProps<{
  member: CastMember;
}>();
</script>
