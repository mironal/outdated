import { ManagedContent, createContent } from "../types"

type StorageKey = "contents"

export const write = async (key: StorageKey, obj: unknown) => {
  const str = JSON.stringify(obj)
  localStorage.setItem(key, str)
  return Promise.resolve()
}

async function read<T>(key: StorageKey, defaultValue: T): Promise<T> {
  const str = localStorage.getItem(key)
  if (str) {
    return JSON.parse(str) as T
  }
  return defaultValue
}

export const fetchContent = async (): Promise<ManagedContent[]> =>
  read("contents", [
    createContent("homebrew", "Globals"),
    createContent("npm", "Globals"),
  ])
