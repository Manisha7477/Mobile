import React, { useState, useEffect } from "react"
import { FaAngleUp, FaAngleDown } from "react-icons/fa"
import api from "@/api/axiosInstance"
import { toast } from "react-toastify"

interface SubMenu {
  subMenuId: number
  subMenuName: string
}

interface Menu {
  menuId: number
  menuName: string

  subMenus: SubMenu[]
}

interface RolePermissions {
  [roleName: string]: {
    [permission: string]: boolean
  }
}
interface RolePermissionsModel {
  roleId: number
  menuList: {
    menuId: number
    isSelected?: boolean
    subMenuLists: {
      subMenuId: number
      isSelected: boolean
    }[]
  }[]
}

interface Roles {
  [roleName: string]: number
}

const RolePermission: React.FC = () => {
  const [availablePermissions, setAvailablePermissions] = useState<Menu[]>([])
  const [checkedPermissions, setCheckedPermissions] = useState<RolePermissions>(
    {},
  )
  const [modifiedPermissions, setModifiedPermissions] =
    useState<RolePermissions>({})
  const [expandedMenus, setExpandedMenus] = useState<{
    [menuId: number]: boolean
  }>({})
  const [selectedRole, setSelectedRole] = useState("All")
  const roles = ["Manager", "Engineer", "Operator"]
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    fetchRolesData()
    fetchPermissionsData()
  }, [])

  const fetchRolesData = async () => {
    try {
      const response = await api.get(`/Menu`)
      if (response.status === 200) {
        const rolesData: Menu[] = response.data.map((menu: any) => ({
          menuId: menu.menuId,
          menuName: menu.menuName,
          subMenus: menu.subMenu.map((subMenu: any) => ({
            subMenuId: subMenu.subMenuId,
            // subMenuName: subMenu.subMenuName,
          })),
        }))
        console.log("response:", response)
        console.log("rolesData:", rolesData)

        setAvailablePermissions(rolesData)
      }
    } catch (error) {
      console.error("Error fetching roles data: ", error)
    }
  }

  const fetchPermissionsData = async () => {
    try {
      const response = await api.get(`/Permission/GetPermissions`)

      if (response.status === 200) {
        const permissions: RolePermissions = {}
        response.data.forEach((role: any) => {
          permissions[role.roleName] = {}
          role.getMenuLists.forEach((menu: any) => {
            permissions[role.roleName][menu.menuName] = true
            // menu.subMenuLists.forEach((subMenu: any) => {
            //   permissions[role.roleName][subMenu.subMenuName] = true
            // })
          })
        })
        setCheckedPermissions(permissions)
      } else {
        console.error("Failed to fetch permissions data.")
      }
    } catch (error) {
      console.error("Error fetching permissions data: ", error)
    }
  }

  const toggleMenu = (menuId: number) => {
    setExpandedMenus((prevState) => ({
      ...prevState,
      [menuId]: !prevState[menuId],
    }))
  }

  const toggleMainAndSubMenu = (
    roleName: string,
    menuName: string,
    isSelected: boolean,
  ) => {
    setModifiedPermissions((prevState) => {
      const updatedRolePermissions = { ...prevState[roleName] }
      updatedRolePermissions[menuName] = isSelected

      const menu = availablePermissions.find((m) => m.menuName === menuName)
      if (menu) {
        // menu.subMenus.forEach((subMenu) => {
        //   updatedRolePermissions[subMenu.subMenuName] = isSelected
        // })
      }
      return { ...prevState, [roleName]: updatedRolePermissions }
    })
  }

  const handleCheckboxChange = (
    roleName: string,
    permission: string,
    isMainMenu: boolean,
  ) => {
    const isCurrentlyChecked = isChecked(roleName, permission)
    if (isMainMenu) {
      toggleMainAndSubMenu(roleName, permission, !isCurrentlyChecked)
    } else {
      setModifiedPermissions((prevState) => {
        const updatedRolePermissions = {
          ...prevState[roleName],
          [permission]: !isCurrentlyChecked,
        }

        const menu = availablePermissions.find((m) =>
          m.subMenus.some((sub) => sub.subMenuName === permission),
        )
        if (menu) {
          const isAnySubmenuSelected = menu.subMenus.some(
            (sub) => updatedRolePermissions[sub.subMenuName],
          )
          updatedRolePermissions[menu.menuName] = isAnySubmenuSelected
        }

        return { ...prevState, [roleName]: updatedRolePermissions }
      })
    }
  }

  const newUpdatedRoles = async () => {
    try {
      const response = await api.get(`/Permission/GetPermissions`)
      localStorage.setItem(
        "updatedRolePermissions",
        JSON.stringify(response.data),
      )
      console.log("updatedRoles:", response.data)
    } catch (error) {
      alert("error in new updated roles")
    }
  }

  const isChecked = (roleName: string, permission: string) => {
    if (
      modifiedPermissions[roleName] &&
      modifiedPermissions[roleName][permission] !== undefined
    ) {
      return modifiedPermissions[roleName][permission]
    }
    return (
      checkedPermissions[roleName] && checkedPermissions[roleName][permission]
    )
  }

  const handleSave = () => {
    setShowConfirmModal(true)
  }
  const confirmSaveChanges = async () => {
    setShowConfirmModal(false)

    const rolePermissionsModel: RolePermissionsModel[] = []
    const roles: Roles = { Manager: 2, Engineer: 3, Operator: 4 }

    Object.keys(checkedPermissions).forEach((roleName) => {
      const menuList = availablePermissions
        .map((menu) => {
          const isMenuSelected = isChecked(roleName, menu.menuName)
          const subMenuLists = menu.subMenus
            .map((subMenu) => ({
              subMenuId: subMenu.subMenuId,
              isSelected: isChecked(roleName, subMenu.subMenuName),
            }))
            .filter((subMenu) => subMenu.isSelected !== undefined)

          if (isMenuSelected || subMenuLists.length > 0) {
            return {
              menuId: menu.menuId,
              isSelected: isMenuSelected,
              subMenuLists: subMenuLists,
            }
          }
          return null
        })
        .filter((menu) => menu !== null)

      if (menuList.length > 0) {
        const roleId = roles[roleName]
        if (!roleId) {
          console.warn(`Skipping unknown role: ${roleName}`)
          return
        }
        rolePermissionsModel.push({
          roleId,
          menuList: menuList as RolePermissionsModel["menuList"],
        })
      }
    })

    const body = { rolePermissionsModel: rolePermissionsModel }

    try {
      const response = await api.post(`/Permission/UpdatePermissions`, body)
      if (response.status === 200) {
        toast.success("Permissions updated successfully!", {
          autoClose: 1000,
        })
        fetchPermissionsData()
        await newUpdatedRoles()
      } else {
        toast.error("Failed to update permissions", {
          autoClose: 1000,
        })
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Something went wrong while saving", {
        autoClose: 1000,
      })
    }
  }

  const handleCancel = () => {
    setModifiedPermissions({})
    // window.location.reload()
  }

  const filteredRoles =
    selectedRole === "All" ? roles : roles.filter((r) => r === selectedRole)

  return (
    <div className="sm:ml-10 xl:ml-0 w-full max-w-screen-m mx-auto">
      <div className="border rounded border-base-300">
        <div
          className="relative bg-white rounded-t-lg border-b border-gray-200 px-4 pt-2 pb-2 flex items-center justify-between"
          style={{ width: "100%" }}
        >

          <div className="px-4 py-1 relative border-b-0 inline-block text-md font-semibold flex items-center gap-6 -gradient-to-r from-blue-500 via-blue-600 to-purple-500">
            Role Permissions
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 rounded-full"></span>
          </div>
          <div className="flex items-center gap-4">
              <div className="relative">
                <label className="mr-2 font-semibold text-base-content">
              Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-base-300 rounded px-2 py-1 text-sm"
            >
              <option value="All">All</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
              </div>
            </div>
          </div>
        {/* Role Filter Dropdown */}
        <div className="p-2 ">
          {/* Table */}
          <div className="overflow-auto max-h-[60vh] border rounded border-base-300">
            <table className="w-full text-sm">
              <thead className="bg-info text-black text-sm font-semibold">
                <tr className="border-b border-base-300">
                  <th className="p-3 text-left">Permission</th>
                  {filteredRoles.map((role) => (
                    <th key={role} className="p-3 text-center">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {availablePermissions.map((menu) => (
                  <React.Fragment key={menu.menuId}>
                    <tr className="bg-base-100 hover:bg-base-200 border-b border-base-300 transition">
                      <td
                        onClick={() => toggleMenu(menu.menuId)}
                        className="flex items-center cursor-pointer p-3"
                      >
                        {menu.menuName}
                        <span className="ml-2">
                          {expandedMenus[menu.menuId] ? (
                            <FaAngleUp />
                          ) : (
                            <FaAngleDown />
                          )}
                        </span>
                      </td>
                      {filteredRoles.map((role) => (
                        <td key={role} className="text-center">
                          <input
                            type="checkbox"
                            checked={isChecked(role, menu.menuName)}
                            onChange={() =>
                              handleCheckboxChange(role, menu.menuName, true)
                            }
                            className="form-checkbox h-5 w-5 text-primary"
                          />
                        </td>
                      ))}
                    </tr>
                    {expandedMenus[menu.menuId] &&
                      menu.subMenus.map((subMenu) => (
                        <tr key={subMenu.subMenuId} className="bg-base-100">
                          <td className="pl-10 p-3 border-b border-base-300 text-base-content">
                            - {subMenu.subMenuName}
                          </td>
                          {filteredRoles.map((role) => (
                            <td key={role} className="text-center">
                              <input
                                type="checkbox"
                                checked={isChecked(role, subMenu.subMenuName)}
                                onChange={() =>
                                  handleCheckboxChange(
                                    role,
                                    subMenu.subMenuName,
                                    false,
                                  )
                                }
                                className="form-checkbox h-5 w-5 text-primary"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {/* Buttons */}
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transitionhover:shadow-inner hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.25)]"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm flex items-center gap-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-200 transition hover:shadow-inner hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.25)]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Save</h2>
            <p className="mb-6">Are you sure you want to save these changes?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmSaveChanges}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Yes, Save
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RolePermission
