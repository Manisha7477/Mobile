import { IFormVariable } from "@/utils/types"
import { ErrorMessage, Field, useFormikContext } from "formik"
import { useEffect, useRef, useState } from "react"
import api from "../../../api/axiosInstance"
import { getIn } from "formik"
interface IPlantStatusDDProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const PlantStatusDD: React.FunctionComponent<IPlantStatusDDProps> = ({
  variable,
  displayLabel = true,
}) => {
  const [value, setValue] = useState<string>("")
  const { setFieldValue, values } = useFormikContext<any>()
  // const plantId = values["plantId"]
  const plantId = getIn(values, variable.name.replace("plantStatus", "plantId"))

  const lastFetchedPlantId = useRef<string | number | null>(null)

  // const fetchApiData = async () => {
  //   if (!plantId || plantId === lastFetchedPlantId.current) return

  //   try {
  //     const url = `/Area/PlantStatus?PlantId=${plantId}` // 👈 Hardcoded here
  //     console.log("🏭 PlantStatus API Request:", url)

  //     const response = await api.get(url)
  //     const data = response.data

  //     if (Array.isArray(data) && data[0]?.plantStatus) {
  //       console.log("✅ Plant Status API Response:", data)
  //       setValue(data[0].plantStatus)
  //       setFieldValue(variable.name, data[0].plantStatus)
  //       lastFetchedPlantId.current = plantId
  //     } else {
  //       console.warn("❌ Unexpected Plant Status response:", data)
  //     }
  //   } catch (err) {
  //     console.error("Error fetching plant status", err)
  //   }
  // }
  const fetchApiData = async () => {
    if (!plantId || plantId === lastFetchedPlantId.current) return

    try {
      const url = `/Area/PlantStatus?PlantId=${plantId}`
      console.log("🏭 PlantStatus API Request:", url)

      const response = await api.get(url)
      const data = response.data

      if (Array.isArray(data) && data[0]?.plantStatusId !== undefined) {
        console.log("✅ Plant Status API Response:", data)

        const statusLabel = data[0].plantStatus // e.g. "Active"
        const statusId = data[0].plantStatusId // e.g. 10012

        setValue(statusLabel) // Show label in input
        setFieldValue(variable.name, statusId) // Store ID in Formik
        lastFetchedPlantId.current = plantId
      } else {
        console.warn("❌ Unexpected Plant Status response:", data)
      }
    } catch (err) {
      console.error("Error fetching plant status", err)
    }
  }

  useEffect(() => {
    if (plantId) {
      console.log("Triggering PlantStatus API call with plantId:", plantId)
      fetchApiData()
    }
    console.log(
      "Current:",
      plantId,
      "Last fetched:",
      lastFetchedPlantId.current,
    )
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

export default PlantStatusDD
