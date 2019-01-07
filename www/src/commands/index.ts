import * as homebrew from "./homebrew"
import * as npm from "./npm"
import { ManagedContent } from "../types"
import { runCommand } from "../exporsedFunc"

export { homebrew, npm }

export const runOutdated = async (
  content: ManagedContent,
  willRunCommand: (command: string) => void,
) => {
  if (content.manager === "homebrew") {
    const command = homebrew.command
    willRunCommand(command)
    return runCommand(command).then(out => {
      if (out.stderr.length > 0) {
        return Promise.reject(new Error(out.stderr))
      }
      return Promise.resolve(homebrew.parse(out.stdout))
    })
  } else if (content.manager === "npm") {
    const command = npm.command(content.path === null)
    willRunCommand(command)
    return runCommand(command, { cwd: content.path || "." }).then(out => {
      if (out.stderr.length > 0) {
        return Promise.reject(new Error(out.stderr))
      }
      return Promise.resolve(npm.parse(out.stdout))
    })
  }

  return Promise.reject(new Error(`${content.manager} is not supported yet`))
}
