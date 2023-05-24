import { instance, instanceWithAccess } from "../configs/axios";
import { ref } from "vue";
const error = ref(null);
const isPending = ref(false);

async function getUser({ userId }) {
  isPending.value = true;
  error.value = null;
  try {
    const res = await instance.get("/users/" + userId);
    return res.data.data;
  } catch (err) {
    error.value = err.response.data.message;
  } finally {
    isPending.value = false;
  }
}

export function useUser() {
  return { error, isPending, getUser };
}
