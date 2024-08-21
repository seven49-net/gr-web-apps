<template>
  <footer class="footer" :class="{ configurator: !configurator }">
    @ {{ date }} Kanton Graubünden
  </footer>
</template>
<script setup>
defineProps({
  configurator: {
    default: () => false
  }
})
const date = new Date().getFullYear()
</script>
