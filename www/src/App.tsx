import React, { Component } from "react"
import "./App.css"
import Sidebar from "./containers/Sidebar"
import Content from "./containers/Content"
import { AppState, LogEntry, ManagedContent, managerKey } from "./types"
import { runCommand } from "./exporsedFunc"
import { buildRunner, run, merge } from "./commands"
import { fetchContent } from "./storage"

const defaultAppStore = (): AppState => ({
  logs: [],
  fetchResult: {},
  contents: [],
  activeManagerKey: "",
  commandRunning: false,
})

class App extends Component<{}, AppState> {
  public state = defaultAppStore()

  public componentDidMount() {
    fetchContent()
      .then(contents => {
        this.setState({ contents })
        setImmediate(() => {
          this.fetch(contents[0])
        })
      })
      .catch(error => console.error(error))
  }
  private addLog = (msg: string, level: LogEntry["level"] = "log") =>
    this.setState({
      logs: [
        ...this.state.logs,
        { timestamp: new Date().getTime(), level, msg },
      ],
    })

  private fetch = (mc: ManagedContent) => {
    this.setState({ activeManagerKey: managerKey(mc) })
    const content = this.state.contents.find(
      c => c.path === mc.path && c.manager === mc.manager,
    )
    if (!content) {
      return
    }
    const runner = buildRunner(content, "list")

    this.addLog(`run > ${runner.command}`)
    run(runner)
      .then(results => {
        const outdated = buildRunner(content, "outdated")

        this.addLog(`run > ${outdated.command}`)
        return Promise.all([results, run(outdated)])
      })
      .then(results => {
        const list = results[0]
        const outdated = results[1]
        const merged = merge(list, outdated)
        const current = this.state.fetchResult

        this.setState({
          fetchResult: {
            ...current,
            [managerKey(mc)]: { results: merged },
          },
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  private onClickContent = (mc: ManagedContent) => {
    this.fetch(mc)
  }

  private onClickAdd = async (directory: string) => {
    if (directory.length === 0) {
      return
    }

    runCommand(`test -d ${directory}`)
      .then(() => {
        console.log(directory, "exists")
      })
      .catch(error => {
        console.error(error)
      })
  }

  public render() {
    const { activeManagerKey, logs } = this.state
    const results = this.state.fetchResult[activeManagerKey] || {}
    const loading = !this.state.fetchResult[activeManagerKey]
    console.log(logs)
    return (
      <div className="App">
        <Sidebar
          activeKey={activeManagerKey}
          contents={this.state.contents}
          onClickContent={this.onClickContent}
          onClickAdd={this.onClickAdd}
        />
        <Content loading={loading} results={results.results} logs={logs} />
      </div>
    )
  }
}

export default App
