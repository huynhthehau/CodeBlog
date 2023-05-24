<script setup>
import { ref, onMounted } from "vue";
import { useRecovery } from "../composables/auth";
const { error, isPending, accountRecovery } = useRecovery();
const email = ref("");
async function recovery() {
  const res = await accountRecovery(email.value);
  error.value = res.msg;
}

onMounted(() => {
  error.value = null;
});
</script>
<template>
  <div class="body">
    <main>
      <form @submit.prevent="recovery" class="formLogin">
        <div class="row">
          <p>
            Forgot your account’s password? Enter your email address and we’ll
            send you a recovery link.
          </p>
        </div>
        <div class="row">
          <label for="email">Email</label>
          <input autofocus v-model="email" required type="email" name="email" />
        </div>
        <p class="error" v-if="error">{{ error }}</p>
        <div class="row mt-3">
          <button v-if="isPending">...</button>
          <button v-else type="submit">Send recovery email</button>
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
  height: 230px;
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
