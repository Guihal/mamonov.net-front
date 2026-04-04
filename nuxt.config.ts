export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],

  css: ['@/assets/css/main.css', '@/assets/scss/main.scss'],
  runtimeConfig: {
    public: {
      isBattleApi: false
    }
  },
  compatibilityDate: '2025-01-15',

  vite: {
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
