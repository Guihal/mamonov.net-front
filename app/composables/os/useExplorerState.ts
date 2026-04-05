import type { FolderConfig, FileEntryConfig, ExplorerEvents } from '~/types/programs'

/** Базовая файловая система (всегда доступна) */
const BASE_FILESYSTEM: FolderConfig = {
  name: 'Компьютер',
  children: [
    {
      name: 'Рабочий стол',
      children: []
    },
    {
      name: 'Документы',
      children: [
        {
          name: 'Проекты',
          children: []
        }
      ]
    },
    {
      name: 'Загрузки',
      children: []
    },
    {
      name: 'Изображения',
      children: []
    }
  ]
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function findFolder(root: FolderConfig, pathSegments: string[]): FolderConfig | null {
  if (pathSegments.length === 0) return root
  const [head, ...rest] = pathSegments
  const child = root.children.find((c): c is FolderConfig => 'children' in c && c.name === head)
  if (!child) return null
  return findFolder(child, rest)
}

export function useExplorerState(events?: ExplorerEvents) {
  const filesystem = ref<FolderConfig>(deepClone(BASE_FILESYSTEM))

  /** Текущий путь как массив имён папок (от корня) */
  const currentPath = ref<string[]>([])

  /** Текущая папка */
  const currentFolder = computed<FolderConfig | null>(() => {
    return findFolder(filesystem.value, currentPath.value)
  })

  /** Дети текущей папки */
  const currentChildren = computed(() => currentFolder.value?.children ?? [])

  /** Папки среди детей */
  const currentFolders = computed(() =>
    currentChildren.value.filter((c): c is FolderConfig => 'children' in c)
  )

  /** Файлы среди детей */
  const currentFiles = computed(() =>
    currentChildren.value.filter((c): c is FileEntryConfig => !('children' in c))
  )

  const openFolder = (name: string) => {
    currentPath.value = [...currentPath.value, name]
    const pathStr = '/' + currentPath.value.join('/')
    events?.onFolderOpen?.(pathStr)
  }

  const navigateTo = (pathArray: string[]) => {
    currentPath.value = [...pathArray]
  }

  const goBack = () => {
    if (currentPath.value.length === 0) return
    currentPath.value = currentPath.value.slice(0, -1)
  }

  const openFile = (file: FileEntryConfig) => {
    const pathStr = '/' + [...currentPath.value, file.name].join('/')
    events?.onFileOpen?.(pathStr, file)
    file.onOpen?.()
  }

  /**
   * Урок расширяет файловую систему, добавляя файлы/папки в указанную папку.
   * @param targetPath — путь к папке (массив имён), [] = корень
   * @param items — элементы для добавления
   */
  const addFiles = (targetPath: string[], items: (FolderConfig | FileEntryConfig)[]) => {
    const folder = findFolder(filesystem.value, targetPath)
    if (!folder) {
      console.warn('[useExplorerState] addFiles: папка не найдена', targetPath)
      return
    }
    folder.children.push(...items)
  }

  return {
    filesystem,
    currentPath,
    currentFolder,
    currentFolders,
    currentFiles,
    openFolder,
    navigateTo,
    goBack,
    openFile,
    addFiles
  }
}
