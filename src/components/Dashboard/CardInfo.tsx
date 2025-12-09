import { classNames } from "@/utils/dom"
import { TbBuildingFactory, TbBuildingFactory2 } from "react-icons/tb"
import { HiUsers, HiOutlineTable } from "react-icons/hi"

type ICardInfoData = {
  title: string
  value: number
  description?: string
}
interface ICardInfoProps {
  data: ICardInfoData[]
}

const CardInfo: React.FunctionComponent<ICardInfoProps> = ({ data }) => {
  let iconItem

  return (
    <div className=" stats flex w-[90vw] justify-between ml-10 mr-7 shadow-lg mt-16">
      {data.map((itemData) => (
        <div className="stat" key={itemData.title}>
          <div className="stat-figure text-primary">
            {itemData.title.includes("Factory") ? (
              <TbBuildingFactory2 className="w-8 h-8" />
            ) : itemData.title.includes("Plant") ? (
              <TbBuildingFactory className="w-8 h-8" />
            ) : itemData.title.includes("Users") ? (
              <HiUsers className="w-8 h-8" />
            ) : (
              <HiOutlineTable className="w-8 h-8" />
            )}
          </div>
          <div className="stat-title">{itemData.title}</div>
          <div
            className={classNames(
              "stat-value",
              itemData.value > 200
                ? "text-success"
                : itemData.value > 100
                ? "text-primary"
                : "text-error",
            )}
          >
            {itemData.value}
          </div>
          {itemData.description && (
            <div className="stat-desc">{itemData.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CardInfo
