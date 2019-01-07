import React, { Component } from "react"
import "./App.css"
import Sidebar from "./containers/Sidebar"
import Content from "./containers/Content"
import { AppState, groupedManagedContents, ManagedContent } from "./types"
import { runCommand } from "./exporsedFunc"
import { homebrew, npm } from "./commands"

const appState: AppState = {
  logs: [],
  fetchResult: {},
  contents: [
    {
      uuid: "1",
      path: null,
      manager: "homebrew",
    },
    {
      uuid: "2",
      path: null,
      manager: "npm",
    },
    {
      uuid: "3",
      path: "~/hoge",
      manager: "npm",
    },
  ],
  activeManagerUUID: "1",
}

const runOutdated = async (
  content: ManagedContent,
  willRunCommand: (command: string) => void,
) => {
  if (content.manager === "homebrew") {
    const command = homebrew.command
    willRunCommand(command)
    return runCommand(command).then(out => {
      if (out.stderr.length > 0) {
        return Promise.reject(new Error(out.stderr))
      }
      return Promise.resolve(homebrew.parse(out.stdout))
    })
  } else if (content.manager === "npm") {
    const command = npm.command(typeof content.path === "string")
    willRunCommand(command)
    return runCommand(command, { cwd: content.path || "." }).then(out => {
      if (out.stderr.length > 0) {
        return Promise.reject(new Error(out.stderr))
      }
      return Promise.resolve(npm.parse(out.stdout))
    })
  }

  return Promise.reject(new Error(`${content.manager} is not supported yet`))
}

class App extends Component<{}, AppState> {
  public state = appState

  onClickContent = (uuid: string) => {
    this.setState({ activeManagerUUID: uuid })

    const content = appState.contents.find(c => c.uuid === uuid)
    if (content) {
      runOutdated(content, command => {
        const logs = this.state.logs
        this.setState({
          logs: [
            ...logs,
            { timestamp: new Date(), level: "log", msg: `run > ${command}` },
          ],
        })
      })
        .then(results => {
          this.setState({
            fetchResult: {
              [uuid]: { results },
            },
          })
        })
        .catch(error => {
          console.error(error)
          const logs = this.state.logs
          this.setState({
            logs: [
              ...logs,
              { timestamp: new Date(), level: "error", msg: error.message },
            ],
          })
        })
    }
  }

  render() {
    const { activeManagerUUID, logs } = this.state
    const results = this.state.fetchResult[activeManagerUUID] || {}
    const loading = !this.state.fetchResult[activeManagerUUID]

    return (
      <div className="App">
        <Sidebar
          contents={groupedManagedContents(appState.contents)}
          onClickContent={this.onClickContent}
        />
        <Content loading={loading} results={results.results} logs={logs} />
      </div>
    )
  }
}

export default App
