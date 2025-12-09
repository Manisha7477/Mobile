import { IFormVariable } from "@/utils/types"
import { ErrorMessage, Field, useFormikContext } from "formik"
import { useEffect, useRef, useState } from "react"
import api from "../../../api/axiosInstance"
import { getIn } from "formik"
import { useCallback } from "react"
interface IAreaDropDownProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const LineDropDown: React.FunctionComponent<IAreaDropDownProps> = ({
  variable,
  displayLabel = true,
}) => {
  const { setFieldValue, values } = useFormikContext<any>()
  const [options, setOptions] = useState<
    { label: string; value: string | number }[]
  >([])
  const plantId = getIn(values, variable.name.replace("lineId", "plantId"))
  const lastFetchedPlantId = useRef<number | string | null>(null)

  const fetchApiData = useCallback(async () => {
    if (!plantId || !variable.API || plantId === lastFetchedPlantId.current)
      return

    try {
      const response = await api.get(`${variable.API}?PlantId=${plantId}`)
      const data = response.data

      if (Array.isArray(data)) {
        const formattedOptions = data.map((item: any) => ({
          label: item.lineName,
          value: item.lineId,
        }))

        setOptions(formattedOptions)
        lastFetchedPlantId.current = plantId
      }
    } catch (err) {
      console.error("Area API error", err)
    }
  }, [plantId, variable.API])

  // useEffect(() => {
  //   fetchApiData()
  // }, [plantId])
  useEffect(() => {
    fetchApiData()
  }, [fetchApiData])

  return (
    <div className="form-control" key={variable.name}>
      {displayLabel && (
        <label htmlFor={variable.name} className="w-full">
          {variable.display}
          {variable.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <Field
        as="select"
        name={variable.name}
        className="select select-sm select-bordered w-full"
      >
        <option value="">Select Line</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Field>
      <div className="text-error text-xs">
        <ErrorMessage name={variable.name} />
      </div>
      {variable.description && (
        <div className="text-sm text-faint mt-1">{variable.description}</div>
      )}
    </div>
  )
}

export default LineDropDown
