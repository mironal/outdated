import React from "react"
import { ManagedContent, groupedManagedContents } from "../types"
import SidebarItem, { SidebarItemProps } from "../components/SidebarItem"
import SidebarForm, { SidebarFormProps } from "../components/SidebarForm"

export type SidebarProps = {
  contents: ManagedContent[]
} & SidebarFormProps &
  Pick<SidebarItemProps, "onClickContent" | "onClickDelete" | "activeKey">

const Sidebar = ({
  activeKey,
  contents,
  onClickContent,
  onClickAdd,
  onClickDelete,
}: SidebarProps) => {
  return (
    <div className="Sidebar">
      {groupedManagedContents(contents).map((c, i) => (
        <SidebarItem
          key={i}
          content={c}
          onClickContent={onClickContent}
          onClickDelete={c.path === "Globals" ? undefined : onClickDelete}
          activeKey={activeKey}
        />
      ))}
      <SidebarForm onClickAdd={onClickAdd} />
    </div>
  )
}

export default Sidebar
