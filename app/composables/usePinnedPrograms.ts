import type { ProgramType } from '~~/shared/types/Program'

/**
 * Глобальный список закреплённых программ для текущего урока.
 * Устанавливается из конфига урока перед монтированием OS.
 */
const pinnedPrograms: Ref<ProgramType[]> = ref([])

export const usePinnedPrograms = () => {
  const setPinnedPrograms = (programs: ProgramType[]) => {
    pinnedPrograms.value = programs
  }

  const clearPinnedPrograms = () => {
    pinnedPrograms.value = []
  }

  return { pinnedPrograms, setPinnedPrograms, clearPinnedPrograms }
}
