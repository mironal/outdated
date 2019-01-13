import { runCommand } from "../exporsedFunc"
import { ExecOptions } from "child_process"
import * as PATH from "path"

const runBoolean = (
  command: string,
  opt: ExecOptions | undefined = undefined,
): Promise<boolean> =>
  runCommand(command, opt)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false))

export const testHomebrew = () => runBoolean("which brew")
export const testNpm = () => runBoolean("which npm")
export const testNpmPackageJson = (path: string) =>
  runBoolean(`test -f ${PATH.join(path, "package.json")}`)
