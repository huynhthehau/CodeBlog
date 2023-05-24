import { instance, instanceWithAccess } from "../configs/axios";
import { ref } from "vue";
const error = ref(null);
const isPending = ref(false);
async function follow(followingId) {
  try {
    const res = await instanceWithAccess.get("/follow_user/", {
      params: {
        userId: followingId,
      },
    });
    if (res.data.data) {
      await instanceWithAccess.delete("/follow_user", {
        data: {
          userId: followingId,
        },
      });
    } else {
      await instanceWithAccess.post("/follow_user", {
        userId: followingId,
      });
    }
  } catch (err) {
    error.value = err.response.data.message;
  }
}
export function useFollow() {
  return { follow };
}
