<script setup lang="ts">
import type { LessonConfig } from '~/types/lesson'
import type { BrowserEvents } from '~/types/programs'
import { useBrowserSites } from '~/composables/os/useBrowserSites'
import { useBrowserTabs } from '~/composables/os/useBrowserTabs'
import { useBrowserBookmarks } from '~/composables/os/useBrowserBookmarks'

const lessonConfig = inject<LessonConfig | null>('lessonConfig', null)
const browserEvents = inject<BrowserEvents | null>('browserEvents', null) ?? {}
const registerOpenBrowserTab = inject<((fn: (url: string) => void) => void) | null>(
  'registerOpenBrowserTab',
  null
)

const sites = useBrowserSites()
const tabs = useBrowserTabs(sites, browserEvents)
const bookmarks = useBrowserBookmarks()

if (lessonConfig?.browserSites) sites.registerSites(lessonConfig.browserSites)
if (lessonConfig?.browserBookmarks) bookmarks.addBookmarks(lessonConfig.browserBookmarks)

// Регистрируем openTab для gameController, чтобы config мог открывать вкладки
registerOpenBrowserTab?.(tabs.openTab)

// Открываем стартовый сайт, если он задан в конфиге
const startUrl = lessonConfig?.browserSites?.[0]?.url
tabs.openTab(startUrl)

provide('browserTabs', tabs)
provide('browserSites', sites)
provide('browserBookmarks', bookmarks)
provide('browserEvents', browserEvents)
</script>

<template>
  <div class="browser">
    <OSProgramsBrowserTabBar />
    <OSProgramsBrowserAddressBar />
    <OSProgramsBrowserBookmarksBar />
    <OSProgramsBrowserPageView />
  </div>
</template>

<style lang="scss">
.browser {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
