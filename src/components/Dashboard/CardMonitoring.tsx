import { classNames } from "@/utils/dom"

interface ICardMonitoringProps {
  data: { [key: string]: any }
}

const CardMonitoring: React.FunctionComponent<ICardMonitoringProps> = ({
  data,
}) => {
  return (
    <div className="w-full border shadow-md mb-4 text-sm rounded">
      <div className="bg-primary text-base-100 py-1 px-2 flex justify-between items-center">
        <div>
          <span className="font-semibold mr-1">Machine No :</span>
          {data.machineNumber}
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-1">Status :</span>
          <span
            className={classNames(
              "w-12 h-4 relative",
              data.status === "success"
                ? "bg-success"
                : data.status === "warning"
                ? "bg-secondary"
                : "bg-error",
            )}
          ></span>
        </div>
      </div>
      <div className="w-full p-2">
        <div>
          <span className="mr-2 font-semibold">Job No</span>
          {data.jobNumber}
        </div>
        <div>
          <span className="mr-2 font-semibold">Current Program</span>
          {data.currentProgram}
        </div>
        <div>
          <span className="mr-2 font-semibold">Run Time</span>
          {data.runTime}
        </div>
      </div>
    </div>
  )
}

export default CardMonitoring
