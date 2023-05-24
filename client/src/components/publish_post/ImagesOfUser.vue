<script setup>
import { ref } from "vue";
import { URL_IMG } from "../../constants/index";
import { useImages } from "../../composables/images";
const { deleteImage } = useImages();
const props = defineProps(["img"]);
const emit = defineEmits(["submitImageFunc", "deleteImages"]);
const isShow = ref(false);
</script>
<template>
  <div class="relative" @mouseleave="isShow = false" @mousemove="isShow = true">
    <img
      :src="URL_IMG + img.name"
      @click="$emit('submitImageFunc', img.name)"
      alt="#"
    />
    <button
      v-if="isShow"
      class="close-btn"
      @click="deleteImage(img._id), $emit('deleteImages')"
      title="Remove this image"
    >
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
</template>
<style scoped>
.modal .close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #ebebeb;
  cursor: pointer;
}
.modal .close-btn i {
  font-size: 20px;
  color: #666;
  margin: auto;
}
.modal .close-btn:hover {
  background: #fff;
}
</style>
