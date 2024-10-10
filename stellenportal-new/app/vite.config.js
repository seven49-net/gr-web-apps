import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import VitePluginEntryInject from 'vite-plugin-entry-inject'

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
    vitePluginEntryInject({
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

function vitePluginEntryInject(config) {
  return {
    name: 'rollup-plugin-entry-inject',
    transformIndexHtml(html, ctx) {
      const { injectTo = 'body' } = config

      let script = ''

      if (ctx.chunk) {
        html = html.replace(
          new RegExp('<script[^<>]+' + ctx.chunk.fileName + '[^<>]+></script>'),
          (match) => {
            script = match

            return ''
          }
        )

        const injectMap = {
          head: {
            tag: '</head>',
            template: `${script}</head>`
          },
          'head-prepend': {
            tag: '<head>',
            template: `<head>${script}`
          },
          body: {
            tag: '</body>',
            template: `${script}</body>`
          },
          'body-prepend': {
            tag: '<body>',
            template: `<body>${script}`
          }
        }

        html = html.replace(injectMap[injectTo].tag, injectMap[injectTo].template)
        const coPat = /crossorigin/g
        html = html.replace(coPat, '')
      }

      return html
    }
  }
}
