export const command = "brew outdated -v"

export const parse = (str: string) => {
  const regexp = /^([^ \n]+) \(([0-9\.]+)\) < ([0-9.]+)$/gm
  let match

  const results = []
  // tslint:disable-next-line:no-conditional-assignment
  while ((match = regexp.exec(str)) !== null) {
    const dep = {
      name: match[1],
      current: match[2],
      latest: match[3],
    }
    results.push(dep)
  }
  return results
}
