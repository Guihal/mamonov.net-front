import type { BrowserSiteConfig } from '~/types/programs'
import { defineAsyncComponent } from 'vue'

const BASE_SITES: BrowserSiteConfig[] = [
  {
    url: 'search://home',
    title: 'Поиск',
    component: defineAsyncComponent(
      () => import('~/components/OS/Programs/Browser/pages/SearchPage.vue')
    )
  },
  {
    url: 'tools://url-checker',
    title: 'Проверка URL',
    component: defineAsyncComponent(
      () => import('~/components/OS/Programs/Browser/pages/UrlChecker.vue')
    ),
    favicon: 'i-lucide-shield-check'
  },
  {
    url: 'tools://file-checker',
    title: 'Проверка файлов',
    component: defineAsyncComponent(
      () => import('~/components/OS/Programs/Browser/pages/FileChecker.vue')
    ),
    favicon: 'i-lucide-file-search'
  },
  {
    url: 'corp://portal',
    title: 'Корпоративный портал',
    component: defineAsyncComponent(
      () => import('~/components/OS/Programs/Browser/pages/CorpPortal.vue')
    ),
    favicon: 'i-lucide-building'
  }
]

export function useBrowserSites() {
  const sitesMap = new Map<string, BrowserSiteConfig>()

  for (const site of BASE_SITES) {
    sitesMap.set(site.url, site)
  }

  const resolve = (url: string): BrowserSiteConfig | null => {
    return sitesMap.get(url) ?? null
  }

  const registerSites = (sites: BrowserSiteConfig[]) => {
    for (const site of sites) {
      sitesMap.set(site.url, site)
    }
  }

  const allSites = computed(() => [...sitesMap.values()])

  return {
    resolve,
    registerSites,
    allSites
  }
}
