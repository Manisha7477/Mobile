import { classNames } from "@/utils/dom"
import { TbBuildingFactory, TbBuildingFactory2 } from "react-icons/tb"
import { HiUsers, HiOutlineTable } from "react-icons/hi"
import { ReactNode } from "react"

interface ICardChartBoxProps {
  title: string
  yearFilterData: string[] | number[]
  children: ReactNode
}

const CardChartBox: React.FunctionComponent<ICardChartBoxProps> = ({
  title,
  yearFilterData,
  children,
}) => {
  const d = new Date()

  return (
    <div className="w-full card bg-base-100 shadow-xl px-4 py-2 mb-4">
      <div className="text-primary border-b pb-1 mb-2 font-bold flex justify-between items-center">
        {title}
        <div>
          <select
            className="select select-xs select-border select-primary"
            defaultValue={d.getFullYear()}
          >
            {yearFilterData.map((yearItem) => {
              return (
                <option key={yearItem} value={yearItem}>
                  {yearItem}
                </option>
              )
            })}
          </select>
        </div>
      </div>

      {children}
    </div>
  )
}

export default CardChartBox
