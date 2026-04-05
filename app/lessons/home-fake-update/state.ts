import { ref } from 'vue'

/** Виден ли попап (управляется из конфига через QA «Закрыть предупреждение»). */
export const popupVisible = ref(false)

export function resetFakeUpdateState() {
  popupVisible.value = false
}
