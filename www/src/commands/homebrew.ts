export const command = "brew outdated -v"

export const parse = (str: string) => {
  const regexp = /^([^ \n]+) \(([0-9\.]+)\) < ([0-9.]+)$/gm
  let match

  /** @type {{name: string; current: string; latest: string}[]} */
  const results = []
  while ((match = regexp.exec(str))) {
    const dep = {
      name: match[1],
      current: match[2],
      latest: match[3],
    }
    results.push(dep)
  }
  return results
}
