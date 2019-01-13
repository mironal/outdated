import React, { Component } from "react"
import "./App.css"
import Sidebar from "./containers/Sidebar"
import Content from "./containers/Content"
import { AppState, groupedManagedContents, LogEntry } from "./types"
import { runCommand } from "./exporsedFunc"
import { buildRunner, run, merge } from "./commands"
import { fetchContent } from "./storage"

const defaultAppStore = (): AppState => ({
  logs: [],
  fetchResult: {},
  contents: [],
  activeManagerUUID: "1",
  commandRunning: false,
})

class App extends Component<{}, AppState> {
  public state = defaultAppStore()

  public componentDidMount() {
    fetchContent()
      .then(contents => {
        this.setState({ contents })
        setImmediate(() => {
          this.fetch(contents[0].uuid)
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

  private fetch = (uuid: string) => {
    this.setState({ activeManagerUUID: uuid })
    const content = this.state.contents.find(c => c.uuid === uuid)
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
            [uuid]: { results: merged },
          },
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  private onClickContent = (uuid: string) => {
    this.fetch(uuid)
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
    const { activeManagerUUID, logs } = this.state
    const results = this.state.fetchResult[activeManagerUUID] || {}
    const loading = !this.state.fetchResult[activeManagerUUID]
    console.log(logs)
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
