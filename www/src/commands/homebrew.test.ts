import {
  listCommand,
  outdatedCommand,
  parseOutdated,
  parseList,
} from "./homebrew"

test("command", () => {
  expect(listCommand).toEqual("brew list --versions")
  expect(outdatedCommand).toEqual("brew outdated -v")
})

test("parse list", () => {
  const leavesStdout = `
carthage
coreutils
curl
fzf
git
git-lfs
htop
jq
mint
neovim
rbenv
swiftlint
tree
wget
zsh
`

  const listStdout = `
autoconf 2.69
carthage 0.31.2
coreutils 8.30
curl 7.63.0
fzf 0.17.5
gettext 0.19.8.1
git 2.20.1
git-lfs 2.6.1
htop 2.2.0
jemalloc 5.1.0
jq 1.6
libidn2 2.0.5
libtermkey 0.20
libunistring 0.9.10
libuv 1.24.1
libvterm 681
luajit 2.0.5
mint 0.11.3
msgpack 3.1.1
ncurses 6.1
neovim 0.3.1
oniguruma 6.9.1
openssl 1.0.2q
pcre2 10.32
pkg-config 0.29.2
rbenv 1.1.1
ruby-build 20181207
swiftlint 0.29.1
tree 1.8.0
unibilium 2.0.0
wget 1.20
zsh 5.6.2_1
`

  const leaves = leavesStdout
    .split("\n")
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const list = listStdout
    .split("\n")
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const leavesVersions = list.filter(ls => leaves.some(l => ls.startsWith(l)))
  expect(leavesVersions.length).toBe(15)

  const versions = parseList(listStdout).filter(ls =>
    leaves.some(l => l === ls.name),
  )

  expect(versions).toEqual([
    { name: "carthage", current: "0.31.2" },
    { name: "coreutils", current: "8.30" },
    { name: "curl", current: "7.63.0" },
    { name: "fzf", current: "0.17.5" },
    { name: "git", current: "2.20.1" },
    { name: "git-lfs", current: "2.6.1" },
    { name: "htop", current: "2.2.0" },
    { name: "jq", current: "1.6" },
    { name: "mint", current: "0.11.3" },
    { name: "neovim", current: "0.3.1" },
    { name: "rbenv", current: "1.1.1" },
    { name: "swiftlint", current: "0.29.1" },
    { name: "tree", current: "1.8.0" },
    { name: "wget", current: "1.20" },
    { name: "zsh", current: "5.6.2_1" },
  ])
})

test("parse outdated", () => {
  const stdout = `
ruby-build (20181207) < 20181225
swiftlint (0.29.1) < 0.29.2
wget (1.20) < 1.20.1
`

  expect(parseOutdated(stdout)).toEqual([
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
