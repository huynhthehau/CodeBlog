<script setup>
import { useCookies } from "vue3-cookies";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useLogin } from "../composables/auth";
import { useRouter, useRoute } from "vue-router";
import socket from "../plugins/socket";
const router = useRouter();
const route = useRoute();
const store = useStore();
const { cookies } = useCookies();
const successForm = ref(route.query.successForm);

const routeBeforeLogin = computed(
  () => store.getters["route/getRouteBeforeLogin"]
);
const { error, isPending, login } = useLogin();
error.value = null;
const email = ref("");
const password = ref("");

async function sign() {
  try {
    const { user, auth, refreshCookie, expiresIn } = await login(
      email.value,
      password.value
    );
    if (!error.value) {
      user && store.dispatch("auth/setUserToken", { user: user });
      auth && localStorage.setItem("accessToken", JSON.stringify(auth));
      expiresIn &&
        localStorage.setItem(
          "accessTokenExpiration",
          JSON.stringify(Date.now() + expiresIn * 1000)
        );
      refreshCookie && cookies.set("RefreshToken", refreshCookie, "15d");
      if (user) {
        socket.auth = {
          userId: user._id,
        };
        socket.connect();
        localStorage.setItem("socketConnection", JSON.stringify(socket.auth));
      }
      if (routeBeforeLogin.value) router.push({ path: routeBeforeLogin.value });
      else router.push({ name: "home", params: {} });
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
<template>
  <div class="body">
    <main>
      <div
        v-if="successForm"
        class="flex p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
        role="alert"
      >
        <svg
          aria-hidden="true"
          class="flex-shrink-0 inline w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class="sr-only">Info</span>
        <div>
          <span class="font-medium">{{ successForm }}</span>
        </div>
      </div>
      <div class="flex justify-center w-full mb-3">
        <div class="w-24 h-24 bg-blue-600 rounded-full relative">
          <div
            class="absolute w-12 h-12 bg-white rounded-full right-2 bottom-2"
          ></div>
        </div>
      </div>
      <a href="#" class="login-btn google">
        <p><i class="fa-brands fa-google"></i> Login with Google</p>
      </a>

      <form @submit.prevent="sign" class="formLogin">
        <div class="row">
          <label for="email">Email</label>
          <input
            autofocus
            v-model="email"
            required
            type="email"
            name="email"
            placeholder="name@company.com"
          />
        </div>
        <div class="row">
          <div class="label-password">
            <label for="password">Password</label>
            <router-link :to="{ name: 'account-recovery' }"
              >Forgot password?</router-link
            >
          </div>
          <input
            v-model="password"
            required
            placeholder="••••••••"
            type="password"
            name="password"
          />
          <ul class="text-red-500 ml-3 text-sm mb-2" v-if="error">
            <li v-for="er in error.split(',')" :key="er">
              {{ er.charAt(0).toUpperCase() + er.slice(1) }}
            </li>
          </ul>
        </div>
        <div class="row mt-3">
          <button v-if="isPending">
            <svg class="animate-spin"></svg>
            Processing...
          </button>
          <button v-else type="submit">Log in</button>
        </div>
      </form>
      <p class="sign-up">
        Don’t have an account?
        <router-link to="/auth/register">Sign up</router-link>
      </p>
    </main>
  </div>
</template>

<style scoped>
.body {
  height: 100vh;
  widows: 100%;
  display: flex;
  justify-content: center;
  background-color: #f1f2f3;
}
main {
  background-color: #f1f2f3;
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
p.error {
  color: rgb(255, 69, 69);
  margin: 5px;
  font-size: 14px;
}
.favicon {
  height: 47px;
  margin-bottom: 10px;
}
.favicon img {
  object-fit: contain;
  max-height: 47px;
}

.login-btn {
  border: 0.5px solid #a8acb1;
  border-radius: 10px;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
  font-weight: 200;
}

.login-btn.github {
  background-color: #2f3337;
  color: white;
}
.login-btn.facebook {
  background-color: #385499;
  color: white;
}
.formLogin {
  background-color: #fff;
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: left;
  flex-direction: column;
  padding: 20px;
  border-radius: 7px;
  margin: 10px 0px 0px;
}
.formLogin .row {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.row label {
  font-weight: bold;
}
.row input {
  border: 0.6px solid #a8acb1;
  height: 32px;
  border-radius: 2px;
  margin-top: 5px;
  padding: 10px;
}
.row button {
  color: white;
  background-color: #0a95ff;
  height: 32px;
  border-radius: 2px;
}

.sign-up {
  margin: 20px 0 0;
}
.sign-up a {
  color: #0a95ff;
}
.label-password {
  display: flex;
  justify-content: space-between;
}
.label-password a {
  color: #21a7ef;
  font-size: 14px;
}
</style>
