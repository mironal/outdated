import React, { useState } from "react"

export interface SidebarFormProps {
  onClickAdd: (directory: string) => void
}

export default function SidebarForm({ onClickAdd }: SidebarFormProps) {
  const [path, setPath] = useState("")

  return (
    <form>
      <input onChange={e => setPath(e.target.value)} type="text" value={path} />
      <button
        type="button"
        onClick={() => onClickAdd(path)}
        disabled={path.length === 0}
      >
        add
      </button>
    </form>
  )
}
