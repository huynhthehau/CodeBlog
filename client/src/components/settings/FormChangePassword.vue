<script setup>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import { useChangePassword } from "../../composables/auth";
import eventBus from "../../utils/evenBus";
import { useRouter } from "vue-router";
import ChangePassword from "../modal/ChangePasswordSuccesModal.vue";
const { error, isPending, changePassword } = useChangePassword();
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const store = useStore();
const userLogin = computed(() => store.getters["auth/getUser"]);
const password = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
async function changePasswordSubmit() {
  const success = await changePassword(
    password.value,
    newPassword.value,
    confirmPassword.value
  );
  if (!success) {
    password.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } else {
    cookies.remove("RefreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("socketConnection");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessTokenExpiration");
    eventBus.emit("showChangesPasswordSuccess");
  }
}
onMounted(() => {
  error.value = "";
});
</script>
<template>
  <h1 class="my-5 text-2xl">Change Password</h1>

  <section
    v-if="userLogin"
    class="text-gray-900 border border-solid border-gray-50 rounded-lg mb-10"
  >
    <form
      class="mt-4 space-y-4 lg:mt-5 md:space-y-5 w-1/3"
      @submit.prevent="changePasswordSubmit"
    >
      <div>
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Password</label
        >
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          placeholder="••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >New password</label
        >
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          v-model="newPassword"
          placeholder="••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label
          for="confirm-password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Confirm password</label
        >
        <input
          type="password"
          name="confirm-password"
          v-model="confirmPassword"
          id="confirm-password"
          placeholder="••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <ul v-if="error" class="text-red-500 ml-3 text-sm mb-2">
        <li v-for="er in error.split(',')" :key="er">
          {{ er.charAt(0).toUpperCase() + er.slice(1) }}
        </li>
      </ul>
      <ul v-else class="text-gray-500 ml-3 text-sm mb-2">
        <li>6-25 characters</li>
        <li>At least one capital letter</li>
        <li>No spaces</li>
      </ul>
      <button
        type="submit"
        class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Reset password
      </button>
    </form>
  </section>
  <ChangePassword></ChangePassword>
</template>
