import React, { useRef, useEffect } from "react"
import { LogEntry } from "../types"
import classnames from "classnames"

const LogLine = ({ entry }: { entry: LogEntry }) => {
  return (
    <p className={classnames("LogLine", entry.level)}>
      {entry.timestamp}: {entry.msg}
    </p>
  )
}

export interface TerminalProps {
  logs: LogEntry[]
}

export default function Terminal({ logs }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const elem = terminalRef.current
    if (!elem || !elem.lastElementChild) {
      return
    }
    elem.lastElementChild.scrollIntoView(true)
  })

  return (
    <div className="Terminal" ref={terminalRef}>
      {logs
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((l, i) => (
          <LogLine key={i} entry={l} />
        ))}
    </div>
  )
}
