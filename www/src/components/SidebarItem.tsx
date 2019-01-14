import React from "react"
import { GroupedManagedContent, ManagedContent, managerKey } from "../types"
import classNames from "classnames"

export interface SidebarItemProps {
  activeKey: string
  content: GroupedManagedContent
  onClickContent?: (mc: ManagedContent) => void
  onClickDelete?: (path: string) => void
}

const SidebarItem = ({
  activeKey,
  content: { path, pkgManagers },
  onClickContent,
  onClickDelete,
}: SidebarItemProps) => {
  return (
    <div>
      <h3 className="SidebarTitle">
        {path}
        {onClickDelete && (
          <button onClick={() => onClickDelete && onClickDelete(path)}>
            x
          </button>
        )}
      </h3>
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

export default SidebarItem
