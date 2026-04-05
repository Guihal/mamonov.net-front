console.log(process.env.NUXT_PUBLIC_IS_BATTLE_API)
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  css: ['@/assets/css/main.css', '@/assets/scss/main.scss'],
  runtimeConfig: {
    public: {
      isBattleApi: process.env.NUXT_PUBLIC_IS_BATTLE_API
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
