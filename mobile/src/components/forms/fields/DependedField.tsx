import { IFormVariable } from "@/utils/types"
import axios from "axios"
import { ErrorMessage, Field, useFormikContext } from "formik"
import React, { useEffect, useState } from "react"
import nookies from "nookies"

interface IDependedFieldProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const DependedField: React.FunctionComponent<IDependedFieldProps> = ({
  variable,
  displayLabel = true,
}) => {
  const { values, setFieldValue } = useFormikContext<{
    [key: string]: string
  }>()

  const token = nookies.get(null).accessToken || ""
  const [displayValue, setDisplayValue] = useState("")

  const depField = values[variable.dependedField!]

  useEffect(() => {
    if (depField) {
      const fetchOperation = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/Job_Allocation/GetOperationDD_WorkcenterId?WorkcenterId=${depField}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          setFieldValue(
            variable.name,
            response.data.Data[0].WorkcenterId.toString(),
          )
          setDisplayValue(response.data.Data[0].Operation)
        } catch (error) {
          console.error("Error fetching operations:", error)
        }
      }

      fetchOperation()
    }
  }, [depField])

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
          id={variable.name}
          name={variable.name}
          placeholder={variable.display}
          value={displayValue}
          className="input input-sm input-bordered w-full"
          readonly
        />
        <div className="text-error text-xs text-left">
          <ErrorMessage name={variable.name} />
        </div>

        <div className="text-sm text-faint mt-1">{variable.description}</div>
      </div>
    </div>
  )
}

export default DependedField
