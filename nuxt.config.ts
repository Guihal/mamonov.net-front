console.log(process.env.NUXT_PUBLIC_IS_BATTLE_API)
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  css: ['@/assets/css/main.css', '@/assets/scss/main.scss'],
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://localhost:8080',
    public: {
      isBattleApi: process.env.NUXT_PUBLIC_IS_BATTLE_API
    }
  },
  compatibilityDate: '2025-01-15',

  routeRules: {
    '/app/categories/*/*': { ssr: false }
  },

  nitro: {
    devProxy: {
      '/auth': { target: 'http://localhost:8080/auth', changeOrigin: true },
      '/categories': { target: 'http://localhost:8080/categories', changeOrigin: true },
      '/lessons': { target: 'http://localhost:8080/lessons', changeOrigin: true },
      '/hp': { target: 'http://localhost:8080/hp', changeOrigin: true },
      '/progress': { target: 'http://localhost:8080/progress', changeOrigin: true }
    }
  },

  vite: {
    optimizeDeps: {
      include: ['zod']
    },
    css: {
      preprocessorMaxWorkers: true,
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/globals.scss" as *;'
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
