import { getCalculatedBounds } from '~/composables/useWindowBounds'
import { debounce } from '~/components/OS/Window/utils/debounce'
import type { WindowOb } from '~/components/OS/Window/Window'
import * as htmlToImage from 'html-to-image'

const images = reactive<Record<string, string>>({})
const observers = new Map<string, MutationObserver>()

export const useFrameObserver = () => {
  const createObserver = (windowOb: WindowOb) => {
    if (observers.has(windowOb.id)) return

    const el = document.getElementById(`window-${windowOb.id}`)
    if (!el) return
    const wrapper = el.querySelector<HTMLElement>('.window__wrapper')
    if (!wrapper) return

    const calculated = getCalculatedBounds(windowOb.id)

    let generating = false
    const generateImage = debounce(async () => {
      if (generating) return
      generating = true
      try {
        images[windowOb.id] = await htmlToImage.toJpeg(wrapper, {
          width: calculated.width,
          height: calculated.height,
          quality: 0.7,
          skipFonts: true
        })
      } catch {
        // html-to-image может упасть на невидимых элементах
      } finally {
        generating = false
      }
    }, 500)

    const observer = new MutationObserver(() => generateImage())

    observer.observe(el, {
      childList: true,
      subtree: true
    })

    observers.set(windowOb.id, observer)
    generateImage()
  }

  const destroyObserver = (windowId: string) => {
    const observer = observers.get(windowId)
    if (observer) {
      observer.disconnect()
      observers.delete(windowId)
    }
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete images[windowId]
  }

  const getSrc = (windowId: string) => computed(() => images[windowId] ?? '')

  return { createObserver, destroyObserver, getSrc }
}
