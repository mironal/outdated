import React, { PureComponent } from "react"
import { GroupedManagedContent } from "../types"
import classNames from "classnames"

export type SidebarItemProps = {
  current: string
  content: GroupedManagedContent
  onClickContent?: (uuid: string) => void
}

const SidebarItem = ({
  content: { path, contents },
  onClickContent,
  current,
}: SidebarItemProps) => {
  return (
    <div className="SidebarItem">
      <h3>{path || "Globals"}</h3>
      <ul>
        {contents.map(c => {
          return (
            <li
              className={classNames({ active: current === c.uuid })}
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

interface ContentInputState {
  directory: string
}

interface ContentInputProps {
  onClickAdd: (directory: string) => void
}

class ContentInput extends PureComponent<ContentInputProps, ContentInputState> {
  state = { directory: "" }
  onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ directory: event.target.value })
  onClickAdd = () => this.props.onClickAdd(this.state.directory)
  render() {
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
  current: string
  contents: GroupedManagedContent[]
  onClickContent?: (uuid: string) => void
} & ContentInputProps

const Sidebar = ({
  contents,
  onClickContent,
  onClickAdd,
  current,
}: SidebarProps) => {
  return (
    <div className="Sidebar">
      {contents.map((c, i) => (
        <SidebarItem
          key={i}
          content={c}
          onClickContent={onClickContent}
          current={current}
        />
      ))}
      <ContentInput onClickAdd={onClickAdd} />
    </div>
  )
}

export default Sidebar
