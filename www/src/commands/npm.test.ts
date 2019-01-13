import { listCommand, outdatedCommand } from "./npm"

test("command", () => {
  expect(listCommand(true)).toEqual("npm -g list --json || true")
  expect(listCommand(false)).toEqual("npm list --json || true")
  expect(outdatedCommand(true)).toEqual("npm -g outdated --json || true")
  expect(outdatedCommand(false)).toEqual("npm outdated --json || true")
})
