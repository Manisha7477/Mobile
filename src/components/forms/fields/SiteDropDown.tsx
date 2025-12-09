import { IFormVariable } from "@/utils/types"
import { ErrorMessage, Field, useFormikContext } from "formik"
import { useEffect, useRef, useState } from "react"
import api from "../../../api/axiosInstance"
import { getIn } from "formik"
interface ISiteDropDownProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const SiteDropDown: React.FunctionComponent<ISiteDropDownProps> = ({
  variable,
  displayLabel = true,
}) => {
  const [value, setValue] = useState<string>("")
  const { setFieldValue, values } = useFormikContext<any>()
  // const plantId = values["plantId"]
  const plantId = getIn(values, variable.name.replace("siteId", "plantId"))
  const lastFetchedPlantId = useRef<number | string | null>(null)

  const fetchApiData = async () => {
    if (!plantId || !variable.API || plantId === lastFetchedPlantId.current)
      return

    try {
      const response = await api.get(`${variable.API}?PlantId=${plantId}`)
      const data = response.data
      console.log("🌐 Site API Response: ", data)

      if (data?.length > 0) {
        setValue(data[0].siteName)

        setFieldValue(variable.name, data[0].siteId)

        lastFetchedPlantId.current = plantId
      }
    } catch (err) {
      console.error("Site API error", err)
    }
  }

  useEffect(() => {
    if (plantId) {
      fetchApiData()
    }
  }, [plantId])

  return (
    <div className="form-control" key={variable.name}>
      {displayLabel && (
        <label htmlFor={variable.name} className="w-full">
          {variable.display}
          {variable.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="w-full">
        <Field
          id={variable.name}
          name={variable.name}
          placeholder={variable.display}
          value={value}
          readOnly
          className="input input-sm input-bordered w-full"
        />
        <div className="text-error text-xs">
          <ErrorMessage name={variable.name} />
        </div>
        {variable.description && (
          <div className="text-sm text-faint mt-1">{variable.description}</div>
        )}
      </div>
    </div>
  )
}

export default SiteDropDown
