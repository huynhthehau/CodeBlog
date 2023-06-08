<script setup>
import { getTimeSincePost, getReadableDate } from "../utils/time";
import EditorMarkdown from "../components/EditorMarkdown.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useComment } from "../composables/comment";
import { URL_AVATAR } from "../constants";
const route = useRoute();
const store = useStore();
const postId = computed(() => {
  return route.params.id.split("?")[0];
});
const user = computed(() => store.getters["auth/getUser"]);

const { createComment } = useComment();
const props = defineProps(["inReplyToComment", "inReplyToUser", "limit"]);
const emit = defineEmits(["commented"]);
const content = ref("");
if (props.inReplyToUser)
  content.value = "@" + props.inReplyToUser.split("@")[0] + " ";
async function postComment() {
  if (!user.value) {
    await store.dispatch("route/setShowModalLogin", {
      isShow: true,
    });
  } else {
    if (content.value.replace(/\s/g, "").length >= 8) {
      const comment = await createComment(
        props.inReplyToComment,
        props.inReplyToUser,
        postId.value,
        content.value
      );
      if (comment) {
        await store.dispatch("notifications/createNewCommentNotification", {
          commentId: comment._id,
          link: "/post/" + postId.value + "?commentId=" + comment._id,
        });
      }
      emit("commented");
      await store.dispatch("comments/setCurrent_page", {
        current_page: 1,
        limit: props.limit || 5,
        postId: postId.value,
      });
      content.value = " ";
    }
  }
}
var toolbarOptions = [
  ["bold", "italic", "underline"],
  ["blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }],
];
</script>
<template>
  <form @submit.prevent="postComment()" class="mb-6">
    <div
      class="py-2 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <label for="comment" class="sr-only">Your comment</label>

      <EditorMarkdown
        v-model:content="content"
        :toolbar="toolbarOptions"
      ></EditorMarkdown>
    </div>
    <button
      type="submit"
      class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
    >
      Post comment
    </button>
  </form>
</template>
<style scoped>
.comments {
  width: 100%;
  border: 1px solid grey;
  position: relative;
  display: flex;
  flex-direction: column;
}

.comments .comment-btn {
  border: 1px solid grey;
  padding: 5px;
  width: 100px;
  font-size: 16px;
  align-self: flex-end;
  margin: 10px 20px 0 0;
}
.comments .postComment {
  display: flex;
  justify-content: center;
  align-items: center;
}
.postComment .avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.postComment .avatar img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.postComment .content {
  padding: 0;
  border: none;
  flex: 5;
}
</style>
