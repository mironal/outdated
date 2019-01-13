import React from "react"
import { LogEntry } from "../types"
import classnames from "classnames"

export const LogLine = ({ entry }: { entry: LogEntry }) => {
  return (
    <p className={classnames("Log", entry.level)}>
      {entry.timestamp}: {entry.msg}
    </p>
  )
}

export interface TerminalProps {
  logs: LogEntry[]
}

class Terminal extends React.PureComponent<TerminalProps> {
  private element: HTMLDivElement | null = null

  public componentDidUpdate(prevProps: TerminalProps) {
    if (this.props.logs.length !== prevProps.logs.length) {
      if (this.element) {
        this.element.lastElementChild!.scrollIntoView(true)
      }
    }
  }

  public render() {
    const { logs } = this.props
    return (
      <div className="Terminal" ref={elem => (this.element = elem)}>
        {logs
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((l, i) => (
            <LogLine key={i} entry={l} />
          ))}
      </div>
    )
  }
}

export default Terminal
