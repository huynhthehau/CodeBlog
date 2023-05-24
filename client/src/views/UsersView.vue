<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import Author from "../components/card/author.vue";
const store = useStore();
const search = ref("");
const page = ref(1);
const limit = ref(10);
const user = computed(() => store.getters["auth/getUser"]);

const listUsers = computed(() => store.getters["users/getAllUsers"]);
const paginationOfUsers = computed(() => store.getters["users/getPagination"]);
async function fetchData() {
  if (user.value) await store.dispatch("auth/setUsersFollowing");
  await store.dispatch("users/filterUser", {
    sort: "follower",
    limit: limit.value,
    current_page: page.value,
    search: search.value,
  });
}
watch(page, async () => {
  await store.dispatch("users/filterUser", {
    sort: "follower",
    limit: limit.value,
    current_page: page.value,
    search: search.value,
  });
});
watch(search, async () => {
  page.value = 1;
  await store.dispatch("users/filterUser", {
    sort: "follower",
    limit: limit.value,
    current_page: page.value,
    search: search.value,
  });
});

onMounted(fetchData);
</script>

<template>
  <div class="w-full lg:w-8/12" v-if="listUsers && paginationOfUsers">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-700 md:text-2xl">
        User({{ paginationOfUsers.total }})
      </h1>
    </div>
    <input
      v-model="search"
      type="search"
      placeholder="Filter by display name"
      class="py-2 px-4"
    />
    <section class="tag-layout">
      <Author
        v-for="user in listUsers"
        :key="user._id"
        :author="user"
        :page="page"
        :search="search"
      ></Author>
    </section>
    <!-- pagination -->
    <div class="mt-8" v-if="paginationOfUsers.total_pages != 0">
      <ul class="flex">
        <li
          @click="
            paginationOfUsers.current_page != 1 &&
              (page = paginationOfUsers.current_page - 1)
          "
          :class="{
            hover_pagi: paginationOfUsers.current_page != 1,
          }"
          class="mx-1 px-3 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-pointer"
        >
          <span class="flex items-center font-bold">previous</span>
        </li>
        <li
          v-for="n in paginationOfUsers.total_pages"
          @click="page = n"
          :key="n"
          :class="{ active: paginationOfUsers.current_page == n }"
          class="mx-1 px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-gray-200 rounded-lg cursor-pointer"
        >
          <span class="font-bold">{{ n }}</span>
        </li>
        <li
          @click="
            paginationOfUsers.current_page != paginationOfUsers.total_pages &&
              (page = paginationOfUsers.current_page + 1)
          "
          :class="{
            hover_pagi:
              paginationOfUsers.current_page != paginationOfUsers.total_pages,
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
</template>
<style scoped>
.tag-layout {
  --columns: 4;
  --spacing: 30px;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: calc(-1 * var(--spacing));
  padding: 32px 0;
  background-color: #fff;
}

.tag-layout .item {
  width: calc(100% / var(--columns) - var(--spacing));
  height: 90px;
  margin-left: var(--spacing);
  margin-top: var(--spacing);
  font-size: 1rem;
  font-weight: 600;
  display: flex;
}
.item button {
  border: 2px solid #5488c7;
  color: #5488c7;
  border-radius: 5px;
  padding: 3px 15px;
}
.item button:hover {
  background-color: #5488c7;
  color: #fff;
}
.followed {
  background-color: #5488c7;
  color: #fff;
}

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
