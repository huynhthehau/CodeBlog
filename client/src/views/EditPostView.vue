<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import EditorMarkdown from "../components/EditorMarkdown.vue";
import { usePost } from "../composables/post";
import { URL_IMG } from "../constants";
import { limitString } from "../utils/string";
import UploadImage from "../components/UploadImage.vue";
const { error, isPending, createPost } = usePost();
const router = useRouter();
const search = ref("");
const store = useStore();
const tags = ref([]);
const title = ref("");
const content = ref("");
const user = computed(() => store.getters["auth/getUser"]);
const imageCover = ref("");

function handleImage(data) {
  imageCover.value = data.image;
}
async function fetchData() {
  error.value = "";
  await store.dispatch("tags/filterTag", {
    search: search.value,
  });
}
watch(search, async () => {
  await store.dispatch("tags/filterTag", {
    search: search.value,
  });
});
const listTags = computed(() => {
  const tagsTitle = tags.value.map((e) => e.title);
  return store.getters["tags/getAllTags"].filter((item) => {
    return !tagsTitle.includes(item.title);
  });
});
function addTag(tag) {
  search.value = "";
  if (tags.value.length < 5) {
    tags.value.push(tag);
  }
}
async function post() {
  if (content.value.replace(/\s/g, "").length >= 22) {
    const tagId = tags.value.map((e) => e._id);
    const post = await createPost(
      title.value,
      content.value,
      tagId,
      imageCover.value
    );
    await store.dispatch("posts/fetchData");
    await store.dispatch("notifications/createNewPostNotification", {
      postId: post._id,
      link: "/post/" + post._id,
      content: `<p><span style="color:#709bd0;">${
        user.value.display_name
      }</span> đã thêm một bài viết mới <span style="color:#709bd0;">${limitString(
        post.title,
        30
      )}</span> mà có thể bạn quan tâm.</p>`,
    });
    router.push({ name: "home", params: {} });
  }
}
function removeItem(arr, item) {
  const index = arr.indexOf(item);

  if (index !== -1) {
    arr.splice(index, 1);
  }
}
onMounted(fetchData);
</script>
<template>
  <main>
    <div class="container title">
      <h2>Title</h2>
      <span>Title of post</span>
      <input
        v-model="title"
        type="text"
        placeholder="ex: cách hoạt động của express..."
      />
    </div>
    <div class="container tags">
      <h2>Tags</h2>
      <span>Tag your post. Maximum 5 tags. At least 1 tag!</span>
      <div class="input">
        <ul v-if="tags != []" class="flex items-center">
          <li v-for="tag in tags" :key="tag._id" class="mr-3">
            {{ tag.title }}
            <i
              @click="removeItem(tags, tag)"
              class="fa-solid fa-xmark cursor-pointer"
            ></i>
          </li>
        </ul>
        <input v-model="search" type="text" placeholder="At least 1 tag!" />
      </div>
      <ul v-if="search" class="sub-menu pl-2 pb-2 pt-1">
        <li v-for="tag in listTags" :key="tag._id" @click="addTag(tag)">
          {{ tag.title }}
        </li>
      </ul>
    </div>
    <div class="container content">
      <EditorMarkdown v-model:content="content"></EditorMarkdown>
    </div>
    <div class="container upload">
      <h2>Cover image</h2>
      <span>You can choose photo if you want</span>
      <UploadImage @sendImage="handleImage"></UploadImage>
    </div>
    <div class="flex justify-start w-full pl-20">
      <ul class="text-red-500 text-sm mb-2" v-if="error">
        <li v-for="er in error.split(',')" :key="er">
          {{ er.charAt(0).toUpperCase() + er.slice(1) }}
        </li>
      </ul>
    </div>
    <div @click="post" class="container submit">
      <button>Post</button>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 60%;
  min-height: 100%;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.container {
  display: flex;
  flex-direction: column;
  border: 0.5px solid #e3e5e7;
  border-radius: 5px;
  margin: 5px 0;
  padding: 10px 25px;
  background-color: #fff;
}
.container.submit {
  flex: 0.1;
  width: 10%;
  text-align: center;
  margin: 10px 0 0 0;
  background-color: #0a95ff;
  color: #fff;
  align-self: normal;
  margin: 10px 0 0 100px;
  cursor: pointer;
}

.container h2 {
  font-size: 24px;
}
.container span {
  font-size: 14px;
  color: #555555;
}
.container input {
  border: 0.5px solid #e3e5e7;
  margin: 10px 0 0 0;
  height: 35px;
  padding: 0 15px;
}
.container .input {
  width: 100%;
  padding: 0 0 0 0;
}
.container .input input {
  border: 0.5px solid #e3e5e7;
  margin: 10px 0 0 0;
  height: 35px;
  padding: 0 15px;
  width: 100%;
}
.title {
  width: 90%;
  flex: 0.6;
}
.content {
  padding: 0;
  border: none;
  width: 90%;
}
.tags {
  width: 90%;
  flex: 0.6;
}
.upload {
  width: 90%;
  flex: 2;
}
.tags .input {
  position: relative;
}
.icon-container {
  position: absolute;
  right: 10px;
  top: calc(50% - 5px);
}
.loader {
  position: relative;
  height: 20px;
  width: 20px;
  display: inline-block;
  animation: around 5.4s infinite;
}

@keyframes around {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader::after,
.loader::before {
  content: "";
  background: white;
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 100%;
  border-width: 2px;
  border-color: #333 #333 transparent transparent;
  border-style: solid;
  border-radius: 20px;
  box-sizing: border-box;
  top: 0;
  left: 0;
  animation: around 0.7s ease-in-out infinite;
}

.loader::after {
  animation: around 0.7s ease-in-out 0.1s infinite;
  background: transparent;
}

.sub-menu {
  border: 1px solid #e3e5e7;
  border-radius: 3px;
}
.sub-menu li {
  cursor: pointer;
}
</style>
