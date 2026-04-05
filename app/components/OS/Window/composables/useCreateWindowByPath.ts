import { useCreateAndRegisterWindow } from './useCreateAndRegisterWindow'
import type { FsFile } from '~~/shared/types/FsFile'

export async function useCreateWindowByPath(path: string) {
  let entity = undefined
  try {
    entity = await $fetch('/api/filesystem/get', {
      responseType: 'json',
      method: 'POST',
      body: {
        path
      }
    })
  } catch (err) {
    console.error(err)
  }

  if (!entity) {
    console.error('Не найдено по такому пути окна')
  }

  // Если с сервера пришёл полноценный FsFile — используем его; иначе — путь как строка
  const file =
    entity && typeof entity === 'object' && 'name' in entity && 'programType' in entity
      ? (entity as FsFile)
      : path

  try {
    useCreateAndRegisterWindow(file)
  } catch (e) {
    console.error(e)
  }

  return true
}
