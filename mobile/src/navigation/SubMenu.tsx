import { MenuItem } from "@/utils/types"
import React from "react"
import { Link } from "react-router-dom"

interface SubMenuProps {
  data: MenuItem
}

export const SubMenu: React.FC<SubMenuProps> = ({ data }) => {
  return (
    <li>
      {data.submenu ? (
        <details>
          <summary>{data.title}</summary>
          <ul className="menu bg-base-100 w-56 rounded-box">
            {data.submenu.map((child) => (
              <SubMenu key={child.title} data={child} />
            ))}
          </ul>
        </details>
      ) : (
        <Link to={data.path}>{data.title}</Link>
      )}
    </li>
  )
}
