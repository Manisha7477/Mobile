import { useFormikContext } from "formik"
import { useEffect, useState } from "react"
import HorizontalLabelFormField from "./HorizontalLabelFormField"
import api from "@/api/axiosInstance"
// Currrently not used
interface AutoSiteFieldProps {
  field: any
}

const AutoSiteField = ({ field }: AutoSiteFieldProps) => {
  const { values, setFieldValue } = useFormikContext<any>()
  const [siteOptions, setSiteOptions] = useState<
    { value: number; label: string }[]
  >([])

  useEffect(() => {
    const plantId = values.plantId
    console.log("Plant ID used to fetch site:", plantId)

    const fetchSite = async () => {
      if (!plantId) {
        setFieldValue("siteId", "")
        setSiteOptions([])
        return
      }

      try {
        const result = await api.get(`/User/Site_DD?PlantId=${plantId}`)
        const sites = result.data

        console.log("Available site options:", sites)

        if (sites?.length) {
          const mappedOptions = sites.map((site: any) => ({
            value: site.siteId,
            label: site.siteName,
          }))
          setSiteOptions(mappedOptions)

          // Auto-select first site if you want:
          // setFieldValue("siteId", mappedOptions[0].value)
        } else {
          setSiteOptions([])
          setFieldValue("siteId", "")
        }
      } catch (error) {
        console.error("Site fetch failed", error)
        setSiteOptions([])
        setFieldValue("siteId", "")
      }
    }

    fetchSite()
  }, [values.plantId, setFieldValue])

  return (
    <HorizontalLabelFormField
      formVariables={[{ ...field, options: siteOptions }]}
    />
  )
}

export default AutoSiteField
