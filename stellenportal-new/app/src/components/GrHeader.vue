<template>
  <header class="header" :class="{ configurator: !configurator }">
    <div class="branding">
      <span class="logo"
        ><img
          src="https://cdn.gr.ch/dev-redesign2016/images/logo.svg"
          alt="Kanton Graubünden" /></span
      >Kanton Graubünden Stellenportal
    </div>
  </header>
</template>
<script setup>
defineProps({
  configurator: {
    default: () => false
  }
})
</script>
