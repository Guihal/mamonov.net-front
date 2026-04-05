<script setup lang="ts">
import type { ExplorerConfig } from '~/types/programs'
import { useExplorerState } from '~/composables/os/useExplorerState'

/**
 * Конфиг Explorer инжектируется уроком через provide('explorerConfig', config).
 * Если конфиг не предоставлен — Explorer работает с базовой файловой системой.
 */
const explorerConfig = inject<ExplorerConfig>('explorerConfig', {})

const { filesystem, currentPath, currentFolders, currentFiles, openFolder, openFile, navigateTo } =
  useExplorerState(explorerConfig.events)

// Если урок передал rootFolder — добавляем его содержимое в корень
if (explorerConfig.rootFolder) {
  for (const item of explorerConfig.rootFolder.children) {
    filesystem.value.children.push(item)
  }
}
</script>

<template>
  <div class="explorer">
    <OSProgramsExplorerExplorerSidebar
      :root="filesystem"
      :current-path="currentPath"
      @navigate-to="navigateTo"
    />
    <div class="explorer__main">
      <OSProgramsExplorerExplorerBreadcrumbs
        :root-name="filesystem.name"
        :current-path="currentPath"
        @navigate-to="navigateTo"
      />
      <OSProgramsExplorerFileGrid
        :folders="currentFolders"
        :files="currentFiles"
        @open-folder="openFolder"
        @open-file="openFile"
      />
    </div>
  </div>
</template>

<style lang="scss">
.explorer {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }
}
</style>
