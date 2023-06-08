<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
const search = ref("");
const page = ref(1);

const store = useStore();
const router = useRouter();
async function fetchData() {
  await store.dispatch("tags/filterTagsShowInHome", {
    current_page: page.value,
    search: search.value,
    sort: "posts",
  });
}
const listTags = computed(() => store.getters["tags/tagsShowInHome"]);
onMounted(fetchData);
</script>
<template>
  <div
    v-if="listTags"
    class="flex flex-wrap bg-white px-4 py-6 max-w-sm mx-auto rounded-lg shadow-md"
  >
    <div
      v-for="tag in listTags"
      :key="tag._id"
      class="mr-2 mb-2 cursor-pointer text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
    >
      <router-link
        :to="{
          name: 'postsTagged',
          params: {
            id: tag._id,
          },
        }"
        >{{ tag.title }}
      </router-link>
    </div>
  </div>
  <div
    v-else
    class="flex flex-col m-8 rounded shadow-md w-60 sm:w-80 animate-pulse h-96"
  >
    <div class="h-48 rounded-t bg-gray-300"></div>
    <div class="flex-1 px-4 py-8 space-y-4 sm:p-8 bg-gray-50">
      <div class="w-full h-6 rounded bg-gray-300"></div>
      <div class="w-full h-6 rounded bg-gray-300"></div>
      <div class="w-3/4 h-6 rounded bg-gray-300"></div>
    </div>
  </div>
</template>
