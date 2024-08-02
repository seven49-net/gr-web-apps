<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import GrFooter from './components/GrFooter.vue'
import GrHeader from './components/GrHeader.vue'
</script>

<template>
  <div class="page-container">
    <GrHeader />
    <div class="container">
      <RouterView />
    </div>
    <gr-footer />
  </div>
</template>
