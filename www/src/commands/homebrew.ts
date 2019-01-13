export const listCommand = "brew list --versions"
export const outdatedCommand = "brew outdated -v"

export const parseOutdated = (outdated: string) => {
  const regexp = /^([^ \n]+) \(([0-9\.]+)\) < ([0-9.]+)$/gm
  let match

  const results = []
  // tslint:disable-next-line:no-conditional-assignment
  while ((match = regexp.exec(outdated)) !== null) {
    const dep = {
      name: match[1],
      current: match[2],
      latest: match[3],
    }
    results.push(dep)
  }
  return results
}

export const parseList = (versions: string) => {
  const regexp = /^([^\n\s]+)\s+(\S+)$/gm
  let match

  const results = []
  // tslint:disable-next-line:no-conditional-assignment
  while ((match = regexp.exec(versions)) !== null) {
    const dep = {
      name: match[1],
      current: match[2],
    }
    results.push(dep)
  }
  return results
}
