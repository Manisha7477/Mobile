import { ISampleData } from "@/utils/types"

interface ITableProps {
  data: ISampleData[]
}

const Table: React.FunctionComponent<ITableProps> = ({ data }) => {
  return (
    <>
      {/* <div className="overflow-x-auto">
        <table className="table"> */}
        <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800">
          {/* head */}
          {/* <thead>
            <tr>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead> */}
          <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              Name
            </th>
            <th className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              Job
            </th>
            <th className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              Favorite Color
            </th>
          </tr>
        </thead>
          {/* <tbody>
            {data.map((dataItem) => {
              return (
                <tr key={dataItem.name}>
                  <td>{dataItem.name}</td>
                  <td>{dataItem.job}</td>
                  <td>{dataItem.color}</td>
                </tr>
              )
            })}
          </tbody> */}
           <tbody>
          {data.map((dataItem) => (
            <tr key={dataItem.name} className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-2 px-4 text-gray-900 dark:text-gray-100">
                {dataItem.name}
              </td>
              <td className="py-2 px-4 text-gray-900 dark:text-gray-100">
                {dataItem.job}
              </td>
              <td className="py-2 px-4 text-gray-900 dark:text-gray-100">
                {dataItem.color}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </>
  )
}

export default Table
