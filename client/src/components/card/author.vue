<!-- <script setup>
import FollowBtn from "../profile/FollowBtn.vue";

import { URL_AVATAR } from "../../constants";
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const store = useStore();
const props = defineProps(["author", "page", "search"]);
async function fetchData() {
  await store.dispatch("users/filterUser", {
    sort: "follower",
    current_page: props.page,
    search: props.search,
  });
}
</script>

<template>
  <div
    class="max-w-sm w-72 bg-white shadow-lg rounded-sm border border-gray-200 m-1"
  >
    <div class="flex flex-col h-full">
      <div class="flex-grow p-5">
        <div class="flex justify-between items-start">
          <header>
            <div class="flex items-center mb-2">
              <img
                :src="URL_AVATAR + author.avatar"
                class="w-14 h-14 border bg-gray-500 border-gray-300 mr-3"
                :alt="author.display_name"
              />
              <div class="mt-1 pr-1">
                <a
                  class="inline-flex text-gray-800 hover:text-gray-900"
                  href="#0"
                >
                  <h2 class="text-xl leading-snug justify-center font-semibold">
                    <router-link
                      :to="{
                        name: 'profile',
                        params: {
                          id: author._id,
                        },
                      }"
                      >{{ author.display_name }}</router-link
                    >
                  </h2>
                </a>
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-400 -mt-0.5 mr-1"
                    >@ {{ author.email.split("@")[0] }}</span
                  >
                </div>
                <FollowBtn
                  class="mt-3"
                  @followSubmit="fetchData"
                  :followUserId="author._id"
                ></FollowBtn>
              </div>
            </div>
          </header>

        </div>
        <div v-if="author.about" class="mt-2 paragraph">
          <div class="text-sm">
            {{ author.about }}
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200">
        <div class="flex divide-x divide-gray-200r">
          <div
            class="pb-4 flex justify-center items-center w-full divide-x divide-gray-400 divide-solid"
          >
            <span class="text-center px-2"
              ><span class="font-bold text-gray-700">{{
                author.followers
              }}</span
              ><span class="text-gray-600"> followers</span></span
            ><span class="text-center px-2"
              ><span class="font-bold text-gray-700">{{ author.posts }}</span
              ><span class="text-gray-600"> posts</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.paragraph {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> -->

<script setup>
import FollowBtn from "../profile/FollowBtn.vue";

import { URL_AVATAR } from "../../constants";
import { useStore } from "vuex";
const store = useStore();
const props = defineProps(["author", "page", "search"]);
async function fetchData() {
  await store.dispatch("users/filterUser", {
    sort: "follower",
    limit: 10,
    current_page: props.page,
    search: props.search,
  });
}
</script>
<template>
  <div
    v-if="author"
    class="max-w-md m-5 z-40 p-3 min-w-fit shadow-lg rounded-lg sm:flex sm:space-x-6 bg-gray-50 text-gray-800 left-14 -bottom-20"
  >
    <div class="flex-shrink-0 w-12 mb-6 h-12 sm:h-28 sm:w-28 sm:mb-0">
      <img
        :src="URL_AVATAR + author.avatar"
        :alt="author.display_name"
        class="object-cover object-center w-full h-full rounded bg-gray-500"
      />
    </div>
    <div class="flex flex-col space-y-4 w-52">
      <div>
        <h2 class="text-2xl font-semibold">
          <router-link
            :to="{
              name: 'profile',
              params: {
                id: author._id,
              },
            }"
            >{{ author.display_name }}</router-link
          >
        </h2>
        <span class="flex items-center space-x-2">
          <span class="text-gray-600">{{ author.email }}</span>
        </span>
        <div class="mt-1 flex flex-row justify-between text-gray-600">
          <p class="mr-1">
            <b>{{ author.posts }}</b> posts
          </p>
          <p class="mr-1">
            <b>{{ author.followers }}</b> followers
          </p>
        </div>
        <FollowBtn
          :followUserId="author._id"
          @followSubmit="fetchData"
        ></FollowBtn>
      </div>
    </div>
  </div>
</template>
