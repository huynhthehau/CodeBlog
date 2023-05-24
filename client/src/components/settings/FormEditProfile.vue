<script setup>
import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";
import { URL_AVATAR } from "../../constants/index";
import { useChangeProfile } from "../../composables/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const { error, isPending, changeProfile } = useChangeProfile();
const store = useStore();
const userLogin = computed(() => store.getters["auth/getUser"]);
const imageUrl = ref(URL_AVATAR + userLogin.value.avatar);

const oldAvatar = ref(userLogin.value.avatar);
const display_name = ref(userLogin.value.display_name);
const bio = ref(userLogin.value.bio);
const location = ref(userLogin.value.location);
const about = ref(userLogin.value.about);

const formData = new FormData();

function onFileSelected(event) {
  const file = event.target.files[0];
  formData.append("avatar", file);
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    imageUrl.value = reader.result;
  };
}

async function changeProfileSubmit() {
  formData.append("display_name", display_name.value);
  formData.append("oldAvatar", oldAvatar.value);
  bio.value != null && formData.append("bio", bio.value);
  location.value != null && formData.append("location", location.value);
  about.value != null && formData.append("about", about.value);
  const newUser = await changeProfile(formData);

  if (newUser) {
    await store.dispatch("auth/setUserToken", { user: newUser });
    router.go(0);
  } else {
    formData.delete("avatar");
    formData.delete("display_name");
    formData.delete("bio");
    formData.delete("location");
    formData.delete("about");
    formData.delete("oldAvatar");
  }
}
onMounted(() => {
  error.value = "";
});
</script>
<template>
  <h1 class="my-5 text-2xl">Public information</h1>

  <section
    v-if="userLogin"
    class="text-gray-900 border border-solid border-gray-50 rounded-lg mb-10"
  >
    <form
      @submit.prevent="changeProfileSubmit"
      class="container flex flex-col mx-auto space-y-12 ng-untouched ng-pristine ng-valid"
    >
      <fieldset class="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm">
        <div class="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
          <div class="col-span-full">
            <label
              for="profile image"
              class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
              >Profile image</label
            >
            <div class="flex items-center space-x-2">
              <img
                :src="imageUrl"
                :alt="userLogin.display_name"
                class="rounded w-36 h-36 bg-gray-500 bg-gray-300"
              />
              <label class="cursor-pointer mt-6">
                <span
                  class="mt-2 text-base leading-normal px-4 py-2 bg-blue-500 text-white text-sm rounded-full"
                  >Select Avatar</span
                >
                <input
                  @change="onFileSelected"
                  type="file"
                  class="hidden"
                  :multiple="multiple"
                  :accept="accept"
                />
              </label>
            </div>
          </div>
          <div class="col-span-full sm:col-span-3">
            <label
              for="Display name"
              class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
              >Display name</label
            >
            <input
              v-model="display_name"
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div class="col-span-full">
            <label
              for="Bio"
              class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
              >Bio</label
            >
            <label class="flex radio p-2 cursor-pointer">
              <input
                class="my-auto transform scale-125"
                type="radio"
                name="bio"
                value="Male"
                v-model="bio"
              />
              <div class="title px-2">male</div>
            </label>

            <label class="flex radio p-2 cursor-pointer">
              <input
                class="my-auto transform scale-125"
                type="radio"
                name="bio"
                value="Female"
                v-model="bio"
              />
              <div class="title px-2">female</div>
            </label>
          </div>
          <div class="col-span-full sm:col-span-3">
            <label
              for="Location"
              class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
              >Location</label
            >
            <input
              v-model="location"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div class="col-span-full">
            <label
              for="About"
              class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
              >About</label
            >
            <div class="mt-2">
              <textarea
                v-model="about"
                id="About"
                name="about"
                rows="3"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
            <p class="mt-3 text-sm leading-6 text-gray-600">
              Write a few sentences about yourself.
            </p>
          </div>
          <div v-if="error" class="col-span-full">
            <p class="mt-3 text-sm leading-6 text-rose-600">
              {{ error }}
            </p>
          </div>
          <div class="col-span-full">
            <button
              type="submit"
              class="px-5 py-2 font-semibold border rounded border-blue-300 text-gray-800 hover:bg-blue-500 hover:border-blue-500"
            >
              Save profile
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  </section>
</template>
