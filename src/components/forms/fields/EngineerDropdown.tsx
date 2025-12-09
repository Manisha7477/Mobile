import { useEffect, useState } from "react"
import { Field, useFormikContext } from "formik"
import { IFormVariable, ITableData } from "@/utils/types"

import api from "@/api/axiosInstance"

interface IDependedFieldProps {
  variable: IFormVariable
  displayLabel?: boolean
}
// working fine
const EngineerDropdown: React.FC<IDependedFieldProps> = ({
  variable,
  displayLabel = true,
}) => {
  const { values, setFieldValue } = useFormikContext<{
    [key: string]: string | null
  }>()

  const [DropOptions, setDropOptions] = useState<ITableData>([])
  const [disabled, setDisabled] = useState<boolean>(true)

  const depFieldValue = values[variable.engineerDrop!] || ""

  useEffect(() => {
    setFieldValue(variable.name, null)

    const fetchEngineers = async () => {
      try {
        const response = await api.get(variable.API!)
        const engineerList = response.data || []
        setDropOptions(engineerList)

        setDisabled(engineerList.length === 0)
      } catch (error) {
        console.error("Error fetching engineer list:", error)
        setDisabled(true)
      }
    }

    if (depFieldValue && String(depFieldValue) === "4") {
      // roleId = 4 → Operator → show engineers normally
      fetchEngineers()
      setDisabled(false)
    } else {
      // roleId ≠ 4 → Engineer/Admin/Manager → force NA (same as ManagerDropdown)
      // setDropOptions([
      //   { byEngineerId: "NA", employeeName: "NA", employeeId: "-" },
      // ])
      setFieldValue(variable.name, "NA")
      setDisabled(true)
    }
  }, [depFieldValue, setFieldValue, variable.name, variable.API])

  const handleEngineerChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value || null

    // Set the value of the current dropdown field
    setFieldValue(variable.name, value)

    // Also set `engineerId` in Formik so ManagerDropdown can listen to it
    setFieldValue("engineerId", value)

    const selectedEngineer = DropOptions.find(
      (eng: any) => String(eng.byEngineerId) === String(value),
    )

    if (selectedEngineer) {
      try {
        const managerResponse = await api.get(
          `/User/Manager_DD?ByEngineerId=${selectedEngineer.byEngineerId}`,
        )
        const managerData = managerResponse.data?.[0]

        if (
          managerData &&
          managerData.byManager !== null &&
          managerData.byManager !== undefined
        ) {
          setFieldValue("byManager", managerData.byManager.toString())
        } else {
          setFieldValue("byManager", null) // allow manual selection
        }
      } catch (err) {
        console.error("Error fetching manager for engineer:", err)
        setFieldValue("byManager", null)
      }
    }
  }

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
          className="select select-sm select-bordered w-full"
          disabled={disabled}
          value={values[variable.name] || ""}
          onChange={handleEngineerChange}
        >
          <option value="">Select</option>
          {DropOptions.map((engineer: any, index: number) => (
            <option value={engineer.byEngineerId} key={index}>
              {`${engineer.employeeName} (${engineer.employeeId})`}
            </option>
            // <option value={engineer.byEngineerId} key={index}>
            //   {engineer.byEngineerId === "NA"
            //     ? "NA"
            //     : `${engineer.employeeName} (${engineer.employeeId})`}
            // </option>
          ))}
        </Field>
      </div>
    </div>
  )
}

export default EngineerDropdown
