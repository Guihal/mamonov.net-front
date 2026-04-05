import type { BrowserEvents } from '~/types/programs'
import type { useBrowserSites } from '~/composables/os/useBrowserSites'

export interface BrowserTab {
  id: string
  url: string
  title: string
  favicon?: string
  history: string[]
  historyIndex: number
}

let tabIdCounter = 0
function nextTabId(): string {
  return `tab-${++tabIdCounter}`
}

export function useBrowserTabs(sites: ReturnType<typeof useBrowserSites>, events?: BrowserEvents) {
  const DEFAULT_URL = 'search://home'

  const tabs = ref<BrowserTab[]>([])
  const activeTabId = ref<string>('')

  const activeTab = computed(() => tabs.value.find((t) => t.id === activeTabId.value) ?? null)

  const activeTabIndex = computed(() => tabs.value.findIndex((t) => t.id === activeTabId.value))

  const canGoBack = computed(() => {
    const tab = activeTab.value
    if (!tab) return false
    return tab.historyIndex > 0
  })

  const canGoForward = computed(() => {
    const tab = activeTab.value
    if (!tab) return false
    return tab.historyIndex < tab.history.length - 1
  })

  function resolveTitle(url: string): string {
    const site = sites.resolve(url)
    return site?.title ?? url
  }

  function resolveFavicon(url: string): string | undefined {
    const site = sites.resolve(url)
    return site?.favicon
  }

  function openTab(url?: string) {
    const tabUrl = url ?? DEFAULT_URL
    const tab: BrowserTab = {
      id: nextTabId(),
      url: tabUrl,
      title: resolveTitle(tabUrl),
      favicon: resolveFavicon(tabUrl),
      history: [tabUrl],
      historyIndex: 0
    }
    tabs.value.push(tab)
    activeTabId.value = tab.id
    events?.onTabOpen?.(tabUrl)
  }

  function closeTab(id: string) {
    const idx = tabs.value.findIndex((t) => t.id === id)
    if (idx === -1) return

    const closedTab = tabs.value[idx]!
    events?.onTabClose?.(closedTab.url)

    tabs.value.splice(idx, 1)

    if (tabs.value.length === 0) return

    if (activeTabId.value === id) {
      const newIdx = Math.min(idx, tabs.value.length - 1)
      activeTabId.value = tabs.value[newIdx]!.id
    }
  }

  function setActiveTab(id: string) {
    activeTabId.value = id
  }

  function navigateTo(url: string) {
    const tab = activeTab.value
    if (!tab) return

    tab.history = tab.history.slice(0, tab.historyIndex + 1)
    tab.history.push(url)
    tab.historyIndex = tab.history.length - 1

    tab.url = url
    tab.title = resolveTitle(url)
    tab.favicon = resolveFavicon(url)

    events?.onUrlNavigate?.(url)
  }

  function goBack() {
    const tab = activeTab.value
    if (!tab || tab.historyIndex <= 0) return

    tab.historyIndex--
    const url = tab.history[tab.historyIndex]!
    tab.url = url
    tab.title = resolveTitle(url)
    tab.favicon = resolveFavicon(url)
  }

  function goForward() {
    const tab = activeTab.value
    if (!tab || tab.historyIndex >= tab.history.length - 1) return

    tab.historyIndex++
    const url = tab.history[tab.historyIndex]!
    tab.url = url
    tab.title = resolveTitle(url)
    tab.favicon = resolveFavicon(url)
  }

  // Открываем первую вкладку
  openTab()

  return {
    tabs,
    activeTabId,
    activeTab,
    activeTabIndex,
    canGoBack,
    canGoForward,
    openTab,
    closeTab,
    setActiveTab,
    navigateTo,
    goBack,
    goForward
  }
}
