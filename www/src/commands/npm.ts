export const command = (global: boolean) => {
  const builder = ["npm"]
  if (global === true) {
    builder.push("-g")
  }

  builder.push("outdated")
  builder.push("|| true") // avoid exit code 1

  return builder.join(" ")
}

export const parse = (str: string) => {
  const regexp = /^\s*([^\s\n]+)\s+([0-9\.]+)\s+(\S+)\s+(\S+).*$/gm
  let match
  const results = []
  // tslint:disable-next-line:no-conditional-assignment
  while ((match = regexp.exec(str)) != null) {
    const dep = {
      name: match[1],
      current: match[2],
      latest: match[4],
    }
    results.push(dep)
  }
  return results
}
