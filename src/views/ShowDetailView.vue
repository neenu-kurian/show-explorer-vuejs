<template>
  <div>
    <RouterLink :to="{ name: 'home' }"
      class="inline-flex ml-3 items-center gap-2 font-medium my-7 cursor-pointer border-none p-0 text-base text-black hover:opacity-70 focus-visible:outline-none focus-ring">
      <ArrowLeftIcon class="w-4 h-4" />
      Back to shows
    </RouterLink>
    <AppLoader v-if="loading" message="Loading show details..." />
    <div v-else-if="error" class="text-center" role="alert">{{ error }}</div>
    <ShowDetailContent v-else-if="show" :show="show" :cast="cast" :castError="castError" :castLoading="castLoading" />
  </div>
</template>

<script setup lang="ts">
import AppLoader from "@/components/AppLoader.vue";
import ShowDetailContent from "@/components/ShowDetailContent.vue";
import { useShowDetails } from "@/composables/useShowDetails";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{ id: number }>();
const router = useRouter();
const { show, cast, loading, error, castError, castLoading, isNotFound, fetchShow } =
  useShowDetails(props.id);
onMounted(fetchShow);
watch(isNotFound, (hasNotFoundError) => {
  if (hasNotFoundError) router.replace({ name: "not-found" });
});
</script>
