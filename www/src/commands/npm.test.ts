import { command, parse } from "./npm"

test("command", () => {
  expect(command(true)).toEqual("npm -g outdated || true")
  expect(command(false)).toEqual("npm outdated || true")
})

test("parse", () => {
  const stdout = `
    Package      Current   Wanted   Latest  Location
    glob          5.0.15   5.0.15    6.0.1  test-outdated-output
    nothingness    0.0.3      git      git  test-outdated-output
    npm            3.5.1    3.5.2    3.5.1  test-outdated-output
    npm            3.5.1    3.5.2    3.5.1
    local-dev      0.0.3   linked   linked  test-outdated-output
    once           1.3.2    1.3.3    1.3.3  test-outdated-output
    `
  expect(parse(stdout)).toEqual([
    {
      name: "glob",
      current: "5.0.15",
      latest: "6.0.1",
    },
    {
      name: "nothingness",
      current: "0.0.3",
      latest: "git",
    },
    {
      name: "npm",
      current: "3.5.1",
      latest: "3.5.1",
    },
    {
      name: "npm",
      current: "3.5.1",
      latest: "3.5.1",
    },
    {
      name: "local-dev",
      current: "0.0.3",
      latest: "linked",
    },
    {
      name: "once",
      current: "1.3.2",
      latest: "1.3.3",
    },
  ])
})
