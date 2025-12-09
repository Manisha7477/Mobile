import { ITableHeader } from "@/utils/types"

interface ITableHeaderConfigProps {
  tableHeaderData: ITableHeader[]
  handleVisibleStatus: Function
}

const TableHeaderConfig: React.FunctionComponent<ITableHeaderConfigProps> = ({
  tableHeaderData,
  handleVisibleStatus,
}) => {
  const handleChange = (
    selectedItem: string,
    slectedStatus: boolean | undefined,
  ) => {
    const foundItemIndex = tableHeaderData.findIndex(
      (item) => item.name === selectedItem,
    )
    if (slectedStatus !== undefined) {
      tableHeaderData[foundItemIndex].visible = !slectedStatus

      handleVisibleStatus(tableHeaderData)
    }
  }
  return (
    <>
      {tableHeaderData.map((items) => (
        <div className="flex justify-between items-center" key={items.name}>
          <div>{items.display}</div>
          <div>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              defaultChecked={items.visible}
              onChange={() => handleChange(items.name, items.visible)}
            />
          </div>
        </div>
      ))}
    </>
  )
}

export default TableHeaderConfig
