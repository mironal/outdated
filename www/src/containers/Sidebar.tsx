import React from "react"
import { GroupedManagedContent, AppState } from "../types"

export type SidebarItemProps = GroupedManagedContent & {
  onClickContent?: (uuid: string) => void
}

const SidebarItem = ({ path, contents, onClickContent }: SidebarItemProps) => {
  return (
    <div className="SidebarItem">
      <h3>{path || "Globals"}</h3>
      <ul>
        {contents.map(c => {
          return (
            <li
              key={c.uuid}
              onClick={() => onClickContent && onClickContent(c.uuid)}
            >
              {c.manager}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export type SidebarProps = {
  contents: SidebarItemProps[]
  onClickContent?: (uuid: string) => void
}

const Sidebar = ({ contents, onClickContent }: SidebarProps) => {
  return (
    <div className="Sidebar">
      {contents.map((c, i) => (
        <SidebarItem key={i} {...c} onClickContent={onClickContent} />
      ))}
    </div>
  )
}

export default Sidebar
