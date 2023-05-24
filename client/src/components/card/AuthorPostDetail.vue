<script setup>
import { onMounted, computed, ref } from "vue";
import { URL_AVATAR } from "../../constants/index";
import FollowBtn from "../profile/FollowBtn.vue";
import { useUser } from "../../composables/user";
const { error, isPending, getUser } = useUser();
const props = defineProps(["authorId"]);
const author = ref(null);
onMounted(async () => {
  author.value = await getUser({ userId: props.authorId });
});
</script>
<template>
  <div
    v-if="author"
    class="max-w-md z-40 p-3 min-w-fit shadow-lg rounded-lg sm:flex sm:space-x-6 bg-gray-50 absolute text-gray-800 left-14 -bottom-20"
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
            <b>{{ author.followers.length }}</b> followers
          </p>
        </div>
        <FollowBtn :followUserId="author._id"></FollowBtn>
      </div>
    </div>
  </div>
</template>
