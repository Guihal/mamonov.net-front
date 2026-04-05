import type { BookmarkConfig } from '~/types/programs'

const BASE_BOOKMARKS: BookmarkConfig[] = [
  {
    label: 'Проверка URL',
    url: 'tools://url-checker',
    icon: 'i-lucide-shield-check'
  },
  {
    label: 'Проверка файлов',
    url: 'tools://file-checker',
    icon: 'i-lucide-file-search'
  },
  {
    label: 'Корп. портал',
    url: 'corp://portal',
    icon: 'i-lucide-building'
  }
]

export function useBrowserBookmarks() {
  const extraBookmarks = ref<BookmarkConfig[]>([])

  const allBookmarks = computed<BookmarkConfig[]>(() => [
    ...BASE_BOOKMARKS,
    ...extraBookmarks.value
  ])

  const addBookmarks = (items: BookmarkConfig[]) => {
    extraBookmarks.value.push(...items)
  }

  return {
    allBookmarks,
    addBookmarks
  }
}
