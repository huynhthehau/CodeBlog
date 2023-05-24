import { instanceWithAccess } from "../configs/axios";
import { ref } from "vue";

const error = ref(null);
const isPending = ref(false);
async function deleteImage(id) {
  try {
    await instanceWithAccess.delete("/images/" + id);
  } catch (err) {
    error.value = err.response.data.message;
  }
}
export function useImages() {
  return { deleteImage };
}
