<template>
  <footer class="footer" :class="{ configurator: !configurator }">@2020 Kanton Graubünden</footer>
</template>
<script setup>
defineProps({
  configurator: {
    default: () => false
  }
})
</script>
