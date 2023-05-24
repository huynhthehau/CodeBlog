<script setup>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useComment } from "../../composables/comment";
import { ref } from "vue";
const { error, isPending, deleteComment } = useComment();
const store = useStore();
const route = useRoute();

const postId = ref(route.params.id);

const props = defineProps(["commentId", "limit", "postId"]);
const emit = defineEmits(["closeModal"]);
function closeModal(e) {
  if (!event.target.closest(".modal") || e == "btn") {
    emit("closeModal");
  }
}

async function editStatusOfPost() {
  const msg = await deleteComment(props.commentId);
  await store.dispatch("comments/setCurrent_page", {
    current_page: 1,
    limit: props.limit,
    postId: postId.value,
  });
  emit("closeModal");
}
</script>

<template>
  <div
    @click="closeModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-30"
  >
    <div class="relative w-full max-w-md max-h-full">
      <div class="modal relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button
          @click="closeModal('btn')"
          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
          data-modal-hide="popup-modal"
        >
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-6 text-center">
          <svg
            aria-hidden="true"
            class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this comment?
          </h3>
          <button
            data-modal-hide="popup-modal"
            type="button"
            @click="editStatusOfPost"
            class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          >
            Yes, I'm sure
          </button>
          <button
            @click="closeModal('btn')"
            data-modal-hide="popup-modal"
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
