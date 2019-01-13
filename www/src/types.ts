export type PackageManager = "npm" | "homebrew"

export type Cwd = "Globals" | string

export interface ManagedContent {
  path: string // Globals is special string
  manager: PackageManager
}

export const createContent = (
  manager: PackageManager,
  path: string,
): ManagedContent => {
  return {
    path,
    manager,
  }
}

export const managerKey = (mc: ManagedContent) => `${mc.path}-${mc.manager}`

export const resolveGlobals = () => {
  return Promise.resolve([
    createContent("homebrew", "Globals"),
    createContent("npm", "Globals"),
  ])
}

export interface OutdatedResult {
  name: string
  current: string
  latest?: string
  wanted?: string
}

export interface ContentFetchResult {
  results?: OutdatedResult[]
  error?: Error
}

export interface GroupedManagedContent {
  path: ManagedContent["path"]
  pkgManagers: PackageManager[]
}

export interface LogEntry {
  timestamp: number
  level: "error" | "log"
  msg: string
}

export interface AppState {
  logs: LogEntry[]
  contents: ManagedContent[]
  fetchResult: { [uuid: string]: ContentFetchResult }
  activeManagerKey: string
  commandRunning: boolean
}

export const groupedManagedContents = (
  contents: ManagedContent[],
): GroupedManagedContent[] => {
  return contents.reduce(
    (results, current) => {
      const c = results.find(r => r.path === current.path)
      if (c) {
        c.pkgManagers.push(current.manager)
      } else {
        const content: GroupedManagedContent = {
          path: current.path,
          pkgManagers: [current.manager],
        }
        results.push(content)
      }
      return results
    },
    [] as GroupedManagedContent[],
  )
}
