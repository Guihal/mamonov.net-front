import { PROGRAMS } from '~/utils/PROGRAMS'
import type { FsFile } from '~~/shared/types/FsFile'

export function useGetShortcut(fsFile: FsFile) {
  const isRegisteredFile = Object.hasOwn(PROGRAMS, fsFile.programType)

  const icon = !isRegisteredFile ? null : PROGRAMS[fsFile.programType]?.icon
  const extention = !isRegisteredFile
    ? null
    : ((PROGRAMS[fsFile.programType] as { extension?: string })?.extension ?? null)

  let nameText = fsFile.name

  if (extention) {
    nameText += `.${extention}`
  }

  return {
    isRegisteredFile,
    icon,
    extention,
    nameText
  }
}
