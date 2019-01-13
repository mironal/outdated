import { listCommand, outdatedCommand } from "./npm"

test("command", () => {
  expect(listCommand(true)).toEqual("npm -g list --json --depth=0 || true")
  expect(listCommand(false)).toEqual("npm list --json --depth=0 || true")
  expect(outdatedCommand(true)).toEqual("npm -g outdated --json || true")
  expect(outdatedCommand(false)).toEqual("npm outdated --json || true")
})
