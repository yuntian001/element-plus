import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'
import VueMacros from 'unplugin-vue-macros/vite'
import esbuild from 'rollup-plugin-esbuild'
import { epRoot, pkgRoot } from '@element-plus/node-utils'
import type { Plugin } from 'vite'
import './vite.init'

const esbuildPlugin = (): Plugin => ({
  ...esbuild({
    target: 'chrome64',
    include: /\.vue$/,
    loaders: {
      '.vue': 'js',
    },
  }),
  enforce: 'post',
})

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: {
      alias: [
        {
          find: /^element-plus(\/(es|lib))?$/,
          replacement: path.resolve(epRoot, 'index.ts'),
        },
        {
          find: /^element-plus\/(es|lib)\/(.*)$/,
          replacement: `${pkgRoot}/$2`,
        },
      ],
    },
    server: {
      host: true,
      https: !!env.HTTPS,
    },
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue(),
          vueJsx: vueJsx(),
        },
      }),
      esbuildPlugin(),
      Components({
        include: `${__dirname}/**`,
        resolvers: ElementPlusResolver({ importStyle: 'sass' }),
        dts: false,
      }),
      mkcert(),
      Inspect(),
    ],

    esbuild: {
      target: 'chrome64',
    },
  }
})
