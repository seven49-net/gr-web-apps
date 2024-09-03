<script setup>
import { RouterView, useRoute } from 'vue-router'

import GrFooter from './components/GrFooter.vue'
import GrHeader from './components/GrHeader.vue'
import { standalone } from './stores/standalone'
</script>

<template>
  <div class="page-container">
    <GrHeader :configurator="standalone.state" />
    <div class="container" :class="{ standalone: standalone.state }">
      <RouterView />
    </div>
    <gr-footer :configurator="standalone.state" />
  </div>
</template>
