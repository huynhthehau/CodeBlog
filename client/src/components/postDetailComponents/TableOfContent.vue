<script setup>
import { computed, onMounted, onUpdated, watch, ref } from "vue";
import TocList from "./TocList.vue";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import { useRoute } from "vue-router";

const slugify = slugifyWithCounter();

const headings = ref([]);

const groupHeadings = computed(() => {
  let items = [...headings.value];
  for (let i = items.length - 1; i >= 0; i--) {
    let currentItem = items[i];

    let parentItem = items.findLast((item, index) => {
      return item.level < currentItem.level && index < i;
    });

    if (parentItem) {
      parentItem.subheadings.unshift(currentItem);
      items.splice(i, 1);
    }
  }
  return items;
});

onUpdated(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (entry.intersectionRatio > 0) {
        document.getElementById(`span${id}`).classList.add("active");
      } else {
        document.getElementById(`span${id}`).classList.remove("active");
      }
    });
  });

  document
    .querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
    .forEach((section) => {
      observer.observe(section);
    });
});

onMounted(() => {
  setTimeout(() => {
    window.document
      .querySelector(".postContent")
      .querySelectorAll("h1,h2,h3")
      .forEach((el) => {
        let id = slugify(el.innerText);
        el.setAttribute("id", id);
        headings.value.push({
          id: id,
          level: parseInt(el.tagName.charAt(1), 10),
          content: el.innerText,
          subheadings: [],
        });
      });
  }, 1000);
});
</script>
<template>
  <div class="space-y-2">
    <h2 class="text-sm font-semibold tracking-widest uppercase text-gray-600">
      Table of contents
    </h2>
    <div v-if="groupHeadings.length" class="flex flex-col space-y-1">
      <TocList :items="groupHeadings"></TocList>
    </div>
    <div v-else class="text-sm px-3 py-2 bg-slate-200 rounded-sm text-gray-500">
      Have no Table of contents
    </div>
  </div>
</template>
