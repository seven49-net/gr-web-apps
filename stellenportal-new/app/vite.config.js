import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginEntryInject from 'vite-plugin-entry-inject'

// https://vitejs.dev/config/
/*
export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      base: '/',
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      }
    }
  } else {
    return {
      plugins: [vue()],
      base: 'https://cdn.gr.ch/apps/int/stellenportal-test/',
      resolve: {
        alias: {
          '@': fileURLToPath(new URL(',/src', import.meta.url))
        }
      }
    }
  }
})
*/

export default defineConfig({
  plugins: [
    vue(),
    VitePluginEntryInject({
      // head-prepend/head/body-prepend/body
      injectTo: 'body'
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
