import { AppState, resolveGlobals } from "../types"

type StorageKey = "contents"

export const write = async (key: StorageKey, obj: unknown) => {
  const str = JSON.stringify(obj)
  localStorage.setItem(key, str)
  return Promise.resolve()
}

export async function read<T>(key: StorageKey, defaultValue: T): Promise<T> {
  const str = localStorage.getItem(key)
  if (str) {
    return JSON.parse(str) as T
  }
  return defaultValue
}

export async function initializeContents() {
  let contents: AppState["contents"] = await read("contents", [])

  if (contents.length === 0) {
    contents = await resolveGlobals()
  }

  return contents
}
