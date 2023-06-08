<script setup>
import RelatedPost from "../components/postDetailComponents/RelatedPost.vue";
import CommentEditor from "../components/CommentEditor.vue";
import SkeletonLoader from "../components/skeletonLoader.vue";
import PostDontExist from "../components/error/PostDontExist.vue";
import Comment from "../components/Comment.vue";
import PostAcive from "../components/PostAcive.vue";
import ContentPost from "../components/postComponents/Content.vue";
import TableOfContent from "../components/postDetailComponents/TableOfContent.vue";
import AuthorPostDetail from "../components/card/AuthorPostDetail.vue";

import { computed, onUpdated, onUnmounted, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { URL_AVATAR, URL_IMG } from "../constants/index";
import { getReadableDate, getTimeSincePost } from "../utils/time";

const store = useStore();
const route = useRoute();
const limit = ref(5);
const showCard = ref(false);
//pagination comments
watch(limit, async () => {
  await store.dispatch("comments/setCurrent_page", {
    current_page: 1,
    limit: limit.value,
    postId: postId.value,
  });
});

window.addEventListener("scroll", (e) => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  if (
    scrollHeight <= scrollTop + clientHeight &&
    paginationOfComment.value.total > limit.value
  ) {
    if (paginationOfComment.value.total - limit.value < 5)
      limit.value += paginationOfComment.value.total - limit.value;
    else limit.value += 5;
  }
});

//cuộn đến comment khi ta click vào thông báo
const commentId = ref(route.query.commentId);
if (commentId.value != null) {
  onMounted(() => {
    const commentElement = document.getElementById(commentId.value);
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: "smooth" });
    } else {
      const discussion = document.getElementById("Discussion");
      if (discussion) discussion.scrollIntoView({ behavior: "smooth" });
    }
  });
}

//lấy dữ liệu
const postId = ref(route.params.id);
watch(postId, () => {
  fetchData();
});
const post = computed(() => store.getters["postDetail/getPost"]);
const user = computed(() => store.getters["auth/getUser"]);
const listComments = computed(
  () => store.getters["comments/getCommentsInPost"]
);
const paginationOfComment = computed(
  () => store.getters["comments/getPaginationOfComments"]
);
const listPostsOfUser = computed(() => {
  const id = postId.value;
  const items = store.getters["postDetail/getPostsOfUser"];
  return items.filter((e) => e._id != id);
});
const listRelatedPosts = computed(
  () => store.getters["postDetail/getRelatedPosts"]
);

//Khởi tạo data lên store
const fetchData = async () => {
  await store.dispatch("postDetail/fetchData", { postId: postId.value });
  await store.dispatch("comments/fetchData", { postId: postId.value });
  if (user.value) {
    await store.dispatch("postDetail/fetchVote", { postId: postId.value });
    await store.dispatch("postDetail/fetchBookmark", { postId: postId.value });
    await store.dispatch("postDetail/fetchFollow", { postId: postId.value });
    await store.dispatch("postDetail/addViews", {
      postId: postId.value,
      userId: user.value._id,
    });
  } else {
    await store.dispatch("postDetail/addViews", {
      postId: postId.value,
    });
  }
  if (!commentId.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
onMounted(fetchData);
//Khi bài viết đã bị xóa
const isDeleted = ref(false);
setTimeout(() => {
  isDeleted.value = true;
}, 2000);
</script>
<template>
  <main v-if="post">
    <PostAcive :votes="post.votes" :author="post.user"></PostAcive>
    <div class="w-7/12 mx-auto">
      <main class="mt-10">
        <div class="mb-4 md:mb-0 w-full mx-auto">
          <div class="space-y-6">
            <h1 class="text-4xl font-bold md:tracking-tight md:text-5xl">
              {{ post.title }}
            </h1>
            <div
              class="relative flex flex-col items-start justify-between w-full md:flex-row md:items-center text-gray-600"
            >
              <div class="flex items-center md:space-x-2">
                <img
                  :src="URL_AVATAR + post.user.avatar"
                  :alt="post.user.display_name"
                  class="w-4 h-4 border rounded-full bg-gray-500 border-gray-300"
                  @mouseover="showCard = true"
                  @mouseleave="showCard = false"
                />
                <AuthorPostDetail
                  v-if="showCard"
                  :authorId="post.user._id"
                ></AuthorPostDetail>
                <p class="text-sm">
                  <router-link
                    :to="{
                      name: 'profile',
                      params: {
                        id: post.user._id,
                      },
                    }"
                    rel="noopener noreferrer"
                    target="_blank"
                    class="underline text-sky-600 mr-1"
                    @mouseover="showCard = true"
                    @mouseleave="showCard = false"
                  >
                    <span itemprop="name">{{
                      post.user.display_name
                    }}</span> </router-link
                  >• {{ getReadableDate(post.createdAt) }}
                </p>
              </div>
              <p class="flex-shrink-0 mt-3 text-sm md:mt-0">
                4 min read • {{ post.views }} views
              </p>
            </div>
          </div>

          <img
            v-if="post.coverImageUrl"
            :src="URL_IMG + post.coverImageUrl"
            class="w-full object-cover lg:rounded"
            style="height: 28em"
          />
        </div>

        <div class="flex flex-col lg:flex-row lg:space-x-12">
          <div
            class="px-4 lg:px-0 mt-12 text-gray-700 text-lg leading-relaxed w-full lg:w-3/4"
          >
            <ContentPost
              class="postContent"
              :content="post.content"
            ></ContentPost>
            <div>
              <div
                class="flex flex-wrap py-6 space-x-2 border-t border-dashed border-gray-600"
              >
                <router-link
                  :to="{ name: 'postsTagged', params: { id: tag._id } }"
                  v-for="tag in post.tags"
                  :key="tag._id"
                  rel="noopener noreferrer"
                  href="#"
                  class="px-3 py-1 rounded-sm hover:underline bg-sky-600 text-gray-50"
                  >#{{ tag.title }}</router-link
                >
              </div>
              <div v-if="listPostsOfUser.length" class="space-y-2">
                <h4 class="text-lg font-semibold">
                  More from {{ post.user.display_name }}
                </h4>
                <ul class="ml-4 space-y-1 list-disc">
                  <li
                    v-for="postOfUser in listPostsOfUser"
                    :key="postOfUser._id"
                  >
                    <router-link
                      :to="{
                        name: 'postDetail',
                        params: { id: postOfUser._id },
                      }"
                      rel="noopener noreferrer"
                      class="hover:underline"
                      >{{ postOfUser.title }}</router-link
                    >
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex justify-between items-center mb-6 mt-6">
              <h2
                v-if="listComments"
                class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white"
                id="Discussion"
              >
                Discussion ({{ listComments.length }})
              </h2>
            </div>
            <CommentEditor
              :inReplyToComment="null"
              :inReplyToUser="null"
            ></CommentEditor>
            <div v-if="listComments">
              <Comment
                v-for="comment in listComments"
                :key="comment._id"
                :comment="comment"
                :id="comment._id"
                :limit="limit"
              ></Comment>
            </div>
          </div>

          <div
            class="w-full lg:w-1/4 m-auto mt-12 max-w-screen-sm sticky top-20 self-start"
          >
            <TableOfContent />

            <div class="space-y-2 mt-5" v-if="listRelatedPosts.length">
              <h2
                class="text-sm font-semibold tracking-widest uppercase text-gray-600"
              >
                Related post
              </h2>
              <div class="max-h-screen overflow-auto style1" id="style-1">
                <RelatedPost
                  class="mb-5"
                  v-for="relatedPost in listRelatedPosts"
                  :key="relatedPost._id"
                  :post="relatedPost"
                ></RelatedPost>
              </div>
            </div>
          </div>
        </div>
      </main>
      <!-- main ends here -->
    </div>
  </main>
  <section v-else>
    <SkeletonLoader v-if="!isDeleted"></SkeletonLoader>
    <PostDontExist v-else></PostDontExist>
  </section>
</template>
<style scoped>
.style1::-webkit-scrollbar {
  display: none;
}
</style>
