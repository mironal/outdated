import React from "react"
import ReactTable from "react-table"
import "react-table/react-table.css"
import classnames from "classnames"

import { OutdatedResult, LogEntry } from "../types"

const LogLine = (entry: LogEntry) => {
  return (
    <p className={classnames("Log", entry.level)}>
      {entry.timestamp.toTimeString()}: {entry.msg}
    </p>
  )
}
export interface ContentProps {
  loading: boolean
  results?: OutdatedResult[]
  logs: LogEntry[]
}

const Content = ({ loading, results, logs }: ContentProps) => {
  return (
    <div className="Content">
      <div className="Table">
        <ReactTable
          data={results}
          loading={loading}
          showPagination={false}
          defaultPageSize={10}
          minRows={3}
          columns={[
            {
              Header: "Name",
              accessor: "name",
            },
            {
              Header: "Current",
              accessor: "current",
            },
            {
              Header: "Latest",
              accessor: "latest",
            },
          ]}
        />
      </div>
      <div className="Terminal">
        {logs.reverse().map((l, i) => (
          <LogLine key={i} {...l} />
        ))}
      </div>
    </div>
  )
}

export default Content
