import { IFormVariable } from "@/utils/types"

import { ErrorMessage, useFormikContext } from "formik"
import { useEffect, useRef, useState } from "react"
import { FiChevronDown } from "react-icons/fi"
import nookies from "nookies"
import api from "@/api/axiosInstance"
// import useDependentStore from "@/store/dependents"
interface ISelectFieldProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const CustomSelectField: React.FunctionComponent<ISelectFieldProps> = ({
  variable,
  displayLabel = true,
}) => {
  // const {firstDependent,secondDependent,setFirstDependent,setSecondDependent} = useDependentStore();
  const { setFieldValue, values } = useFormikContext<any>()
  const [dropOptions, setDropOptions] = useState<
    { id: string | number; name: string }[]
  >([])
  const [filteredOptions, setFilteredOptions] = useState<
    { id: string | number; name: string }[]
  >([])
  const [searchInput, setSearchInput] = useState<string>("")
  const [showOptions, setShowOptions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const token = nookies.get(null).accessToken || ""
  const [rawOptions, setRawOptions] = useState<any[]>([])

  const parseApiData = (
    data: any[],
  ): { id: string | number; name: string }[] => {
    return data.map((item) => {
      const keys = Object.keys(item)
      const values = Object.values(item)
      console.log("keys= " + keys + " and values " + values)
      if (keys.length === 5) {
        return {
          id: item[keys[0]],
          name: item[keys[0]] + "-" + item[keys[2]],
        }
      } else if (keys.length === 2) {
        return {
          id: item[keys[0]],
          name: item[keys[1]],
        }
      } else if (keys.length === 3) {
        return {
          id: item[keys[2]], // Last key is ID
          name: `${item[keys[0]]} - ${item[keys[1]]}`, // Combine first two keys for name
        }
      } else if (keys.includes("id") && keys.includes("name")) {
        return {
          id: item["id"],
          name: item["name"],
        }
      } else {
        return {
          id: values[0],
          name: values.join(" - "),
        }
      }
    })
  }
  const parseResponseData = (item: string) => {
    // return "hello";
    let arr = item.split("-")
    if (arr.length == 1) return arr[0]
    if (arr.length == 2) return arr[0] + "-" + arr[1]
    return arr[0] + "-" + arr[2] + "-" + arr[4]
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
        }))
        setDropOptions(staticOptions || [])
        setFilteredOptions(staticOptions || [])
      }
      // } else if (variable.options) {
      //   const staticOptions = variable.options.map((option: any) => {
      //     const parsedId =
      //       typeof option === "number" || !isNaN(Number(option))
      //         ? Number(option)
      //         : option
      //     return {
      //       id: parsedId,
      //       name: option.toString(),
      //     }
      //   })
      //   setDropOptions(staticOptions || [])
      //   setFilteredOptions(staticOptions || [])
      // }
      else {
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

  const handleOptionSelect = (selectedOption: {
    id: string | number
    name: string
  }) => {
    console.log(
      "id and name selected are ",
      selectedOption.id,
      selectedOption.name,
    )

    setSearchInput(selectedOption.name)
    setFieldValue(variable.name, selectedOption.id)
    setShowOptions(false)
    // Get raw object using selectedOption.id
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

export default CustomSelectField

// import { IFormVariable } from "@/utils/types"
// import axios from "axios"
// import { ErrorMessage, useFormikContext } from "formik"
// import { useEffect, useRef, useState } from "react"
// import { FiChevronDown } from "react-icons/fi"
// import nookies from "nookies"
// import api from "@/api/axiosInstance"
// interface ISelectFieldProps {
//   variable: IFormVariable
//   displayLabel?: boolean
// }

// const CustomSelectField: React.FunctionComponent<ISelectFieldProps> = ({
//   variable,
//   displayLabel = true,
// }) => {
//   const { setFieldValue, values } = useFormikContext<any>()
//   const [dropOptions, setDropOptions] = useState<
//     { id: string | number; name: string }[]
//   >([])
//   const [filteredOptions, setFilteredOptions] = useState<
//     { id: string | number; name: string }[]
//   >([])
//   const [searchInput, setSearchInput] = useState<string>("")
//   const [showOptions, setShowOptions] = useState(false)
//   const containerRef = useRef<HTMLDivElement>(null)

//   const token = nookies.get(null).accessToken || ""

//   const parseApiData = (
//     data: any[],
//   ): { id: string | number; name: string }[] => {
//     return data.map((item) => {
//       const keys = Object.keys(item)
//       const values = Object.values(item)

//       if (keys.length === 2) {
//         return {
//           id: item[keys[0]],
//           name: item[keys[1]],
//         }
//       } else if (keys.length === 3) {
//         return {
//           id: item[keys[2]], // Last key is ID
//           name: `${item[keys[0]]} - ${item[keys[1]]}`, // Combine first two keys for name
//         }
//       } else if (keys.includes("id") && keys.includes("name")) {
//         return {
//           id: item["id"],
//           name: item["name"],
//         }
//       } else {
//         return {
//           id: values[0],
//           name: values.join(" - "),
//         }
//       }
//     })
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       if (variable.API) {
//         try {
//           console.log("variable.API", variable.API)

//           // const result = await axios.get(`${variable.API}`, {
//           //   headers: { Authorization: `Bearer ${token}` },
//           // })
//           const result = await api.get(variable.API)
//           const parsedData = parseApiData(result?.data || [])
//           setDropOptions(parsedData)
//           setFilteredOptions(parsedData)
//         } catch (error) {
//           console.error("Error fetching data:", error)
//         }
//       } else if (variable.options) {
//         const staticOptions = variable.options.map((option: any) => ({
//           id: option,
//           name: option,
//         }))
//         setDropOptions(staticOptions || [])
//         setFilteredOptions(staticOptions || [])
//       } else {
//         setDropOptions([])
//         setFilteredOptions([])
//       }
//     }
//     fetchData()
//   }, [variable.API, variable.options])

//   useEffect(() => {
//     if (searchInput) {
//       setFilteredOptions(
//         dropOptions.filter((option) =>
//           option.name.toLowerCase().includes(searchInput.toLowerCase()),
//         ),
//       )
//     } else {
//       setFilteredOptions(dropOptions)
//     }
//   }, [searchInput, dropOptions])

//   useEffect(() => {
//     const selectedValue = values[variable.name]
//     const selectedOption = dropOptions.find(
//       (option) => option.id === selectedValue,
//     )
//     if (selectedOption) {
//       setSearchInput(selectedOption.name)
//     }
//   }, [values, variable.name, dropOptions])

//   const handleOptionSelect = (selectedOption: {
//     id: string | number
//     name: string
//   }) => {
//     setSearchInput(selectedOption.name)
//     setFieldValue(variable.name, selectedOption.id)
//     setShowOptions(false)
//   }

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setShowOptions(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   return (
//     <div className="form-control" key={variable.name} ref={containerRef}>
//       {displayLabel && (
//         <label htmlFor={variable.name} className="w-full">
//           {variable.display}
//           {variable.required && (
//             <span className="text-error text-left ml-1">*</span>
//           )}
//         </label>
//       )}

//       <div className="relative w-full">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder={`Search ${variable.display}`}
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             onFocus={() => setShowOptions(true)}
//             className="input input-sm input-bordered w-full"
//           />
//           <FiChevronDown
//             className="absolute right-2 top-2 text-gray-500 cursor-pointer"
//             onClick={() => setShowOptions(!showOptions)}
//           />
//         </div>

//         {showOptions && (
//           <ul className="absolute z-10 w-full bg-base-100 border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((optionItem) => (
//                 <li
//                   key={optionItem.id}
//                   onClick={() => handleOptionSelect(optionItem)}
//                   className="cursor-pointer px-4 py-2 hover:bg-gray-100 capitalize"
//                 >
//                   {optionItem.name}
//                 </li>
//               ))
//             ) : (
//               <li className="px-4 py-2 text-gray-500">No options available</li>
//             )}
//           </ul>
//         )}

//         <div className="text-error text-xs text-left">
//           <ErrorMessage name={variable.name} />
//         </div>

//         <div className="text-sm text-faint mt-1">{variable.description}</div>
//       </div>
//     </div>
//   )
// }

// export default CustomSelectField
