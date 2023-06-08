<script setup>
import PostFilter from "../components/postComponents/elements-select-option.vue";
import Post from "../components/postComponents/elements-blog-post-article-review.vue";
import FollowTagBtn from "../components/profile/FollowTagBtn.vue";

import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted, watch } from "vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const page = ref(1);
const tagId = computed(() => route.params.id);
const tagDetail = computed(() => store.getters["tags/tagInPostTagged"]);
const search = computed(() => store.getters["search/getSearchText"]);
const posts = computed(() => store.getters["postsTagged/getAllPosts"]);
const paginationOfPosts = computed(
  () => store.getters["postsTagged/getPaginationPost"]
);
const sort = ref("latest");
watch(search, async () => {
  page.value = 1;
  await store.dispatch("postsTagged/setCurrent_page", {
    id: tagId.value,
    search: search.value,
    sort: sort.value,
    current_page: page.value,
    search: search.value,
  });
});
async function emitSelectSort(select) {
  sort.value = select;
  page.value = 1;
  await store.dispatch("postsTagged/setCurrent_page", {
    id: tagId.value,
    sort: sort.value,
    search: search.value,
    limit: 7,
    current_page: page.value,
  });
}

async function setPostPage(page) {
  await store.dispatch("postsTagged/setCurrent_page", {
    id: tagId.value,
    sort: sort.value,
    search: search.value,
    limit: 7,
    current_page: page,
  });
}
async function fetchData() {
  await store.dispatch("postsTagged/setCurrent_page", {
    id: tagId.value,
    sort: sort.value,
    search: search.value,
    limit: 7,
    current_page: 1,
  });
  await store.dispatch("tags/setTagInPostTagged", { tagId: tagId.value });
}
onMounted(fetchData);
</script>
<template>
  <div class="w-full lg:w-8/12" v-if="posts && paginationOfPosts && tagDetail">
    <div class="flex items-center justify-between">
      <div class="flex">
        <h1 class="text-xl font-bold text-gray-700 md:text-2xl">
          Posts [{{ tagDetail.title }}]
        </h1>
        <FollowTagBtn :followTagId="tagDetail._id"></FollowTagBtn>
      </div>
      <PostFilter @selectSort="emitSelectSort"></PostFilter>
    </div>
    <div class="mt-6" v-for="post in posts" :key="post.id">
      <Post :post="post" :typePost="{ type: 'postHome' }"></Post>
    </div>
    <!-- pagination -->
    <div class="mt-8" v-if="paginationOfPosts.total_pages != 0">
      <ul class="flex">
        <li
          @click="
            paginationOfPosts.current_page != 1 &&
              setPostPage(paginationOfPosts.current_page - 1)
          "
          :class="{
            hover_pagi: paginationOfPosts.current_page != 1,
          }"
          class="mx-1 px-3 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-pointer"
        >
          <span class="flex items-center font-bold">previous</span>
        </li>
        <li
          v-for="n in paginationOfPosts.total_pages"
          @click="setPostPage(n)"
          :key="n"
          :class="{ active: paginationOfPosts.current_page == n }"
          class="mx-1 px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-gray-200 rounded-lg cursor-pointer"
        >
          <span class="font-bold">{{ n }}</span>
        </li>
        <li
          @click="
            paginationOfPosts.current_page != paginationOfPosts.total_pages &&
              setPostPage(paginationOfPosts.current_page + 1)
          "
          :class="{
            hover_pagi:
              paginationOfPosts.current_page != paginationOfPosts.total_pages,
          }"
          class="mx-1 px-3 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-pointer"
        >
          <span class="flex items-center font-bold">Next</span>
        </li>
      </ul>
    </div>
    <div v-else class="flex flex-col items-center mt-10">
      <i class="fa-solid fa-magnifying-glass fa-2xl"></i>
      <p class="mt-4">
        We couldn't find anything for
        <span class="font-medium">{{ search }}</span>
      </p>
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

<style scoped>
.active {
  background-color: rgb(55 65 81 / 1);
  color: rgb(229 231 235 / 1);
}
.hover_pagi {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity));
}
.hover_pagi:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity));
  color: rgb(229 231 235 / var(--tw-bg-opacity));
}
</style>
