import { v4 as uuid } from "uuid"

export type PackageManager = "npm" | "homebrew"

export type Cwd = "Globals" | string

export interface ManagedContent {
  uuid: string // unique string id
  path: string | null
  manager: PackageManager
}

export const createContent = (
  manager: PackageManager,
  path: string | null,
): ManagedContent => {
  return {
    uuid: uuid(),
    path,
    manager,
  }
}

export interface OutdatedResult {
  name: string
  current: string
  latest: string
}

export interface ContentFetchResult {
  results?: OutdatedResult[]
  error?: Error
}

export interface GroupedManagedContent {
  path: ManagedContent["path"]
  contents: Array<Pick<ManagedContent, "uuid" | "manager">>
}

export interface LogEntry {
  timestamp: Date
  level: "error" | "log"
  msg: string
}

export interface AppState {
  logs: LogEntry[]
  contents: ManagedContent[]
  fetchResult: { [uuid: string]: ContentFetchResult }
  activeManagerUUID: string
  commandRunning: boolean
}

export const groupedManagedContents = (
  contents: ManagedContent[],
): GroupedManagedContent[] => {
  const displayPath = (path: string | null) => (path == null ? "Globals" : path)

  return contents.reduce(
    (results, current) => {
      const c = results.find(
        r => displayPath(r.path) === displayPath(current.path),
      )
      if (c) {
        c.contents.push({
          uuid: current.uuid,
          manager: current.manager,
        })
      } else {
        const content: GroupedManagedContent = {
          path: displayPath(current.path),
          contents: [
            {
              uuid: current.uuid,
              manager: current.manager,
            },
          ],
        }
        results.push(content)
      }
      return results
    },
    [] as GroupedManagedContent[],
  )
}
