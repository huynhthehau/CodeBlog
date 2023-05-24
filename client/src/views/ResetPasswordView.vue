<script setup>
import { useRoute, useRouter, onMounted } from "vue-router";
import { useResetPassword } from "../composables/auth";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();
const newPassword = ref("");
const confirmPassword = ref("");
const { error, isPending, resetPassword } = useResetPassword();
const token = ref(route.query.token);

async function resetPasswordSubmit() {
  const data = await resetPassword(
    newPassword.value,
    confirmPassword.value,
    token.value
  );
  if (data.message) {
    router.push({
      name: "login",
      query: {
        successForm: "Password changed!",
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
    <main class="min-h-fit">
      <form @submit.prevent="resetPasswordSubmit()" class="formLogin">
        <div class="row">
          <p>Please enter a new password!</p>
        </div>
        <div class="row">
          <label for="newPassword">Password</label>
          <input
            autofocus
            required
            type="password"
            v-model="newPassword"
            name="newPassword"
          />
        </div>
        <div class="row">
          <label for="confirmPassword">Confirm</label>
          <input
            autofocus
            required
            type="password"
            v-model="confirmPassword"
            name="confirmPassword"
          />
        </div>
        <p class="error" v-if="error">{{ error }}</p>
        <ul v-else class="text-gray-500 ml-3 text-sm mb-2">
          <li>6-25 characters</li>
          <li>At least one capital letter</li>
          <li>No spaces</li>
        </ul>
        <div class="row">
          <button v-if="isPending">...</button>
          <button v-else type="submit">Reset password</button>
        </div>
      </form>
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
  justify-content: space-around;
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
  height: 300px;
  max-height: fit-content;
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
