import React, { Component } from "react"
import "./App.css"
import Sidebar from "./containers/Sidebar"
import Content from "./containers/Content"
import {
  AppState,
  groupedManagedContents,
  ManagedContent,
  PackageManager,
  createContent,
} from "./types"
import { runCommand } from "./exporsedFunc"
import { homebrew, npm } from "./commands"
import { fetchContent } from "./storage"

const defaultAppStore = (): AppState => ({
  logs: [],
  fetchResult: {},
  contents: [],
  activeManagerUUID: "1",
  commandRunning: false,
})

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
    const command = npm.command(content.path === null)
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
  public state = defaultAppStore()

  public componentDidMount() {
    fetchContent()
      .then(contents => {
        this.setState({ contents, activeManagerUUID: contents[0].uuid })
      })
      .catch(error => console.error(error))
  }

  onClickContent = (uuid: string) => {
    if (this.state.commandRunning) {
      return
    }
    this.setState({ activeManagerUUID: uuid, commandRunning: true })
    const content = this.state.contents.find(c => c.uuid === uuid)
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
          const current = this.state.fetchResult
          this.setState({
            commandRunning: false,
            fetchResult: {
              ...current,
              [uuid]: { results },
            },
          })
        })
        .catch(error => {
          console.error(error)
          const logs = this.state.logs
          this.setState({
            commandRunning: false,
            logs: [
              ...logs,
              { timestamp: new Date(), level: "error", msg: error.message },
            ],
          })
        })
    } else {
      console.warn("not found", uuid, "in", this.state.contents)
    }
  }

  onClickAdd = async (directory: string) => {
    if (directory.length === 0) {
      return
    }

    runCommand(`test -d ${directory}`)
      .then(() => {})
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    const { activeManagerUUID, logs } = this.state
    const results = this.state.fetchResult[activeManagerUUID] || {}
    const loading = !this.state.fetchResult[activeManagerUUID]
    return (
      <div className="App">
        <Sidebar
          current={activeManagerUUID}
          contents={groupedManagedContents(this.state.contents)}
          onClickContent={this.onClickContent}
          onClickAdd={this.onClickAdd}
        />
        <Content loading={loading} results={results.results} logs={logs} />
      </div>
    )
  }
}

export default App
