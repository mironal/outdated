export type PackageManager = "npm" | "homebrew"

export type Cwd = "Globals" | string

export interface ManagedContent {
  uuid: string // unique string id
  path: string | null
  manager: PackageManager
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
  contents: Pick<ManagedContent, "uuid" | "manager">[]
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
}

export const groupedManagedContents = (
  contents: ManagedContent[],
): GroupedManagedContent[] => {
  return contents.reduce(
    (results, current) => {
      const c = results.find(c => c.path === current.path)
      if (c) {
        c.contents.push({
          uuid: current.uuid,
          manager: current.manager,
        })
      } else {
        const content: GroupedManagedContent = {
          path: current.path,
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
