import { useEffect, useState } from "react"
import { Field, useFormikContext } from "formik"

import { IFormVariable, ITableData } from "@/utils/types"

import api from "@/api/axiosInstance"

interface IDependedFieldProps {
  variable: IFormVariable
  displayLabel?: boolean
}

// {roleId: 4, roleName: "Operator"}

// {roleId: 3, roleName: "Engineer"}

// {roleId: 2, roleName: "Manager"}

// {roleId: 1, roleName: "Admin"}
const ManagerDropdown: React.FunctionComponent<IDependedFieldProps> = ({
  variable,
  displayLabel = true,
}) => {
  const { values, setFieldValue } = useFormikContext<{
    [key: string]: string | null // Allow null for resetting values
  }>()
  console.log("values in manager dropdown", values)
  const [DropOptions, setDropOptions] = useState<ITableData>([])
  const [disabled, setDisabled] = useState<boolean>(true)

  const [displayValue, setDisplayValue] = useState<string>("")

  const depFieldEng = values[variable.managerDrop!] || "" // Engineer-dependent value
  const depFieldRole = values[variable.dependedDrop!] || "" // Role-dependent value

  useEffect(() => {
    const role = parseInt(depFieldRole)
    setDisplayValue("")
    if (!depFieldRole) {
      // No role yet → keep ManagerDD disabled
      setDropOptions([])
      setDisabled(true)
      setFieldValue(variable.name, null)
      return
    }
    if (role === 4) {
      // Operator → force NA
      setDropOptions([{ byManager: "NA", employeeName: "NA" }])
      // setDropOptions([])
      setFieldValue(variable.name, "NA")
      setDisplayValue("NA")
      setDisabled(true)
      return
    }
    // // Only reset field if role changes OR engineer changes (and no manager mapped yet)
    // // if (!depFieldEng && (role === 3 || role === 4)) {
    // if (!depFieldEng && role === 3) {
    //   setFieldValue(variable.name, null)
    // }

    if (role === 1 || role === 2) {
      setDisabled(true)
      api
        .get(variable.API!)
        .then((res) => setDropOptions(res.data))
        .catch((err) => console.error(err))
      //   } else if (role === 4 || role === 3) {
      //     const fetchMappedManager = async () => {
      //       try {
      //         if (depFieldEng) {
      //           const res = await api.get(
      //             `/User/Manager_DD?ByEngineerId=${depFieldEng}`,
      //           )
      //           const manager = res.data?.[0]
      //           console.log("API response:", res.data)
      //           console.log("Mapped manager:", manager)
      //           if (
      //             manager?.byManager !== null &&
      //             manager?.byManager !== undefined
      //           ) {
      //             setDropOptions([manager])
      //             setFieldValue(variable.name, manager.byManager.toString())
      //             setDisplayValue(manager.employeeName || "")
      //             setDisabled(true)
      //             return
      //           }
      //         }

      //         // fallback
      //         setDisabled(false)
      //         const fallback = await api.get(variable.API!)
      //         setDropOptions(fallback.data)
      //       } catch (err) {
      //         console.error("Error fetching manager:", err)
      //         setDisabled(false)
      //       }
      //     }

      //     fetchMappedManager()
      //   }
      // }, [depFieldRole, depFieldEng, variable.name, setFieldValue])
    } else if (role === 3) {
      // Engineer → fetch mapped manager
      const fetchMappedManager = async () => {
        try {
          if (depFieldEng) {
            const res = await api.get(
              `/User/Manager_DD?ByEngineerId=${depFieldEng}`,
            )
            const manager = res.data?.[0]
            if (manager?.byManager) {
              setDropOptions([manager])
              setFieldValue(variable.name, manager.byManager.toString())
              setDisplayValue(manager.employeeName || "")
              setDisabled(true)
              return
            }
          }
          setDisabled(false)
          const fallback = await api.get(variable.API!)
          setDropOptions(fallback.data)
        } catch (err) {
          console.error("Error fetching manager:", err)
          setDisabled(false)
        }
      }

      fetchMappedManager()
    }
  }, [depFieldRole, depFieldEng, variable.name, setFieldValue])

  return (
    <div className="form-control" key={variable.name}>
      {displayLabel && (
        <label htmlFor={variable.name} className="w-full">
          {variable.display}
          {variable.required && (
            <span className="text-error text-left ml-1">*</span>
          )}
        </label>
      )}
      <div className="w-full">
        <Field
          as="select"
          id={variable.name}
          name={variable.name}
          placeholder={variable.display}
          className="select select-sm select-bordered w-full"
          disabled={disabled}
          value={values[variable.name] || ""}
          onChange={(e: any) => {
            const value = e.target.value || null
            setFieldValue(variable.name, value)
          }}
        >
          <option value="">Select</option>
          {DropOptions.map((optionItem: any, index: number) => (
            <option
              key={index}
              value={
                optionItem.byManager?.toString() ||
                (Object.values(optionItem)[0] as string)
              }
              className="capitalize"
            >
              {optionItem.byManager === "NA" ? "NA" : optionItem.employeeName}
            </option>
          ))}
        </Field>
      </div>
    </div>
  )
}

export default ManagerDropdown
