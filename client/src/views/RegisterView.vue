<script setup>
import { onMounted, ref } from "vue";
import { useSignUp } from "../composables/auth";
import { useRouter } from "vue-router";
const router = useRouter();
const displayName = ref("");
const email = ref("");
const password = ref("");

const { error, isPending, signUp } = useSignUp();
async function sign() {
  await signUp(email.value, password.value, displayName.value);
  if (!error.value) {
    router.push({
      name: "login",
      query: {
        successForm: "Register success!",
      },
    });
  }
}
onMounted(() => {
  error.value = null;
});
</script>
<template>
  <div class="body">
    <main>
      <a href="#" class="favicon">
        <img src="../assets/favicon/ms-icon-70x70.png" alt="" />
      </a>
      <a href="#" class="login-btn google">
        <p><i class="fa-brands fa-google"></i> Sign up with Google</p>
      </a>
      <a href="#" class="login-btn github">
        <p><i class="fa-brands fa-github"></i> Sign up with Github</p>
      </a>
      <a href="#" class="login-btn facebook">
        <p>
          <i class="fa-brands fa-square-facebook"></i> Sign up with Facebook
        </p>
      </a>
      <form @submit.prevent="sign" class="formLogin relative">
        <div class="row">
          <label for="displayName">Display name</label>
          <input
            autofocus
            v-model="displayName"
            required
            type="text"
            name="displayName"
          />
        </div>
        <div class="row">
          <label for="email">Email</label>
          <input v-model="email" required type="email" name="email" />
        </div>
        <div class="row">
          <label for="password">Password</label>

          <input v-model="password" required type="password" name="password" />
        </div>
        <ul class="text-red-500 ml-3 text-sm mb-2" v-if="error">
          <li v-for="er in error.split(',')" :key="er">
            {{ er.charAt(0).toUpperCase() + er.slice(1) }}
          </li>
        </ul>

        <ul v-else class="text-gray-500 ml-3 text-sm mb-2">
          <li>6-25 characters</li>
          <li>At least one capital letter</li>
          <li>No spaces</li>
        </ul>
        <div class="row">
          <button v-if="isPending">...</button>

          <button v-else type="submit">Sign up</button>
        </div>
      </form>
      <p class="sign-up">
        Already have an account?
        <router-link to="/auth/login">Log in</router-link>
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
  height: 360px;
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
</style>
