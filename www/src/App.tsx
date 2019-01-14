import React, { Component } from "react"
import "./App.css"
import Sidebar from "./containers/Sidebar"
import Content from "./containers/Content"
import {
  AppState,
  LogEntry,
  ManagedContent,
  managerKey,
  resolveManagers,
} from "./types"
import { runCommand } from "./exporsedFunc"
import { buildRunner, run, merge } from "./commands"
import { initializeContents, write } from "./storage"

const defaultAppStore = (): AppState => ({
  logs: [],
  fetchResult: {},
  contents: [],
  active: {} as ManagedContent,
  commandRunning: false,
})

class App extends Component<{}, AppState> {
  public state = defaultAppStore()

  public componentDidMount() {
    initializeContents()
      .then(contents => {
        this.setState({ contents })
        this.onClickContent(contents[0])
      })
      .catch(error => console.error(error))
  }

  public componentDidUpdate(_: {}, prevState: AppState) {
    if (managerKey(this.state.active) !== managerKey(prevState.active)) {
      this.fetch()
    }
  }

  private addLog = (msg: string, level: LogEntry["level"] = "log") =>
    this.setState({
      logs: [
        ...this.state.logs,
        { timestamp: new Date().getTime(), level, msg },
      ],
    })

  private fetch = () => {
    const mc = this.state.active
    const content = this.state.contents.find(
      c => c.path === mc.path && c.manager === mc.manager,
    )
    if (!content) {
      return
    }

    const runner = buildRunner(content, "list")

    this.addLog(`run > '${runner.command}' in '${content.path}'`)
    run(runner)
      .then(results => {
        const outdated = buildRunner(content, "outdated")

        this.addLog(`run > '${outdated.command}' in '${content.path}'`)
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
    this.setState({ active: mc })
  }

  private onClickAdd = async (directory: string) => {
    if (directory.length === 0) {
      return ""
    }

    return runCommand(`test -d ${directory}`)
      .then(() => {
        console.log(directory, "exists")
        return resolveManagers(directory)
      })
      .then(pms => {
        if (pms.length > 0) {
          const contents = [...this.state.contents, ...pms]
          this.setState({ contents })
          this.onClickContent(pms[0])
          return write("contents", contents)
        }
      })
      .then(() => {
        return ""
      })
      .catch(error => {
        this.addLog(error.message, "error")
        console.error(error)
        return directory
      })
  }

  private onClickDelete = async (path: string) => {
    const contents = this.state.contents.filter(c => c.path !== path)
    this.setState({ contents })

    await write("contents", contents)
  }

  public render() {
    const { active, logs } = this.state
    const activeManagerKey = managerKey(active)
    const results = this.state.fetchResult[activeManagerKey] || {}
    const loading = !this.state.fetchResult[activeManagerKey]

    return (
      <div className="App">
        <Sidebar
          activeKey={activeManagerKey}
          contents={this.state.contents}
          onClickContent={this.onClickContent}
          onClickAdd={this.onClickAdd}
          onClickDelete={this.onClickDelete}
        />
        <Content loading={loading} results={results.results} logs={logs} />
      </div>
    )
  }
}

export default App
