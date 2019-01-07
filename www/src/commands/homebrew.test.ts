import { command, parse } from "./homebrew"

test("command", () => {
  expect(command).toEqual("brew outdated -v")
})

test("parse", () => {
  const stdout = `
ruby-build (20181207) < 20181225
swiftlint (0.29.1) < 0.29.2
wget (1.20) < 1.20.1
`

  expect(parse(stdout)).toEqual([
    {
      name: "ruby-build",
      current: "20181207",
      latest: "20181225",
    },
    {
      name: "swiftlint",
      current: "0.29.1",
      latest: "0.29.2",
    },
    {
      name: "wget",
      current: "1.20",
      latest: "1.20.1",
    },
  ])
})
