import React from "react"
import ReactTable, { ComponentPropsGetterRC } from "react-table"
import "react-table/react-table.css"

import { OutdatedResult, LogEntry } from "../types"
import Terminal from "../components/Terminal"

export interface ContentProps {
  loading: boolean
  results?: OutdatedResult[]
  logs: LogEntry[]
}

const cellClass: ComponentPropsGetterRC = (state, rowInfo, column) => {
  if (!column || !rowInfo) {
    return {}
  }
  const { current, wanted, latest } = rowInfo.original as OutdatedResult
  if (column.Header === "Wanted" && current !== wanted) {
    return { className: "wanted" }
  } else if (column.Header === "Latest" && current !== latest) {
    return { className: "latest" }
  }
  return {}
}
const Content = ({ loading, results, logs }: ContentProps) => {
  return (
    <div className="Content">
      <div className="Table">
        <ReactTable
          className="OutdatedTable"
          data={results}
          loading={loading}
          showPagination={false}
          pageSize={Math.max((results || []).length, 20)}
          getTdProps={cellClass}
          columns={[
            {
              Header: "Name",
              accessor: "name",
            },
            {
              Header: "Current",
              accessor: "current",
            },
            { Header: "Wanted", accessor: "wanted" },
            {
              Header: "Latest",
              accessor: "latest",
            },
          ]}
        />
      </div>
      <Terminal logs={logs} />
    </div>
  )
}

export default Content
