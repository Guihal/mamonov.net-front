const lastPushedPath = ref<string | null>(null)

interface QueueItem {
  path: string
  resolve: () => void
}

const pushQueue = ref<QueueItem[]>([])
let isProcessing = false

export function useQueuedRouter() {
  const router = useRouter()
  const route = useRoute()

  const isQueueEmpty = computed(() => pushQueue.value.length === 0)

  const processQueue = async () => {
    if (isProcessing || pushQueue.value.length === 0) return

    isProcessing = true
    const item = pushQueue.value.shift()!

    try {
      if (item.path !== lastPushedPath.value && item.path !== route.path) {
        lastPushedPath.value = item.path
        await router.push(item.path)
      }
    } finally {
      item.resolve()
      isProcessing = false

      if (pushQueue.value.length > 0) {
        processQueue()
      }
    }
  }

  const queuedPush = (path: string): Promise<void> => {
    return new Promise((resolve) => {
      pushQueue.value.push({ path, resolve })
      processQueue()
    })
  }

  return { queuedPush, lastPushedPath, isQueueEmpty }
}
