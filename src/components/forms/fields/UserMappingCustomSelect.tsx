import { IFormVariable } from "@/utils/types"

import { ErrorMessage, useFormikContext } from "formik"
import { useEffect, useRef, useState } from "react"
import { FiChevronDown } from "react-icons/fi"

import api from "@/api/axiosInstance"

interface ISelectFieldProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const UserMappingCustomSelect: React.FunctionComponent<ISelectFieldProps> = ({
  variable,
  displayLabel = true,
}) => {
  const { setFieldValue, values } = useFormikContext<any>()
  const [dropOptions, setDropOptions] = useState<
    { id: string | number; name: string; userId: string | number }[]
  >([])
  const [filteredOptions, setFilteredOptions] = useState<
    { id: string | number; name: string; userId: string | number }[]
  >([])
  const [searchInput, setSearchInput] = useState<string>("")
  const [showOptions, setShowOptions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [rawOptions, setRawOptions] = useState<any[]>([])

  // const parseApiData = (
  //   data: any[],
  // ): { id: string | number; name: string; userId: number | string }[] => {
  //   return data.map((item) => {
  //     const keys = Object.keys(item)
  //     const values = Object.values(item)
  //     console.log("keys= " + keys + " and values " + values)

  //     return {
  //       id: item[keys[0]],
  //       name: item[keys[0]] + "-" + item[keys[2]] + "-" + item[keys[4]],
  //       userId: item[keys[1]], // Assuming the last key is userId
  //     }
  //   })
  // }
  const parseApiData = (
    data: any[],
  ): { id: string | number; name: string; userId: number | string }[] => {
    return data.map((item) => {
      const keys = Object.keys(item)

      const safeVal = (val: any) =>
        val !== null && val !== undefined ? val : ""

      return {
        id: safeVal(item[keys[0]]),
        name: `${safeVal(item[keys[0]])}-${safeVal(item[keys[2]])}-${safeVal(
          item[keys[4]],
        )}`,
        userId: safeVal(item[keys[1]]),
      }
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (variable.API) {
        try {
          console.log("variable.API", variable.API)
          const result = await api.get(variable.API)
          console.log("result data = " + JSON.stringify(result.data, null, 2))
          const parsedData = parseApiData(result?.data || [])
          setRawOptions(result?.data || [])
          setDropOptions(parsedData)
          setFilteredOptions(parsedData)
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      } else if (variable.options) {
        const staticOptions = variable.options.map((option: any) => ({
          id: option,
          name: option,
          userId: option,
        }))
        setDropOptions(staticOptions || [])
        setFilteredOptions(staticOptions || [])
      } else {
        setDropOptions([])
        setFilteredOptions([])
      }
    }
    fetchData()
  }, [variable.API, variable.options])

  useEffect(() => {
    if (searchInput) {
      setFilteredOptions(
        dropOptions.filter((option) =>
          option.name.toLowerCase().includes(searchInput.toLowerCase()),
        ),
      )
    } else {
      setFilteredOptions(dropOptions)
    }
  }, [searchInput, dropOptions])

  useEffect(() => {
    const selectedValue = values[variable.name]
    const selectedOption = dropOptions.find(
      (option) => option.id === selectedValue,
    )
    if (selectedOption) {
      setSearchInput(selectedOption.name)
    }
  }, [values, variable.name, dropOptions])

  const handleOptionSelect = async (selectedOption: {
    id: string | number
    name: string
    userId: string | number
  }) => {
    console.log("Selected:", selectedOption)

    setSearchInput(selectedOption.name)
    setFieldValue(variable.name, selectedOption.userId)
    setShowOptions(false)

    const raw = rawOptions.find(
      (item) =>
        item.employeeId === selectedOption.id || item.id === selectedOption.id,
    )

    if (raw) {
      if (raw.roleId) {
        setFieldValue("roleId", raw.roleId.toString())
      }
      if (raw.userId) {
        setFieldValue("userId", raw.userId.toString())
      }

      if (raw.roleId === 4) {
        try {
          // First, check if Operator has direct manager
          const operatorManagerResponse = await api.get(
            `/User/Manager_DD?ByEngineerId=${raw.userId}`,
          )
          const managerFromOperator = operatorManagerResponse.data?.[0]

          if (
            managerFromOperator &&
            managerFromOperator.byManager !== null &&
            managerFromOperator.byManager !== undefined
          ) {
            setFieldValue("byManager", managerFromOperator.byManager.toString())
          } else {
            // If no direct manager, enable engineer dropdown
            const engineerListResponse = await api.get("/User/Enginneer_DD")
            const engineerList = engineerListResponse.data

            // Automatically select engineer if found
            const matchedEngineer = engineerList.find(
              (engineer: any) => engineer.employeeId === raw.employeeId, // or match via another logic
            )

            if (matchedEngineer) {
              setFieldValue(
                "byEngineerId",
                matchedEngineer.byEngineerId.toString(),
              )

              // Now fetch manager for this engineer
              const managerFromEngineerResponse = await api.get(
                `/User/Manager_DD?ByEngineerId=${matchedEngineer.byEngineerId}`,
              )

              const managerData = managerFromEngineerResponse.data?.[0]
              if (
                managerData &&
                managerData.byManager !== null &&
                managerData.byManager !== undefined
              ) {
                setFieldValue("byManager", managerData.byManager.toString())
              }
            } else {
              setFieldValue("byEngineerId", null)
              setFieldValue("byManager", null)
            }
          }
        } catch (err) {
          console.error("Error in manager fallback:", err)
          setFieldValue("byEngineerId", null)
          setFieldValue("byManager", null)
        }
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="form-control" key={variable.name} ref={containerRef}>
      {displayLabel && (
        <label htmlFor={variable.name} className="w-full">
          {variable.display}
          {variable.required && (
            <span className="text-error text-left ml-1">*</span>
          )}
        </label>
      )}

      <div className="relative w-full">
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${variable.display}`}
            value={searchInput}
            onChange={(e) => {
              // parseResponseData(e.target.value)
              // console.log("value coming is "+e.target.value);
              setSearchInput(e.target.value)
            }}
            onFocus={() => setShowOptions(true)}
            className="input input-sm input-bordered w-full"
          />
          <FiChevronDown
            className="absolute right-2 top-2 text-gray-500 cursor-pointer"
            onClick={() => setShowOptions(!showOptions)}
          />
        </div>

        {showOptions && (
          <ul className="absolute z-10 w-full bg-base-100 border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((optionItem) => {
                // console.log("option item " + optionItem.name)
                return (
                  <li
                    key={optionItem.name}
                    onClick={() => handleOptionSelect(optionItem)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 capitalize"
                  >
                    {/* {parseResponseData(optionItem.name)}  */}
                    {optionItem.name}
                  </li>
                )
              })
            ) : (
              <li className="px-4 py-2 text-gray-500">No options available</li>
            )}
          </ul>
        )}

        <div className="text-error text-xs text-left">
          <ErrorMessage name={variable.name} />
        </div>

        <div className="text-sm text-faint mt-1">{variable.description}</div>
      </div>
    </div>
  )
}

export default UserMappingCustomSelect
