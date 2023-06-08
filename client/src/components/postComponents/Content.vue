<script setup>
const props = defineProps(["content"]);
</script>
<template>
  <section class="main-wrapper">
    <div v-html="content"></div>
  </section>
</template>
<style scoped>
/* Basic CSS file without reset */
section {
  font-size: 16px;
  line-height: 1.5;
}
.main-wrapper :deep() .ql-syntax {
  margin: 1em 0;
  background-color: #f1f2f3;
  border: 1px solid #e5e5e5;
  padding: 1em;
  overflow: auto;
  border-radius: 3px;
}

.main-wrapper :deep() code {
  padding: 1px 3px;
  border-radius: 3px;
}
.main-wrapper :deep() h1 {
  font-weight: bold;
  margin-bottom: 0.7rem;
  font-size: 1.5rem;
}

.main-wrapper :deep() h2,
h3,
h4,
h5,
h6 {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.main-wrapper :deep() p {
  margin-bottom: 0.2rem;
}
.main-wrapper :deep() a {
  color: #007bff;
  text-decoration: none;
}

.main-wrapper :deep() ul {
  list-style-type: disc;
  margin-left: 2rem;

  margin-bottom: 1rem;
}
.main-wrapper :deep() ol {
  list-style-type: decimal;
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.main-wrapper :deep() li {
  margin-bottom: 0.5rem;
}

.main-wrapper :deep() img {
  max-width: 100%;
  height: auto;
}
.main-wrapper :deep() blockquote {
  margin: 0 0 0.5rem;
  padding: 0.5rem 1rem;
  color: #666;
  border-left: 5px solid #ccc;
}
</style>

<!-- <style scoped>
.main-wrapper >>> p {
  color: red;
}
</style> -->
