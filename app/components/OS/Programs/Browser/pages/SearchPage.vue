<script setup lang="ts">
import type { BrowserEvents } from '~/types/programs'
import type { useBrowserTabs } from '~/composables/os/useBrowserTabs'

const { navigateTo } = inject('browserTabs') as ReturnType<typeof useBrowserTabs>
const browserEvents = inject<BrowserEvents>('browserEvents', {})

const query = ref('')
const hasSearched = ref(false)

interface SearchResult {
  title: string
  url: string
  description: string
}

const mockResults: SearchResult[] = [
  {
    title: 'Корпоративный портал — Главная',
    url: 'corp://portal',
    description: 'Официальный портал компании. Объявления, контакты, документы.'
  },
  {
    title: 'Проверка URL на безопасность',
    url: 'tools://url-checker',
    description: 'Онлайн-сервис проверки ссылок на фишинг и вредоносное ПО.'
  },
  {
    title: 'Проверка файлов на вирусы',
    url: 'tools://file-checker',
    description: 'Загрузите файл для анализа на вредоносный код.'
  }
]

const results = ref<SearchResult[]>([])

function onSearch() {
  if (!query.value.trim()) return
  hasSearched.value = true
  browserEvents.onFormSubmit?.('search://home', { query: query.value })
  results.value = mockResults.filter(
    (r) =>
      r.title.toLowerCase().includes(query.value.toLowerCase()) ||
      r.description.toLowerCase().includes(query.value.toLowerCase())
  )
  if (results.value.length === 0) {
    results.value = mockResults
  }
}

function openResult(url: string) {
  navigateTo(url)
}
</script>

<template>
  <div class="search-page">
    <div v-if="!hasSearched" class="search-page__hero">
      <h1 class="search-page__logo">Поиск</h1>
      <div class="search-page__form">
        <UInput
          v-model="query"
          size="lg"
          placeholder="Введите запрос..."
          class="search-page__input"
          @keydown.enter="onSearch"
        />
        <UButton size="lg" @click="onSearch"> Найти </UButton>
      </div>
    </div>
    <div v-else class="search-page__results">
      <div class="search-page__results-header">
        <UInput
          v-model="query"
          size="sm"
          class="search-page__results-input"
          @keydown.enter="onSearch"
        />
        <UButton size="sm" @click="onSearch"> Найти </UButton>
      </div>
      <div class="search-page__results-list">
        <div
          v-for="result in results"
          :key="result.url"
          class="search-page__result"
          @click="openResult(result.url)"
        >
          <div class="search-page__result-url">{{ result.url }}</div>
          <div class="search-page__result-title">{{ result.title }}</div>
          <div class="search-page__result-desc">{{ result.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.search-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  &__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 24px;
  }

  &__logo {
    font-size: 48px;
    font-weight: 700;
    color: #4285f4;
    user-select: none;
  }

  &__form {
    display: flex;
    gap: 8px;
    width: 100%;
    max-width: 500px;
    padding: 0 16px;
  }

  &__input {
    flex: 1;
  }

  &__results {
    padding: 16px;
  }

  &__results-header {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    max-width: 500px;
  }

  &__results-input {
    flex: 1;
  }

  &__results-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 600px;
  }

  &__result {
    cursor: pointer;

    &:hover .search-page__result-title {
      text-decoration: underline;
    }
  }

  &__result-url {
    font-size: 12px;
    color: #202124;
    margin-bottom: 2px;
  }

  &__result-title {
    font-size: 18px;
    color: #1a0dab;
    margin-bottom: 4px;
  }

  &__result-desc {
    font-size: 13px;
    color: #4d5156;
    line-height: 1.4;
  }
}
</style>
