import React, { useState } from "react"
import {
  GroupedManagedContent,
  ManagedContent,
  managerKey,
  groupedManagedContents,
} from "../types"
import classNames from "classnames"

export interface SidebarItemProps {
  activeKey: string
  content: GroupedManagedContent
  onClickContent?: (mc: ManagedContent) => void
}

const SidebarItem = ({
  content: { path, pkgManagers },
  onClickContent,
  activeKey,
}: SidebarItemProps) => {
  return (
    <div>
      <h3 className="SidebarTitle">{path}</h3>
      <ul>
        {pkgManagers.map(manager => {
          const key = managerKey({
            path,
            manager,
          })
          return (
            <li
              className={classNames([
                { active: activeKey === key },
                "clickable",
                "pkg-manager",
              ])}
              key={key}
              onClick={() =>
                onClickContent && onClickContent({ path, manager })
              }
            >
              {manager}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
interface ContentInputProps {
  onClickAdd: (directory: string) => void
}

function ContentInput({ onClickAdd }: ContentInputProps) {
  const [path, setPath] = useState("")

  return (
    <div>
      <input onChange={e => setPath(e.target.value)} type="text" value={path} />
      <button onClick={() => onClickAdd(path)} disabled={path.length === 0}>
        add
      </button>
    </div>
  )
}

export type SidebarProps = {
  activeKey: string
  contents: ManagedContent[]
  onClickContent?: (mc: ManagedContent) => void
} & ContentInputProps

const Sidebar = ({
  activeKey,
  contents,
  onClickContent,
  onClickAdd,
}: SidebarProps) => {
  return (
    <div className="Sidebar">
      {groupedManagedContents(contents).map((c, i) => (
        <SidebarItem
          key={i}
          content={c}
          onClickContent={onClickContent}
          activeKey={activeKey}
        />
      ))}
      <ContentInput onClickAdd={onClickAdd} />
    </div>
  )
}

export default Sidebar
