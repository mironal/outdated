import React, { PureComponent } from "react"
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
    <div className="SidebarItem">
      <h3>{path}</h3>
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

interface ContentInputState {
  directory: string
}

interface ContentInputProps {
  onClickAdd: (directory: string) => void
}

class ContentInput extends PureComponent<ContentInputProps, ContentInputState> {
  public state = { directory: "" }
  public onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ directory: event.target.value })
  public onClickAdd = () => this.props.onClickAdd(this.state.directory)
  public render() {
    const { directory } = this.state
    return (
      <div>
        <input onChange={this.onChange} type="text" value={directory} />
        <button onClick={this.onClickAdd} disabled={directory.length === 0}>
          add
        </button>
      </div>
    )
  }
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
