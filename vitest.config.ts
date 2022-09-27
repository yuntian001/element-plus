import path from 'path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/vite'

export default defineConfig({
  resolve: {
    conditions: ['dev', 'main', 'module'],
  },
  plugins: [
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx(),
      },
    }) as any,
    {
      resolveId(id) {
        if (!id.startsWith('@element-plus/components')) return
        return id.replace(
          '@element-plus/components/src',
          path.resolve('packages/web/components/src')
        )
      },
    },
  ],
  optimizeDeps: {
    disabled: true,
  },
  test: {
    clearMocks: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
})
