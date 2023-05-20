import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const env = loadEnv('', process.cwd())

export default defineConfig({
  plugins: [vue({
		template: {
			compilerOptions: {
				isCustomElement: (tag) => tag.startsWith('swiper-')
			}
		}
	})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
	server: {
		proxy: {
			'/api': {
				target: env.VITE_API_URL,
				changeOrigin: true
			}
		}
	}
})
