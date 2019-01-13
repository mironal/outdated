export const listCommand = (global: boolean) => {
  const builder = ["npm"]
  if (global === true) {
    builder.push("-g")
  }

  builder.push("list")
  builder.push("--json")
  builder.push("--depth=0")
  builder.push("|| true") // avoid exit code 1

  return builder.join(" ")
}

export const outdatedCommand = (global: boolean) => {
  const builder = ["npm"]
  if (global === true) {
    builder.push("-g")
  }

  builder.push("outdated")
  builder.push("--json")
  builder.push("|| true") // avoid exit code 1

  return builder.join(" ")
}

export const parseList = (jsonString: string) => {
  const json = JSON.parse(jsonString) as {
    dependencies: {
      [pkg: string]: {
        version: string
      }
    }
  }

  return Object.keys(json.dependencies).map(key => {
    const o = json.dependencies[key]
    return {
      name: key,
      current: o.version,
    }
  })
}

export const parseOutdated = (jsonString: string) => {
  const json = JSON.parse(jsonString) as {
    [pkg: string]: {
      current: string
      wanted: string
      latest: string
    }
  }

  return Object.keys(json).map(key => {
    const o = json[key]
    return { name: key, current: o.current, wanted: o.wanted, latest: o.latest }
  })
}
