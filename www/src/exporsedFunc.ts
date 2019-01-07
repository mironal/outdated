import { OutdatedResult } from "./types"
import { ExecOptions } from "child_process"

const win: any = window

export function runCommand(
  command: string,
  opt?: ExecOptions,
): Promise<{ stdout: string; stderr: string }> {
  if (win.runCommand) {
    return win.runCommand(command, opt)
  }
  console.warn("undefined runCommand function")
  return Promise.resolve({ stdout: "", stderr: "" })
}
