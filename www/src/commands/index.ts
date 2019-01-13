import * as homebrew from "./homebrew"
import * as npm from "./npm"
import { ManagedContent, OutdatedResult } from "../types"
import { runCommand } from "../exporsedFunc"
import { ExecOptions } from "child_process"

export { homebrew, npm }

export interface Runner {
  command: string
  opt?: ExecOptions
  parse(str: string): OutdatedResult[]
}
export const buildRunner = (
  content: ManagedContent,
  type: "outdated" | "list",
): Runner => {
  if (content.manager === "homebrew") {
    return {
      command:
        type === "list" ? homebrew.listCommand : homebrew.outdatedCommand,
      parse: type === "list" ? homebrew.parseList : homebrew.parseOutdated,
    }
  } else if (content.manager === "npm") {
    const global = content.path === "Globals"
    const cwd = content.path === "Globals" ? undefined : content.path
    return {
      command:
        type === "list" ? npm.listCommand(global) : npm.outdatedCommand(global),
      parse: type === "list" ? npm.parseList : npm.parseOutdated,
      opt: { cwd, maxBuffer: 1024 * 1024 },
    }
  }

  throw new Error(`${type} ${content.manager} is not supported yet`)
}

export const run = (runner: Runner) => {
  return runCommand(runner.command, runner.opt).then(out => {
    if (out.stderr.length > 0) {
      return Promise.reject(new Error(out.stderr))
    }
    return Promise.resolve(runner.parse(out.stdout))
  })
}

export const merge = (list: OutdatedResult[], outdated: OutdatedResult[]) => {
  return [...list, ...outdated]
    .reduce(
      (rs, r) => {
        const index = rs.findIndex(elem => elem.name === r.name)
        if (index > -1) {
          rs[index] = r
        } else {
          rs.push(r)
        }

        return rs
      },
      [] as OutdatedResult[],
    )
    .map(r => {
      return {
        name: r.name,
        current: r.current,
        latest: r.latest || r.current,
        wanted: r.wanted || r.current,
      }
    })
}
